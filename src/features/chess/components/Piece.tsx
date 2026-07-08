import React from 'react'
import type { PieceColor, PieceType } from '../types'

interface PieceProps {
  type: PieceType
  color: PieceColor
  className?: string
}

export const Piece: React.FC<PieceProps> = ({ type, color, className = '' }) => {
  // Common styling: White has slate-dark outline, Black has light-slate outline.
  // This ensures pieces are distinct and readable on both light and dark squares.
  const isWhite = color === 'w'
  const strokeColor = isWhite ? '#161618' : '#f0f0f2'
  const fillColor = isWhite ? '#f0f0f2' : '#222225'

  // Standard clean vector outlines (derived from standard chess piece SVGs but simplified)
  switch (type) {
    case 'p': // Pawn
      return (
        <svg viewBox="0 0 45 45" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.75 3.88 2 5.29V29h9v-2.71c1.25-1.41 2-3.26 2-5.29 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M15 36h15v-3.5c0-1.38-1.12-2.5-2.5-2.5h-10c-1.38 0-2.5 1.12-2.5 2.5V36z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )

    case 'r': // Rook
      return (
        <svg viewBox="0 0 45 45" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 36v-4h21v4H12z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M14 32l1-14h15l1 14H14z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M14 18V11h4v3h5v-3h5v3h5v-3h4v7H14z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )

    case 'n': // Knight
      return (
        <svg viewBox="0 0 45 45" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M33 36c0-1-1-6-4-10-3-4-8-5-10-5-2 0-3-.5-4-1.5-.5-.5-.5-1.5-.5-2.5 0-3 3-6.5 5-8.5.5-.5.5-1 0-1.5-.5-.5-1.5-1-3-1-3 0-7.5 4.5-9.5 8.5C5 23.5 6.5 32 10.5 33.5c3.5 1.5 7.5 1 11.5 1.5 2 .25 5 1 5 1H33z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="15" cy="15" r="1.5" fill={strokeColor} />
        </svg>
      )

    case 'b': // Bishop
      return (
        <svg viewBox="0 0 45 45" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15 36h15v-3H15v3z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M22.5 8s-7 6-7 12c0 4.5 3 7 7 10 4-3 7-5.5 7-10 0-6-7-12-7-12z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M22.5 5v3M21 6.5h3"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )

    case 'q': // Queen
      return (
        <svg viewBox="0 0 45 45" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.5 36h20v-3h-20v3z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M12.5 33l2.5-18 7.5 12.5 7.5-12.5 2.5 18H12.5z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="12.5" cy="13" r="1.5" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="22.5" cy="11" r="1.5" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="32.5" cy="13" r="1.5" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      )

    case 'k': // King
      return (
        <svg viewBox="0 0 45 45" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.5 36h20v-3h-20v3z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M15 33l1.5-14H21v3h3v-3h4.5l1.5 14H15z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M22.5 11v5M20 13.5h5"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M17 19c0-3 3-5 5.5-5s5.5 2 5.5 5H17z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )

    default:
      return null
  }
}
