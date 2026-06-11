import { Player } from "../types/player";
import { Roster } from "./Roster";

export function Results({
  result,
  team,
  roundHistory, 
  onNewGame,
}: {
  result: string;
  team: Player[];
  roundHistory: {
    roundName: string;
    won: boolean;
    wins: number;
    losses: number;
  }[];
  onNewGame: () => void;
}) {
  return (
    <section className="mt-8 mb-8 w-full max-w-5xl bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-center">
      <h2 className="text-4xl font-bold mb-4">
        Tournament Summary
      </h2>

      <p className="text-2xl font-bold mb-8">
        {result}
      </p>

      <Roster team={team} />

      <h3 className="text-2xl font-bold mt-8 mb-4">
        Results
      </h3>

      <div className="space-y-3">
        {roundHistory.map((round, index) => (
          <div
            key={`${round.roundName}-${index}`}
            className="bg-zinc-800 rounded-lg px-4 py-3 flex justify-between"
          >
            <span>{round.roundName}</span>

            <span
              className={
                round.won
                  ? "text-green-400 font-bold"
                  : "text-red-400 font-bold"
              }
            >
              {round.won ? "Won" : "Lost"} {round.wins}-{round.losses}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={onNewGame}
        className="mt-8 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-bold"
      >
        New Game
      </button>
    </section>
  );
}