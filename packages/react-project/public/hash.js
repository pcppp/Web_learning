// 导入 spark-md5
self.importScripts('/spark-md5.min.js');

// 生成文件 hash
self.onmessage = (e) => {
  const { chunks } = e.data;
  const spark = new self.SparkMD5.ArrayBuffer();
  let percentage = 0; // 进度
  let count = 0; // 记录访问切片次数，用作递归的终止条件
  const loadNext = () => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(chunks[count]);
    reader.onload = (e) => {
      count++;
      spark.append(e.target.result);
      if (count === chunks.length) {
        self.postMessage({
          percentage: 100,
          hash: spark.end(),
        });
        self.close();
      } else {
        percentage += 100 / chunks.length;
        self.postMessage({
          percentage,
        });
        loadNext();
      }
    };
  };
  loadNext();
};
