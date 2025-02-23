import { useState, useRef } from 'react';
const useMyUploadzone = ({ useOnDrop = () => {}, noClick = false, noKeyboad = false, multiple = false }) => {
  const acceptedFiles = useRef([]);
  let files = [];
  const getInputProps = () => {};
  const handleFiles = (files) => {};

  const addFile = (file) => {
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
  const getRootProps = () => ({
    onDrop: (e) => {
      e.preventDefault();
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        files[i] = e.dataTransfer.files[i];
      }
      let { items } = e.dataTransfer;
      if (items && items.length && items[0].webkitGetAsEntry != null) {
        _addFilesFromItems(items);
      } else {
        handleFiles(files);
      }
      acceptedFiles.current = files;
      useOnDrop(acceptedFiles.current);
    },
  });

  return { getRootProps, getInputProps, acceptedFiles: acceptedFiles.current };
};

export default useMyUploadzone;
