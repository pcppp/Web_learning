function MyButton({ children, type = '', onClick }) {
  const className = `nes-btn ${type ? `is-${type}` : ''}`;

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
