import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Dropzone from 'react-dropzone';
import useTree from '../../../hooks/useTree';
import Tree from './Tree';
import http from '../../../request/http';
import { UpLoadFiles } from '../../../request/api';
function MyDropzone() {
  return <StyledDropzone />;
}

function StyledDropzone(props) {
  const onDrop = (acceptedFiles) => {
    const filteredFiles = acceptedFiles.filter((file) => !file.name.includes('.DS_Store'));
    const root = turnToTreeFiles(filteredFiles);
    setTreeFiles(root);
    upLoad(root);
  };
  const upLoadTask = useRef([]);
  const upLoad = (files) => {
    let task = [];
    const creatTask = (file, parent, type, path) => {
      const task = { id: '', file, parent, type, progress: 0, path };
      return task;
    };
    const renderTreeFiles = (root) => {
      root.children.forEach((child) => {
        if (child.children.length) {
          task.push(creatTask(child.data, root, 'folder', child.key));
          renderTreeFiles(child);
        } else {
          task.push(creatTask(child.data, root, 'file', child.key));
        }
      });
    };
    upLoadTask.current = task;
    console.log(task);
    renderTreeFiles(files);
    const uploadRequests = upLoadTask.current.map((task) => {
      const formData = new FormData();
      formData.append('file', task.file);
      formData.append('path', task.path);
      formData.append('type', task.type);
      console.log(task.path);
      return http.post(UpLoadFiles, formData, {
        onProgress: (event) => {
          const loaded = Math.min(event.loaded, task.file.size);
          const progress = Math.floor((loaded / task.file.size) * 100);
          task.progress = progress;
          forceUpdate(true);
        },
      });
    });
    uploadRequests
      .reduce(async (promiseChain, currentItem) => {
        await promiseChain;
        return processItem(currentItem);
      }, Promise.resolve())
      .then(() => {
        console.log('所有项目已处理完成');
      });
    // Promise.all(uploadRequests)
    //   .then(() => {
    //     console.log('All files uploaded successfully');
    //   })
    //   .catch((error) => {
    //     console.error('Error uploading files:', error);
    //   }); // 多文件并行上传
  };

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject, acceptedFiles } = useDropzone({
    onDrop,
    noClick: false,
    noKeyboard: true,
    multiple: true,
  });
  const getPathArr = (path) => {
    if (path[0] === '/') {
      path = path.slice(1);
    }
    return path.split('/').slice(0);
  };
  const turnToTreeFiles = (files) => {
    const root = useTree(new File([''], `.`), '.');
    files.map((file) => {
      const filePath = getPathArr(file.path);
      let currentRoot = root;
      filePath.forEach((pathItem) => {
        currentRoot = currentRoot.insertChild(new File([''], `${pathItem}`), currentRoot.key + '/' + pathItem);
      });
      currentRoot.data = file;
    });
    console.log('======= root =======\n', root);

    return root;
  };
  const [treeFiles, setTreeFiles] = useState(null);

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  function remove(data) {
    root.deleteChild(data);
  }
  return (
    <div className="container">
      <div {...getRootProps({ style })}>
        <input webkitdirectory={1} {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      {treeFiles && <Tree treeData={treeFiles} keyProp="key"></Tree>}
    </div>
  );
}
const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
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
