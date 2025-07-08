import { useState, useRef, useEffect } from 'react';
import Board from './components/board';
import PlayerPlateau from './components/PlayerPlateau';
const kong = 0; // 空
const ma = 1; // 马
const ju = 2; // 车
const pao = 3; //炮
const jiang = 4; // 将
const shi = 5; // 士
const xiang = 6; // 象
const zu = 7; // 卒
const initChessPieceList = () => {
  console.log('init');
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
const Chess = () => {
  const [player, setPlayer] = useState(1);
  const [chessPieceList, setChessPieceList] = useState(() => initChessPieceList());
  const [successFlag, setSuccessFlag] = useState(false);
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:2000');
    socketRef.current = socket;
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'join', roomId: 'room1' }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('收到对手走子', data);
      if (data.type === 'move') {
        handleMoveChessPiece({ from: data.from, to: data.to });
      }
    };

    return () => socket.close();
  }, []);
  const playerRotation = () => {
    if (player === 1) setPlayer(2);
    else setPlayer(1);
  };
  const socketRef = useRef(null);
  const handleSuccessJudgment = ({ chessPiece }) => {
    if (chessPiece.type === jiang) {
      setSuccessFlag(true);
      return true;
    }
    return false;
  };
  const handleMoveChessPiece = ({ from, to }) => {
    const newRow = Math.floor(to / 9);
    const oldRow = Math.floor(from / 9);
    const newCol = to % 9;
    const oldCol = from % 9;
    const oldChessPiece = chessPieceList[oldRow][oldCol];
    const newChessPiece = chessPieceList[newRow][newCol];
    const newChessPieceList = chessPieceList.map((row) => [...row]);
    newChessPieceList[newRow][newCol] = {
      row: newRow,
      col: newCol,
      type: oldChessPiece.type,
      player: oldChessPiece.player,
    };
    newChessPieceList[oldRow][oldCol] = { row: oldRow, col: oldCol, type: kong };
    setChessPieceList(newChessPieceList);
    if (handleSuccessJudgment({ chessPiece: newChessPiece })) {
      return;
    }
    // playerRotation();
  };

  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <PlayerPlateau player={1} isActivate={player === 1} className="flex-1" />
        <Board
          socket={socketRef}
          handleMoveChessPiece={handleMoveChessPiece}
          player={player}
          setPlayer={setPlayer}
          chessPieceList={chessPieceList}
        />
        <PlayerPlateau player={2} isActivate={player === 2} className="flex-1" />
      </div>
    </>
  );
};
export default Chess;
