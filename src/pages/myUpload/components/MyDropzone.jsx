import React, { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import Dropzone from 'react-dropzone';
import useTree from '../../../hooks/useTree';
function MyDropzone() {
  return <StyledDropzone />;
}

function StyledDropzone(props) {
  const onDrop = () => {};

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject, acceptedFiles } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    multiple: true,
  });
  const getTreeFiles = (files) => {
    root.data = { path: acceptedFiles[0].path.split('/').slice(1)[0], type: 'floder' };
    files.map((file) => {
      const filePath = file.path.split('/').slice(2);
      let currentPath = root;
      filePath.forEach((pathItem) => {
        currentPath = currentPath.insertChild({ path: currentPath + pathItem, type: 'floder' });
      });
      currentPath.data = file;
    });
    console.log(root);
  };
  const root = useTree(null);
  if (acceptedFiles.length) {
    getTreeFiles(acceptedFiles);
  }
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <div className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        {acceptedFiles.map((file) => {
          return (
            <li key={file.path}>
              {file.path} - {file.size} bytes
            </li>
          );
        })}
      </div>
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
