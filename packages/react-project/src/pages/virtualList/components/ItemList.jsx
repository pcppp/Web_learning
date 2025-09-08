import React, { useState, useRef } from 'react';

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
  return (
    <>
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
    </>
  );
};

export default ItemList;
