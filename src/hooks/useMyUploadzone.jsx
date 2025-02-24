import { useState, useRef } from 'react';
const useMyUploadzone = ({
  useOnDrop = () => {},
  useOnClick = () => {},
  accept = '*',
  sizelimit = 1024 * 1024,
  noClick = false,
  noKeyboad = false,
  multiple = false,
}) => {
  const acceptedFiles = useRef([]);
  const inputRef = useRef(null);
  let files = [];

  const typeDetect = (file, accept) => {
    const starTypeDetect = (type, fileType) => {
      const star = type.indexOf('*');
      if (star === 0) {
        return true;
      }
      return star > -1 ? type.slice(0, star) === fileType.slice(0, star) : type === fileType;
    };
    let acceptType = accept.split(',');
    let res = false;
    acceptType.forEach((type) => {
      if (starTypeDetect(type, file.type)) {
        res = true;
      }
    });

    return res;
  };
  const getAcceptFile = (files) => {
    return files.filter((file) => {
      const isValidSize = file.size <= sizelimit;
      const isValidType = typeDetect(file, accept);
      if (!isValidSize) console.error('文件大小超标:', file);
      if (!isValidType) console.error('文件类型错误:', file);
      return isValidSize && isValidType;
    });
  };
  const getInputProps = (props) => {
    return {
      accept,
      ref: inputRef,
      type: 'file',
      multiple,
      style: { overflow: 'hidden', whiteSpace: 'nowrap', width: '1px', height: '1px' },
      ...props,
    };
  };
  const addFile = (file) => {
    if (file.webkitRelativePath != '') {
      file.path = file.webkitRelativePath;
    }
    if (file.path === undefined) {
      file.path = file.fullPath;
    }
    files.push(file);
  };
  const _addFilesFromDirectory = (directory, path) => {
    let dirReader = directory.createReader();
    let errorHandler = (error) => __guardMethod__(console, 'log', (o) => o.log(error));
    var readEntries = () => {
      return dirReader.readEntries((entries) => {
        if (entries.length > 0) {
          for (let entry of entries) {
            if (entry.isFile) {
              entry.file((file) => {
                file.fullPath = `${path}/${file.name}`;
                return addFile(file);
              });
            } else if (entry.isDirectory) {
              _addFilesFromDirectory(entry, `${path}/${entry.name}`);
            }
          }
          readEntries();
        }
        return null;
      }, errorHandler);
    };

    return readEntries();
  };
  const _addFilesFromItems = (items) => {
    return (() => {
      let result = [];
      for (let item of items) {
        var entry;
        if (item.webkitGetAsEntry != null && (entry = item.webkitGetAsEntry())) {
          if (entry.isFile) {
            result.push(addFile(item.getAsFile()));
          } else if (entry.isDirectory) {
            result.push(_addFilesFromDirectory(entry, entry.name));
          } else {
            result.push(undefined);
          }
        } else if (item.getAsFile != null) {
          if (item.kind == null || item.kind === 'file') {
            result.push(addFile(item.getAsFile()));
          } else {
            result.push(undefined);
          }
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  };
  const handleFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      addFile(files[i]);
    }
  };
  const getRootProps = (props) => ({
    onDrop: (e) => {
      e.preventDefault();
      if (e.dataTransfer.files.length) {
        let { items } = e.dataTransfer;
        if (items && items.length && items[0].webkitGetAsEntry != null) {
          // The browser supports dropping of folders, so handle items instead of files
          _addFilesFromItems(items);
        } else {
          handleFiles(items);
        }
        acceptedFiles.current = files;
        useOnDrop(getAcceptFile(acceptedFiles.current));
      }
    },
    onClick: (e) => {
      if (noClick) {
        e.preventDefault();
      } else {
        inputRef.current.click();
        e.stopPropagation();
      }
    },
    onChange: (e) => {
      if (e.target.files.length) {
        let currentFiles = e.target.files;
        if (currentFiles && currentFiles.length && currentFiles[0].webkitGetAsEntry != null) {
          _addFilesFromItems(currentFiles);
        } else {
          handleFiles(currentFiles);
        }
        acceptedFiles.current = files;
        console.log('======= acceptedFiles.current =======\n', acceptedFiles.current);
        console.log(getAcceptFile(acceptedFiles.current));
        useOnClick(getAcceptFile(acceptedFiles.current));
      }
    },
    onPaste: (e) => {
      if (!noKeyboad && e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
        let currentFiles = e.clipboardData.items;
        if (currentFiles && currentFiles.length && currentFiles[0].webkitGetAsEntry != null) {
          _addFilesFromItems(currentFiles);
        } else {
          handleFiles(currentFiles);
        }
        acceptedFiles.current = files;
        useOnDrop(getAcceptFile(acceptedFiles.current));
      }
    },
    ...props,
  });

  return { getRootProps, getInputProps, acceptedFiles: acceptedFiles.current };
};

export default useMyUploadzone;
