import React from 'react'
import type { PieceInfo } from '../types'
import { Piece } from './Piece'

interface SquareProps {
  coordinate: string
  isDark: boolean
  piece: PieceInfo | null
}

export const Square: React.FC<SquareProps> = ({ coordinate, isDark, piece }) => {
  // Editorial palette for a premium scientific appearance (avoiding traditional browns)
  // Dark squares: Deep charcoal
  // Light squares: Muted warm stone / gray
  const bgClass = isDark ? 'bg-[#141416]' : 'bg-[#28282b]'

  // Build descriptive label for screen readers
  const pieceLabel = piece 
    ? `${piece.color === 'w' ? 'White' : 'Black'} ${getPieceFullName(piece.type)}` 
    : 'empty'
  const ariaLabel = `${coordinate}, ${pieceLabel}`

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`relative w-full aspect-square flex items-center justify-center transition-colors duration-200 outline-none focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-sage focus-visible:z-10 ${bgClass} group rounded-none cursor-pointer overflow-hidden`}
    >
      {/* Visual square border for scientific instrument details */}
      <span className="absolute inset-0 border border-border/10 opacity-30 pointer-events-none" />

      {/* Premium subtle hover overlay */}
      <span className="absolute inset-0 bg-white/0 hover:bg-white/5 transition-colors duration-150 pointer-events-none" />

      {/* Render the piece if present */}
      {piece && (
        <div className="w-[78%] h-[78%] transition-transform duration-300 group-hover:scale-[1.03]">
          <Piece type={piece.type} color={piece.color} />
        </div>
      )}
    </button>
  )
}

function getPieceFullName(type: string): string {
  switch (type) {
    case 'p': return 'Pawn'
    case 'r': return 'Rook'
    case 'n': return 'Knight'
    case 'b': return 'Bishop'
    case 'q': return 'Queen'
    case 'k': return 'King'
    default: return 'Piece'
  }
}
