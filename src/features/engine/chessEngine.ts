import { Chess } from 'chess.js'
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
