import { useEffect, useCallback, useMemo, useState } from 'react';
const useVirtual = ({ size, parentRef, estimateSize, overscan }) => {
  const itemHeights = useMemo(() => Array.from({ length: size }, (_, i) => estimateSize(i)), [estimateSize, size]);
  const [startIndex, setStartIndex] = useState(0);
  const [virtualRows, setVirtualRows] = useState([]);
  const limit = (height) => {
    // 计算当前能够承下的元素数量
    let i = 0;
    let sum = 0;
    while (sum < height) {
      sum += itemHeights[i];
      i++;
    }
    return i;
  };
  let endIndex = 0;
  if (parentRef.current) {
    endIndex = Math.min(startIndex + limit(parentRef.current.clientHeight), size - 1);
    console.log('🚀 ~ useVirtual ~ startIndex:', startIndex);
    console.log('🚀 ~ useVirtual ~ endIndex:', endIndex);
  }
  // 整个容器的高度
  const wraperHeight = useMemo(() => itemHeights.reduce((sum, height) => sum + height, 0), [itemHeights]);

  const renderList = useCallback(
    (scrollTop) => {
      let negativeStartHeight = scrollTop;
      let startHeight = scrollTop;
      let listArr = [];
      setStartIndex(limit(scrollTop));
      for (let i = Math.max(startIndex - overscan, 0); i < Math.min(size, endIndex + overscan); i++) {
        console.log('🚀 ~ useVirtual ~ endIndex + overscan:', endIndex + overscan);
        if (i < startIndex) {
          negativeStartHeight -= itemHeights[-(overscan - i)];
          listArr.push({
            index: -(overscan - i),
            height: itemHeights[-(overscan - i)],
            start: negativeStartHeight,
          });
        } else {
          startHeight += itemHeights[i];
          listArr.push({ index: i, height: itemHeights[i], start: startHeight });
        }
      }
      setVirtualRows(listArr);
    },
    [itemHeights]
  );
  const handleScroll = useCallback(() => {
    const scrollTop = parentRef.current.scrollTop;
    renderList(scrollTop);
  }, []);
  useEffect(() => {
    if (parentRef.current) {
      const scrollTop = parentRef.current.scrollTop;
      renderList(scrollTop);
      parentRef.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (parentRef.current) {
        parentRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);
  return { totalHeight: wraperHeight, virtualItems: virtualRows };
};
export default useVirtual;
