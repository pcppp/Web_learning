import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import useMyUploadzone from '../../../hooks/useMyuploadzone';
import Dropzone from 'react-dropzone';
import useTree from '../../../hooks/useTree';
import Tree from './Tree';
import http from '../../../request/http';
import { UpLoadFiles } from '../../../request/api';
import useSliceFile from '../../../hooks/useSliceFile';
function MyDropzone() {
  return <StyledDropzone />;
}

function StyledDropzone(props) {
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
    const creatTask = (file, name, parent, type, path) => {
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
            task.push(creatTask(child.data, child.data.name, root, 'folder', child.key));
            renderTreeFiles(child);
          } else {
            task.push(creatTask(child.data, child.data.name, root, 'file', child.key));
          }
        });
      }
    };
    renderTreeFiles(treeFiles);
    upLoadTaskList.current = task;
    setTotalSize(totalSize);
    return upLoadTaskList.current;
  };

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
      .then((res) => {
        progressCb(res.data.file.size);
        abortControllers.current = abortControllers.current.filter((c) => c !== controller);
      });
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
      return chain.then((prevResult) => {
        return requestFn();
      });
    }, Promise.resolve());
  };

  const { errorFiles, errorMessage, getRootProps, getInputProps, isDragActive, isDragAccept, acceptedFiles } =
    useMyUploadzone({
      useOnClick: onDrop,
      useOnDrop: onDrop,
      noClick: false,
      noKeyboard: false,
      multiple: true,
      accept: '*',
      lengthlimit: 20,
      sizelimit: 1024 * 1024 * 1024,
    });

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
      <button onClick={handleUpload}>点击上传</button>
      <button onClick={handlePauseOrCancle}>暂停/取消</button>
      <div>{errorMessage && <div>{errorMessage.message}</div>}</div>

      <div {...getRootProps({ style })}>
        <input webkitdirectory={1} {...getInputProps()} />
        {isDragAccept && isDragActive && <p style={{ pointerEvents: 'none' }}>All files will be accepted</p>}
        {!isDragAccept && isDragActive && <p style={{ pointerEvents: 'none' }}>Some files will be rejected</p>}
        {!isDragActive && <p style={{ pointerEvents: 'none' }}>Drop some files here ...</p>}
      </div>
      {treeFiles && (
        <>
          <div>上传进度: {((parseFloat(uploadedSize) / totalSize) * 100).toFixed(0)} %</div>
          <Tree treeData={treeFiles} keyProp="key" displayProp="name"></Tree>
        </>
      )}
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
