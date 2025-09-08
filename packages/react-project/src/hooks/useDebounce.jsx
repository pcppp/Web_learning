const useDebounce = (func, time = 500) => {
  let timer;

  const handleDebounce = (...arg) => {
    return new Promise((resovle) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const result = func(...arg);
        resovle(result);
      }, time);
    });
  };
  return handleDebounce;
};
export default useDebounce;
