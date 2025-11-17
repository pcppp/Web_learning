// src/store/appStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AppState } from '../types/app';

const initialState: AppState = {
  auth: {
    user: null,
    token: null,
    sessionId: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  },
  game: {
    board: Array(10)
      .fill(null)
      .map(() => Array(9).fill(null)),
    playerRotation: 1,
    gameStatus: 'waiting',
    winner: null,
    isCheck: false,
    moveHistory: [],
  },
  player: {
    currentPlayer: null,
    opponent: null,
    roomId: null,
    sessionId: null,
    connectionStatus: 'disconnected',
    playersInRoom: [],
  },
  ui: {
    selectedPiece: null,
    possibleMoves: [],
    isFlipped: false,
    loading: false,
    error: null,
    showHistory: false,
    undoAvailable: false,
  },
  lobby: {
    rooms: [],
    currentRoom: null,
    lobbyStatus: 'loading',
  },
  communication: {
    pendingMoves: [],
    lastMessage: null,
    reconnectionAttempts: 0,
  },
  config: {
    userPreferences: {
      theme: 'light',
      soundEnabled: true,
    },
    gameSettings: {
      timeLimit: 0,
      autoFlip: false,
    },
  },
};

interface AppStore extends AppState {
  // Setters for auth state
  setUser: (user: AppState['auth']['user']) => void;
  setToken: (token: string | null) => void;
  setAuthSessionId: (sessionId: string | null) => void;
  setAuthLoading: (loading: boolean) => void;
  setAuthError: (error: string | null) => void;

  // Auth actions
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, password: string, email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  initAuth: () => Promise<void>;

  // Setters for game state
  setBoard: (board: AppState['game']['board']) => void;
  setPlayerRotation: (rotation: 1 | 2) => void;
  setGameStatus: (status: AppState['game']['gameStatus']) => void;
  setWinner: (winner: 1 | 2 | null) => void;
  setIsCheck: (isCheck: boolean) => void;
  addMoveToHistory: (move: import('../types/game').MoveRecord) => void;
  removeLastMoveFromHistory: () => void; // 新增，用于撤销
  clearMoveHistory: () => void;

  // Setters for player state
  setCurrentPlayer: (player: AppState['player']['currentPlayer']) => void;
  setOpponent: (opponent: AppState['player']['opponent']) => void;
  setRoomId: (roomId: string | null) => void;
  setSessionId: (sessionId: string | null) => void;
  setConnectionStatus: (status: AppState['player']['connectionStatus']) => void;
  setPlayersInRoom: (players: AppState['player']['playersInRoom']) => void;

