// src/types/communication.ts
import { Position } from './game';

export interface Move {
  from: Position;
  to: Position;
}

export interface WebSocketMessage {
  type: string;
  data: any;
}

export interface CommunicationState {
  pendingMoves: Move[];
  lastMessage: WebSocketMessage | null;
  reconnectionAttempts: number;
}
