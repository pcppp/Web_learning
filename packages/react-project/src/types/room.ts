// src/types/room.ts
import { Player } from './player';

export interface Room {
  roomId: string;
  name?: string;
  players?: Player[];
  maxPlayers: number;
  status: 'waiting' | 'playing' | 'finished';
  timeLimit?: number;
  createdBy?: string;
  isPrivate?: boolean;
}

export interface LobbyState {
  rooms: Room[];
  currentRoom: Room | null;
  lobbyStatus: 'loading' | 'loaded' | 'error';
}
