import { useState, useRef, useEffect, useCallback, use } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import Board from './components/Board';
import PlayerPlateau from './components/PlayerPlateau';
import styled from 'styled-components';
import useWebSocket from '../../hooks/useWebSocket';
import useChessGame from './hooks/useChessGame';
import useChessSession from './hooks/useChessSession';
import { useAppStore } from '@/store/appStore';
import { useChessAPI } from '@/request/chess';
const STATUS = {
  WAITING: 'waiting',
  READY: 'ready',
  RECONNECTING: 'reconnecting',
  PLAYING: 'playing',
};
const PlayerContainer = styled.div``;
const Chess = () => {
  const { gameState, initChessPieceList, makeMove, undoMove, checkVictory } = useChessGame();
  useChessSession({});
  const { leaveRoom } = useChessAPI();
  const { roomId } = useParams();
  const nav = useNavigate();
  const player = useAppStore((state) => state.currentPlayer);
  const isFlipped = player === 2 ? true : false;
  useEffect(() => {
    initChessPieceList();
    return () => {
      handleLeaveRoom();
    };
  }, []);
  const handleLeaveRoom = async () => {
    if (roomId) {
      try {
        await leaveRoom({ roomId });
      } catch (error) {
        console.error('离开房间失败:', error);
      } finally {
        nav('/chess/hall');
      }
    }
  };
  const dispatchPlayerRotation = () => {};
  const getAnotherPlayer = (player) => {
    if (player === 2) return 1;
    if (player === 1) return 2;
  };

  const { socketRef, sendMessage, connectionStatus } = useWebSocket({
    url: 'ws://localhost:2000',
    onMessage: useCallback((data) => {
      if (data.type === 'start') {
        console.log(1);
      }
      if (data.type === 'move') {
        makeMove(data.from, data.to);
      }
      if (data.type === 'opponentDisConnect') {
        console.log(2);
      }
    }, []),
    onOpen: useCallback(() => {
      // sendMessage({ type: 'join', roomId });
    }, []),
  });

  return (
    <div
      className={`flex h-full w-full scale-40 flex-col items-center justify-center sm:scale-70 lg:scale-80 xl:scale-90 2xl:scale-100`}>
      <PlayerContainer className="flex w-full flex-1 shrink-0 flex-col items-center justify-center">
        <PlayerPlateau
          status={status}
          player={getAnotherPlayer(player)}
          isActivate={getAnotherPlayer(player) === gameState.playerRotation}></PlayerPlateau>
      </PlayerContainer>
      <div className="aspect-square shrink px-[47px]">
        <Board
          socket={socketRef}
          handleMoveChessPiece={makeMove}
          player={player}
          isFlipped={isFlipped}
          chessPieceList={gameState.board}
          playerRotation={gameState.playerRotation}
        />
      </div>
      <PlayerContainer className="flex flex-1 shrink-0 flex-col items-center justify-center">
        <PlayerPlateau player={player} isActivate={player === gameState.playerRotation} />
      </PlayerContainer>
    </div>
  );
};
export default Chess;
