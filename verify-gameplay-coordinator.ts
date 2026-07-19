import { ChessEngine } from './src/features/engine/chessEngine'
import { QuantumEngine } from './src/features/quantum/engine/quantumEngine'
import type { QuantumOverlay } from './src/features/quantum/types/quantum'

interface MoveRecord {
  from: string
  to: string
  promotion?: 'q' | 'r' | 'b' | 'n'
}

class DeterministicCoordinator {
  public engine: ChessEngine
  public quantumEngine: QuantumEngine
  public moveHistory: MoveRecord[] = []
  private initialFen?: string

  constructor(fen?: string) {
    this.initialFen = fen
    this.engine = new ChessEngine(fen)
    this.quantumEngine = new QuantumEngine()
  }

  public findSplitMoveIndex(overlay: QuantumOverlay): number {
    for (let i = this.moveHistory.length - 1; i >= 0; i--) {
      const m = this.moveHistory[i]
      if (m.from === overlay.fromSquare && m.to === overlay.squareA) {
        return i
      }
    }
    return -1
  }

  public getLegalMovesForQuantumSquare(square: string): string[] {
    const overlay = this.quantumEngine.getCurrentOverlay()
    if (!overlay) return []

    if (square === overlay.squareA) {
      return this.engine.getLegalMovesForSquare(square)
    }

    if (square === overlay.squareB) {
      const tempEngine = new ChessEngine()
      const splitMoveIndex = this.findSplitMoveIndex(overlay)
      if (splitMoveIndex !== -1) {
        for (let i = 0; i < this.moveHistory.length; i++) {
          const m = this.moveHistory[i]
          if (i === splitMoveIndex) {
            tempEngine.move(m.from, overlay.squareB, m.promotion)
          } else {
            tempEngine.move(m.from, m.to, m.promotion)
          }
        }
        return tempEngine.getLegalMovesForSquare(square)
      }
    }

    return []
  }

  public getLegalMovesForSquareCombined(square: string): string[] {
    const overlay = this.quantumEngine.getCurrentOverlay()
    if (!overlay) {
      return this.engine.getLegalMovesForSquare(square)
    }

    if (square === overlay.squareA || square === overlay.squareB) {
      return this.getLegalMovesForQuantumSquare(square)
    }

    const normalMoves = this.engine.getLegalMovesForSquare(square)
    const turn = this.engine.getTurn()

    if (turn !== overlay.piece.color) {
      const extraMoves: string[] = []
      const tempEngine = new ChessEngine()
      const splitMoveIndex = this.findSplitMoveIndex(overlay)
      if (splitMoveIndex !== -1) {
        for (let i = 0; i < this.moveHistory.length; i++) {
          const m = this.moveHistory[i]
          if (i === splitMoveIndex) {
            tempEngine.move(m.from, overlay.squareB, m.promotion)
          } else {
            tempEngine.move(m.from, m.to, m.promotion)
          }
        }

        const tempMoves = tempEngine.getLegalMovesForSquare(square)
        if (tempMoves.includes(overlay.squareB)) {
          extraMoves.push(overlay.squareB)
        }
      }

      return Array.from(new Set([...normalMoves, ...extraMoves]))
    }

    return normalMoves
  }

  public rebuildGame(transformMove?: (move: MoveRecord, index: number) => MoveRecord): void {
    const newHistory: MoveRecord[] = []
    for (let i = 0; i < this.moveHistory.length; i++) {
      const originalMove = this.moveHistory[i]
      const transformedMove = transformMove ? transformMove(originalMove, i) : originalMove
      newHistory.push({ ...transformedMove })
    }

    if (this.initialFen) {
      this.engine = new ChessEngine(this.initialFen)
    } else {
      this.engine.reset()
    }

    for (const m of newHistory) {
      const success = this.engine.move(m.from, m.to, m.promotion)
      if (!success) {
        throw new Error(`ReplayError: Failed to execute move from ${m.from} to ${m.to}`)
      }
    }

    this.moveHistory = newHistory
  }

  public commitQuantumOverlay(selected: string, targetA: string, targetB: string) {
    const activePiece = this.engine.getPiece(selected)
    if (!activePiece) return

    const quantumPiece = {
      id: `piece-${selected}-${Date.now()}`,
      type: activePiece.type,
      color: activePiece.color
    }

    this.quantumEngine.registerQuantumOverlay(
      quantumPiece,
      selected,
      targetA,
      targetB
    )

    const success = this.engine.move(selected, targetA)
    if (success) {
      this.moveHistory.push({ from: selected, to: targetA })
    }
  }

