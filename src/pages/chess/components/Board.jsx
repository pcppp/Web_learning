import { useState, useEffect } from 'react';
import styled from 'styled-components';
const ChessPiece = styled.div`
  background: red;
  border: ${(props) => (props.$isSelected ? '4px solid black' : 'none')}; /* 添加黑色边框 */
  border-radius: 50%;
  transition: border 0.1s ease;
`;
const GridContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  /* 提示点样式 */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: ${(props) => (props.$showDot ? '8px' : '0')};
    height: ${(props) => (props.$showDot ? '8px' : '0')};
    background-color: black;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
`;
const kong = 0; // 空
const ma = 1; // 马
const ju = 2; // 车
const pao = 3; //炮
const jiang = 4; // 将
const shi = 5; // 士
const xiang = 6; // 象
const zu = 7; // 卒
const initChessPieceList = () => {
  const chessPieceList = Array(10)
    .fill(null)
    .map(() => Array(9).fill({ type: kong }));
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

  // 将棋子放置到棋盘上
  redPositions.forEach(({ row, col, type }) => {
    chessPieceList[row][col] = { row, col, type, player: 1 };
  });
  blackPositions.forEach(({ row, col, type }) => {
    chessPieceList[row][col] = { row, col, type, player: 2 };
  });

  return chessPieceList;
};
const getTypeFromIndex = (index) => {
  return;
};

const Grid = ({ chessPiece, isSelected, onClick, showDot }) => {
  return (
    <GridContainer $showDot={showDot} onClick={onClick}>
      {chessPiece.type === kong ? (
        <div className="h-15 w-15"></div>
      ) : (
        <ChessPiece $isSelected={isSelected} className="h-15 w-15 rounded-full">
          {chessPiece.type}
        </ChessPiece>
      )}
    </GridContainer>
  );
};
const chessPieceClick = ({ chessPiece }) => {};
const getIndexFromRowCol = ({ row, col }) => {
  return row * 9 + col;
};
const Board = () => {
  const [chessPieceList, setChessPieceList] = useState(initChessPieceList());
  const [dotsIndex, setDotsIndex] = useState(new Set());
  const [selectedIndex, setSelectedIndex] = useState(null);
  const getPossibilityLocation = ({ chessPiece }) => {
    const dotsIndex = new Set();
    const { row, col } = chessPiece;
    const verifiedAdd = (row, col) => {
      if (row < 10 && col < 9 && row >= 0 && col >= 0) {
        dotsIndex.add(row * 9 + col);
      }
    };
    const type = chessPiece.type;
    switch (type) {
      case 1:
        //马
        const moveList = [
          [1, 2],
          [1, -2],
          [2, 1],
          [2, -1],
          [-1, 2],
          [-1, -2],
          [-2, 1],
          [-2, -1],
        ];
        moveList.forEach((move) => {
          let blockIndex = null;
          if (Math.abs(move[0]) === 2) {
            const blockIncremental = move[0] / 2;
            blockIndex = getIndexFromRowCol({ row: row + blockIncremental, col: col });
          } else {
            const blockIncremental = move[1] / 2;
            blockIndex = getIndexFromRowCol({ row: row, col: col + blockIncremental });
          }
          if (chessPieceList.flat()[blockIndex] && chessPieceList.flat()[blockIndex].type !== kong) return;
          verifiedAdd(row + move[0], col + move[1]);
        });

        break;
      case 2:
        // 车
        for (let i = 0; i < 10; i++) {
          verifiedAdd(row + i, col);
          verifiedAdd(row - i, col);
          verifiedAdd(row, col + i);
          verifiedAdd(row, col - i);
        }
        break;
      case 3:
        // 炮
        for (let i = 0; i < 10; i++) {
          verifiedAdd(row + i, col);
          verifiedAdd(row - i, col);
          verifiedAdd(row, col + i);
          verifiedAdd(row, col - i);
        }
        break;
      case 4:
        // 将
        verifiedAdd(row + 1, col);
        verifiedAdd(row - 1, col);
        verifiedAdd(row, col + 1);
        verifiedAdd(row, col - 1);
        break;
      case 5:
        // 士
        verifiedAdd(row + 1, col + 1);
        verifiedAdd(row + 1, col - 1);
        verifiedAdd(row - 1, col + 1);
        verifiedAdd(row - 1, col - 1);
        break;
      case 6:
        // 象
        verifiedAdd(row + 2, col + 2);
        verifiedAdd(row + 2, col - 2);
        verifiedAdd(row - 2, col + 2);
        verifiedAdd(row - 2, col - 2);
        break;
      case 7:
        // 卒
        verifiedAdd(row + 1, col);
        verifiedAdd(row - 1, col);
        break;
    }
    setDotsIndex(dotsIndex);
  };
  const handleDotsIndex = (chessPiece) => {
    const PossibilityLocation = getPossibilityLocation({ chessPiece });
  };
  const handleMoveChessPiece = ({ index }) => {
    console.log('handleMoveChessPiece');
    const newRow = Math.floor(index / 9); // 使用 Math.floor 计算新行号
    const oldRow = Math.floor(selectedIndex / 9); // 使用 Math.floor 计算旧行号
    const newCol = index % 9; // 列号计算正确，无需修改
    const oldCol = selectedIndex % 9; // 列号计算正确，无需修改
    const newChessPieceList = chessPieceList.map((row) => [...row]);
    newChessPieceList[newRow][newCol] = { row: newRow, col: newCol, type: newChessPieceList[oldRow][oldCol].type };
    newChessPieceList[oldRow][oldCol] = { type: kong };
    setChessPieceList(newChessPieceList);
  };
  const onGridClick = ({ chessPiece, index }) => {
    const type = chessPiece.type;
    if (type !== kong) {
      setSelectedIndex(index);
      handleDotsIndex(chessPiece);
    } else if (dotsIndex.has(index)) {
      handleMoveChessPiece({ index });
      setDotsIndex(new Set());
      setSelectedIndex(null);
    }
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      {
        <div className="grid grid-cols-9 gap-5">
          {chessPieceList.flat().map((chessPiece, index) => (
            <Grid
              key={index}
              chessPiece={chessPiece}
              onClick={() => onGridClick({ chessPiece, index })}
              isSelected={selectedIndex === index}
              showDot={dotsIndex.has(index)}></Grid>
          ))}
        </div>
      }
    </div>
  );
};

export default Board;
