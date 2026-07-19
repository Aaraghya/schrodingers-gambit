import { useState, useMemo, useEffect, useRef } from 'react'
import { ChessEngine } from '../engine/chessEngine'
import { QuantumEngine } from '../quantum/engine/quantumEngine'
import { getMergedBoardState } from '../quantum/utils/quantumUtils'
import type { BoardState } from '../chess/types'
import type { QuantumOverlay } from '../quantum/types/quantum'

interface MoveRecord {
  from: string
  to: string
  promotion?: 'q' | 'r' | 'b' | 'n'
}

export function useChessGame() {
  // Persist the ChessEngine instance across renders
  const engine = useMemo(() => new ChessEngine(), [])

  // Persist the QuantumEngine instance across renders
  const quantumEngine = useMemo(() => new QuantumEngine(), [])

  // Track sequence of successful classical moves
  const moveHistoryRef = useRef<MoveRecord[]>([])

  // Expose engine states via React state to trigger visual re-renders
  const [board, setBoard] = useState<BoardState>(() =>
    getMergedBoardState(engine.getBoardState(), quantumEngine.getCurrentOverlay())
  )
  const [turn, setTurn] = useState<'w' | 'b'>(() => engine.getTurn())
  const [isGameOver, setIsGameOver] = useState<boolean>(() => engine.isGameOver())
  const [inCheck, setInCheck] = useState<boolean>(() => engine.inCheck())
  const [isCheckmate, setIsCheckmate] = useState<boolean>(() => engine.isCheckmate())
  const [isStalemate, setIsStalemate] = useState<boolean>(() => engine.isStalemate())
  const [isDraw, setIsDraw] = useState<boolean>(() => engine.isDraw())
  const [drawReason, setDrawReason] = useState<'threefold' | 'material' | 'fifty-moves' | 'stalemate' | 'unknown' | null>(null)
  const [history, setHistory] = useState<string[]>(() => engine.getHistory())

  // Selection and highlight states (purely visual interaction details)
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [legalMoves, setLegalMoves] = useState<string[]>([])
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null)

  // Promotion pending state: { from, to }
  const [promotionPending, setPromotionPending] = useState<{ from: string; to: string } | null>(null)

  // Quantum Mode Activation State
  const [isQuantumModeActive, setIsQuantumModeActive] = useState<boolean>(false)
  const [quantumModeError, setQuantumModeError] = useState<string | null>(null)
  const [firstTarget, setFirstTarget] = useState<string | null>(null)
  const [secondTarget, setSecondTarget] = useState<string | null>(null)

  // Synchronizes the React states with the underlying engine's state
  const syncState = () => {
    setBoard(getMergedBoardState(engine.getBoardState(), quantumEngine.getCurrentOverlay()))
    setTurn(engine.getTurn())
    setIsGameOver(engine.isGameOver())
    setInCheck(engine.inCheck())
    setIsCheckmate(engine.isCheckmate())
    setIsStalemate(engine.isStalemate())
    setIsDraw(engine.isDraw())
    setHistory(engine.getHistory())

    if (engine.isDraw()) {
      if (engine.isStalemate()) {
        setDrawReason('stalemate')
      } else if (engine.isThreefoldRepetition()) {
        setDrawReason('threefold')
      } else if (engine.isInsufficientMaterial()) {
        setDrawReason('material')
      } else if (engine.isFiftyMoves()) {
        setDrawReason('fifty-moves')
      } else {
        setDrawReason('unknown')
      }
    } else {
      setDrawReason(null)
    }
  }

  // Keyboard listener to cancel Quantum Mode via Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isQuantumModeActive) {
        setIsQuantumModeActive(false)
        setQuantumModeError(null)
        setFirstTarget(null)
        setSecondTarget(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isQuantumModeActive])

  /**
   * Clears current visual highlights and active selection.
   */
  const clearSelection = () => {
    setSelectedSquare(null)
    setLegalMoves([])
    if (isQuantumModeActive) {
      setIsQuantumModeActive(false)
      setQuantumModeError(null)
    }
    setFirstTarget(null)
    setSecondTarget(null)
  }

  /**
   * Finds the index of the split move in history.
   */
  const findSplitMoveIndex = (overlay: QuantumOverlay): number => {
    for (let i = moveHistoryRef.current.length - 1; i >= 0; i--) {
      const m = moveHistoryRef.current[i]
      if (m.from === overlay.fromSquare && m.to === overlay.squareA) {
        return i
      }
    }
    return -1
  }

  /**
   * Retrieves the legal moves for a quantum piece's branch as if the piece collapsed to that branch.
   */
  const getLegalMovesForQuantumSquare = (square: string): string[] => {
    const overlay = quantumEngine.getCurrentOverlay()
    if (!overlay) return []

    if (square === overlay.squareA) {
      return engine.getLegalMovesForSquare(square)
    }

    if (square === overlay.squareB) {
      const tempEngine = new ChessEngine()
      const splitMoveIndex = findSplitMoveIndex(overlay)
      if (splitMoveIndex !== -1) {
        for (let i = 0; i < moveHistoryRef.current.length; i++) {
          const m = moveHistoryRef.current[i]
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

  /**
   * Computes the legal moves for any square, accounting for normal moves, quantum piece moves,
   * and quantum captures using temporary engines.
   */
  const getLegalMovesForSquareCombined = (square: string): string[] => {
    const overlay = quantumEngine.getCurrentOverlay()
    if (!overlay) {
      return engine.getLegalMovesForSquare(square)
    }

    // Moving the quantum piece itself
    if (square === overlay.squareA || square === overlay.squareB) {
      return getLegalMovesForQuantumSquare(square)
    }

    // Normal legal moves
    const normalMoves = engine.getLegalMovesForSquare(square)

    // Capturing the quantum piece
    if (turn !== overlay.piece.color) {
      const extraMoves: string[] = []

      // In the current active engine, the quantum piece is at squareA.
      // So engine.getLegalMovesForSquare(square) already includes squareA if it can be captured.
      // We only need to check squareB using a temporary engine where the split resolved to squareB.
      const tempEngine = new ChessEngine()
      const splitMoveIndex = findSplitMoveIndex(overlay)
      if (splitMoveIndex !== -1) {
        for (let i = 0; i < moveHistoryRef.current.length; i++) {
          const m = moveHistoryRef.current[i]
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

  /**
   * Rebuilds the entire game state from move history, applying an optional transform function to each move.
   * Performs validation against an independently constructed expected engine state.
   */
  const rebuildGame = (transformMove?: (move: MoveRecord, index: number) => MoveRecord): void => {
    const newHistory: MoveRecord[] = []
    for (let i = 0; i < moveHistoryRef.current.length; i++) {
      const originalMove = moveHistoryRef.current[i]
      const transformedMove = transformMove ? transformMove(originalMove, i) : originalMove
      newHistory.push({ ...transformedMove })
    }

    // Reset the active engine
    engine.reset()

    // Replay each move
    for (const m of newHistory) {
      const success = engine.move(m.from, m.to, m.promotion)
      if (!success) {
        throw new Error(`ReplayError: Failed to execute move from ${m.from} to ${m.to}`)
      }
    }

    // Construct expected engine independently for validation
    const expectedEngine = new ChessEngine()
    for (const m of newHistory) {
      const success = expectedEngine.move(m.from, m.to, m.promotion)
      if (!success) {
        throw new Error(`ReplayValidationError: Expected engine failed to execute move from ${m.from} to ${m.to}`)
      }
    }

    // Verify invariants
    if (engine.getFen() !== expectedEngine.getFen()) {
      throw new Error('ReplayValidationError: Active engine FEN does not match expected engine FEN after replay.')
    }
    if (engine.getTurn() !== expectedEngine.getTurn()) {
      throw new Error('ReplayValidationError: Active engine turn does not match expected engine turn after replay.')
    }
    if (engine.getHistory().length !== newHistory.length) {
      throw new Error('ReplayValidationError: Active engine history length does not match replayed history length.')
    }

    // Update the history reference
    moveHistoryRef.current = newHistory

    // Synchronize states
    syncState()
  }

  /**
   * Executes a move and updates board state.
   */
  const makeMove = (from: string, to: string, promotion?: 'q' | 'r' | 'b' | 'n') => {
    const overlay = quantumEngine.getCurrentOverlay()
    if (!overlay) {
      // Normal move
      const success = engine.move(from, to, promotion)
      if (success) {
        moveHistoryRef.current.push({ from, to, promotion })
        setLastMove({ from, to })
        clearSelection()
        syncState()
      }
      return
    }

    const splitMoveIndex = findSplitMoveIndex(overlay)
    if (splitMoveIndex === -1) {
      // Fallback if split move not found in history, though it should always be
      const success = engine.move(from, to, promotion)
      if (success) {
        moveHistoryRef.current.push({ from, to, promotion })
        setLastMove({ from, to })
        clearSelection()
        syncState()
      }
      return
    }

    // Trigger B: Moving the quantum piece itself
    // If the player attempts to move either rendered branch
    if (from === overlay.squareA || from === overlay.squareB) {
      const collapsedSquare = quantumEngine.triggerCollapse('move')
      if (collapsedSquare) {
        rebuildGame((move, index) => {
          if (index === splitMoveIndex) {
            return { ...move, to: collapsedSquare }
          }
          return move
        })

        // Attempt the requested move from the actual collapsed location
        const success = engine.move(collapsedSquare, to, promotion)
        if (success) {
          moveHistoryRef.current.push({ from: collapsedSquare, to, promotion })
          setLastMove({ from: collapsedSquare, to })
        }
        clearSelection()
        syncState()
      }
      return
    }

    // Trigger A: Capturing a quantum piece
    // If the move targets either branch of the current overlay
    if (to === overlay.squareA || to === overlay.squareB) {
      const collapsedSquare = quantumEngine.triggerCollapse('capture')
      if (collapsedSquare) {
        rebuildGame((move, index) => {
          if (index === splitMoveIndex) {
            return { ...move, to: collapsedSquare }
          }
          return move
        })

        // Capture only succeeds if collapse matches targeted branch, or if it is an en passant capture
        const isEnPassant =
          engine.getPiece(from)?.type === 'p' &&
          to === overlay.squareA &&
          collapsedSquare === overlay.squareB

        let success = false
        if (collapsedSquare === to || isEnPassant) {
          success = engine.move(from, to, promotion)
          if (success) {
            moveHistoryRef.current.push({ from, to, promotion })
            setLastMove({ from, to })
          }
        }
        clearSelection()
        syncState()
      }
      return
    }

    // Unrelated moves:
    // If neither origin nor destination interacts with the overlay, execute normally.
    // Overlay remains active.
    const success = engine.move(from, to, promotion)
    if (success) {
      moveHistoryRef.current.push({ from, to, promotion })
      setLastMove({ from, to })
      clearSelection()
      syncState()
    }
  }

  /**
   * Promotes a pending pawn move with the selected piece.
   */
  const promotePawn = (pieceType: 'q' | 'r' | 'b' | 'n') => {
    if (!promotionPending) return
    const { from, to } = promotionPending
    makeMove(from, to, pieceType)
    setPromotionPending(null)
  }

  /**
   * Cancels a pending pawn promotion.
   */
  const cancelPromotion = () => {
    setPromotionPending(null)
    clearSelection()
  }

  /**
   * Resets the entire game.
   */
  const resetGame = () => {
    engine.reset()
    quantumEngine.reset()
    setIsQuantumModeActive(false)
    setQuantumModeError(null)
    setFirstTarget(null)
    setSecondTarget(null)
    clearSelection()
    setLastMove(null)
    setPromotionPending(null)
    moveHistoryRef.current = []
    syncState()
  }

  /**
   * Toggles Quantum Mode (activation/cancellation)
   */
  const toggleQuantumMode = () => {
    if (isQuantumModeActive) {
      setIsQuantumModeActive(false)
      setQuantumModeError(null)
      setFirstTarget(null)
      setSecondTarget(null)
      return
    }

    if (quantumEngine.getCurrentOverlay() !== null) {
      setQuantumModeError('Overlay Active')
      return
    }

    if (quantumEngine.hasUsedQuantumMove(turn)) {
      setQuantumModeError('Move Spent')
      return
    }

    if (!selectedSquare) {
      setQuantumModeError('No piece selected')
      return
    }

    const piece = engine.getPiece(selectedSquare)
    if (!piece || piece.color !== turn) {
      setQuantumModeError('Invalid selection')
      return
    }

    const legalDestinations = engine.getLegalMovesForSquare(selectedSquare)
    if (legalDestinations.length < 2) {
      setQuantumModeError('Requires >= 2 moves')
      return
    }

    setIsQuantumModeActive(true)
    setQuantumModeError(null)
    setFirstTarget(null)
    setSecondTarget(null)
  }

  /**
   * Commits the selected quantum superposition overlay into the QuantumEngine.
   * Uses explicit runtime guards instead of non-null assertions.
   */
  const commitQuantumOverlay = (selected: string, targetA: string, targetB: string) => {
    const activePiece = engine.getPiece(selected)
    if (!activePiece) return

    const quantumPiece = {
      id: `piece-${selected}-${Date.now()}`,
      type: activePiece.type,
      color: activePiece.color
    }

    // Register overlay in Quantum Engine
    quantumEngine.registerQuantumOverlay(
      quantumPiece,
      selected,
      targetA,
      targetB
    )

    // Execute standard classical move to targetA in classical engine to advance the turn
    const success = engine.move(selected, targetA)
    if (success) {
      moveHistoryRef.current.push({ from: selected, to: targetA })
      setLastMove({ from: selected, to: targetA })
    }
  }

  /**
   * Interactive handler for cell clicks.
   */
  const selectSquare = (square: string) => {
    // Block input if promotion modal is active
    if (promotionPending) return

    const overlay = quantumEngine.getCurrentOverlay()
    let piece = engine.getPiece(square)

    // Resolve quantum piece info if clicking on a branch of the overlay
    if (overlay && (square === overlay.squareA || square === overlay.squareB)) {
      piece = {
        type: overlay.piece.type,
        color: overlay.piece.color
      }
    }

    // Interactive targeting flow for Quantum Mode
    if (isQuantumModeActive) {
      // Clicking the selected piece again deselects it and exits Quantum Mode
      if (square === selectedSquare) {
        clearSelection()
        return
      }

      // Clicking another of our own pieces cancels the quantum workflow and selects it classically
      if (piece && piece.color === turn) {
        setIsQuantumModeActive(false)
        setFirstTarget(null)
        setSecondTarget(null)
        setSelectedSquare(square)
        setLegalMoves(getLegalMovesForSquareCombined(square))
        return
      }

      // Clicking a legal destination
      if (legalMoves.includes(square)) {
        if (firstTarget === null) {
          // Select first destination
          setFirstTarget(square)
        } else {
          // Clicking first destination again deselects it
          if (square === firstTarget) {
            setFirstTarget(null)
            return
          }
          // Set second destination and complete selection workflow
          setSecondTarget(square)

          // Execute overlay creation with runtime guards
          if (selectedSquare && firstTarget) {
            commitQuantumOverlay(selectedSquare, firstTarget, square)
          }

          // Complete workflow: reset selections and states
          setIsQuantumModeActive(false)
          setFirstTarget(null)
          setSecondTarget(null)
          clearSelection()
          syncState()
        }
      }
      return
    }

    // Case 1: No active selection
    if (!selectedSquare) {
      if (piece && piece.color === turn) {
        setSelectedSquare(square)
        setLegalMoves(getLegalMovesForSquareCombined(square))
      }
      return
    }

    // Case 2: Clicking the same selected square -> deselect
    if (selectedSquare === square) {
      clearSelection()
      return
    }

    // Case 3: Clicking a valid legal destination -> check for promotion or execute
    if (legalMoves.includes(square)) {
      let selectedPiece = engine.getPiece(selectedSquare)
      if (overlay && (selectedSquare === overlay.squareA || selectedSquare === overlay.squareB)) {
        selectedPiece = {
          type: overlay.piece.type,
          color: overlay.piece.color
        }
      }
      const isPawn = selectedPiece && selectedPiece.type === 'p'
      const isPromotionRank = square.endsWith('8') || square.endsWith('1')

      if (isPawn && isPromotionRank) {
        // Intercept move and trigger promotion pending dialog
        setPromotionPending({ from: selectedSquare, to: square })
        return
      }

      makeMove(selectedSquare, square)
      return
    }

    // Case 4: Clicking another of our own pieces -> switch selection
    if (piece && piece.color === turn) {
      setSelectedSquare(square)
      setLegalMoves(getLegalMovesForSquareCombined(square))
      return
    }

    // Case 5: Clicking anywhere else (empty, opponent) -> clear selection
    clearSelection()
  }

  // Get active King square in check (if any)
  const kingInCheckSquare = inCheck ? engine.getKingSquare(turn) : null

  /**
   * Developer debug tool to manually trigger a collapse of the active quantum overlay.
   */
  const triggerManualCollapse = () => {
    const overlay = quantumEngine.getCurrentOverlay()
    if (!overlay) return

    const splitMoveIndex = findSplitMoveIndex(overlay)
    if (splitMoveIndex === -1) return

    const collapsedSquare = quantumEngine.triggerCollapse('move')
    if (collapsedSquare) {
      rebuildGame((move, index) => {
        if (index === splitMoveIndex) {
          return { ...move, to: collapsedSquare }
        }
        return move
      })
    }
    clearSelection()
    syncState()
  }

  return {
    board,
    turn,
    isGameOver,
    inCheck,
    isCheckmate,
    isStalemate,
    isDraw,
    drawReason,
    history,
    selectedSquare,
    legalMoves,
    lastMove,
    promotionPending,
    kingInCheckSquare,
    fen: engine.getFen(),
    isQuantumModeActive,
    quantumModeError,
    firstTarget,
    secondTarget,
    currentOverlay: quantumEngine.getCurrentOverlay(),
    hasUsedQuantumMove: quantumEngine.hasUsedQuantumMove(turn),
    toggleQuantumMode,
    selectSquare,
    makeMove,
    promotePawn,
    cancelPromotion,
    clearSelection,
    resetGame,
    syncState,
    triggerManualCollapse,
  }
}
