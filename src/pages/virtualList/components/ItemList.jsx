import React, { useState, useRef } from 'react';
const ItemList = ({ listRef, items }) => {
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
        <ul ref={listRef} style={{ overflowY: 'scroll', padding: '10px', height: '50vh', width: '30vw' }}>
          {items.map((item, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              {item}
              <button
                onClick={() => removeItem(index)}
                style={{
                  marginLeft: '10px',
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '5px 10px',
                }}>
                删除
              </button>
            </li>
          ))}
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
        <button
          onClick={addItem}
          style={{
            padding: '5px 15px',
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}>
          添加
        </button>
      </div>
    </>
  );
};

export default ItemList;
