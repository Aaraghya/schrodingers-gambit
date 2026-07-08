import { useState, useMemo } from 'react'
import { ChessEngine } from '../engine/chessEngine'
import type { BoardState } from '../chess/types'

export function useChessGame() {
  // Persist the ChessEngine instance across renders
  const engine = useMemo(() => new ChessEngine(), [])

  // Expose engine states via React state to trigger visual re-renders
  const [board, setBoard] = useState<BoardState>(() => engine.getBoardState())
  const [turn, setTurn] = useState<'w' | 'b'>(() => engine.getTurn())
  const [isGameOver, setIsGameOver] = useState<boolean>(() => engine.isGameOver())

  // Selection and highlight states (purely visual interaction details)
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [legalMoves, setLegalMoves] = useState<string[]>([])
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null)

  // Synchronizes the React states with the underlying engine's state
  const syncState = () => {
    setBoard(engine.getBoardState())
    setTurn(engine.getTurn())
    setIsGameOver(engine.isGameOver())
  }

  /**
   * Clears current visual highlights and active selection.
   */
  const clearSelection = () => {
    setSelectedSquare(null)
    setLegalMoves([])
  }

  /**
   * Executes a move and updates board state.
   */
  const makeMove = (from: string, to: string) => {
    const success = engine.move(from, to)
    if (success) {
      setLastMove({ from, to })
      clearSelection()
      syncState()
    }
  }

  /**
   * Interactive handler for cell clicks.
   */
  const selectSquare = (square: string) => {
    const piece = engine.getPiece(square)

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

    // Case 3: Clicking a valid legal destination -> execute move
    if (legalMoves.includes(square)) {
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

  return {
    board,
    turn,
    isGameOver,
    selectedSquare,
    legalMoves,
    lastMove,
    fen: engine.getFen(),
    selectSquare,
    makeMove,
    clearSelection,
    syncState,
  }
}