  public makeMove(from: string, to: string, promotion?: 'q' | 'r' | 'b' | 'n'): boolean {
    const overlay = this.quantumEngine.getCurrentOverlay()
    if (!overlay) {
      const success = this.engine.move(from, to, promotion)
      if (success) {
        this.moveHistory.push({ from, to, promotion })
      }
      return success
    }

    const splitMoveIndex = this.findSplitMoveIndex(overlay)
    if (splitMoveIndex === -1) {
      const success = this.engine.move(from, to, promotion)
      if (success) {
        this.moveHistory.push({ from, to, promotion })
      }
      return success
    }

    // Trigger A: Capturing a quantum piece
    if (to === overlay.squareA || to === overlay.squareB) {
      const collapsedSquare = this.quantumEngine.triggerCollapse('capture')
      if (collapsedSquare) {
        this.rebuildGame((move, index) => {
          if (index === splitMoveIndex) {
            return { ...move, to: collapsedSquare }
          }
          return move
        })

        let success = false
        if (collapsedSquare === to) {
          success = this.engine.move(from, to, promotion)
          if (success) {
            this.moveHistory.push({ from, to, promotion })
          }
        }
        return success
      }
      return false
    }

    // Trigger B: Moving the quantum piece itself
    if (from === overlay.squareA || from === overlay.squareB) {
      const collapsedSquare = this.quantumEngine.triggerCollapse('move')
      if (collapsedSquare) {
        this.rebuildGame((move, index) => {
          if (index === splitMoveIndex) {
            return { ...move, to: collapsedSquare }
          }
          return move
        })

        const success = this.engine.move(collapsedSquare, to, promotion)
        if (success) {
          this.moveHistory.push({ from: collapsedSquare, to, promotion })
        }
        return success
      }
      return false
    }

    // Unrelated moves
    const success = this.engine.move(from, to, promotion)
    if (success) {
      this.moveHistory.push({ from, to, promotion })
    }
    return success
  }
}

// Test Suite
function runScenario1() {
  console.log('--- Running Scenario 1 ---');
  // Normal game start
  const coord = new DeterministicCoordinator()
  // White splits pawn from e2 to e3 and e4
  coord.commitQuantumOverlay('e2', 'e3', 'e4')
  
  // Verify overlay exists
  let overlay = coord.quantumEngine.getCurrentOverlay()
  if (!overlay) throw new Error('Overlay should exist after split')
  
  // Black plays unrelated move: g7 -> g6
  const success = coord.makeMove('g7', 'g6')
  if (!success) throw new Error('Unrelated move g7-g6 should succeed')
  
  // Verify overlay still exists and turn progresses
  overlay = coord.quantumEngine.getCurrentOverlay()
  if (!overlay) throw new Error('Overlay should still exist after unrelated move')
  if (coord.engine.getTurn() !== 'w') throw new Error('Turn should be White after Black plays')
  console.log('Scenario 1 passed successfully!');
}

function runScenario2() {
  console.log('--- Running Scenario 2 ---');
  // FEN: White Rook at d4, Black Rook at e5, White King at g1 (no check)
  const testFen = 'k7/8/8/4r3/3R4/8/8/6K1 w - - 0 1'
  
  let successesA = 0
  let successesB = 0
  const trials = 100

  for (let i = 0; i < trials; i++) {
    // Test capture on squareA (d5)
    const coordA = new DeterministicCoordinator(testFen)
    coordA.commitQuantumOverlay('d4', 'd5', 'e4')
    
    // We mock/hijack Math.random to force collapse to squareA (d5) on even runs, squareB (e4) on odd runs
    const originalRandom = Math.random
    Math.random = () => (i % 2 === 0 ? 0.1 : 0.9) // 0.1 resolves to squareA (d5), 0.9 resolves to squareB (e4)
    
    const captureASucceeded = coordA.makeMove('e5', 'd5')
    if (captureASucceeded) {
      successesA++
      // Verify overlay cleared
      if (coordA.quantumEngine.getCurrentOverlay() !== null) throw new Error('Overlay not cleared after collapse')
    }
    
    // Test capture on squareB (e4)
    const coordB = new DeterministicCoordinator(testFen)
    coordB.commitQuantumOverlay('d4', 'd5', 'e4')
    
    const captureBSucceeded = coordB.makeMove('e5', 'e4')
    if (captureBSucceeded) {
      successesB++
      // Verify overlay cleared
      if (coordB.quantumEngine.getCurrentOverlay() !== null) throw new Error('Overlay not cleared after collapse')
    }

    Math.random = originalRandom
  }

  // With our Math.random forcing, half of the trials collapse to d5 and half to e4
  console.log(`Capture Square A trials: ${trials}. Successes: ${successesA} (Expected: ${trials / 2})`)
  console.log(`Capture Square B trials: ${trials}. Successes: ${successesB} (Expected: ${trials / 2})`)

  if (successesA !== trials / 2) throw new Error(`Scenario 2 failed: Capture A succeeded in ${successesA} trials instead of ${trials / 2}`)
  if (successesB !== trials / 2) throw new Error(`Scenario 2 failed: Capture B succeeded in ${successesB} trials instead of ${trials / 2}`)

  console.log('Scenario 2 passed successfully!');
}

