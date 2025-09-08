import styled from 'styled-components';
import useMyUploadzone from '../../../hooks/useMyuploadzone';

const MyUploadzone = () => {
  const { getInputProps, getRootProps } = useMyUploadzone({ multiple: true });
  return (
    <UploadZone {...getRootProps()}>
      <input
        {...getInputProps()}
        webkitdirectory={1}
        type="file"
        style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '1px', height: '1px' }}
      />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </UploadZone>
  );
};
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
const UploadZone = styled.div`
  ${baseStyle}
`;
export default MyUploadzone;

const focusedStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};
