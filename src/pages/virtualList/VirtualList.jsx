import ItemList from './components/ItemList';
import useVirtual from '../../hooks/useVirtual';
import { ButtonPro } from '@/components/ButtonPro';

import { useCallback, useEffect, useRef, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';
import { InputPro } from '../../components/InputPro';
import TitlePro from '../../components/TitlePro';
export default function VirtualList() {
  const listRef = useRef();
  const [items, setItems] = useState([]);
  const virtualizer = useVirtual({
    size: items.length,
    estimateSize: useCallback(() => 20, []),
    parentRef: listRef,
    overscan: 20,
  });

  return (
    <div className={'flex flex-col items-center justify-center gap-10'}>
      <TitlePro>虚拟列表</TitlePro>
      <div>
        <ItemSetter itemDispatch={setItems}></ItemSetter>
      </div>
      <div className="p-5 shadow-md">
        {items.length > 0 && (
          <div>
            <ItemList
              listRef={listRef}
              items={items}
              virtualRows={virtualizer.virtualItems}
              totalHeight={virtualizer.totalHeight}></ItemList>
          </div>
        )}
      </div>
    </div>
  );
}
const ItemSetter = ({ itemDispatch }) => {
  const [inputValue, setInputValue] = useState('');
  const addItem = () => {
    if (inputValue) {
      itemDispatch([...Array.from({ length: inputValue }, (_, index) => '测试用例' + (index + 1))]);
    }
  };
  return (
    <div style={{ marginTop: '20px' }}>
      <InputPro
        label="数组大小"
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
        确认
      </ButtonPro>
    </div>
  );
};
