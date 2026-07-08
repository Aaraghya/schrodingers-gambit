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

  // Synchronizes the React states with the underlying engine's state
  const syncState = () => {
    setBoard(engine.getBoardState())
    setTurn(engine.getTurn())
    setIsGameOver(engine.isGameOver())
  }

  return {
    board,
    turn,
    isGameOver,
    fen: engine.getFen(),
    syncState,
  }
}
