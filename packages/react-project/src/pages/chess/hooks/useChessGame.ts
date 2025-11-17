import { useAppStore } from '@/store/appStore';
import { ChessPiece, MoveRecord } from '@/types/game';

const useChessGame = () => {
  const gameState = useAppStore((state) => state.game);
  const setBoard = useAppStore((state) => state.setBoard);
  const setPlayerRotation = useAppStore((state) => state.setPlayerRotation);
  const addMoveToHistory = useAppStore((state) => state.addMoveToHistory);
  const setWinner = useAppStore((state) => state.setWinner);
  const setGameStatus = useAppStore((state) => state.setGameStatus);
  const removeLastMoveFromHistory = useAppStore((state) => state.removeLastMoveFromHistory);

  const initChessPieceList = () => {
    const chessPieceList: (ChessPiece | null)[][] = Array(10)
      .fill(null)
      .map(() => Array(9).fill(null));
    // 设置棋子的初始位置
    const redPositions: Array<{ row: number; col: number; type: ChessPiece['type'] }> = [
      { row: 0, col: 0, type: 'ju' }, // 车
      { row: 0, col: 1, type: 'ma' }, // 马
      { row: 0, col: 2, type: 'xiang' }, // 象
      { row: 0, col: 3, type: 'shi' }, // 士
      { row: 0, col: 4, type: 'jiang' }, // 将
      { row: 0, col: 5, type: 'shi' }, // 士
      { row: 0, col: 6, type: 'xiang' }, // 象
      { row: 0, col: 7, type: 'ma' }, // 马
      { row: 0, col: 8, type: 'ju' }, // 车
      { row: 2, col: 1, type: 'pao' }, // 炮
      { row: 2, col: 7, type: 'pao' }, // 炮
      { row: 3, col: 0, type: 'zu' }, // 卒
      { row: 3, col: 2, type: 'zu' }, // 卒
      { row: 3, col: 4, type: 'zu' }, // 卒
      { row: 3, col: 6, type: 'zu' }, // 卒
      { row: 3, col: 8, type: 'zu' }, // 卒
    ];
    // 黑方棋子的初始位置
    const blackPositions: Array<{ row: number; col: number; type: ChessPiece['type'] }> = [
      { row: 9, col: 0, type: 'ju' }, // 车
      { row: 9, col: 1, type: 'ma' }, // 马
      { row: 9, col: 2, type: 'xiang' }, // 象
      { row: 9, col: 3, type: 'shi' }, // 士
      { row: 9, col: 4, type: 'jiang' }, // 将
      { row: 9, col: 5, type: 'shi' }, // 士
      { row: 9, col: 6, type: 'xiang' }, // 象
      { row: 9, col: 7, type: 'ma' }, // 马
      { row: 9, col: 8, type: 'ju' }, // 车
      { row: 7, col: 1, type: 'pao' }, // 炮
      { row: 7, col: 7, type: 'pao' }, // 炮
      { row: 6, col: 0, type: 'zu' }, // 卒
      { row: 6, col: 2, type: 'zu' }, // 卒
      { row: 6, col: 4, type: 'zu' }, // 卒
      { row: 6, col: 6, type: 'zu' }, // 卒
      { row: 6, col: 8, type: 'zu' }, // 卒
    ];
    // 将棋子放置到棋盘上
    redPositions.forEach(({ row, col, type }) => {
      chessPieceList[row][col] = { row, col, type, player: 1 };
    });
    blackPositions.forEach(({ row, col, type }) => {
      chessPieceList[row][col] = { row, col, type, player: 2 };
    });
    setBoard(chessPieceList);
  };

  const makeMove = (from: number, to: number) => {
    const newBoard = gameState.board.map((row) => row.map((piece) => (piece ? { ...piece } : null)));

    const newRow = Math.floor(to / 9);
    const oldRow = Math.floor(from / 9);
    const newCol = to % 9;
    const oldCol = from % 9;

    const movingPiece = gameState.board[oldRow][oldCol];
    if (!movingPiece) return;

    newBoard[newRow][newCol] = {
      row: newRow,
      col: newCol,
      type: movingPiece.type,
      player: movingPiece.player,
    };
    newBoard[oldRow][oldCol] = null;

    const newPlayerRotation = gameState.playerRotation === 1 ? 2 : 1;
    const moveRecord: MoveRecord = {
      from: { row: oldRow, col: oldCol },
      to: { row: newRow, col: newCol },
      piece: movingPiece,
      timestamp: Date.now(),
    };

    setBoard(newBoard);
    setPlayerRotation(newPlayerRotation);
    addMoveToHistory(moveRecord);
  };

  const undoMove = () => {
    if (gameState.moveHistory.length === 0) return;

    const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];
    const newBoard = gameState.board.map((row) => row.map((piece) => (piece ? { ...piece } : null)));

    // 恢复移动的棋子到原位
    newBoard[lastMove.from.row][lastMove.from.col] = lastMove.piece;
    newBoard[lastMove.to.row][lastMove.to.col] = null;

    setBoard(newBoard);
    removeLastMoveFromHistory();
    setPlayerRotation(gameState.playerRotation === 1 ? 2 : 1); // 撤销时切换回上一玩家
  };

  const checkVictory = () => {
    const hasRedJiang = gameState.board.flat().some((piece) => piece?.type === 'jiang' && piece.player === 1);
    const hasBlackJiang = gameState.board.flat().some((piece) => piece?.type === 'jiang' && piece.player === 2);

    if (!hasRedJiang) {
      setWinner(2);
      setGameStatus('finished');
    } else if (!hasBlackJiang) {
      setWinner(1);
      setGameStatus('finished');
    }
  };

  return { gameState, initChessPieceList, makeMove, undoMove, checkVictory };
};

export default useChessGame;
