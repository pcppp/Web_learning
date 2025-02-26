import { useState, useRef, useReducer, useEffect } from 'react';
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
  function getFilesFromDataTransferItems(event) {
    return new Promise((resolve, reject) => {
      try {
        const items = event.dataTransfer.items;

        // 0. 检查 items 是否存在
        if (!items || items.length === 0) {
          reject(new Error('拖拽内容为空'));
          return;
        }

        // 1. 遍历所有 items
        const filePromises = Array.from(items).map((item) => {
          if (item.webkitGetAsEntry) {
            // 支持目录解析（Chrome/Firefox）
            const entry = item.webkitGetAsEntry();

            // 2. 递归处理文件和文件夹
            return new Promise((resolveEntry) => {
              const files = [];
              readDirectoryEntry(entry, files).then(() => resolveEntry(files));
            });
          } else {
            // 普通文件处理（兼容性方案）
            const file = item.getAsFile();
            return file ? Promise.resolve([file]) : Promise.resolve([]);
          }
        });

        // 3. 合并所有文件
        Promise.all(filePromises)
          .then((fileArrays) => {
            const allFiles = fileArrays.flat();
            resolve(allFiles);
          })
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  // 辅助函数：递归读取文件夹
  function readDirectoryEntry(entry, files = [], path = '') {
    return new Promise((resolve, reject) => {
      if (entry.isFile) {
        // 文件：转为 File 对象
        entry.file((file) => {
          if (path !== '') {
            file.fullPath = path + file.name;
            file.path = path + file.name;
          } else {
            file.fullPath = file.name;
            file.path = file.name;
          }
          files.push(file);
          resolve(files);
        }, reject);
      } else if (entry.isDirectory) {
        // 文件夹：递归读取子内容
        const dirReader = entry.createReader();
        dirReader.readEntries((entries) => {
          const dirName = entry.name;
          const newPath = `${path}${dirName}/`;
          const promises = entries.map((entry) => readDirectoryEntry(entry, files, newPath));
          Promise.all(promises)
            .then(() => resolve(files))
            .catch(reject);
        }, reject);
      }
    });
  }
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
    return file;
  };

  const _addFilesFromDirectory = async (directory, path) => {
    let dirReader = directory.createReader();

    let errorHandler = (error) => __guardMethod__(console, 'log', (o) => o.log(error));

    var readEntries = async () => {
      return new Promise((resolve, reject) => {
        dirReader.readEntries(async (entries) => {
          if (entries.length > 0) {
            for (let entry of entries) {
              if (entry.isFile) {
                await new Promise((resolve, reject) => {
                  entry.file((file) => {
                    file.fullPath = `${path}/${file.name}`;
                    addFile(file);
                    resolve();
                  });
                });
              } else if (entry.isDirectory) {
                await _addFilesFromDirectory(entry, `${path}/${entry.name}`);
              }
            }
            await readEntries();
          }
          resolve();
        }, errorHandler);
      });
    };

    return await readEntries();
  };

  function getFilesFromItems(items) {
    return new Promise((resolve, reject) => {
      try {
        if (items && items.length && items[0].webkitGetAsEntry != null) {
          // 如果支持目录，则递归读取文件夹内容
        } else {
          // 否则处理普通文件
          handleFiles(items);
        }
      } catch (error) {
        reject(error); // 捕获同步错误
      }
      resolve(files.current);
    });
  }
  const _addFilesFromItems = async (items) => {
    let result = [];
    for (let item of items) {
      var entry;
      if (item.webkitGetAsEntry != null && (entry = item.webkitGetAsEntry())) {
        if (entry.isFile) {
          result.push(addFile(item.getAsFile()));
        } else if (entry.isDirectory) {
          // Append all files from that directory to files
          result.push(await _addFilesFromDirectory(entry, entry.name));
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
  };
  const handleFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      addFile(files[i]);
    }
  };
  const getRootProps = (props) => ({
    // onDropCapture: (e) => {
    //   e.stopPropagation(); // 阻止子组件处理 drop 事件
    // },
    onDrop: (e) => {
      e.preventDefault();
      if (e.dataTransfer.files.length) {
        getFilesFromDataTransferItems(e).then((files) => {
          console.log('======= files =======\n', files);
          let { acceptFiles } = validateFiles(files);
          upLoadDispatch({ type: 'DRAG_END' });
          useOnDrop(acceptFiles);
        });
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
