// src/types/game.ts
export type ChessPieceType = 'pao' | 'ma' | 'ju' | 'jiang' | 'xiang' | 'shi' | 'zu';

export interface ChessPiece {
  player: 1 | 2;
  row: number;
  col: number;
  type: ChessPieceType;
}

export interface Position {
  row: number;
  col: number;
}

export interface MoveRecord {
  from: Position;
  to: Position;
  piece: ChessPiece;
  timestamp: number;
}

export interface GameState {
  board: (ChessPiece | null)[][];
  playerRotation: 1 | 2;
  gameStatus: 'waiting' | 'ready' | 'playing' | 'reconnecting' | 'finished';
  winner: 1 | 2 | null;
  isCheck: boolean;
  moveHistory: MoveRecord[];
}
