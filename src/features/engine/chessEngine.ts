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
   * Promotion piece is passed optionally (Q, R, B, N).
   */
  public move(from: string, to: string, promotion?: 'q' | 'r' | 'b' | 'n'): boolean {
    try {
      this.instance.move({
        from: from as Square,
        to: to as Square,
        promotion: promotion
      })
      return true
    } catch {
      return false
    }
  }

  /**
   * Resets the chess game to the initial starting position.
   */
  public reset(): void {
    this.instance.reset()
  }

  /**
   * Returns whether the active player is in check.
   */
  public inCheck(): boolean {
    return this.instance.inCheck()
  }

  /**
   * Returns whether the active position is checkmate.
   */
  public isCheckmate(): boolean {
    return this.instance.isCheckmate()
  }

  /**
   * Returns whether the active position is stalemate.
   */
  public isStalemate(): boolean {
    return this.instance.isStalemate()
  }

  /**
   * Returns whether the current game is drawn (stalemate, threefold repetition, 50-move rule, etc.).
   */
  public isDraw(): boolean {
    return this.instance.isDraw()
  }

  /**
   * Returns whether the game is drawn specifically by threefold repetition.
   */
  public isThreefoldRepetition(): boolean {
    return this.instance.isThreefoldRepetition()
  }

  /**
   * Returns whether the game is drawn specifically by insufficient material.
   */
  public isInsufficientMaterial(): boolean {
    return this.instance.isInsufficientMaterial()
  }

  /**
   * Returns whether the game is drawn specifically by fifty-move rule.
   */
  public isFiftyMoves(): boolean {
    // chess.js 1.0.0+ exposes isDraw() which includes 50-move rule internally.
    // In chess.js, we can also inspect the halfmove clock via FEN.
    return this.instance.isDraw() && !this.instance.isStalemate() && !this.instance.isThreefoldRepetition() && !this.instance.isInsufficientMaterial()
  }

  /**
   * Retrieves the history of executed moves in standard algebraic notation (SAN).
   */
  public getHistory(): string[] {
    return this.instance.history()
  }

  /**
   * Finds the coordinate square of the King for the specified color.
   */
  public getKingSquare(color: 'w' | 'b'): string | null {
    const board = this.instance.board()
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cell = board[r][c]
        if (cell && cell.type === 'k' && cell.color === color) {
          return cell.square
        }
      }
    }
    return null
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
