import { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import useDebounce from './useDebounce';
import useThrottleAndDeounce from './useThrottleAndDebounce';
const useVirtual = ({ size, parentRef, estimateSize, overscan }) => {
  const itemHeights = useMemo(() => Array.from({ length: size }, (_, i) => estimateSize(i)), [estimateSize, size]);
  const [startIndex, setStartIndex] = useState(0);
  const [virtualRows, setVirtualRows] = useState([]);
  const lastScrollTop = useRef(0);
  const cumulativeHeights = (startIndex, height) => {
    // 计算当前能够承下的元素数量
    let i = startIndex;
    console.log('start', startIndex);
    let sum = 0;
    while (sum <= height) {
      sum += itemHeights[i];
      i++;
    }
    console.log('end', i);
    return i - 1;
  };

  const getEndIndex = useCallback(
    (startIndex) => {
      const endIndex = Math.min(cumulativeHeights(startIndex, parentRef.current.clientHeight), size - 1);
      return endIndex;
    },
    [parentRef]
  );

  // 整个容器的高度
  const wraperHeight = useMemo(() => itemHeights.reduce((sum, height) => sum + height, 0), [itemHeights]);
  const handleScroll = useCallback(() => {
    const scrollTop = parentRef.current.scrollTop;
    if (!(scrollTop + parentRef.current.clientHeight > wraperHeight && lastScrollTop.current < scrollTop)) {
      renderList(scrollTop);
    }
    lastScrollTop.current = scrollTop;
  }, [parentRef]);
  const trottleAndDeounceHandleScroll = useThrottleAndDeounce(handleScroll, 30, 30);

  const renderList = useCallback(
    (scrollTop) => {
      let negativeStartHeight = scrollTop;
      let startHeight = scrollTop;
      let renderStartIndex = cumulativeHeights(startIndex, scrollTop);
      let listArr = [];
      console.log('======= renderStartIndex =======\n', renderStartIndex);

      const renderEndIndex = getEndIndex(renderStartIndex);
      console.log('======= renderEndIndex =======\n', renderEndIndex);
      setStartIndex(renderStartIndex);

      for (let i = Math.max(renderStartIndex - overscan, 0); i < Math.min(size, renderEndIndex + overscan); i++) {
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
      console.log('======= listArr =======\n', listArr);

      setVirtualRows(listArr);
    },
    [startIndex, itemHeights]
  );

  useEffect(() => {
    if (parentRef.current) {
      const scrollTop = parentRef.current.scrollTop;
      renderList(scrollTop);
      parentRef.current.addEventListener('scroll', trottleAndDeounceHandleScroll);
    }
    return () => {
      if (parentRef.current) {
        parentRef.current.removeEventListener('scroll', trottleAndDeounceHandleScroll);
      }
    };
  }, [handleScroll]);
  return { totalHeight: wraperHeight + 8, virtualItems: virtualRows };
};
export default useVirtual;
