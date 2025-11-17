// src/types/config.ts
export interface UserPreferences {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
}

export interface GameSettings {
  timeLimit: number;
  autoFlip: boolean;
}

export interface ConfigState {
  userPreferences: UserPreferences;
  gameSettings: GameSettings;
}
