import http from '../request/http';
import { MergeChunks } from '../request/api';
export default function useSliceFile({ formData = new FormData(), SIZE = 1024 * 1024 }) {
  const file = formData.get('file');
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
  const calculateHash = (chunks) => {
    return new Promise((resolve) => {
      // 添加 worker 属性
      const worker = new Worker('/hash.js');
      worker.postMessage({ chunks });
      worker.onmessage = (e) => {
        const { percentage, hash } = e.data;
        console.log('生成 hash 的进度：', percentage);
        if (hash) {
          resolve(hash);
        }
      };
    });
  };
  const handleChangeFile = async () => {
    if (file && file.size > 0) {
      // 1、对大文件拆分切片
      const chunks = createFileChunks(file);
      // 2、根据切片，生成文件总的 hash（文件唯一标识（根据文件内容生成的 hash））
      const hash = await calculateHash(chunks);
      const fileForm = chunks.map((chunk, index) => {
        formData.delete('file');
        formData.append('file', { fileName: file.name, chunk, hash, hashIndex: `${hash}-${index}`, ...file });
        return formData;
      });
      return fileForm;
    } else {
      console.log('文件为空');
    }
  };
  const mergeChunks = async () => {
    await http.post(
      MergeChunks,
      JSON.stringify({
        fileName: uploadFile.current.file.name,
        fileHash: uploadFile.current.hash,
        chunkSize: SIZE, // 切片大小
      }),
      { 'content-type': 'application/json' }
    );
  };
  const startUploadRequest = async (file, max = 5, uploadReq = () => {}) => {
    const fileForm = await handleChangeFile(file);
    return new Promise((resovle) => {
      const total = chunks.length; // 请求总数量
      let count = 0; // 记录请求完成的数量
      let index = 0; // 发起请求的数量
      const start = () => {
        while (index <= total && max > 0) {
          index++;
          uploadReq(fileForm[index]).then(() => {
            count++;
            max++;
            if (count === total) {
              resovle();
            } else {
              start();
            }
          });
        }
      };
    });
  };
  return {
    startUploadRequest,
  };
}
