import { useState, useEffect } from 'react';
import styled from 'styled-components';
const ChessContainer = styled.div``;
const ChessPiece = styled.div`
  border: ${(props) => (props.$isSelected ? '4px solid black' : 'none')}; /* 添加黑色边框 */
  background: ${(props) => (props.$player == 1 ? 'red' : 'blue')}; /* 添加黑色边框 */
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
const getChessNameFromType = (type) => {
  switch (type) {
    case 1:
      return '马';
    case 2:
      return '车';
    case 3:
      return '炮';
    case 4:
      return '将';
    case 5:
      return '士';
    case 6:
      return '象';
    case 7:
      return '卒';
  }
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

const Grid = ({ chessPiece, isSelected, onClick, showDot }) => {
  return (
    <GridContainer $showDot={showDot} onClick={onClick}>
      {chessPiece.type === kong ? (
        <ChessContainer className="h-25 w-25"></ChessContainer>
      ) : (
        <ChessContainer className="flex h-25 w-25 flex-col items-center justify-center">
          <ChessPiece
            $isSelected={isSelected}
            $player={chessPiece.player}
            className="flex h-20 w-20 flex-col items-center justify-center rounded-full text-[30px]">
            <div>{getChessNameFromType(chessPiece.type)}</div>
          </ChessPiece>
        </ChessContainer>
      )}
    </GridContainer>
  );
};
const getIndexFromRowCol = ({ row, col }) => {
  return row * 9 + col;
};
const Board = ({ player, setPlayer }) => {
  const [chessPieceList, setChessPieceList] = useState(initChessPieceList());
  const [dotsIndex, setDotsIndex] = useState(new Set());
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [successFlag, setSuccessFlag] = useState(false);
  // const [player, setPlayer] = useState(1);
  const playerRotation = () => {
    if (player === 1) setPlayer(2);
    else setPlayer(1);
  };
  const handleDotsIndex = ({ chessPiece }) => {
    const dotsIndex = new Set();
    const directions = [
      [1, 0], // 向下
      [-1, 0], // 向上
      [0, 1], // 向右
      [0, -1], // 向左
    ];
    const { row, col } = chessPiece;
    const verifiedAdd = (row, col) => {
      if (verify(row, col)) {
        dotsIndex.add(row * 9 + col);
        return true;
      }
      return false;
    };
    const verify = (row, col) => {
      if (row < 10 && col < 9 && row >= 0 && col >= 0) {
        return true;
      }
      return false;
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
        directions.forEach(([rowIncrement, colIncrement]) => {
          for (let i = 1; i < 10; i++) {
            const newRow = row + i * rowIncrement;
            const newCol = col + i * colIncrement;
            // 边界检查
            if (!verify(newRow, newCol)) break;

            // 如果遇到棋子
            if (chessPieceList[newRow][newCol].type !== kong) {
              // 如果是敌方棋子，可以吃掉
              if (chessPieceList[newRow][newCol].player !== player) {
                verifiedAdd(newRow, newCol);
              }
              break; // 遇到棋子后停止
            }
            // 如果是空格，添加到可移动位置
            verifiedAdd(newRow, newCol);
          }
        });
        break;
      case 3:
        directions.forEach(([rowIncrement, colIncrement]) => {
          let hasJumped = false; // 标记是否已经越过一个棋子

          for (let i = 1; i < 10; i++) {
            const newRow = row + i * rowIncrement;
            const newCol = col + i * colIncrement;

            // 边界检查
            if (newRow < 0 || newRow >= 10 || newCol < 0 || newCol >= 9) break;

            const targetPiece = chessPieceList[newRow][newCol];

            if (targetPiece.type !== kong) {
              if (!hasJumped) {
                // 第一次遇到棋子，标记为已越过
                hasJumped = true;
              } else {
                // 第二次遇到棋子，检查是否是敌方棋子
                if (targetPiece.player !== player) {
                  verifiedAdd(newRow, newCol); // 可以吃掉敌方棋子
                }
                break; // 无论是否吃子，炮的路径到此结束
              }
            } else {
              // 如果是空格
              if (!hasJumped) {
                verifiedAdd(newRow, newCol); // 只有在未越过棋子的情况下才能移动到空格
              }
            }
          }
        });
        break;
      case 4:
        // 将
        const palaceBounds =
          player === 1
            ? { rowMin: 0, rowMax: 2, colMin: 3, colMax: 5 } // 红方九宫格
            : { rowMin: 7, rowMax: 9, colMin: 3, colMax: 5 }; // 黑方九宫格

        const verifiedAddInPalace = (row, col) => {
          // 检查是否在九宫格内
          if (
            row >= palaceBounds.rowMin &&
            row <= palaceBounds.rowMax &&
            col >= palaceBounds.colMin &&
            col <= palaceBounds.colMax
          ) {
            if (chessPieceList[row][col].type !== kong && chessPieceList[row][col].player === player) {
            } else {
              verifiedAdd(row, col);
            }
          }
        };

        // 上下左右移动
        verifiedAddInPalace(row + 1, col);
        verifiedAddInPalace(row - 1, col);
        verifiedAddInPalace(row, col + 1);
        verifiedAddInPalace(row, col - 1);
        // 对将逻辑
        let blockingPiece = false;
        for (let i = row + (player === 1 ? 1 : -1); i >= 0 && i < 10; i += player === 1 ? 1 : -1) {
          const targetPiece = chessPieceList[i][col];
          if (targetPiece.type !== kong) {
            if (targetPiece.type === jiang && targetPiece.player !== player && !blockingPiece) {
              verifiedAdd(i, col); // 对将
            }
            blockingPiece = true; // 标记为有阻挡
          }
        }
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
  const handleSuccessJudgment = ({ chessPiece }) => {
    if (chessPiece.type === jiang) {
      setSuccessFlag(true);
      return true;
    }
    return false;
  };
  const handleMoveChessPiece = ({ index, chessPiece }) => {
    const newRow = Math.floor(index / 9);
    const oldRow = Math.floor(selectedIndex / 9);
    const newCol = index % 9;
    const oldCol = selectedIndex % 9;
    const oldChessPiece = chessPieceList[oldRow][oldCol];
    const newChessPieceList = chessPieceList.map((row) => [...row]);
    newChessPieceList[newRow][newCol] = {
      row: newRow,
      col: newCol,
      type: oldChessPiece.type,
      player: oldChessPiece.player,
    };
    newChessPieceList[oldRow][oldCol] = { type: kong };
    setChessPieceList(newChessPieceList);
    if (handleSuccessJudgment({ chessPiece })) {
      return;
    }
    playerRotation();
  };
  const onGridClick = ({ chessPiece, index }) => {
    const type = chessPiece.type;
    const isOpposite = chessPiece.player && chessPiece.player !== player;
    if (dotsIndex.has(index)) {
      if (type === kong) {
        handleMoveChessPiece({ chessPiece, index });
        setDotsIndex(new Set());
        setSelectedIndex(null);
        return;
      }
      if (isOpposite) {
        handleMoveChessPiece({ chessPiece, index });
        setDotsIndex(new Set());
        setSelectedIndex(null);
        return;
      }
    }
    if (isOpposite) {
      return;
    }
    setSelectedIndex(index);
    handleDotsIndex({ chessPiece });
  };
  return (
    <div className="bg-[url(/chessboard2.png)] bg-cover px-[16px] py-[16px]">
      {
        <div className="gap grid grid-cols-9">
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
