const useThrottleAndDebounce = (func, throttleTime = 500, debounceTime = 500) => {
  let startTime = performance.now();
  let timer;
  const handler = (...args) => {
    clearTimeout(timer);
    const now = performance.now();
    if (now - startTime >= throttleTime) {
      startTime = now;
      return Promise.resolve(func(...args));
    } else {
      return new Promise((resolve) => {
        timer = setTimeout(() => {
          startTime = performance.now();
          const result = func(...args);
          resolve(result);
        }, debounceTime);
      });
    }
  };

  return handler;
};
export default useThrottleAndDebounce;
