import React, { useCallback, useMemo, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Dropzone from 'react-dropzone';

function MyUpload({ uploadFolder = true, accept = 'image/*', multiple = false }) {
  // const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useMyDrop({
  //   accept: { 'image/*': [] },
  // });
  const file = useRef({});
  const style = useMemo(
    () => ({
      ...baseStyle,
      // ...(isFocused ? focusedStyle : {}),
      // ...(isDragAccept ? acceptStyle : {}),
      // ...(isDragReject ? rejectStyle : {}),
    })
    // [isFocused, isDragAccept, isDragReject]
  );

  return (
    <div className="container">
      <div {...style}>
        <input
          type="file"
          id={file}
          multiple={multiple}
          accept={accept}
          webkitdirectory={uploadFolder}
          mozdirectory={uploadFolder}
          odirectory={uploadFolder}></input>
        <p>Drag 'n' drop some files here, or click to select files</p>
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

export default MyUpload;
