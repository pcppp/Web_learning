import { useCallback } from 'react';
import http from '../request/http';

/**
 * 🔥 自定义 Hook：象棋 API
 * 自动注入当前用户信息
 */
export function useChessAPI() {
  const createRoom = useCallback(async ({ name, timeLimit = 600 }) => {
    try {
      const response = await http.post('/rooms', { name, timeLimit });
      return response;
    } catch (error) {
      console.error('创建房间失败:', error);
      throw error;
    }
  }, []);

  const getRooms = useCallback(async () => {
    try {
      const response = await http.get('/chess/lobby');
      return response;
    } catch (error) {
      console.error('获取房间列表失败:', error);
      throw error;
    }
  }, []);
  const joinLobby = useCallback(async () => {
    try {
      const response = await http.get('/chess/lobby/enter');
      return response;
    } catch (error) {
      console.error('进入大厅失败:', error);
      throw error;
    }
  }, []);
  const joinRoom = useCallback(async ({ roomId }) => {
    try {
      const response = await http.post(`/chess/rooms/${roomId}/join`);
      return response;
    } catch (error) {
      console.error('加入房间失败:', error);
      throw error;
    }
  }, []);

  const leaveRoom = useCallback(async ({ roomId }) => {
    try {
      const response = await http.post(`/chess/rooms/${roomId}/leave`);
      return response;
    } catch (error) {
      console.error('离开房间失败:', error);
      throw error;
    }
  }, []);

  const reconnect = useCallback(async ({ sessionId, reconnectToken }) => {
    try {
      const response = await http.post('/chess/sessions/reconnect', {
        sessionId,
        reconnectToken,
      });
      return response;
    } catch (error) {
      console.error('重连失败:', error);
      throw error;
    }
  }, []);

  return {
    createRoom,
    getRooms,
    joinRoom,
    leaveRoom,
    reconnect,
    joinLobby,
  };
}
