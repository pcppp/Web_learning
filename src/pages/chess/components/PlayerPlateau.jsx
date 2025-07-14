const STATUS = {
  WAITING: 'waiting',
  READY: 'ready',
  RECONNECTING: 'reconnecting',
  PLAYING: 'playing',
};

const PlayerPlateau = ({ status, player, isActivate }) => {
  return (
    <div className="h-full w-full p-10">
      <div className="flex items-center justify-center">
        玩家{player}
        {isActivate && <div>-----进行中.........</div>}
      </div>
      {status === STATUS.WAITING && <div>等待对手加入</div>}
      {status === STATUS.RECONNECTING && <div>等待对手重连</div>}
    </div>
  );
};
export default PlayerPlateau;
