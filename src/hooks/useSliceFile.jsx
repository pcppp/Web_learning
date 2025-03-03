import http from '../request/http';
import { MergeChunks } from '../request/api';
import { useRef } from 'react';
export default function useSliceFile({ SIZE = 1024 * 1024 } = { SIZE: 1024 * 1024 }) {
  const hashRef = useRef(null);
  // 生成文件切片
  const createFileChunks = (file) => {
    const chunks = [];
    let cur = 0;
    while (cur < file.size) {
      chunks.push(file.slice(cur, cur + SIZE));
      cur += SIZE;
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
        if (hash) {
          hashRef.current = hash;
          resolve(hash);
        }
      };
    });
  };
  const handleChangeFile = async (file, formData) => {
    if (file && file.size > 0) {
      // 1、对大文件拆分切片
      const chunks = createFileChunks(file, SIZE);
      // 2、根据切片，生成文件总的 hash（文件唯一标识（根据文件内容生成的 hash））
      const hash = await calculateHash(chunks);
      const upLoadChunks = chunks.map((chunk, index) => {
        return {
          fileName: file.name,
          chunk: chunk,
          size: SIZE,
          hash,
          hashIndex: `${hash}-${index}`,
        };
      });
      const fileForm = upLoadChunks.map((chunk, index) => {
        const formDataCurrent = new FormData();
        formData.forEach((value, key) => {
          if (key !== 'file') {
            formDataCurrent.append(key, value);
          }
        });
        formDataCurrent.append('file', chunk.chunk);
        formDataCurrent.append('type', 'fileSlice');
        formDataCurrent.append('hashIndex', chunk.hashIndex);
        formDataCurrent.append('hash', chunk.hash);
        return formDataCurrent;
      });
      return fileForm;
    } else {
      console.log('文件为空');
    }
  };
  const mergeChunks = async ({ file }) => {
    let res = await http.post(MergeChunks, {
      fileName: file.name,
      fileHash: hashRef.current,
      chunkSize: SIZE, // 切片大小
    });
    return res;
  };
  const startUploadRequest = async ({ max = 5, uploadReq = () => {}, formData }) => {
    const fileForm = await handleChangeFile(formData.get('file'), formData);
    return new Promise((resovle) => {
      const total = fileForm.length; // 请求总数量
      let count = 0; // 记录请求完成的数量
      let index = 0; // 发起请求的数量
      max = Math.min(total, max);
      const start = () => {
        while (index < total && max > 0) {
          uploadReq(fileForm[index])
            .then((res) => {
              count++;
              max++;
              if (count === total) {
                resovle();
              } else {
                start();
              }
            })
            .catch((error) => {
              // console.log(error);
            });
          index++;
        }
      };
      start();
    });
  };
  const upLoadSliceFile = async ({ max = 5, uploadReq = () => {}, formData = new FormData() }) => {
    return new Promise(async (resovle) => {
      await startUploadRequest({ max, uploadReq, formData });
      let res = await mergeChunks({ file: formData.get('file') });
      console.log('mergeChunks');
      resovle(res);
    });
  };
  return {
    upLoadSliceFile,
  };
}
