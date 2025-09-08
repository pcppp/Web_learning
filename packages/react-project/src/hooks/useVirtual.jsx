import { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import useDebounce from './useDebounce';
import useThrottleAndDebounce from './useThrottleAndDebounce';
const useVirtual = ({ size, parentRef, estimateSize, overscan }) => {
  const itemHeights = useMemo(() => Array.from({ length: size }, (_, i) => estimateSize(i)), [estimateSize, size]);
  const [startIndex, setStartIndex] = useState(0);
  const [virtualRows, setVirtualRows] = useState([]);
  const lastScrollTop = useRef(0);
  const cumulativeHeights = useCallback(
    (startIndex, height) => {
      // 计算当前能够承下的元素数量
      let i = startIndex;
      let sum = 0;
      while (sum <= height && i < size) {
        sum += itemHeights[i];
        i++;
      }
      return i - 1;
    },
    [size]
  );
  // 预计算累积高度
  const cumulativeIndexHeights = useMemo(() => {
    const arr = [0];
    for (let i = 0; i < size; i++) arr[i + 1] = arr[i] + itemHeights[i];
    return arr;
  }, [itemHeights, size]);
  const getStartIndex = useCallback(
    (low, high, scrollTop) => {
      while (low < high) {
        const mid = Math.floor((low + high) / 2);
        if (cumulativeIndexHeights[mid] < scrollTop) low = mid + 1;
        else high = mid;
      }
      return Math.max(0, low - 1);
    },
    [cumulativeIndexHeights]
  );
  const getEndIndex = useCallback(
    (startIndex) => {
      const endIndex = Math.min(cumulativeHeights(startIndex, parentRef.current.clientHeight), size - 1);
      return endIndex;
    },
    [parentRef, size]
  );
  const renderList = useCallback(
    (scrollTop) => {
      let negativeStartHeight = scrollTop;
      let renderStartIndex = getStartIndex(0, size, scrollTop);
      let listArr = [];
      const renderEndIndex = getEndIndex(renderStartIndex);
      setStartIndex(renderStartIndex);
      for (let i = Math.max(renderStartIndex - overscan, 0); i < Math.min(size, renderEndIndex + overscan); i++) {
        if (renderStartIndex < overscan && i < renderStartIndex) {
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
          listArr.push({ index: i, height: itemHeights[i], start: cumulativeIndexHeights[i] });
        }
      }
      setVirtualRows(listArr);
    },
    [cumulativeIndexHeights, itemHeights, startIndex, overscan, size, getEndIndex, getStartIndex]
  );
  // 整个容器的高度
  const wrapperHeight = useMemo(() => itemHeights.reduce((sum, height) => sum + height, 0), [itemHeights]);
  const handleScroll = useCallback(() => {
    const scrollTop = parentRef.current.scrollTop;
    renderList(scrollTop);
    lastScrollTop.current = scrollTop;
  }, [parentRef, renderList]);
  const throttleAndDebounceHandleScroll = useThrottleAndDebounce(handleScroll, 30, 30);

  const handleResize = () => renderList(parentRef.current.scrollTop);

  useEffect(() => {
    if (parentRef.current) {
      const scrollTop = parentRef.current.scrollTop;
      renderList(scrollTop);
      parentRef.current.addEventListener('scroll', throttleAndDebounceHandleScroll);
      parentRef.current.addEventListener('resize', handleResize);
    } else {
      return;
    }
    return () => {
      if (parentRef.current) {
        parentRef.current.removeEventListener('scroll', throttleAndDebounceHandleScroll);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [handleScroll, parentRef, size]);
  return { totalHeight: wrapperHeight, virtualItems: virtualRows };
};
export default useVirtual;