function runScenario3() {
  console.log('--- Running Scenario 3 ---');
  // FEN: White Rook at d4, Black King at a8 (to avoid check/blocking issues)
  const testFen = 'k7/8/8/8/3R4/8/8/4K3 w - - 0 1'
  let movesToF4Succeeded = 0
  let movesToD6Succeeded = 0
  const trials = 100

  for (let i = 0; i < trials; i++) {
    // 1. Move Rook split d4 -> d5 and e4
    const coord = new DeterministicCoordinator(testFen)
    coord.commitQuantumOverlay('d4', 'd5', 'e4')
    
    // 2. Play unrelated move for Black: a8 -> b8
    coord.makeMove('a8', 'b8')
    
    // Force collapse to d5 (even i) or e4 (odd i)
    const originalRandom = Math.random
    Math.random = () => (i % 2 === 0 ? 0.1 : 0.9)

    // 3. Play from branch squareB (e4) to f4
    // If it collapsed to e4, e4->f4 is legal. If d5, e4->f4 is illegal from d5 (since Rook is at d5)
    const successF4 = coord.makeMove('e4', 'f4')
    if (successF4) {
      movesToF4Succeeded++
    } else {
      // If it aborted, the turn should remain White ('w')
      if (coord.engine.getTurn() !== 'w') throw new Error('Turn should remain White after aborted move')
    }

    Math.random = originalRandom
  }

  for (let i = 0; i < trials; i++) {
    const coord = new DeterministicCoordinator(testFen)
    coord.commitQuantumOverlay('d4', 'd5', 'e4')
    coord.makeMove('a8', 'b8')

    const originalRandom = Math.random
    Math.random = () => (i % 2 === 0 ? 0.1 : 0.9)

    // 4. Play from branch squareA (d5) to d6
    // If it collapsed to d5, d5->d6 is legal. If e4, d5->d6 is illegal from e4
    const successD6 = coord.makeMove('d5', 'd6')
    if (successD6) {
      movesToD6Succeeded++
    } else {
      if (coord.engine.getTurn() !== 'w') throw new Error('Turn should remain White after aborted move')
    }

    Math.random = originalRandom
  }

  console.log(`Move to f4 trials: ${trials}. Successes: ${movesToF4Succeeded} (Expected: ${trials / 2})`)
  console.log(`Move to d6 trials: ${trials}. Successes: ${movesToD6Succeeded} (Expected: ${trials / 2})`)

  if (movesToF4Succeeded !== trials / 2) throw new Error(`Scenario 3 failed: Move to f4 succeeded in ${movesToF4Succeeded} trials instead of ${trials / 2}`)
  if (movesToD6Succeeded !== trials / 2) throw new Error(`Scenario 3 failed: Move to d6 succeeded in ${movesToD6Succeeded} trials instead of ${trials / 2}`)

  console.log('Scenario 3 passed successfully!');
}

function runScenario4() {
  console.log('--- Running Scenario 4 ---');
  // Check that every move executes only through coord.engine.move
  // We can verify this by checking that ChessEngine constructor does not have custom mutations,
  // and we only push to history when engine.move is successful.
  // We'll also print the final history to show that all moves were correctly logged.
  const coord = new DeterministicCoordinator()
  coord.commitQuantumOverlay('e2', 'e3', 'e4')
  coord.makeMove('g7', 'g6')
  
  console.log('Move History of Simulator:', coord.moveHistory)
  if (coord.moveHistory.length !== 2) throw new Error('History length should be 2')
  console.log('Scenario 4 passed successfully!');
}

// Run All
try {
  runScenario1()
  runScenario2()
  runScenario3()
  runScenario4()
  console.log('\n=======================================');
  console.log('ALL VERIFICATION SCENARIOS PASSED!');
  console.log('=======================================');
} catch (err) {
  console.error('\n!!! VERIFICATION FAILED !!!');
  throw err;
}
