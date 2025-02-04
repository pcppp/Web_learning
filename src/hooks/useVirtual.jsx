import { useEffect, useCallback, useMemo, useState } from 'react';
const useVirtual = ({ size, parentRef, estimateSize, overscan }) => {
  const itemHeights = useMemo(() => Array.from({ length: size }, (_, i) => estimateSize(i)), [estimateSize, size]);
  const [startIndex, setStartIndex] = useState(0);
  let virtualRows = [];
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
    console.log('parentRef.current', parentRef.current.clientHeight);
    endIndex = Math.min(startIndex + limit(parentRef.current.clientHeight), size - 1);
  }
  const wraperHeight = useMemo(() => itemHeights.reduce((sum, height) => sum + height, 0), [itemHeights]);
  const renderList = useCallback(
    (scrollTop) => {
      console.log('1');
      let negativeStartHeight = scrollTop;
      let startHeight = scrollTop;
      setStartIndex(limit(scrollTop));
      for (let i = Math.max(startIndex - overscan, 0); i < Math.min(size, endIndex + overscan); i++) {
        console.log('@');

        if (i < startIndex) {
          negativeStartHeight -= itemHeights[-(overscan - i)];
          virtualRows.push({
            index: -(overscan - i),
            height: itemHeights[-(overscan - i)],
            start: negativeStartHeight,
          });
        } else {
          startHeight += itemHeights[i];
          virtualRows.push({ index: i, height: itemHeights[i], start: startHeight });
        }
      }
    },
    [itemHeights]
  );
  const handleScroll = useCallback(() => {
    const scrollTop = parentRef.current.scrollTop;
    renderList(scrollTop);
  }, [itemHeights]);
  useEffect(() => {
    if (parentRef.current) {
      renderList(parentRef.current.scrollTop);
      parentRef.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (parentRef.current) {
        parentRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);
  console.log('2');

  return { totalHeight: wraperHeight, virtualItems: virtualRows };
};
export default useVirtual;
