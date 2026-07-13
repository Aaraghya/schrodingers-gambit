import type { BoardState, PieceInfo } from '../../chess/types'
import type { QuantumOverlay } from '../types/quantum'

export interface MergedPieceInfo extends PieceInfo {
  isQuantum?: boolean
  quantumId?: string
}

export type MergedBoardState = (MergedPieceInfo | null)[][]

/**
 * Converts chess algebraic notation coordinates (e.g. "e4") to 2D board indices { row, col }.
 */
export function squareToIndex(square: string): { row: number; col: number } {
  const file = square.charCodeAt(0) - 97 // 'a' is 97
  const rank = 8 - parseInt(square[1], 10)
  return { row: rank, col: file }
}

/**
 * Converts 2D board indices { row, col } back to chess algebraic notation coordinates (e.g. "e4").
 */
export function indexToSquare(row: number, col: number): string {
  const file = String.fromCharCode(97 + col)
  const rank = (8 - row).toString()
  return file + rank
}

/**
 * Merges the classical board state from chess.js with the active quantum overlay.
 * 
 * CRITICAL DESIGN RULE:
 * Hiding fromSquare is a visual, render-layer transformation only.
 * The authoritative chess.js board is NEVER modified until measurement/collapse occurs.
 * Under the hood, chess.js still contains the piece at fromSquare. The merged output
 * visually empties fromSquare and renders the two superposition ghost pieces at squareA
 * and squareB.
 */
export function getMergedBoardState(
  classicalBoard: BoardState,
  currentOverlay: QuantumOverlay | null
): MergedBoardState {
  // Deep copy the classical board
  const mergedBoard: MergedBoardState = classicalBoard.map((row) =>
    row.map((cell) => (cell ? { ...cell } : null))
  )

  if (!currentOverlay) {
    return mergedBoard
  }

  const { piece, fromSquare, squareA, squareB } = currentOverlay

  // 1. Visually remove the piece from its original deterministic square
  // This is a render-layer only change (the piece remains at fromSquare in chess.js)
  const idxFrom = squareToIndex(fromSquare)
  if (idxFrom.row >= 0 && idxFrom.row < 8 && idxFrom.col >= 0 && idxFrom.col < 8) {
    mergedBoard[idxFrom.row][idxFrom.col] = null
  }

  // 2. Visually place the piece in superposition at squareA
  const idxA = squareToIndex(squareA)
  if (idxA.row >= 0 && idxA.row < 8 && idxA.col >= 0 && idxA.col < 8) {
    mergedBoard[idxA.row][idxA.col] = {
      type: piece.type,
      color: piece.color,
      isQuantum: true,
      quantumId: piece.id
    }
  }

  // 3. Visually place the piece in superposition at squareB
  const idxB = squareToIndex(squareB)
  if (idxB.row >= 0 && idxB.row < 8 && idxB.col >= 0 && idxB.col < 8) {
    mergedBoard[idxB.row][idxB.col] = {
      type: piece.type,
      color: piece.color,
      isQuantum: true,
      quantumId: piece.id
    }
  }

  return mergedBoard
}
