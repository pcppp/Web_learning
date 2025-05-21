import React, { useState, useCallback } from 'react';

function App() {
  const [count, setCount] = useState(0);

  // 内部对 input 进行了修改
  const handleInputChange = useCallback((input) => {
    input = input.trim(); // 修改了 input，但是 input 是参数
    console.log(input);
  }, []); // 不需要将 `input` 列为依赖项

  return (
    <div>
      <p>Count: {count}</p>
      <ButtonPro onClick={() => setCount(count + 1)}>Increase Count</ButtonPro>
      <ButtonPro onClick={() => handleInputChange('  Hello World  ')}>Change Input</ButtonPro>
    </div>
  );
}

//如果函数内部使用了其他外部变量，并且这些外部变量会影响函数逻辑，那么这些外部变量需要列入依赖项。例如：
const [value, setValue] = useState('');

const handleInputChange = useCallback(
  (input) => {
    const newValue = input.trim() + value; // 使用了外部变量 `value`
    console.log(newValue);
  },
  [value]
); // 此处需要将 `value` 列入依赖项
