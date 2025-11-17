// src/types/ui.ts
import { ChessPiece, Position } from './game';

export interface UIState {
  selectedPiece: ChessPiece | null;
  possibleMoves: Position[];
  isFlipped: boolean;
  loading: boolean;
  error: string | null;
  showHistory: boolean;
  undoAvailable: boolean;
}
