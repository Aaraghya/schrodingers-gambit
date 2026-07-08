import { Chess, type Square } from 'chess.js'
import type { BoardState } from '../chess/types'
import { mapEngineBoardToState } from './boardMapper'

export class ChessEngine {
  private instance: Chess

  constructor(fen?: string) {
    this.instance = new Chess(fen)
  }

  /**
   * Retrieves the current 8x8 visual BoardState mapped from chess.js.
   */
  public getBoardState(): BoardState {
    return mapEngineBoardToState(this.instance.board())
  }

  /**
   * Gets the piece at a specific square coordinates (e.g. "e4").
   */
  public getPiece(square: string) {
    return this.instance.get(square as Square)
  }

  /**
   * Calculates all legal destination squares for a piece at the specified coordinate.
   */
  public getLegalMovesForSquare(square: string): string[] {
    const moves = this.instance.moves({ square: square as Square, verbose: true })
    // verbose: true returns Move objects; we extract the 'to' target square coordinate
    return moves.map((m) => m.to)
  }

  /**
   * Attempts to execute a move from start to target.
   * Promotes pawns reaching the back ranks to Queen by default.
   */
  public move(from: string, to: string): boolean {
    try {
      const piece = this.instance.get(from as Square)
      const isPawn = piece && piece.type === 'p'
      const isPromotionRank = to.endsWith('8') || to.endsWith('1')
      
      const moveConfig = isPawn && isPromotionRank 
        ? { from: from as Square, to: to as Square, promotion: 'q' }
        : { from: from as Square, to: to as Square }

      this.instance.move(moveConfig)
      return true
    } catch {
      return false
    }
  }

  /**
   * Gets the current game position FEN string.
   */
  public getFen(): string {
    return this.instance.fen()
  }

  /**
   * Retrieves the color whose turn it is to move ('w' or 'b').
   */
  public getTurn(): 'w' | 'b' {
    return this.instance.turn()
  }

  /**
   * Determines if the game has ended.
   */
  public isGameOver(): boolean {
    return this.instance.isGameOver()
  }
}
