/*
 * @Descripttion:
 * @version:
 * @Author: pc
 * @Date: 2024-10-11 13:29:03
 * @LastEditors: your name
 * @LastEditTime: 2024-10-12 11:14:39
 */
import './style/App.css';
import { useState } from 'react';
import Tictactoe from '@/pages/tictactoe/Tictactoe.jsx';
const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
];

function MyButton({ handleClick, pointNum }) {
  return <button onClick={handleClick}>you have clicked we {pointNum} times</button>;
}

function MyShoppingList() {
  const listItems = products.map((product) => (
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen',
      }}>
      {product.title}
    </li>
  ));
  return (
    <>
      <ul>{listItems}</ul>;
    </>
  );
}
export default function MyApp() {
  const [pointNum, setPointNum] = useState(0);
  const handleClick = () => {
    setPointNum(pointNum + 1);
  };
  return (
    // <>
    //   <div>
    //     <MyButton {...{ pointNum }} {...{ handleClick }} />
    //     <MyButton handleClick={handleClick} pointNum={pointNum} />
    //     <MyShoppingList />
    //   </div>
    // </>
    <Tictactoe />
  );
}
