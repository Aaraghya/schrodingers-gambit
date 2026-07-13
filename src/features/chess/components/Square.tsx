import React from 'react'
import type { PieceInfo } from '../types'
import { Piece } from './Piece'

interface MergedPieceInfo extends PieceInfo {
  isQuantum?: boolean
  quantumId?: string
}

interface SquareProps {
  coordinate: string
  isDark: boolean
  piece: MergedPieceInfo | null
  isSelected: boolean
  isLegalDestination: boolean
  isLastMovePart: boolean
  isKingInCheck: boolean
  isQuantumA?: boolean
  isQuantumB?: boolean
  fadingPiece?: PieceInfo | null
  isQuantumHovered?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onClick: () => void
}

export const Square: React.FC<SquareProps> = ({ 
  coordinate, 
  isDark, 
  piece,
  isSelected,
  isLegalDestination,
  isLastMovePart,
  isKingInCheck,
  isQuantumA = false,
  isQuantumB = false,
  fadingPiece = null,
  isQuantumHovered = false,
  onMouseEnter,
  onMouseLeave,
  onClick
}) => {
  // Editorial palette for a scientific appearance
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
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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

      {/* Check State: subtle red outline and dark red tint */}
      {isKingInCheck && (
        <span className="absolute inset-0 border-2 border-[#e25c5c]/40 bg-[#e25c5c]/5 z-10 pointer-events-none" />
      )}

      {/* Selection Border Overlay: subtle sage outline */}
      {isSelected && (
        <span className="absolute inset-0 border-2 border-sage z-10 pointer-events-none" />
      )}

      {/* Quantum first destination selection border */}
      {isQuantumA && (
        <span className="absolute inset-0 border border-dashed border-sage z-10 bg-sage/5 pointer-events-none" />
      )}

      {/* Quantum second destination selection border */}
      {isQuantumB && (
        <span className="absolute inset-0 border border-dashed border-sage/60 z-10 bg-sage/5 pointer-events-none" />
      )}

      {/* Dotted outline for both branches of the superposition */}
      {piece?.isQuantum && (
        <span className="absolute inset-0 border border-dotted border-sage/50 z-10 pointer-events-none" />
      )}

      {/* Subtle background highlight for linked hovered branches */}
      {isQuantumHovered && (
        <span className="absolute inset-0 bg-sage/[0.04] border border-sage/30 z-10 pointer-events-none transition-colors duration-150" />
      )}

      {/* Tiny quantum identifier (Ψ) in the corner of the squares */}
      {piece?.isQuantum && (
        <span className="absolute bottom-1 right-1.5 text-[8px] font-mono text-sage/70 select-none z-10">
          Ψ
        </span>
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
        <div className={`w-[78%] h-[78%] transition-all duration-300 group-hover:scale-[1.03] ${
          piece.isQuantum ? 'opacity-50 blur-[0.5px] animate-quantum-fade-in' : ''
        }`}>
          <Piece type={piece.type} color={piece.color} />
        </div>
      )}

      {/* Render fading piece if present (the original piece fading out) */}
      {fadingPiece && (
        <div className="absolute w-[78%] h-[78%] z-10 animate-quantum-fade-out pointer-events-none">
          <Piece type={fadingPiece.type} color={fadingPiece.color} />
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
