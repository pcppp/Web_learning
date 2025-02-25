import { useState, useRef, useReducer } from 'react';
import { UpLoadFiles } from '../request/api';
import { use } from 'react';
const useMyUploadzone = ({
  useOnDrop = () => {},
  useOnClick = () => {},
  accept = '*',
  sizelimit = 1024 * 1024,
  noClick = false,
  noKeyboad = false,
  multiple = false,
  lengthlimit = 20,
}) => {
  const initialState = {
    errorMessage: {},
    acceptedFiles: [],
    errorFiles: [],
    isDragActive: false,
    isDragAccept: true,
  };
  const upLoadReducer = (state, action) => {
    switch (action.type) {
      case 'ADD_ACCEPT_FILES':
        return { ...state, acceptedFiles: [...state.acceptedFiles, ...action.files] };
      case 'ADD_ERROR_FILES':
        return {
          ...state,
          errorFiles: [...state.errorFiles, ...action.files],
          errorMessage: { type: action.errorType, message: action.message },
          isDragAccept: false,
        };
      case 'BATCH_UPDATE':
        return {
          ...state,
          acceptedFiles: action.acceptedFiles,
          errorFiles: action.errorFiles,
          errorMessage: action.errorMessage,
        };
      case 'DRAG_START':
        return { ...state, isDragActive: true };
      case 'DRAG_END':
        return { ...state, isDragActive: false };
      case 'RESET':
        return initialState;
      default:
        return state;
    }
  };
  const inputRef = useRef(null);
  const files = useRef([]);
  const [upLoadState, upLoadDispatch] = useReducer(upLoadReducer, initialState);

  const typeDetect = (file, accept) => {
    const starTypeDetect = (type, fileType) => {
      const star = type.indexOf('*');
      if (star === 0) {
        return true;
      }
      return star > -1 ? type.slice(0, star + 1) === fileType.slice(0, star + 1) : type === fileType;
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

  const validateFiles = (files) => {
    let acceptFiles = [];
    let errorFiles = [];
    if (files.length > lengthlimit) {
      upLoadDispatch({ type: 'ADD_ERROR_FILES', files: files, errorType: 'length', message: '文件数量超标' });
    } else {
      files.forEach((file) => {
        const isValidSize = file.size <= sizelimit;
        const isValidType = typeDetect(file, accept);
        if (!isValidSize || !isValidType) {
          errorFiles.push(file);
        } else {
          acceptFiles.push(file);
        }
      });
      if (errorFiles.length > 0) {
        upLoadDispatch({
          type: 'ADD_ERROR_FILES',
          files: errorFiles,
          errorType: 'size or type',
          message: '部分文件不符合要求',
        });
      }

      upLoadDispatch({ type: 'ADD_ACCEPT_FILES', files: acceptFiles });
    }
    return { acceptFiles, errorFiles };
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
    if (file.path === undefined) {
      file.path = file.name;
      file.fullPath = file.name;
    }
    files.current.push(file);
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
    return (async () => {
      let result = [];
      for (let item of items) {
        var entry;
        if (item.webkitGetAsEntry != null && (entry = await item.webkitGetAsEntry())) {
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
    onDrop: async (e) => {
      e.preventDefault();
      if (e.dataTransfer.files.length) {
        let { items } = e.dataTransfer;
        if (items && items.length && items[0].webkitGetAsEntry != null) {
          await _addFilesFromItems(items);
        } else {
          handleFiles(items);
        }
        let { acceptFiles } = validateFiles(files.current);
        upLoadDispatch({ type: 'DRAG_END' });
        useOnDrop(acceptFiles);
      }
    },
    onDragStart: (e) => {
      e.preventDefault();
    },
    onDragOver: (e) => {
      e.preventDefault();
    },
    onDragEnd: (e) => {
      e.preventDefault();
    },

    onDragEnter: (e) => {
      e.preventDefault();
      upLoadDispatch({ type: 'DRAG_START' });
    },
    onDragLeave: (e) => {
      e.preventDefault();
      upLoadDispatch({ type: 'DRAG_END' });
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
        let { acceptFiles, errorFiles } = validateFiles(files.current);
        useOnClick(acceptFiles);
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
        let { acceptFiles } = validateFiles(files.current);
        useOnDrop(acceptFiles);
      }
    },
    ...props,
  });
  return {
    ...upLoadState,
    getRootProps,
    getInputProps,
  };
};

export default useMyUploadzone;
