import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Dropzone from 'react-dropzone';
import useTree from '../../../hooks/useTree';
import Tree from './Tree';
function MyDropzone() {
  return <StyledDropzone />;
}

function StyledDropzone(props) {
  const onDrop = (acceptedFiles) => {
    const filteredFiles = acceptedFiles.filter((file) => !file.name.includes('.DS_Store'));
    const root = turnToTreeFiles(filteredFiles);
    setTreeFiles(root);
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
    const root = useTree(new File([''], `./`), `.`);
    files.map((file) => {
      const filePath = getPathArr(file.path);
      let currentRoot = root;
      filePath.forEach((pathItem) => {
        currentRoot = currentRoot.insertChild(new File([''], `${pathItem}/`), currentRoot.key + '/' + pathItem);
      });
      currentRoot.data = file;
    });
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
      <input type="file" webkitdirectory="" />
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
