import type { PieceColor } from '../../chess/types'
import type { QuantumOverlay, QuantumPiece, QuantumState, MeasurementEvent } from '../types/quantum'

export class QuantumEngine {
  private state: QuantumState

  constructor() {
    this.state = this.initialState()
  }

  /**
   * Returns the initial clean quantum state.
   */
  private initialState(): QuantumState {
    return {
      currentOverlay: null,
      quantumMovesUsed: {
        w: false,
        b: false
      },
      measurementHistory: []
    }
  }

  /**
   * Retrieves the current active quantum overlay, if any exists.
   */
  public getCurrentOverlay(): QuantumOverlay | null {
    return this.state.currentOverlay
  }

  /**
   * Checks if the player of the specified color has already spent their single quantum move.
   */
  public hasUsedQuantumMove(color: PieceColor): boolean {
    return this.state.quantumMovesUsed[color]
  }

  /**
   * Checks if a specific square is part of the active quantum overlay.
   */
  public isQuantumSquare(square: string): boolean {
    const overlay = this.state.currentOverlay
    if (!overlay) return false
    return overlay.squareA === square || overlay.squareB === square
  }

  /**
   * Returns the partner square for a square in superposition.
   * If the input square is squareA, returns squareB.
   * If the input square is squareB, returns squareA.
   * Otherwise returns null.
   */
  public getLinkedSquare(square: string): string | null {
    const overlay = this.state.currentOverlay
    if (!overlay) return null
    if (overlay.squareA === square) return overlay.squareB
    if (overlay.squareB === square) return overlay.squareA
    return null
  }

  /**
   * Validates if a Quantum Move (Split) can be performed.
   * Enforces rules:
   * 1. Only one active Quantum Overlay can exist on the board at a time.
   * 2. The player must have their Quantum Move available.
   * 3. The piece must have at least two distinct legal destination squares returned by chess.js.
   */
  public canPerformQuantumMove(
    color: PieceColor,
    fromSquare: string,
    legalMovesForPiece: string[]
  ): boolean {
    // Scaffold: returns false by default, to be implemented in 4B
    if (!fromSquare) return false
    if (this.state.currentOverlay !== null) return false
    if (this.hasUsedQuantumMove(color)) return false
    if (legalMovesForPiece.length < 2) return false
    return true
  }

  /**
   * Registers a new Quantum Overlay on the board and marks the player's quantum move as used.
   */
  public registerQuantumOverlay(
    piece: QuantumPiece,
    fromSquare: string,
    squareA: string,
    squareB: string
  ): void {
    // Scaffold: to be fully integrated in 4B
    this.state.currentOverlay = {
      piece,
      fromSquare,
      squareA,
      squareB
    }
    this.state.quantumMovesUsed[piece.color] = true
  }

  /**
   * Resolves the active superposition by collapsing it to either squareA or squareB (50/50).
   * Generates a MeasurementEvent and adds it to history.
   * Returns the square that the piece collapsed to.
   */
  public triggerCollapse(trigger: 'capture' | 'move'): string | null {
    const overlay = this.state.currentOverlay
    if (!overlay) return null

    // Scaffold: to be fully implemented with randomness/outcome in 4B.
    // For scaffolding, we just return squareA as a dummy outcome.
    const collapsedSquare = overlay.squareA

    const event: MeasurementEvent = {
      id: `measure-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
      trigger,
      piece: overlay.piece,
      squareA: overlay.squareA,
      squareB: overlay.squareB,
      collapsedSquare
    }

    this.state.measurementHistory.push(event)
    this.state.currentOverlay = null // Collapse removes the overlay

    return collapsedSquare
  }

  /**
   * Retrieves all logged measurement events.
   */
  public getMeasurementHistory(): MeasurementEvent[] {
    return this.state.measurementHistory
  }

  /**
   * Resets the quantum engine state (e.g. for a new game).
   */
  public reset(): void {
    this.state = this.initialState()
  }
}
