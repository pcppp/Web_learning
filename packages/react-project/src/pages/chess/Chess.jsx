import { useState, useRef, useEffect, useCallback } from 'react';
import Board from './components/board';
import PlayerPlateau from './components/PlayerPlateau';
import styled from 'styled-components';
import useWebSocket from '../../hooks/useWebSocket';
const kong = 0; // 空
const ma = 1; // 马
const ju = 2; // 车
const pao = 3; //炮
const jiang = 4; // 将
const shi = 5; // 士
const xiang = 6; // 象
const zu = 7; // 卒
const STATUS = {
  WAITING: 'waiting',
  READY: 'ready',
  RECONNECTING: 'reconnecting',
  PLAYING: 'playing',
};
const PlayerContainer = styled.div``;
const Chess = () => {
  const [player, setPlayer] = useState(null);
  const [successFlag, setSuccessFlag] = useState(false);
  const [playerRotation, setPlayerRotation] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  // 'waiting' | 'ready' | 'reconnecting' | 'playing'
  const [status, setStatus] = useState(STATUS.WAITING);
  const dispatchPlayerRotation = () => {
    setPlayerRotation((prev) => {
      if (prev === 1) return 2;
      else if (prev) return 1;
    });
  };
  const getAnotherPlayer = (player) => {
    if (player === 2) return 1;
    if (player === 1) return 2;
  };
  const initChessPieceList = () => {
    const chessPieceList = Array(10)
      .fill(null)
      .map(() => Array(9).fill({}));
    // 设置棋子的初始位置
    const redPositions = [
      { row: 0, col: 0, type: ju }, // 车
      { row: 0, col: 1, type: ma }, // 马
      { row: 0, col: 2, type: xiang }, // 象
      { row: 0, col: 3, type: shi }, // 士
      { row: 0, col: 4, type: jiang }, // 将
      { row: 0, col: 5, type: shi }, // 士
      { row: 0, col: 6, type: xiang }, // 象
      { row: 0, col: 7, type: ma }, // 马
      { row: 0, col: 8, type: ju }, // 车
      { row: 2, col: 1, type: pao }, // 炮
      { row: 2, col: 7, type: pao }, // 炮
      { row: 3, col: 0, type: zu }, // 卒
      { row: 3, col: 2, type: zu }, // 卒
      { row: 3, col: 4, type: zu }, // 卒
      { row: 3, col: 6, type: zu }, // 卒
      { row: 3, col: 8, type: zu }, // 卒
    ];
    // 黑方棋子的初始位置
    const blackPositions = [
      { row: 9, col: 0, type: ju }, // 车
      { row: 9, col: 1, type: ma }, // 马
      { row: 9, col: 2, type: xiang }, // 象
      { row: 9, col: 3, type: shi }, // 士
      { row: 9, col: 4, type: jiang }, // 将
      { row: 9, col: 5, type: shi }, // 士
      { row: 9, col: 6, type: xiang }, // 象
      { row: 9, col: 7, type: ma }, // 马
      { row: 9, col: 8, type: ju }, // 车
      { row: 7, col: 1, type: pao }, // 炮
      { row: 7, col: 7, type: pao }, // 炮
      { row: 6, col: 0, type: zu }, // 卒
      { row: 6, col: 2, type: zu }, // 卒
      { row: 6, col: 4, type: zu }, // 卒
      { row: 6, col: 6, type: zu }, // 卒
      { row: 6, col: 8, type: zu }, // 卒
    ];
    chessPieceList.forEach((rows, rowIndex) => {
      rows.forEach((item, colIndex) => {
        item.row = rowIndex;
        item.col = colIndex;
        item.type = kong;
      });
    });
    // 将棋子放置到棋盘上
    redPositions.forEach(({ row, col, type }) => {
      chessPieceList[row][col] = { row, col, type, player: 1 };
    });
    blackPositions.forEach(({ row, col, type }) => {
      chessPieceList[row][col] = { row, col, type, player: 2 };
    });
    return chessPieceList;
  };
  const [chessPieceList, setChessPieceList] = useState(() => initChessPieceList());

  const { socketRef, sendMessage, connectionStatus } = useWebSocket({
    url: 'ws://localhost:2000',
    onMessage: useCallback((data) => {
      if (data.type === 'joinSuccess') {
        setPlayer(data.player);
        setIsFlipped(data.player === 1);
        if (data.chessPieceList) {
          setChessPieceList(data.chessPieceList);
          console.log(data.playerRotation);
          setPlayerRotation(data.playerRotation);
        }
      }

      if (data.type === 'start') {
        setStatus(STATUS.PLAYING);
      }
      if (data.type === 'move') {
        handleMoveChessPiece({
          from: data.from,
          to: data.to,
        });
      }
      if (data.type === 'opponentDisConnect') {
        setStatus(STATUS.RECONNECTING);
      }
    }, []),
    onOpen: useCallback(() => {
      sendMessage({ type: 'join', roomId: 'room1' });
    }, []),
  });

  const handleSuccessJudgment = ({ chessPiece }) => {
    if (chessPiece.type === jiang) {
      setSuccessFlag(true);
      return true;
    }
    return false;
  };

  const handleMoveChessPiece = ({ from, to }) => {
    // 纯函数：计算移动后的棋盘
    const calculateNewBoard = (chessPieceList, from, to) => {
      const newBoard = chessPieceList.map((row) => row.map((piece) => ({ ...piece })));

      const newRow = Math.floor(to / 9);
      const oldRow = Math.floor(from / 9);
      const newCol = to % 9;
      const oldCol = from % 9;

      const movingPiece = chessPieceList[oldRow][oldCol];

      newBoard[newRow][newCol] = {
        row: newRow,
        col: newCol,
        type: movingPiece.type,
        player: movingPiece.player,
      };

      newBoard[oldRow][oldCol] = {
        row: oldRow,
        col: oldCol,
        type: kong,
        player: null,
      };

      return newBoard;
    };
    let newBoard = calculateNewBoard(chessPieceList, from, to);
    setChessPieceList((prev) => {
      newBoard = calculateNewBoard(prev, from, to);
      return newBoard;
    });
    dispatchPlayerRotation();
    return { chessPieceList, playerRotation: getAnotherPlayer(playerRotation) };
  };
  return (
    <>
      <div
        className={`flex h-full w-full scale-40 flex-col items-center justify-center sm:scale-70 lg:scale-80 xl:scale-90 2xl:scale-100`}>
        <PlayerContainer className="flex w-full flex-1 shrink-0 flex-col items-center justify-center">
          <PlayerPlateau
            status={status}
            player={getAnotherPlayer(player)}
            isActivate={getAnotherPlayer(player) === playerRotation}></PlayerPlateau>
        </PlayerContainer>
        <div className="aspect-square shrink px-[47px]">
          <Board
            socket={socketRef}
            handleMoveChessPiece={handleMoveChessPiece}
            player={player}
            isFlipped={isFlipped}
            setPlayer={setPlayer}
            chessPieceList={chessPieceList}
            playerRotation={playerRotation}
          />
        </div>
        <PlayerContainer className="flex flex-1 shrink-0 flex-col items-center justify-center">
          <PlayerPlateau player={player} isActivate={player === playerRotation} />
        </PlayerContainer>
      </div>
    </>
  );
};
export default Chess;
