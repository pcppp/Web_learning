export default function useSliceFile({ file, SIZE = 1024 * 1024 }) {
  // 生成文件切片
  const createFileChunks = (file, chunkSize) => {
    const chunks = [];
    let cur = 0;
    while (cur < file.size) {
      chunks.push(file.slice(cur, cur + chunkSize));
      cur += chunkSize;
    }
    return chunks;
  };
  return createFileChunks(file, SIZE);
}
