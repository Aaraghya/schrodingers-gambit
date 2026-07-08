import React from 'react'
import type { PieceInfo } from '../types'
import { Piece } from './Piece'

interface SquareProps {
  coordinate: string
  isDark: boolean
  piece: PieceInfo | null
  isSelected: boolean
  isLegalDestination: boolean
  isLastMovePart: boolean
  onClick: () => void
}

export const Square: React.FC<SquareProps> = ({ 
  coordinate, 
  isDark, 
  piece,
  isSelected,
  isLegalDestination,
  isLastMovePart,
  onClick
}) => {
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
      onClick={onClick}
      aria-label={ariaLabel}
      className={`relative w-full aspect-square flex items-center justify-center transition-colors duration-200 outline-none focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-sage focus-visible:z-10 ${bgClass} group rounded-none cursor-pointer overflow-hidden`}
    >
      {/* Visual square border for scientific instrument details */}
      <span className="absolute inset-0 border border-border/10 opacity-30 pointer-events-none" />

      {/* Premium subtle hover overlay */}
      <span className="absolute inset-0 bg-white/0 hover:bg-white/5 transition-colors duration-150 pointer-events-none" />

      {/* Last Move Tint Overlay */}
      {isLastMovePart && (
        <span className="absolute inset-0 bg-sage/[0.08] pointer-events-none" />
      )}

      {/* Selection Border Overlay: subtle sage outline */}
      {isSelected && (
        <span className="absolute inset-0 border-2 border-sage z-10 pointer-events-none" />
      )}

      {/* Legal Move Indicator */}
      {isLegalDestination && (
        piece ? (
          // Capture target: subtle outer ring around the piece
          <span className="absolute inset-1.5 border border-sage/50 rounded-full pointer-events-none z-10" />
        ) : (
          // Empty cell target: small centered dot
          <span className="w-2 h-2 rounded-full bg-sage/60 pointer-events-none z-10" />
        )
      )}

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
