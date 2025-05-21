import ItemList from './components/ItemList';
import useVirtual from '../../hooks/useVirtual';
import { ButtonPro } from '@/components/ButtonPro';

import { useCallback, useEffect, useRef, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';
export default function VirtualList() {
  const listRef = useRef();
  const [items, setItems] = useState(['']);
  const virtualizer = useVirtual({
    size: items.length,
    estimateSize: useCallback(() => 20, []),
    parentRef: listRef,
    overscan: 20,
  });

  return (
    <div className="">
      <ItemList
        listRef={listRef}
        items={items}
        virtualRows={virtualizer.virtualItems}
        totalHeight={virtualizer.totalHeight}></ItemList>
      <ItemSetter itemDispatch={setItems}></ItemSetter>
    </div>
  );
}
const ItemSetter = ({ itemDispatch }) => {
  const [inputValue, setInputValue] = useState('');
  const addItem = () => {
    if (inputValue) {
      itemDispatch([...Array.from({ length: inputValue }, (_, index) => '测试用例' + index)]);
    }
  };
  return (
    <div style={{ marginTop: '20px' }}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        placeholder="请输入项目个数"
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
  );
};
