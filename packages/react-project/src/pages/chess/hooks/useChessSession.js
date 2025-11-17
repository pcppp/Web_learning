import useWebSocket from '@/hooks/useWebSocket';

const useChessSession = ({ onstart, onEnd, onUndo }) => {
  const handleMessage = (message) => {
    const { type, data } = message;
    switch (type) {
      case 'game_joined':
        break;
      case 'game_start':
        onstart(data);
        break;
      case 'game_end':
        onEnd(data);
        break;
      case 'undo_move':
        onUndo(data);
        break;
      default:
        break;
    }
  };
  const { sendMessage, socketRef, connectionStatus } = useWebSocket({
    url: 'ws://localhost:2000',
    onMessage: handleMessage,
    onOpen: () => {},
  });
};
export default useChessSession;
