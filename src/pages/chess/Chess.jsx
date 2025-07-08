import { useState } from 'react';
import Board from './components/board';
import PlayerPlateau from './components/PlayerPlateau';

const Chess = () => {
  const [player, setPlayer] = useState(1);
  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <PlayerPlateau player={1} isActivate={player === 1} className="flex-1" />
        <Board player={player} setPlayer={setPlayer} />
        <PlayerPlateau player={2} isActivate={player === 2} className="flex-1" />
      </div>
    </>
  );
};
export default Chess;
