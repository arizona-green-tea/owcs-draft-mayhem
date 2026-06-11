import { Player } from "../types/player";
import { MatchResult } from "../lib/simulation";
import { getMapImage } from "../lib/assets";
import { TeamLineup } from "./TeamLineup";

export function MatchIntro({
  team,
  enemyTeam,
  matchResult,
  currentGameIndex,
  roundName,
  onStartMatch,
}: {
  team: Player[];
  enemyTeam: Player[];
  matchResult: MatchResult;
  currentGameIndex: number;
  roundName: string;
  onStartMatch: () => void;
}) {
  const currentGame = matchResult.games[currentGameIndex];

  return (
    <section className="mt-8 mb-8 w-full max-w-7xl bg-zinc-900 border border-zinc-700 rounded-xl p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
        <div className="order-2 lg:order-1 w-full min-w-0"></div>
          <TeamLineup 
            title="Your Team" 
            team={team}
            compactOnMobile 
          />

        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold mb-4">{roundName}</h2>

          <img
            src={getMapImage(currentGame.mapName)}
            alt={currentGame.mapName}
            className="w-full max-w-[700px] aspect-video object-cover rounded-xl mb-4 border border-zinc-700"
          />

          <h3 className="text-2xl font-bold mb-6">
            {currentGame.mapName}
          </h3>

          <div className="text-5xl font-bold text-zinc-400 mb-6">
            VS
          </div>

          <button
            onClick={onStartMatch}
            className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg font-bold"
          >
            Start Match
          </button>
        </div>
        <div className="order-3 lg:order-3 w-full min-w-0">
          <TeamLineup 
            title="Enemy Team" 
            team={enemyTeam} 
            compactOnMobile
          />
        </div>
      </div>
    </section>
  );
}