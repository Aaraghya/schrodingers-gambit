import React from 'react'
import type { BoardState, PieceType } from '../types'
import { Square } from './Square'
import { BoardCoordinates } from './BoardCoordinates'

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']

const createInitialBoard = (): BoardState => {
  const board: BoardState = Array(8).fill(null).map(() => Array(8).fill(null))
  const backRowPieces: PieceType[] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']

  // Setup Black pieces (rows 0 and 1)
  for (let col = 0; col < 8; col++) {
    board[0][col] = { type: backRowPieces[col], color: 'b' }
    board[1][col] = { type: 'p', color: 'b' }
  }

  // Setup White pieces (rows 6 and 7)
  for (let col = 0; col < 8; col++) {
    board[6][col] = { type: 'p', color: 'w' }
    board[7][col] = { type: backRowPieces[col], color: 'w' }
  }

  return board
}

export const ChessBoard: React.FC = () => {
  const board = createInitialBoard()

  return (
    <div className="relative w-full aspect-square p-6 border border-border/30 bg-[#0c0c0d] shadow-[0_0_32px_rgba(0,0,0,0.65)] select-none">
      {/* Editorial Ranks and Files Labels */}
      <BoardCoordinates />

      {/* 8x8 Square Grid (Enclosed within the Slate Frame) */}
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full border border-border/20 bg-bg-primary">
        {board.map((row, rIdx) =>
          row.map((piece, cIdx) => {
            const coordinate = files[cIdx] + ranks[rIdx]
            const isDark = (rIdx + cIdx) % 2 === 1
            return (
              <Square
                key={coordinate}
                coordinate={coordinate}
                isDark={isDark}
                piece={piece}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
