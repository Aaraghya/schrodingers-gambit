import React from 'react'
import type { BoardState } from '../types'
import { Square } from './Square'
import { BoardCoordinates } from './BoardCoordinates'

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']

interface ChessBoardProps {
  board: BoardState
  selectedSquare: string | null
  legalMoves: string[]
  lastMove: { from: string; to: string } | null
  onSquareClick: (square: string) => void
}

export const ChessBoard: React.FC<ChessBoardProps> = ({ 
  board,
  selectedSquare,
  legalMoves,
  lastMove,
  onSquareClick
}) => {
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
            const isSelected = selectedSquare === coordinate
            const isLegalDestination = legalMoves.includes(coordinate)
            const isLastMovePart = lastMove 
              ? (lastMove.from === coordinate || lastMove.to === coordinate)
              : false

            return (
              <Square
                key={coordinate}
                coordinate={coordinate}
                isDark={isDark}
                piece={piece}
                isSelected={isSelected}
                isLegalDestination={isLegalDestination}
                isLastMovePart={isLastMovePart}
                onClick={() => onSquareClick(coordinate)}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
