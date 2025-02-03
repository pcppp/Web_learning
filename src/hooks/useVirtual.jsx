import { useEffect, useCallback, useMemo, useState } from 'react';
export default useVirtual = ({ size, parentRef, estimateSize, overscan }) => {
  const itemHeights = useMemo(
    Array.from({ length: size }, (_, i) => estimateSize(i)),
    [estimateSize, size]
  );
  const [startIndex, setStartIndex] = useState(0);
  const endIndex = Math.min(startIndex + limit, list.length - 1);
  const limit = () => {
    // 计算当前能够承下的元素数量
    let i = 0;
    let sum = 0;
    while (sum < parentRef.current.height) {
      sum += itemHeights[i];
      i++;
    }
    return i;
  };
  const wraperHeight = useMemo(
    itemHeights.reduce((sum, height) => sum + height, 0),
    [itemHeights]
  );
  const renderList = () => {
    let arr = [];
    for (let i = Math.max(startIndex - overscan, 0); i < Math.min(size, endIndex + overscan); i++) {
      arr.push();
    }
  };
  const handleScroll = useCallback(() => {
    if (listRef.current) {
      const scrollTop = listRef.current.scrollTop;
      setScrollPos(scrollTop);
    }
  }, [itemHeights]);
  useEffect(() => {
    listRef.current.addEventListener('scroll', handleScroll);
    return () => {
      listRef.current.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
};
