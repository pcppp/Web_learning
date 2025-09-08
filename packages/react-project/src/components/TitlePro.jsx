export default function TitlePro({ underline, className, ...props }) {
  return (
    <>
      <h1 className={`m-3 text-center text-3xl font-bold text-amber-800 ${className}`} {...props}></h1>
      {underline && <div className={`mx-auto h-1 w-28 rounded-full bg-amber-800 opacity-50 ${className}`}></div>}
    </>
  );
}
