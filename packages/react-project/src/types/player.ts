// src/types/player.ts
export interface Player {
  userId: string;
  username: string;
  avatar?: string;
  side?: 'RED' | 'BLACK';
  ready: boolean;
  isOnline: boolean;
}

export interface AuthState {
  user: Player | null;
  token: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface PlayerState {
  currentPlayer: Player | null;
  opponent: Player | null;
  roomId: string | null;
  sessionId: string | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
  playersInRoom: Player[];
}
