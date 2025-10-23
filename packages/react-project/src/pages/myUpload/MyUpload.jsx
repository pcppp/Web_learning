import React, { useCallback, useMemo, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Dropzone from 'react-dropzone';
import MyDropzone from './components/MyDropzone';
import MyUploadzone from './components/MyUploadzone';
import MyDrag from './components/MyDrag';
function MyUpload({ uploadFolder = true, accept = 'image/*', multiple = false }) {
  return (
    <>
      <div className={''}>
        {/* <MyUploadzone></MyUploadzone> */}
        <MyDropzone></MyDropzone>
      </div>
      <MyDrag></MyDrag>
    </>
  );
}

export default MyUpload;