  // Setters for UI state
  setSelectedPiece: (piece: AppState['ui']['selectedPiece']) => void;
  setPossibleMoves: (moves: AppState['ui']['possibleMoves']) => void;
  setIsFlipped: (flipped: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setShowHistory: (show: boolean) => void;
  setUndoAvailable: (available: boolean) => void;

  // Setters for lobby state
  setRooms: (rooms: AppState['lobby']['rooms']) => void;
  setCurrentRoom: (room: AppState['lobby']['currentRoom']) => void;
  setLobbyStatus: (status: AppState['lobby']['lobbyStatus']) => void;

  // Setters for communication state
  addPendingMove: (move: import('../types/communication').Move) => void;
  removePendingMove: (index: number) => void;
  setLastMessage: (message: AppState['communication']['lastMessage']) => void;
  setReconnectionAttempts: (attempts: number) => void;

  // Setters for config state
  setUserPreferences: (prefs: AppState['config']['userPreferences']) => void;
  setGameSettings: (settings: AppState['config']['gameSettings']) => void;

  // Utility methods
  resetGame: () => void;
  resetPlayer: () => void;
  resetUI: () => void;
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Auth setters
        setUser: (user) =>
          set((state) => ({
            auth: { ...state.auth, user, isAuthenticated: !!user && !!state.auth.token },
          })),
        setToken: (token) =>
          set((state) => ({
            auth: { ...state.auth, token, isAuthenticated: !!token && !!state.auth.user },
          })),
        setAuthSessionId: (sessionId) => set((state) => ({ auth: { ...state.auth, sessionId } })),
        setAuthLoading: (loading) => set((state) => ({ auth: { ...state.auth, loading } })),
        setAuthError: (error) => set((state) => ({ auth: { ...state.auth, error } })),

        // Auth actions
        initAuth: async () => {
          const savedToken = localStorage.getItem('chess_token');
          const savedUser = localStorage.getItem('chess_user');
          const savedSessionId = localStorage.getItem('chess_sessionId');

          if (savedToken && savedUser) {
            try {
              set((state) => ({
                auth: {
                  ...state.auth,
                  token: savedToken,
                  user: JSON.parse(savedUser),
                  sessionId: savedSessionId,
                  isAuthenticated: true,
                },
              }));

              // 验证 token 是否有效（需要导入authAPI）
              const { authAPI } = await import('../request/auth');
              const { user } = await authAPI.getCurrentUser();

              set((state) => ({ auth: { ...state.auth, user } }));
              localStorage.setItem('chess_user', JSON.stringify(user));
            } catch (error) {
              console.error('Token 验证失败', error);
              localStorage.removeItem('chess_token');
              localStorage.removeItem('chess_user');
              localStorage.removeItem('chess_sessionId');
              set((state) => ({
                auth: { ...state.auth, token: null, user: null, sessionId: null, isAuthenticated: false },
              }));
            }
          }
          set((state) => ({ auth: { ...state.auth, loading: false } }));
        },

        login: async (username: string, password: string) => {
          try {
            set((state) => ({ auth: { ...state.auth, error: null } }));
            const { authAPI } = await import('../request/auth');
            const response = await authAPI.login(username, password);

            const { token: newToken, user: newUser, session: newSession } = response;

            set((state) => ({
              auth: {
                ...state.auth,
                token: newToken,
                user: newUser,
                sessionId: newSession?.sessionId || null,
                isAuthenticated: true,
                error: null,
              },
            }));

            localStorage.setItem('chess_token', newToken);
            localStorage.setItem('chess_user', JSON.stringify(newUser));
            if (newSession?.sessionId) {
              localStorage.setItem('chess_sessionId', newSession.sessionId);
            }

            return { success: true };
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || '登录失败';
            set((state) => ({ auth: { ...state.auth, error: errorMessage } }));
            return { success: false, error: errorMessage };
          }
        },

        register: async (username: string, password: string, email: string) => {
          try {
            set((state) => ({ auth: { ...state.auth, error: null } }));
            const { authAPI } = await import('../request/auth');
            const response = await authAPI.register(username, password, email);

            const { token: newToken, user: newUser } = response;

            set((state) => ({
              auth: {
                ...state.auth,
                token: newToken,
                user: newUser,
                isAuthenticated: true,
                error: null,
              },
            }));

            localStorage.setItem('chess_token', newToken);
            localStorage.setItem('chess_user', JSON.stringify(newUser));

            return { success: true };
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || '注册失败';
            set((state) => ({ auth: { ...state.auth, error: errorMessage } }));
            return { success: false, error: errorMessage };
          }
        },

        logout: async () => {
          try {
            const { authAPI } = await import('../request/auth');
            await authAPI.logout();
          } catch (error) {
            console.error('登出失败', error);
          } finally {
            set((state) => ({
              auth: {
                ...state.auth,
                user: null,
                token: null,
                sessionId: null,
                isAuthenticated: false,
                error: null,
              },
            }));

            localStorage.removeItem('chess_token');
            localStorage.removeItem('chess_user');
            localStorage.removeItem('chess_sessionId');
          }
        },

        refreshToken: async () => {
          try {
            const { authAPI } = await import('../request/auth');
            const { token: newToken } = await authAPI.refreshToken();

            set((state) => ({ auth: { ...state.auth, token: newToken } }));
            localStorage.setItem('chess_token', newToken);
            return true;
          } catch (error) {
            console.error('Token 刷新失败', error);
            get().logout();
            return false;
          }
        },

        // Game setters
        setBoard: (board) => set((state) => ({ game: { ...state.game, board } })),
        setPlayerRotation: (rotation) => set((state) => ({ game: { ...state.game, playerRotation: rotation } })),
        setGameStatus: (status) => set((state) => ({ game: { ...state.game, gameStatus: status } })),
        setWinner: (winner) => set((state) => ({ game: { ...state.game, winner } })),
        setIsCheck: (isCheck) => set((state) => ({ game: { ...state.game, isCheck } })),
        addMoveToHistory: (move) =>
          set((state) => ({ game: { ...state.game, moveHistory: [...state.game.moveHistory, move] } })),
        removeLastMoveFromHistory: () =>
          set((state) => ({ game: { ...state.game, moveHistory: state.game.moveHistory.slice(0, -1) } })),
        clearMoveHistory: () => set((state) => ({ game: { ...state.game, moveHistory: [] } })),

        // Player setters
        setCurrentPlayer: (player) => set((state) => ({ player: { ...state.player, currentPlayer: player } })),
        setOpponent: (opponent) => set((state) => ({ player: { ...state.player, opponent } })),
        setRoomId: (roomId) => set((state) => ({ player: { ...state.player, roomId } })),
        setSessionId: (sessionId) => set((state) => ({ player: { ...state.player, sessionId } })),
        setConnectionStatus: (status) => set((state) => ({ player: { ...state.player, connectionStatus: status } })),
        setPlayersInRoom: (players) => set((state) => ({ player: { ...state.player, playersInRoom: players } })),

        // UI setters
        setSelectedPiece: (piece) => set((state) => ({ ui: { ...state.ui, selectedPiece: piece } })),
        setPossibleMoves: (moves) => set((state) => ({ ui: { ...state.ui, possibleMoves: moves } })),
        setIsFlipped: (flipped) => set((state) => ({ ui: { ...state.ui, isFlipped: flipped } })),
        setLoading: (loading) => set((state) => ({ ui: { ...state.ui, loading } })),
        setError: (error) => set((state) => ({ ui: { ...state.ui, error } })),
        setShowHistory: (show) => set((state) => ({ ui: { ...state.ui, showHistory: show } })),
        setUndoAvailable: (available) => set((state) => ({ ui: { ...state.ui, undoAvailable: available } })),

        // Lobby setters
        setRooms: (rooms) => set((state) => ({ lobby: { ...state.lobby, rooms } })),
        setCurrentRoom: (room) => set((state) => ({ lobby: { ...state.lobby, currentRoom: room } })),
        setLobbyStatus: (status) => set((state) => ({ lobby: { ...state.lobby, lobbyStatus: status } })),

        // Communication setters
        addPendingMove: (move) =>
          set((state) => ({
            communication: { ...state.communication, pendingMoves: [...state.communication.pendingMoves, move] },
          })),
        removePendingMove: (index) =>
          set((state) => ({
            communication: {
              ...state.communication,
              pendingMoves: state.communication.pendingMoves.filter((_, i) => i !== index),
            },
          })),
        setLastMessage: (message) =>
          set((state) => ({ communication: { ...state.communication, lastMessage: message } })),
        setReconnectionAttempts: (attempts) =>
          set((state) => ({ communication: { ...state.communication, reconnectionAttempts: attempts } })),

        // Config setters
        setUserPreferences: (prefs) => set((state) => ({ config: { ...state.config, userPreferences: prefs } })),
        setGameSettings: (settings) => set((state) => ({ config: { ...state.config, gameSettings: settings } })),

        // Utility methods
        resetGame: () => set((state) => ({ game: initialState.game })),
        resetPlayer: () => set((state) => ({ player: initialState.player })),
        resetUI: () => set((state) => ({ ui: initialState.ui })),
      }),
      {
        name: 'app-store',
        partialize: (state) => ({
          config: state.config, // Only persist config
          auth: { token: state.auth.token, user: state.auth.user, sessionId: state.auth.sessionId }, // Persist auth
          player: {
            currentPlayer: state.player.currentPlayer,
            sessionId: state.player.sessionId,
            roomId: state.player.roomId,
          }, // Persist some player info
        }),
      }
    ),
    { name: 'AppStore' }
  )
);
