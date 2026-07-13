import type { PieceType, PieceColor } from '../../chess/types'

export interface QuantumPiece {
  id: string; // Unique ID to track the piece across its superposition states
  type: PieceType;
  color: PieceColor;
}

export interface QuantumOverlay {
  piece: QuantumPiece;
  fromSquare: string; // Original square before split
  squareA: string;    // Target square A
  squareB: string;    // Target square B
}

export interface MeasurementEvent {
  id: string;
  timestamp: number;
  trigger: 'capture' | 'move';
  piece: QuantumPiece;
  squareA: string;
  squareB: string;
  collapsedSquare: string; // The square the piece collapsed to (either squareA or squareB)
}

export interface QuantumState {
  // Active quantum overlay (at most 1 active overlay on the board at a time)
  currentOverlay: QuantumOverlay | null;

  // Track one quantum move usage per player
  quantumMovesUsed: {
    w: boolean;
    b: boolean;
  };

  measurementHistory: MeasurementEvent[];
}
