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

  public triggerManualCollapse() {
    const overlay = this.quantumEngine.getCurrentOverlay()
    if (!overlay) return

    const splitMoveIndex = this.findSplitMoveIndex(overlay)
    if (splitMoveIndex === -1) return

    const collapsedSquare = this.quantumEngine.triggerCollapse('move')
    if (collapsedSquare) {
      this.rebuildGame((move, index) => {
        if (index === splitMoveIndex) {
          return { ...move, to: collapsedSquare }
        }
        return move
      })
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

// Scenarios
function runScenario1() {
  console.log('--- Scenario 1: Move Split Piece -> Collapse -> Continue ---');
  const coord = new DeterministicCoordinator()
  
  // 1. White splits e2 pawn to e3 (squareA) and e4 (squareB)
  coord.commitQuantumOverlay('e2', 'e3', 'e4')
  if (!coord.quantumEngine.getCurrentOverlay()) throw new Error('Overlay should exist')

  // 2. Black plays unrelated move g7 -> g6
  if (!coord.makeMove('g7', 'g6')) throw new Error('g7-g6 failed')
  if (!coord.quantumEngine.getCurrentOverlay()) throw new Error('Overlay should still exist')

  // 3. White moves quantum piece from e4 (squareB) to e5
  // We mock Math.random to force collapse to e4 (squareB)
  const originalRandom = Math.random
  Math.random = () => 0.9 // Forces squareB (e4)

  const success = coord.makeMove('e4', 'e5')
  Math.random = originalRandom

  if (!success) throw new Error('Move e4->e5 should have succeeded on collapse to e4')
  if (coord.quantumEngine.getCurrentOverlay() !== null) throw new Error('Overlay not cleared')
  if (coord.engine.getTurn() !== 'b') throw new Error('Turn should be Black')
  
  // 4. Game continues normally: Black plays g6 -> g5
  if (!coord.makeMove('g6', 'g5')) throw new Error('Game play should continue normally')
  console.log('Scenario 1 passed!');
}

function runScenario2() {
  console.log('--- Scenario 2: Capture branch A -> Collapse to A -> Success ---');
  const testFen = 'k7/8/8/4r3/3R4/8/8/6K1 w - - 0 1'
  const coord = new DeterministicCoordinator(testFen)

  // 1. White splits Rook from d4 to d5 and e4
  coord.commitQuantumOverlay('d4', 'd5', 'e4')

  // 2. Black attempts capture on branch A (d5) -> collapse to A (d5)
  const originalRandom = Math.random
  Math.random = () => 0.1 // Forces squareA (d5)

  const success = coord.makeMove('e5', 'd5')
  Math.random = originalRandom

  if (!success) throw new Error('Capture on d5 should succeed')
  if (coord.quantumEngine.getCurrentOverlay() !== null) throw new Error('Overlay should be cleared')
  if (coord.engine.getTurn() !== 'w') throw new Error('Turn should be White')
  
  // Verify Rook is captured and Black Rook is at d5
  const pieceAtD5 = coord.engine.getPiece('d5')
  if (!pieceAtD5 || pieceAtD5.type !== 'r' || pieceAtD5.color !== 'b') {
    throw new Error('Black Rook should be on d5')
  }
  console.log('Scenario 2 passed!');
}

function runScenario3() {
  console.log('--- Scenario 3: Capture branch A -> Collapse to B -> Fails (aborted) ---');
  const testFen = 'k7/8/8/4r3/3R4/8/8/6K1 w - - 0 1'
  const coord = new DeterministicCoordinator(testFen)

  // 1. White splits Rook from d4 to d5 and e4
  coord.commitQuantumOverlay('d4', 'd5', 'e4')

  // 2. Black attempts capture on branch A (d5) -> collapse to B (e4)
  const originalRandom = Math.random
  Math.random = () => 0.9 // Forces squareB (e4)

  const success = coord.makeMove('e5', 'd5')
  Math.random = originalRandom

  if (success) throw new Error('Capture should have aborted')
  if (coord.quantumEngine.getCurrentOverlay() !== null) throw new Error('Overlay should be cleared')
  
  // Turn must remain Black ('b')
  if (coord.engine.getTurn() !== 'b') throw new Error('Turn must remain Black after aborted move')

  // Board remains valid: White Rook is at e4, Black Rook is still at e5
  const rookW = coord.engine.getPiece('e4')
  const rookB = coord.engine.getPiece('e5')
  if (!rookW || rookW.type !== 'r' || rookW.color !== 'w') throw new Error('White Rook should be at e4')
  if (!rookB || rookB.type !== 'r' || rookB.color !== 'b') throw new Error('Black Rook should still be at e5')

  console.log('Scenario 3 passed!');
}

function runScenario4() {
  console.log('--- Scenario 4: Multiple Unrelated Moves -> Collapse -> Replay Sync ---');
  const coord = new DeterministicCoordinator()

  // 1. White splits e2 pawn to e3 and e4
  coord.commitQuantumOverlay('e2', 'e3', 'e4')

  // 2. Several unrelated moves
  coord.makeMove('g7', 'g6') // Black
  coord.makeMove('a2', 'a3') // White
  coord.makeMove('b7', 'b6') // Black
  coord.makeMove('h2', 'h3') // White

  // Verify overlay active
  if (!coord.quantumEngine.getCurrentOverlay()) throw new Error('Overlay should be active')

  // 3. Developer manual collapse
  const originalRandom = Math.random
  Math.random = () => 0.9 // Forces squareB (e4)
  coord.triggerManualCollapse()
  Math.random = originalRandom

  // 4. Verify everything is fully synchronized
  if (coord.quantumEngine.getCurrentOverlay() !== null) throw new Error('Overlay should be cleared')

  // Replay a clean, expected classical engine to match invariants
  const expectedEngine = new ChessEngine()
  expectedEngine.move('e2', 'e4')
  expectedEngine.move('g7', 'g6')
  expectedEngine.move('a2', 'a3')
  expectedEngine.move('b7', 'b6')
  expectedEngine.move('h2', 'h3')

  if (coord.engine.getFen() !== expectedEngine.getFen()) {
    throw new Error('FEN does not match expected replayed FEN')
  }
  if (coord.moveHistory.length !== coord.engine.getHistory().length) {
    throw new Error('History length mismatch')
  }
  if (coord.engine.getTurn() !== expectedEngine.getTurn()) {
    throw new Error('Turn mismatch')
  }

  console.log('Scenario 4 passed!');
}

// Run tests
try {
  runScenario1()
  runScenario2()
  runScenario3()
  runScenario4()
  console.log('\n=============================================');
  console.log('ALL INTEGRATION SCENARIOS PASSED SUCCESSFULLY!');
  console.log('=============================================');
} catch (err) {
  console.error('\n!!! INTEGRATION VERIFICATION FAILED !!!');
  throw err;
}
