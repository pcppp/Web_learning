// src/types/app.ts
import { GameState } from './game';
import { PlayerState, AuthState } from './player';
import { UIState } from './ui';
import { LobbyState } from './room';
import { CommunicationState } from './communication';
import { ConfigState } from './config';

export interface AppState {
  auth: AuthState;
  game: GameState;
  player: PlayerState;
  ui: UIState;
  lobby: LobbyState;
  communication: CommunicationState;
  config: ConfigState;
}
