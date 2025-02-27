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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [treeFiles, setTreeFiles] = useState(null);
  const { upLoadSliceFile } = useSliceFile();

  const onDrop = (acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    setUploadProgress(0);
    const filteredFiles = acceptedFiles.filter((file) => !file.name.includes('.DS_Store'));
    renderDrop(filteredFiles);
  };
  const upLoadTaskList = useRef([]);
  const renderDrop = (files) => {
    const root = turnToTreeFiles(files);
    setTreeFiles(root);
    setUploadTask(root);
  };
  const setUploadTask = (treeFiles) => {
    let task = [];
    const creatTask = (file, name, parent, type, path) => {
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
    return upLoadTaskList.current;
  };
  const upLoadFile = (formData) => {
    return http.post(UpLoadFiles, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };
  const upLoadTask = async (task) => {
    const uploadRequests = await task.map((task) => async () => {
      const currentTask = task;
      const formData = new FormData();
      const maxSize = 1024 * 1024;
      formData.append('file', currentTask.file);
      formData.append('path', currentTask.path);
      formData.append('type', currentTask.type);
      formData.append('name', currentTask.name);
      if (currentTask.file.size > maxSize) {
        return await upLoadSliceFile({ max: 5, uploadReq: upLoadFile, formData });
      }
      // return upLoadFile(formData);
    });
    let progress = 0;
    // 顺序执行
    uploadRequests
      .reduce((chain, requestFn, index) => {
        return chain.then((prevResult) => {
          return requestFn().then((res) => {
            progress++;
            setUploadProgress(progress);
          });
        });
      }, Promise.resolve())
      .then((finalResult) => {})
      .catch((error) => {
        console.error('上传失败:', error);
      });
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
    console.log(path);
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
    uploadProgress;
  };
  const handlePauseOrCancle = () => {
    if (upLoadTaskList.current.length) {
      renderDrop([]);
    } else {
      handlePause();
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
          <div>上传进度: {((parseFloat(uploadProgress) / upLoadTaskList.current.length) * 100).toFixed(0)} %</div>
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
