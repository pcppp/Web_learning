/*
 * @Descripttion:
 * @version:
 * @Author: pc
 * @Date: 2024-10-12 10:25:26
 * @LastEditors: your name
 * @LastEditTime: 2024-10-12 16:15:54
 */
import { useState } from 'react';
import Board from './components/Board';
import { ButtonPro } from '@/components/ButtonPro';
export default function TicTacToe() {
  const [history, setHistory] = useState([Array(9).fill(null)]); //#####包含了1个长度为9的数组的数组
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  function handlePlay(nextSquares) {
    let nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  const moves = history.map((squares, move) => {
    let description;
    if (move === 0) {
      description = 'go to game start';
    } else {
      description = 'go to move #' + move;
    }
    return (
      <li key={move}>
        <ButtonPro onClick={() => jumpTo(move)}>{description}</ButtonPro>
      </li>
    );
  });

  return (
    <>
      {/* 游戏标题 */}
      <div className="flex min-h-screen flex-col items-center p-4 md:p-8">
        <h1 className="mb-6 text-center text-3xl font-bold text-amber-800">井字棋游戏</h1>
        <div className="game flex w-full max-w-3xl flex-col gap-8 md:flex-row md:justify-center">
          <div className="game-board h-60 rounded-lg p-6 shadow-md">
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}></Board>
          </div>
          <div className="game-info w-full max-w-xs rounded-lg p-6 text-center text-sm text-amber-700 md:w-64">
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    </>
  );
}
