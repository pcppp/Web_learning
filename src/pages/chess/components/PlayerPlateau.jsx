const PlayerPlateau = ({ player, isActivate }) => {
  return (
    <div className="h-full w-full p-10">
      <div className="flex items-center justify-center">
        玩家{player}
        {isActivate && <div>-----进行中.........</div>}
      </div>
    </div>
  );
};
export default PlayerPlateau;
