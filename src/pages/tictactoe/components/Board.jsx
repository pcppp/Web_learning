/*
 * @Descripttion:
 * @version:
 * @Author: pc
 * @Date: 2024-10-12 11:20:33
 * @LastEditors: your name
 * @LastEditTime: 2024-10-12 15:12:56
 */
import '@/style/tictactoe.css';
import { useState } from 'react';
function Square({ value, onClick }) {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

export default function Board({ xIsNext, squares, onPlay }) {
  let content;
  const winner = calculateWinner(squares);
  function handleClick(i) {
    if (!squares[i] && !winner) {
      let nextSquares = squares.slice();
      nextSquares[i] = xIsNext ? 'X' : 'O';
      onPlay(nextSquares);
    }
  }
  if (winner) {
    content = winner + '  is  winner';
  } else {
    content = `Next Player: ${xIsNext ? 'X' : 'O'}`;
  }
  return (
    <>
      <div className="status">{content}</div>
      {Array.from({ length: 3 }, (_, index_rol) => (
        <div className="board-row" key={index_rol}>
          {Array.from({ length: 3 }, (_, index_col) => (
            <Square
              key={index_col + index_rol * 3}
              onClick={() => handleClick(index_col + index_rol * 3)}
              value={squares[index_col + index_rol * 3]}></Square>
          ))}
        </div>
      ))}
    </>
  );
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
}
