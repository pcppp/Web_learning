import ItemList from './components/ItemList';
import useVirtual from '../../hooks/useVirtual';
import { useRef, useState } from 'react';
export default function VirtualList() {
  const listRef = useRef();
  const [items, setItems] = useState(['苹果', ...Array.from({ length: 10000 }, (_, index) => '香蕉' + index), '橙子']);

  const virtualizer = useVirtual({
    size: items.length,
    estimateSize: () => 20,
    parentRef: listRef,
    overscan: 20,
  });
  // console.log('virtualizer.virtualItems', virtualizer.virtualItems);

  return (
    <ItemList
      listRef={listRef}
      items={items}
      virtualRows={virtualizer.virtualItems}
      totalHeight={virtualizer.totalHeight}></ItemList>
  );
}
