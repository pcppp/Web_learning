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
export default function Tictactoe() {
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
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}></Board>
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    </>
  );
}
