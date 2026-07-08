import type { BoardState, PieceType, PieceColor } from '../chess/types'

// chess.js board() cell representation
interface ChessJsSquare {
  type: 'p' | 'r' | 'n' | 'b' | 'q' | 'k'
  color: 'w' | 'b'
  square: string
}

export type ChessJsBoard = (ChessJsSquare | null)[][]

/**
 * Maps the 8x8 Board structure from chess.js to our feature's visual BoardState layout.
 */
export function mapEngineBoardToState(engineBoard: ChessJsBoard): BoardState {
  return engineBoard.map((row) =>
    row.map((cell) => {
      if (!cell) return null
      return {
        type: cell.type as PieceType,
        color: cell.color as PieceColor,
      }
    })
  )
}
