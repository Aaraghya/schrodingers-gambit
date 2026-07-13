import { useState, useMemo, useEffect } from 'react'
import { ChessEngine } from '../engine/chessEngine'
import { QuantumEngine } from '../quantum/engine/quantumEngine'
import { getMergedBoardState } from '../quantum/utils/quantumUtils'
import type { BoardState } from '../chess/types'

export function useChessGame() {
  // Persist the ChessEngine instance across renders
  const engine = useMemo(() => new ChessEngine(), [])

  // Persist the QuantumEngine instance across renders
  const quantumEngine = useMemo(() => new QuantumEngine(), [])

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
   * Executes a move and updates board state.
   */
  const makeMove = (from: string, to: string, promotion?: 'q' | 'r' | 'b' | 'n') => {
    const success = engine.move(from, to, promotion)
    if (success) {
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
  }

  /**
   * Interactive handler for cell clicks.
   */
  const selectSquare = (square: string) => {
    // Block input if promotion modal is active
    if (promotionPending) return

    const piece = engine.getPiece(square)

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
        setLegalMoves(engine.getLegalMovesForSquare(square))
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
        setLegalMoves(engine.getLegalMovesForSquare(square))
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
      const selectedPiece = engine.getPiece(selectedSquare)
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
      setLegalMoves(engine.getLegalMovesForSquare(square))
      return
    }

    // Case 5: Clicking anywhere else (empty, opponent) -> clear selection
    clearSelection()
  }

  // Get active King square in check (if any)
  const kingInCheckSquare = inCheck ? engine.getKingSquare(turn) : null

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
  }
}
