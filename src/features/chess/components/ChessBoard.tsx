import React, { useState } from 'react'
import type { BoardState } from '../types'
import { Square } from './Square'
import { BoardCoordinates } from './BoardCoordinates'
import type { QuantumOverlay } from '../../quantum/types/quantum'
import { squareToIndex } from '../../quantum/utils/quantumUtils'

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']

interface ChessBoardProps {
  board: BoardState
  selectedSquare: string | null
  legalMoves: string[]
  lastMove: { from: string; to: string } | null
  kingInCheckSquare: string | null
  promotionPending: { from: string; to: string } | null
  isGameOver: boolean
  isCheckmate: boolean
  drawReason: 'threefold' | 'material' | 'fifty-moves' | 'stalemate' | 'unknown' | null
  turn: 'w' | 'b'
  onSquareClick: (square: string) => void
  onPromoteSelect: (piece: 'q' | 'r' | 'b' | 'n') => void
  onPromoteCancel: () => void
  onResetGame: () => void
  onReturnHome: () => void
  firstTarget?: string | null
  secondTarget?: string | null
  currentOverlay?: QuantumOverlay | null
}

export const ChessBoard: React.FC<ChessBoardProps> = ({ 
  board,
  selectedSquare,
  legalMoves,
  lastMove,
  kingInCheckSquare,
  promotionPending,
  isGameOver,
  isCheckmate,
  drawReason,
  turn,
  onSquareClick,
  onPromoteSelect,
  onPromoteCancel,
  onResetGame,
  onReturnHome,
  firstTarget = null,
  secondTarget = null,
  currentOverlay = null
}) => {
  const [hoveredSquare, setHoveredSquare] = useState<string | null>(null)

  const getDrawMessage = () => {
    if (drawReason === 'stalemate') return 'Stalemate: No legal moves available.'
    if (drawReason === 'threefold') return 'Draw by threefold repetition.'
    if (drawReason === 'material') return 'Draw by insufficient material.'
    if (drawReason === 'fifty-moves') return 'Draw by the fifty-move rule.'
    return 'Draw by agreement or rule constraint.'
  }

  // Hover pairing logic
  const isOverlayActive = currentOverlay !== null
  const isHoveredQuantumBranch = isOverlayActive && (
    hoveredSquare === currentOverlay.squareA || hoveredSquare === currentOverlay.squareB
  )

  // Render SVG connector between squareA and squareB only when hovering either branch
  const renderQuantumConnector = () => {
    if (!currentOverlay || !isHoveredQuantumBranch) return null

    const idxA = squareToIndex(currentOverlay.squareA)
    const idxB = squareToIndex(currentOverlay.squareB)

    const x1 = `${(idxA.col + 0.5) * 12.5}%`
    const y1 = `${(idxA.row + 0.5) * 12.5}%`
    const x2 = `${(idxB.col + 0.5) * 12.5}%`
    const y2 = `${(idxB.row + 0.5) * 12.5}%`

    return (
      <svg className="absolute inset-0 pointer-events-none z-20 w-full h-full">
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#97A88A"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="opacity-40 transition-opacity duration-200"
        />
      </svg>
    )
  }

  return (
    <div className="relative w-full aspect-square p-6 border border-border/30 bg-[#0c0c0d] shadow-[0_0_32px_rgba(0,0,0,0.65)] select-none">
      {/* Editorial Ranks and Files Labels */}
      <BoardCoordinates />

      {/* 8x8 Square Grid (Enclosed within the Slate Frame) */}
      <div className="relative grid grid-cols-8 grid-rows-8 w-full h-full border border-border/20 bg-bg-primary">
        {/* SVG Connector Line */}
        {renderQuantumConnector()}

        {board.map((row, rIdx) =>
          row.map((piece, cIdx) => {
            const coordinate = files[cIdx] + ranks[rIdx]
            const isDark = (rIdx + cIdx) % 2 === 1
            const isSelected = selectedSquare === coordinate
            const isLegalDestination = legalMoves.includes(coordinate)
            const isLastMovePart = lastMove 
              ? (lastMove.from === coordinate || lastMove.to === coordinate)
              : false
            const isKingInCheck = kingInCheckSquare === coordinate
            const isQuantumA = firstTarget === coordinate
            const isQuantumB = secondTarget === coordinate

            // Determine if this cell contains a branch of the active overlay
            const isBranch = currentOverlay !== null && (currentOverlay.squareA === coordinate || currentOverlay.squareB === coordinate)
            const isQuantumHovered = isBranch && isHoveredQuantumBranch

            // Original piece that needs to fade out
            const fadingPiece = (currentOverlay && currentOverlay.fromSquare === coordinate)
              ? currentOverlay.piece
              : null

            return (
              <Square
                key={coordinate}
                coordinate={coordinate}
                isDark={isDark}
                piece={piece}
                isSelected={isSelected}
                isLegalDestination={isLegalDestination}
                isLastMovePart={isLastMovePart}
                isKingInCheck={isKingInCheck}
                isQuantumA={isQuantumA}
                isQuantumB={isQuantumB}
                fadingPiece={fadingPiece}
                isQuantumHovered={isQuantumHovered}
                onMouseEnter={() => setHoveredSquare(coordinate)}
                onMouseLeave={() => setHoveredSquare(null)}
                onClick={() => onSquareClick(coordinate)}
              />
            )
          })
        )}
      </div>

      {/* Promotion pending dialog overlay */}
      {promotionPending && (
        <div className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4 select-none p-6">
          <span className="text-[10px] font-mono tracking-widest text-text-secondary/70 uppercase">// Select Promotion Piece</span>
          <div className="flex gap-3">
            {([
              { type: 'q', label: 'Queen', symbol: '♛' },
              { type: 'r', label: 'Rook', symbol: '♜' },
              { type: 'b', label: 'Bishop', symbol: '♝' },
              { type: 'n', label: 'Knight', symbol: '♞' }
            ] as const).map(({ type, label, symbol }) => (
              <button
                key={type}
                type="button"
                onClick={() => onPromoteSelect(type)}
                className="flex flex-col items-center gap-1.5 p-3 border border-border/30 bg-[#0c0c0d] hover:border-sage text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer w-16 outline-none focus-visible:outline-1 focus-visible:outline-sage rounded-none"
              >
                <span className="text-lg leading-none">{symbol}</span>
                <span className="text-[7px] font-mono uppercase tracking-wider">{label}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onPromoteCancel}
            className="mt-2 text-[9px] font-mono text-text-secondary/40 hover:text-text-secondary/80 uppercase tracking-widest transition-colors duration-150 cursor-pointer outline-none focus-visible:underline"
          >
            [ Cancel ]
          </button>
        </div>
      )}

      {/* Game Over Dialog Overlay */}
      {isGameOver && (
        <div className="absolute inset-0 bg-bg-primary/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-6 select-none p-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-[10px] font-mono tracking-[0.25em] text-accent uppercase">// Calibration Concluded</span>
            <h2 className="text-2xl font-serif text-text-primary mt-1">
              {isCheckmate ? 'Checkmate' : 'Draw'}
            </h2>
            <p className="text-[11px] font-serif text-text-secondary/70 italic max-w-[280px]">
              {isCheckmate 
                ? `${turn === 'w' ? 'Black' : 'White'} wins the observation field.`
                : getDrawMessage()
              }
            </p>
          </div>

          <div className="flex flex-col gap-2.5 w-48 mt-2">
            <button
              type="button"
              onClick={onResetGame}
              className="w-full py-2 bg-[#0c0c0d] text-sage hover:text-text-primary border border-sage/40 hover:border-sage text-[10px] font-mono tracking-widest uppercase transition-all duration-200 cursor-pointer rounded-none outline-none focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-sage"
            >
              [ New Game ]
            </button>
            <button
              type="button"
              onClick={onReturnHome}
              className="w-full py-2 bg-[#0c0c0d] text-text-secondary/70 hover:text-text-primary border border-border/40 hover:border-border text-[9px] font-mono tracking-widest uppercase transition-all duration-200 cursor-pointer rounded-none outline-none focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-border"
            >
              [ Return Home ]
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
