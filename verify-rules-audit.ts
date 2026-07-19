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
      const tempEngine = new ChessEngine(this.initialFen)
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
      const tempEngine = new ChessEngine(this.initialFen)
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

  public triggerManualCollapse(forcedChoice?: 'A' | 'B') {
    const overlay = this.quantumEngine.getCurrentOverlay()
    if (!overlay) return

    const splitMoveIndex = this.findSplitMoveIndex(overlay)
    if (splitMoveIndex === -1) return

    let collapsedSquare: string | null
    if (forcedChoice) {
      collapsedSquare = forcedChoice === 'A' ? overlay.squareA : overlay.squareB
      // Add manual event to history directly
      const event = {
        id: `measure-${overlay.piece.id}-manual-${Date.now()}`,
        timestamp: Date.now(),
        trigger: 'move' as const,
        piece: { ...overlay.piece },
        squareA: overlay.squareA,
        squareB: overlay.squareB,
        collapsedSquare
      }
      this.quantumEngine['state'].measurementHistory.push(event)
      this.quantumEngine['state'].currentOverlay = null
    } else {
      collapsedSquare = this.quantumEngine.triggerCollapse('move')
    }

    if (collapsedSquare) {
      this.rebuildGame((move, index) => {
        if (index === splitMoveIndex) {
          return { ...move, to: collapsedSquare }
        }
        return move
      })
    }
  }

  public makeMove(from: string, to: string, promotion?: 'q' | 'r' | 'b' | 'n', forcedChoice?: 'A' | 'B'): boolean {
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

    // Trigger B: Moving the quantum piece itself
    if (from === overlay.squareA || from === overlay.squareB) {
      let collapsedSquare: string | null
      if (forcedChoice) {
        collapsedSquare = forcedChoice === 'A' ? overlay.squareA : overlay.squareB
        const event = {
          id: `measure-${overlay.piece.id}-move-${Date.now()}`,
          timestamp: Date.now(),
          trigger: 'move' as const,
          piece: { ...overlay.piece },
          squareA: overlay.squareA,
          squareB: overlay.squareB,
          collapsedSquare
        }
        this.quantumEngine['state'].measurementHistory.push(event)
        this.quantumEngine['state'].currentOverlay = null
      } else {
        collapsedSquare = this.quantumEngine.triggerCollapse('move')
      }

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

    // Trigger A: Capturing a quantum piece
    if (to === overlay.squareA || to === overlay.squareB) {
      let collapsedSquare: string | null
      if (forcedChoice) {
        collapsedSquare = forcedChoice === 'A' ? overlay.squareA : overlay.squareB
        const event = {
          id: `measure-${overlay.piece.id}-capture-${Date.now()}`,
          timestamp: Date.now(),
          trigger: 'capture' as const,
          piece: { ...overlay.piece },
          squareA: overlay.squareA,
          squareB: overlay.squareB,
          collapsedSquare
        }
        this.quantumEngine['state'].measurementHistory.push(event)
        this.quantumEngine['state'].currentOverlay = null
      } else {
        collapsedSquare = this.quantumEngine.triggerCollapse('capture')
      }

      if (collapsedSquare) {
        this.rebuildGame((move, index) => {
          if (index === splitMoveIndex) {
            return { ...move, to: collapsedSquare }
          }
          return move
        })

        const isEnPassant =
          this.engine.getPiece(from)?.type === 'p' &&
          to === overlay.squareA &&
          collapsedSquare === overlay.squareB

        let success = false
        if (collapsedSquare === to || isEnPassant) {
          success = this.engine.move(from, to, promotion)
          if (success) {
            this.moveHistory.push({ from, to, promotion })
          }
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

// ----------------------------------------------------
// RUN AUDIT TEST CASES
// ----------------------------------------------------
console.log('==================================================');
console.log('   STARTING SCHRÖDINGER\'S GAMBIT RULES AUDIT      ');
console.log('==================================================\n');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, message: string) {
  if (!condition) {
    testsFailed++;
    console.error(`❌ [FAIL] ${message}`);
    throw new Error(message);
  } else {
    testsPassed++;
    console.log(`✅ [PASS] ${message}`);
  }
}

// --- Test 1: Check Scenarios ---
function testCheckScenarios() {
  console.log('\n--- Test 1: Check Scenarios ---');

  // Scenario A: Collapse resulting in check
  // White King e1, White Rook d4 in superposition (d5/e4), Black King e8.
  // Under the hood, split move is registered to d5. Turn becomes Black.
  const fen1 = '4k3/8/8/8/3R4/8/8/4K3 w - - 0 1';
  const coordA = new DeterministicCoordinator(fen1);
  coordA.commitQuantumOverlay('d4', 'd5', 'e4'); // targetA: d5, targetB: e4
  assert(coordA.engine.inCheck() === false, 'Black King should not be in check in chess.js initially');

  // White triggers manual collapse to e4 (targetB).
  coordA.triggerManualCollapse('B');
  assert(coordA.engine.inCheck() === true, 'Black King on e8 should be in check after collapse to e4');

  // Scenario B: Collapse removing check
  // White King e1, White Rook g8, Black Queen d7.
  // Setup FEN where Black is to move and splits.
  const fen2 = 'k5R1/3q4/8/8/8/8/8/4K3 b - - 0 1';
  const coordB = new DeterministicCoordinator(fen2);
  coordB.commitQuantumOverlay('d7', 'e8', 'd8'); // targetA: e8 (checking e1), targetB: d8 (not checking). Committed to e8.
  assert(coordB.engine.inCheck() === true, 'White King should be in check in chess.js because Queen is committed to e8');

  // White attempts to capture Queen at e8: Rg8 -> e8.
  // Collapse resolves to d8 (targetB).
  let success = coordB.makeMove('g8', 'e8', undefined, 'B'); // Force collapse to B (d8)
  assert(!success, 'Rook capture on e8 should fail because Queen collapsed to d8');
  assert(coordB.engine.inCheck() === false, 'White King should no longer be in check after Queen collapsed to d8');
  assert(coordB.engine.getTurn() === 'w', 'Turn should remain White after failed capture');

  // Scenario C: Moving a quantum piece while in check
  // White King e1, White Rook d4, Black Rook a8.
  // Setup:
  // 1. White splits Rook d4 to d5 and e4. Committed to d5.
  // 2. Black moves Rook a8 -> e8+, putting White King in check in chess.js.
  const fen3 = 'r6k/8/8/8/3R4/8/8/4K3 w - - 0 1';
  const coordC = new DeterministicCoordinator(fen3);
  coordC.commitQuantumOverlay('d4', 'd5', 'e4'); // Committed to d5.
  coordC.makeMove('a8', 'e8'); // Black checks White King.
  
  assert(coordC.engine.inCheck() === true, 'White King should be in check');

  // White tries to move quantum Rook. Legal moves for d5 (which is the committed square)
  // should only be those that resolve the check. Since moving Rook d5->d8 doesn't resolve check,
  // it should not be in the legal moves of d5.
  const legalMovesD5 = coordC.getLegalMovesForSquareCombined('d5');
  assert(!legalMovesD5.includes('d8'), 'Move d5->d8 should be illegal because it does not resolve check');
}

// --- Test 2: Checkmate Scenarios ---
function testCheckmateScenarios() {
  console.log('\n--- Test 2: Checkmate Scenarios ---');

  // Scenario A: Collapse results in checkmate
  // Black King h8, Black Pawns g7, h7. White Rook d1.
  // White splits Rook d1 to d8 (targetA) and a1 (targetB).
  // Under the hood committed to d8.
  const fen = '6kr/5ppp/8/8/8/8/8/3R1K2 w - - 0 1';
  const coordA = new DeterministicCoordinator(fen);
  coordA.commitQuantumOverlay('d1', 'd8', 'a1'); // committed to d8.

  // In chess.js, Rook is at d8, so it is checkmate.
  assert(coordA.engine.isCheckmate() === true, 'Rook at d8 under-the-hood should trigger checkmate');

  // Collapse to d8 (targetA) keeps it checkmate.
  coordA.triggerManualCollapse('A');
  assert(coordA.engine.isCheckmate() === true, 'Checkmate should be preserved after collapse to d8');
  assert(coordA.engine.isGameOver() === true, 'Game should be over after checkmate collapse');

  // Scenario B: Collapse results in NOT checkmate
  const coordB = new DeterministicCoordinator(fen);
  coordB.commitQuantumOverlay('d1', 'd8', 'a1');
  assert(coordB.engine.isCheckmate() === true, 'Rook at d8 under-the-hood should trigger checkmate');

  // Collapse to a1 (targetB) removes checkmate.
  coordB.triggerManualCollapse('B');
  assert(coordB.engine.isCheckmate() === false, 'Checkmate should be resolved after collapse to a1');
  assert(coordB.engine.isGameOver() === false, 'Game should not be over after collapse to a1');
}

// --- Test 3: Stalemate Scenarios ---
function testStalemateScenarios() {
  console.log('\n--- Test 3: Stalemate Scenarios ---');

  // Setup: Black King a8. White Pawn a7. White Rook b6, White King c6.
  // White splits Rook b6 to b7 (targetA) and h6 (targetB).
  // Under the hood committed to b7.
  const fen = 'k7/P7/1RK5/8/8/8/8/8 w - - 0 1';
  const coord = new DeterministicCoordinator(fen);
  coord.commitQuantumOverlay('b6', 'b7', 'h6'); // targetA: b7, targetB: h6.

  assert(coord.engine.isStalemate() === true, 'Rook at b7 under-the-hood should trigger stalemate');

  // Collapse to b7 (targetA) preserves stalemate.
  coord.triggerManualCollapse('A');
  assert(coord.engine.isStalemate() === true, 'Stalemate preserved after collapse to b7');
  assert(coord.engine.isGameOver() === true, 'Game over after stalemate collapse');
}

// --- Test 4: Draw Rules ---
function testDrawRules() {
  console.log('\n--- Test 4: Draw Rules ---');

  // 1. Fifty-move rule
  // We can initialize FEN with halfmove clock at 99.
  const fenFifty = 'k7/8/8/8/8/8/8/3R1K2 w - - 99 50';
  const coordFifty = new DeterministicCoordinator(fenFifty);
  // White splits Rook d1 to d2 and d3 (increases halfmove clock to 100 in chess.js)
  coordFifty.commitQuantumOverlay('d1', 'd2', 'd3');
  // Halfmove clock should be 100 (50 full moves). Since it's a draw by 50-move rule, isDraw should be true.
  assert(coordFifty.engine.isFiftyMoves() === true, '50-move rule should be triggered');
  assert(coordFifty.engine.isDraw() === true, 'Fifty-move rule should result in draw');

  // 2. Insufficient material
  // White King f1, White Rook d1, Black King c2.
  // FEN: 8/8/8/8/8/8/2k5/3R1K2 w - - 0 1
  const fenMat = '8/8/8/8/8/8/2k5/3R1K2 w - - 0 1';
  const coordMat = new DeterministicCoordinator(fenMat);
  coordMat.commitQuantumOverlay('d1', 'd2', 'd3'); // Committed to d2.
  // Black King captures on d2 (Trigger A). Force collapse to d2.
  // Capture succeeds. Rook d2 is captured. Only Kings are left.
  const success = coordMat.makeMove('c2', 'd2', undefined, 'A');
  assert(success, 'Black King captures d2 successfully');
  assert(coordMat.engine.isInsufficientMaterial() === true, 'Only Kings left should trigger insufficient material draw');
  assert(coordMat.engine.isDraw() === true, 'Insufficient material should result in draw');

  // 3. Threefold repetition
  const coordRep = new DeterministicCoordinator();
  // We execute a sequence of repetitions:
  // Nf3, Nf6, Ng1, Ng8 (1st time)
  // Nf3, Nf6, Ng1, Ng8 (2nd time)
  // Nf3, Nf6, Ng1, Ng8 (3rd time)
  for (let i = 0; i < 2; i++) {
    coordRep.makeMove('g1', 'f3');
    coordRep.makeMove('g8', 'f6');
    coordRep.makeMove('f3', 'g1');
    coordRep.makeMove('f6', 'g8');
  }
  // Make the moves for the third repetition
  coordRep.makeMove('g1', 'f3');
  coordRep.makeMove('g8', 'f6');
  coordRep.makeMove('f3', 'g1');
  coordRep.makeMove('f6', 'g8');

  assert(coordRep.engine.isThreefoldRepetition() === true, 'Threefold repetition should be detected');
  assert(coordRep.engine.isDraw() === true, 'Threefold repetition should result in draw');
}

// --- Test 5: Castling Rights ---
function testCastlingRights() {
  console.log('\n--- Test 5: Castling Rights ---');

  // White King e1, White Rook h1, Black King a8.
  // FEN: k7/8/8/8/8/8/8/4K2R w K - 0 1 (White has kingside castling rights K).
  const fen = 'k7/8/8/8/8/8/8/4K2R w K - 0 1';
  const coord = new DeterministicCoordinator(fen);

  // White splits Rook h1 to f1 and g1.
  coord.commitQuantumOverlay('h1', 'f1', 'g1'); // targetA: f1, targetB: g1

  // Since Rook moved under the hood to f1, castling rights should be lost in chess.js.
  const fenAfterSplit = coord.engine.getFen();
  assert(!fenAfterSplit.includes(' K '), 'Castling rights K should be lost in FEN after split move');

  // Collapse to f1 should preserve loss of castling rights.
  coord.triggerManualCollapse('A');
  const fenAfterCollapse = coord.engine.getFen();
  assert(!fenAfterCollapse.includes(' K '), 'Castling rights K should remain lost after collapse');
}

// --- Test 6: En Passant ---
function testEnPassant() {
  console.log('\n--- Test 6: En Passant ---');

  // White pawn e2, Black pawn d4.
  // FEN: k7/8/8/8/3p4/8/4P3/4K3 w - - 0 1
  const fen = 'k7/8/8/8/3p4/8/4P3/4K3 w - - 0 1';
  const coord = new DeterministicCoordinator(fen);

  // White splits pawn e2 to e3 (targetA) and e4 (targetB).
  coord.commitQuantumOverlay('e2', 'e3', 'e4'); // Committed to e3.

  // Black plays en passant capture: d4 -> e3.
  // This targets e3 (squareA). Trigger A (capture).
  // Force collapse to e4 (squareB).
  const success = coord.makeMove('d4', 'e3', undefined, 'B');
  assert(success, 'En passant capture should succeed on collapse to e4');

  // Verify White pawn on e4 is captured and Black pawn is on e3.
  assert(!coord.engine.getPiece('e4'), 'White pawn on e4 should be captured');
  const pieceE3 = coord.engine.getPiece('e3');
  assert(pieceE3 !== null && pieceE3 !== undefined && pieceE3.type === 'p' && pieceE3.color === 'b', 'Black pawn should be on e3');
}

// --- Test 7: Pawn Promotion ---
function testPawnPromotion() {
  console.log('\n--- Test 7: Pawn Promotion ---');

  // White pawn e2, Black King a8.
  // FEN: k7/8/8/8/8/8/4P3/4K3 w - - 0 1
  const fen = 'k7/8/8/8/8/8/4P3/4K3 w - - 0 1';
  const coord = new DeterministicCoordinator(fen);

  // 1. White splits pawn e2 to e3 and e4 (committed to e3)
  coord.commitQuantumOverlay('e2', 'e3', 'e4');

  // 2. Black plays unrelated move a8 -> b8
  coord.makeMove('a8', 'b8');

  // 3. White moves quantum pawn e3 -> e4 (collapses to e3, succeeds)
  let success = coord.makeMove('e3', 'e4', undefined, 'A');
  assert(success, 'Move e3->e4 should succeed after collapse to e3');

  // 4. Black plays unrelated move b8 -> a8
  coord.makeMove('b8', 'a8');

  // 5. White moves e4 -> e5
  coord.makeMove('e4', 'e5');

  // 6. Black plays a8 -> b8
  coord.makeMove('a8', 'b8');

  // 7. White moves e5 -> e6
  coord.makeMove('e5', 'e6');

  // 8. Black plays b8 -> a8
  coord.makeMove('b8', 'a8');

  // 9. White moves e6 -> e7
  coord.makeMove('e6', 'e7');

  // 10. Black plays a8 -> b8
  coord.makeMove('a8', 'b8');

  // 11. White moves e7 -> e8 with promotion to Queen.
  // Since it is a classical promotion, makeMove should receive promotion: 'q'.
  success = coord.makeMove('e7', 'e8', 'q');
  assert(success, 'Pawn promotion e7->e8(q) should succeed');

  // Verify piece on e8 is a White Queen.
  const pieceE8 = coord.engine.getPiece('e8');
  assert(pieceE8 !== null && pieceE8.type === 'q' && pieceE8.color === 'w', 'Promoted piece should be a White Queen');

  // Verify that replay preserves the promotion state.
  coord.rebuildGame();
  const pieceE8Replayed = coord.engine.getPiece('e8');
  assert(pieceE8Replayed !== null && pieceE8Replayed.type === 'q' && pieceE8Replayed.color === 'w', 'Promotion state preserved after replay');
}

// --- Test 8: State Safety ---
function testStateSafety() {
  console.log('\n--- Test 8: State Safety ---');

  // Scenario A: reset game
  const coord = new DeterministicCoordinator();
  coord.commitQuantumOverlay('e2', 'e3', 'e4');
  assert(coord.quantumEngine.getCurrentOverlay() !== null, 'Overlay should exist');
  coord.quantumEngine.reset();
  coord.engine.reset();
  coord.moveHistory = [];
  assert(coord.quantumEngine.getCurrentOverlay() === null, 'Overlay should be cleared after reset');
  assert(coord.moveHistory.length === 0, 'History should be empty after reset');

  // Scenario B: failed quantum capture
  // Setup: White Rook d4 split to d5 and e4. Black Rook e5 attempts capture on d5 (collapses to e4).
  const testFen = 'k7/8/8/4r3/3R4/8/8/5K2 w - - 0 1';
  const coordCap = new DeterministicCoordinator(testFen);
  coordCap.commitQuantumOverlay('d4', 'd5', 'e4');
  
  // Capture on d5. Collapses to e4. Capture fails.
  const capSuccess = coordCap.makeMove('e5', 'd5', undefined, 'B');
  assert(!capSuccess, 'Capture on d5 should fail since Rook collapsed to e4');
  console.log('Overlay after failed capture:', coordCap.quantumEngine.getCurrentOverlay());
  assert(coordCap.quantumEngine.getCurrentOverlay() === null, 'Overlay should be cleared after collapse');
  
  // Scenario C: failed quantum move
  // Setup: White Rook d4 split to d5 and e4. White Rook attempts to move from d5 to d6 (collapses to e4).
  const coordMove = new DeterministicCoordinator(testFen);
  coordMove.commitQuantumOverlay('d4', 'd5', 'e4');
  coordMove.makeMove('a8', 'b8'); // Black unrelated
  
  // Move from d5 to d6. Collapses to e4. Move fails (since Rook is on e4, not d5).
  const moveSuccess = coordMove.makeMove('d5', 'd6', undefined, 'B');
  assert(!moveSuccess, 'Move from d5 should fail since Rook collapsed to e4');
  assert(coordMove.quantumEngine.getCurrentOverlay() === null, 'Overlay should be cleared after collapse');
}

// Execute tests
try {
  testCheckScenarios();
  testCheckmateScenarios();
  testStalemateScenarios();
  testDrawRules();
  testCastlingRights();
  testEnPassant();
  testPawnPromotion();
  testStateSafety();

  console.log('\n==================================================');
  console.log(`   ALL AUDIT SCENARIOS PASSED: ${testsPassed} passed / ${testsFailed} failed`);
  console.log('==================================================');
  process.exit(0);
} catch (err) {
  console.error('\n==================================================');
  console.error(`   AUDIT SCENARIOS FAILED: ${testsPassed} passed / ${testsFailed} failed`);
  console.error('==================================================');
  console.error(err);
  process.exit(1);
}
