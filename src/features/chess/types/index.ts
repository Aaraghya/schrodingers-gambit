export type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k'
export type PieceColor = 'w' | 'b'

export interface PieceInfo {
  type: PieceType
  color: PieceColor
}

export type BoardState = (PieceInfo | null)[][]
