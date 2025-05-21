import { useState } from 'react';

export function InputPro({
  type = 'text',
  value,
  onChange,
  placeholder = '',
  label,
  className = '',
  error,
  success,
  icon,
  disabled = false,
  onFocus: originOnFocus = () => {},
  onBlur: originOnBlur = () => {},
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false); // 根据状态确定边框颜色
  const getBorderColor = () => {
    if (error) return 'border-red-500 focus:ring-red-300';
    if (success) return 'border-green-500 focus:ring-green-300';
    if (isFocused) return 'border-amber-500 focus:ring-amber-300';
    return 'border-amber-300 hover:border-amber-400';
  };

  return (
    <>
      {label && <label className={'p-2.5 text-amber-900'}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`rounded-md border bg-amber-50 p-2.5 text-amber-800 transition-all outline-none ${getBorderColor()} ${icon ? 'pl-10' : 'pl-3'} ${disabled ? 'cursor-not-allowed bg-amber-100 opacity-70' : ''} focus:ring-opacity-50 focus:ring-2 ${className}`}
        onFocus={(...args) => {
          setIsFocused(true);
          return originOnFocus(...args);
        }}
        onBlur={(...args) => {
          setIsFocused(false);
          return originOnBlur(...args);
        }}
        {...props}></input>
      {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
      {success && !error && <div className="mt-1 text-xs text-green-500">{success}</div>}
    </>
  );
}
