export function ButtonPro({ children, type = '', className, onClick, ...props }) {
  return (
    <button
      className={`m-1 rounded bg-amber-400 p-2 px-4 py-2 text-center text-amber-800 hover:bg-amber-600 hover:text-amber-300 ${className}`}
      onClick={onClick}
      {...props}>
      {children}
    </button>
  );
}
