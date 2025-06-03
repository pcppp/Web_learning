import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import useMyUploadzone from '../../../hooks/useMyuploadzone';
import Dropzone from 'react-dropzone';
import useTree from '../../../hooks/useTree';
import Tree from './Tree';
import http from '../../../request/http';
import { UpLoadFiles } from '../../../request/api';
import useSliceFile from '../../../hooks/useSliceFile';
import { ButtonPro } from '@/components/ButtonPro';
function MyDropzone() {
  return <StyledDropzone />;
}

function StyledDropzone(props) {
  const [errorMessage, setErrorMessage] = useState({ message: '' });
  const [uploadedSize, setUploadedSize] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [treeFiles, setTreeFiles] = useState(null);
  const { upLoadSliceFile } = useSliceFile({ SIZE: 1024 * 256 });
  const abortControllers = useRef([]);
  const upLoadTaskList = useRef([]);
  const uploadedRef = useRef(0);
  const uploadRequests = useRef([]);
  const initPage = () => {
    setUploadedSize(0);
    setTotalSize(0);
    setTreeFiles(null);
    abortControllers.current = [];
    upLoadTaskList.current = [];
    uploadedRef.current = 0;
    uploadRequests.current = [];
  };
  const onDrop = (acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    initPage();
    const filteredFiles = acceptedFiles.filter((file) => !file.name.includes('.DS_Store'));
    renderDrop(filteredFiles);
  };
  const renderDrop = (files) => {
    const root = turnToTreeFiles(files);
    setTreeFiles(root);
    setUploadTask(root);
  };
  const setUploadTask = (treeFiles) => {
    let task = [];
    let totalSize = 0;
    const createTask = (file, name, parent, type, path) => {
      if (file && file.size) {
        totalSize += file.size;
      }
      const task = { id: '', file, name, parent, type, progress: 0, path };
      return task;
    };
    const renderTreeFiles = (root) => {
      if (root) {
        root.children.forEach((child) => {
          if (child.children.length) {
            task.push(createTask(child.data, child.data.name, root, 'folder', child.key));
            renderTreeFiles(child);
          } else {
            task.push(createTask(child.data, child.data.name, root, 'file', child.key));
          }
        });
      }
    };
    renderTreeFiles(treeFiles);
    upLoadTaskList.current = task;
    setTotalSize(totalSize);
    return upLoadTaskList.current;
  };
  const {
    errorFiles,
    errorMessage: errorMessageUpload,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    acceptedFiles,
  } = useMyUploadzone({
    useOnClick: onDrop,
    useOnDrop: onDrop,
    noClick: false,
    noKeyboard: false,
    multiple: true,
    accept: '*',
    lengthlimit: 20,
    sizelimit: 1024 * 1024 * 1024,
  });
  useEffect(() => {
    setErrorMessage(errorMessageUpload);
  }, errorMessageUpload);
  const upLoadFile = (formData) => {
    const controller = new AbortController(); // 为每个请求创建新控制器
    abortControllers.current.push(controller);
    const progressCb = (progressSize) => {
      uploadedRef.current += progressSize;
      setUploadedSize(uploadedRef.current);
    };
    return http
      .post(UpLoadFiles, formData, {
        signal: controller.signal,
        headers: { 'Content-Type': 'multipart/form-data', accept: '*' },
      })
      .then(
        (res) => {
          progressCb(res.data.file.size);
          abortControllers.current = abortControllers.current.filter((c) => c !== controller);
        },
        (reason) => {
          setErrorMessage(reason);
        }
      );
  };
  const abortAllRequests = () => {
    abortControllers.current.forEach((controller) => {
      controller.abort(); // 终止所有进行中的请求
    });
    abortControllers.current = []; // 清空控制器数组
  };
  const upLoadTask = async (task) => {
    uploadRequests.current = await task.map((task) => async () => {
      const currentTask = task;
      const formData = new FormData();
      const maxSize = 1024 * 1024;
      formData.append('file', currentTask.file);
      formData.append('path', currentTask.path);
      formData.append('type', currentTask.type);
      formData.append('name', currentTask.name);
      if (currentTask.file.size > maxSize) {
        return await upLoadSliceFile({
          max: 5,
          uploadReq: upLoadFile,
          formData,
        });
      }
      return upLoadFile(formData);
    });
    // 顺序执行
    uploadRequests.current.reduce((chain, requestFn, index) => {
      return chain.then(
        (prevResult) => {
          return requestFn();
        },
        (reason) => [(errorMessage.message = reason.message)]
      );
    }, Promise.resolve());
  };

  const getPathArr = (path) => {
    if (path && path.length > 0) {
      if (path[0] === '/') {
        path = path.slice(1);
      }
      return path.split('/').slice(0);
    }
  };
  const turnToTreeFiles = (files) => {
    if (!files || files.length === 0) return null;
    const root = useTree(new File([''], `.`), '.', '');
    files.map((file) => {
      const filePath = getPathArr(file.path);
      let currentRoot = root;
      filePath.forEach((pathItem) => {
        currentRoot = currentRoot.insertChild(
          new File([''], `${pathItem}`),
          currentRoot.key + '/' + pathItem,
          pathItem
        );
      });
      currentRoot.data = file;
    });
    return root;
  };

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? focusedStyle : {}),
      ...(isDragAccept && isDragActive ? acceptStyle : {}),
      ...(!isDragAccept && isDragActive ? rejectStyle : {}),
    }),
    [isDragAccept, isDragActive]
  );

  function remove(data) {
    root.deleteChild(data);
  }
  const handleUpload = () => {
    if (!upLoadTaskList.current.length) {
      console.log('空文件');
      return;
    }
    upLoadTask(upLoadTaskList.current);
  };
  const handlePause = () => {
    abortAllRequests();
  };
  const handlePauseOrCancle = () => {
    if (upLoadTaskList.current.length) {
      handlePause();
    } else {
      renderDrop([]);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-amber-50 p-4 sm:p-8">
        <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-6 text-center text-2xl font-bold text-amber-800">文件上传</h2>

          {/* 上传按钮区域 */}
          <div className="mb-6 flex flex-wrap justify-center gap-3">
            <ButtonPro onClick={handleUpload} className="flex items-center bg-amber-500 px-6 py-2 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              点击上传
            </ButtonPro>

            <ButtonPro
              onClick={handlePauseOrCancle}
              className="flex items-center bg-amber-100 px-6 py-2 text-amber-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              暂停/取消
            </ButtonPro>
          </div>

          {/* 错误信息展示 */}
          {errorMessage && errorMessage.message && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {errorMessage.message}
            </div>
          )}

          {/* 拖放区域 */}
          <div
            {...getRootProps()}
            className={`flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors duration-200 sm:p-12 ${isDragActive && isDragAccept ? 'border-green-400 bg-green-50' : ''} ${isDragActive && !isDragAccept ? 'border-red-400 bg-red-50' : ''} ${!isDragActive ? 'border-amber-300 bg-amber-50 hover:border-amber-400 hover:bg-amber-100' : ''} `}>
            <input webkitdirectory={1} {...getInputProps()} className="hidden" />

            {/* 上传图标 */}
            <div className="mb-4">
              {isDragActive ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-12 w-12 ${isDragAccept ? 'text-green-500' : 'text-red-500'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
              )}
            </div>

            {/* 提示文字 */}
            <div className="text-center">
              {isDragAccept && isDragActive && <p className="font-medium text-green-600">所有文件都将被接受</p>}
              {!isDragAccept && isDragActive && <p className="font-medium text-red-600">部分文件将被拒绝</p>}
              {!isDragActive && (
                <>
                  <p className="mb-2 font-medium text-amber-700">拖拽文件到这里上传</p>
                  <p className="text-sm text-amber-500">或点击此区域选择文件</p>
                </>
              )}
            </div>
          </div>

          {/* 上传进度和文件树 */}
          {treeFiles && (
            <div className="mt-6 min-h-96 border-t border-amber-200 pt-6">
              {/* 进度条 */}
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-amber-700">上传进度</span>
                  <span className="text-amber-600">{((parseFloat(uploadedSize) / totalSize) * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-amber-100">
                  <div
                    className="h-2.5 rounded-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${((parseFloat(uploadedSize) / totalSize) * 100).toFixed(0)}%` }}></div>
                </div>
              </div>

              {/* 文件树 */}
              <div className="max-h-96 overflow-auto rounded-md bg-amber-50 p-4">
                <h3 className="mb-3 font-medium text-amber-800">文件列表</h3>
                <div className="min-h-60">
                  <Tree treeData={treeFiles} keyProp="key" displayProp="name" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '3px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const focusedStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

export default MyDropzone;
