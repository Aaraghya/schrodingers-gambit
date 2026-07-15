import type { PieceColor } from '../../chess/types'
import type { QuantumOverlay, QuantumPiece, QuantumState, MeasurementEvent } from '../types/quantum'

export class QuantumEngine {
  private state: QuantumState

  constructor() {
    this.state = this.initialState()
  }

  private eventCounter = 0

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
   * Returns a deep copy to prevent mutation of the internal state.
   */
  public getCurrentOverlay(): QuantumOverlay | null {
    const overlay = this.state.currentOverlay
    if (!overlay) return null
    return {
      piece: { ...overlay.piece },
      fromSquare: overlay.fromSquare,
      squareA: overlay.squareA,
      squareB: overlay.squareB
    }
  }

  /**
   * Checks if a quantum overlay is currently active.
   */
  public hasCurrentOverlay(): boolean {
    return this.state.currentOverlay !== null
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
   * Registers a new Quantum Overlay on the board and marks the player's quantum move as used.
   */
  public registerQuantumOverlay(
    piece: QuantumPiece,
    fromSquare: string,
    squareA: string,
    squareB: string
  ): void {
    this.state.currentOverlay = {
      piece: { ...piece },
      fromSquare,
      squareA,
      squareB
    }
    this.state.quantumMovesUsed[piece.color] = true
  }

  /**
   * Resolves the active superposition by collapsing it to either squareA or squareB (50/50).
   * Generates an immutable MeasurementEvent and adds it to history.
   * Returns the square that the piece collapsed to.
   * Returns null if no overlay is active.
   */
  public triggerCollapse(trigger: 'capture' | 'move'): string | null {
    const overlay = this.state.currentOverlay
    if (!overlay) return null

    // Perform a true 50/50 random choice between squareA and squareB
    const collapsedSquare = Math.random() < 0.5 ? overlay.squareA : overlay.squareB

    // Generate unique ID: prefer crypto.randomUUID() if supported, otherwise deterministic fallback
    let eventId: string
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      eventId = crypto.randomUUID()
    } else {
      eventId = `measure-${overlay.piece.id}-${trigger}-${this.eventCounter++}`
    }

    const event: MeasurementEvent = {
      id: eventId,
      timestamp: Date.now(),
      trigger,
      piece: { ...overlay.piece },
      squareA: overlay.squareA,
      squareB: overlay.squareB,
      collapsedSquare
    }

    // Append to measurementHistory
    this.state.measurementHistory.push(event)

    // Clear currentOverlay
    this.state.currentOverlay = null

    return collapsedSquare
  }

  /**
   * Retrieves all logged measurement events.
   * Returns a deep copy to prevent mutation of the internal state.
   */
  public getMeasurementHistory(): MeasurementEvent[] {
    return this.state.measurementHistory.map(event => ({
      id: event.id,
      timestamp: event.timestamp,
      trigger: event.trigger,
      piece: { ...event.piece },
      squareA: event.squareA,
      squareB: event.squareB,
      collapsedSquare: event.collapsedSquare
    }))
  }

  /**
   * Resets the quantum engine state (e.g. for a new game).
   */
  public reset(): void {
    this.state = this.initialState()
    this.eventCounter = 0
  }
}

