import { useState, useRef } from 'react';
const useMyUploadzone = ({
  useOnDrop = () => {},
  useOnClick = () => {},
  noClick = false,
  noKeyboad = false,
  multiple = false,
}) => {
  const acceptedFiles = useRef([]);
  const inputRef = useRef(null);
  let files = [];
  const getInputProps = (props) => {
    return {
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

          // Recursively call readEntries() again, since browser only handle
          // the first 100 entries.
          // See: https://developer.mozilla.org/en-US/docs/Web/API/DirectoryReader#readEntries
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
      }
      acceptedFiles.current = files;
      useOnDrop(acceptedFiles.current);
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
        let { files } = e.target;
        if (files && files.length && files[0].webkitGetAsEntry != null) {
          _addFilesFromItems(files);
        } else {
          handleFiles(files);
        }
      }
      acceptedFiles.current = files;
      useOnClick(acceptedFiles.current);
    },
    ...props,
  });

  return { getRootProps, getInputProps, acceptedFiles: acceptedFiles.current };
};

export default useMyUploadzone;
