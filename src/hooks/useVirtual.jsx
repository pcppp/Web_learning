import { useEffect, useCallback, useMemo, useState, useRef } from 'react';
const useVirtual = ({ size, parentRef, estimateSize, overscan }) => {
  const itemHeights = useMemo(() => Array.from({ length: size }, (_, i) => estimateSize(i)), [estimateSize, size]);
  const [startIndex, setStartIndex] = useState(0);

  const [virtualRows, setVirtualRows] = useState([]);
  const cumulativeHeights = (startIndex, height) => {
    // 计算当前能够承下的元素数量
    let i = startIndex;
    let sum = 0;
    while (sum <= height) {
      sum += itemHeights[i];
      i++;
    }
    return i - 1;
  };

  const getEndIndex = useCallback(
    (startIndex) => {
      return Math.min(startIndex + cumulativeHeights(startIndex, parentRef.current.clientHeight), size - 1);
    },
    [parentRef]
  );

  // 整个容器的高度
  const wraperHeight = useMemo(() => itemHeights.reduce((sum, height) => sum + height, 0), [itemHeights]);

  const renderList = useCallback(
    (scrollTop) => {
      console.log('🚀 ~ useVirtual ~ scrollTop:', scrollTop);
      let negativeStartHeight = scrollTop;
      let startHeight = scrollTop;
      let renderStartIndex = cumulativeHeights(startIndex, scrollTop);

      let listArr = [];
      setStartIndex(renderStartIndex);
      for (
        let i = Math.max(renderStartIndex - overscan, 0);
        i < Math.min(size, getEndIndex(renderStartIndex) + overscan);
        i++
      ) {
        if (renderStartIndex < overscan && i < renderStartIndex) {
          const overscan = renderStartIndex;
          negativeStartHeight -= itemHeights[renderStartIndex - i];
          listArr.push({
            index: renderStartIndex - i - 1,
            height: itemHeights[renderStartIndex - i],
            start: negativeStartHeight,
          });
        } else if (i < renderStartIndex) {
          negativeStartHeight -= itemHeights[i];
          listArr.push({
            index: i - overscan,
            height: itemHeights[i],
            start: negativeStartHeight,
          });
        } else {
          listArr.push({ index: i, height: itemHeights[i], start: startHeight });
          startHeight += itemHeights[i];
        }
      }
      setVirtualRows(listArr);
      console.log('🚀 ~ useVirtual ~ listArr:', listArr);
    },
    [startIndex, itemHeights]
  );
  const handleScroll = useCallback(() => {
    const scrollTop = parentRef.current.scrollTop;
    renderList(scrollTop);
  }, [parentRef]);
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
