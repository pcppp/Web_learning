import React, { useState, useRef } from 'react';
import { ButtonPro } from '@/components/ButtonPro';

const getItemStyle = ({ height, start }) => {
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: height,
    transform: `translateY(${start}px)`,
  };
};
const ItemList = ({ listRef, items, virtualRows, totalHeight }) => {
  // 定义初始状态：列表项和当前输入值
  const [inputValue, setInputValue] = useState('');
  // 添加新项
  const addItem = () => {
    if (inputValue.trim()) {
      setItems([...items, inputValue]);
      setInputValue(''); // 清空输入框
    }
  };
  // 删除某一项
  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };
  return (
    <>
      <h2>水果列表</h2>
      <div>
        <ul
          ref={listRef}
          style={{
            overflowY: 'scroll',
            margin: '0',
            height: '50vh',
            width: '30vw',
            position: 'relative',
            overscrollBehavior: 'none',
          }}>
          <li style={{ height: totalHeight, visibility: 'hidden' }}></li>

          {virtualRows.map(({ index, height, start }) => {
            const item = items[index];
            return (
              <li key={index} style={getItemStyle({ height, start })}>
                {item}
              </li>
            );
          })}
        </ul>
      </div>
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="请输入新项目"
          style={{
            padding: '5px',
            fontSize: '16px',
            marginRight: '10px',
            width: '200px',
          }}
        />
        <ButtonPro
          onClick={addItem}
          style={{
            padding: '5px 15px',
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}>
          添加
        </ButtonPro>
      </div>
    </>
  );
};

export default ItemList;
