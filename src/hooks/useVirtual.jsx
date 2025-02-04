import { useEffect, useCallback, useMemo, useState } from 'react';
const useVirtual = ({ size, parentRef, estimateSize, overscan }) => {
  const itemHeights = useMemo(() => Array.from({ length: size }, (_, i) => estimateSize(i)), [estimateSize, size]);
  const [startIndex, setStartIndex] = useState(0);
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
  const endIndex = Math.min(startIndex + limit, size - 1);
  const wraperHeight = useMemo(() => itemHeights.reduce((sum, height) => sum + height, 0), [itemHeights]);
  const renderList = (scrollTop) => {
    let arr = [];
    let startHeight = scrollTop;
    setStartIndex(limit(scrollTop));
    for (let i = Math.max(startIndex - overscan, 0); i < Math.min(size, endIndex + overscan); i++) {
      if (i < startIndex) {
      }
      startHeight += itemHeights[i];
      arr.push({ index: i, height: itemHeights[i], start: startHeight });
    }
  };
  const handleScroll = useCallback(() => {
    const scrollTop = parentRef.current.scrollTop;
  }, [itemHeights]);
  useEffect(() => {
    if (parentRef.current) {
      parentRef.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      parentRef.current.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
  return { totalHeight: wraperHeight, virtualRows: {} };
};
export default useVirtual;
