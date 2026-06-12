import { Player } from "../types/player";
import { MatchResult } from "../lib/simulation";
import { getMapImage } from "../lib/assets";
import { TeamLineup } from "./TeamLineup";

export function MatchSimulation({
    team,
    enemyTeam,
    matchResult,
    currentGameIndex,
    visibleEventCount,
    gameFinished,
    roundName,
    message,
    result,
    nextRound,
}: {
    team: Player[];
    enemyTeam: Player[];
    matchResult: MatchResult;
    currentGameIndex: number;
    visibleEventCount: number;
    gameFinished: boolean;
    roundName: string;
    message: string;
    result: string;
    nextRound: () => void;
}) {
    const currentGame = matchResult.games[currentGameIndex];
    const visibleEvents = currentGame.events.slice(0, visibleEventCount);

    const revealedGames = matchResult.games.slice(0, currentGameIndex);

    const revealedWins = revealedGames.filter(
        game => game.won
    ).length;   

    const revealedLosses = revealedGames.filter(
        game => !game.won
    ).length;

    const liveWins =
        revealedWins +
        (gameFinished && currentGame.won ? 1 : 0);

    const liveLosses =
        revealedLosses +
        (gameFinished && !currentGame.won ? 1 : 0);

    return (
        <section className="mt-8 mb-8 w-full max-w-7xl bg-zinc-900 border border-zinc-700 rounded-xl p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">

                <div className="order-2 lg:order-1 w-full min-w-0">
                    <TeamLineup 
                        title="Your Team" 
                        team={team} 
                    />
                </div>

                <div className="order-1 lg:order-2 flex flex-col items-center text-center w-full min-w-0">

                    <h2 className="text-3xl font-bold mb-4">
                        {roundName}
                    </h2>

                    <img
                        src={getMapImage(currentGame.mapName)}
                        alt={currentGame.mapName}
                        className="w-full max-w-[700px] aspect-video object-cover rounded-xl mb-4 border border-zinc-700"
                    />

                    <h3 className="text-2xl font-bold mb-2">
                        {currentGame.mode} · {currentGame.mapName}
                    </h3>

                    <p className="text-zinc-400 mb-6">
                        Game {currentGame.gameNumber} ·
                        Series {liveWins} - {liveLosses}
                    </p>

                    <div className="space-y-3 mb-6 min-h-[140px]">
                        {visibleEvents.map((event, index) => (
                            <p
                            key={index}
                            className={
                                event.positive
                                ? "text-green-400 text-lg"
                                : "text-red-400 text-lg"
                            }
                            >
                            {event.positive ? "+" : "-"} {event.text}
                            </p>
                        ))}
                    </div>

                    {gameFinished && (
                        <div
                            className={
                            currentGame.won
                                ? "text-green-400 text-3xl font-bold mb-4"
                                : "text-red-400 text-3xl font-bold mb-4"
                            }
                        >
                            {currentGame.won
                            ? "GAME WON"
                            : "GAME LOST"}
                        </div>
                    )}
                    {message && (
                        <div className="flex flex-col items-center gap-4 mt-8">
                            <div className="text-2xl font-bold">
                            {message}
                            </div>

                            {!result && (
                            <button
                                onClick={nextRound}
                                className="bg-green-500 hover:bg-green-600 px-5 py-3 rounded-lg font-bold text-lg"
                            >
                                Next Round
                            </button>
                            )}
                        </div>
                    )}
                    {!message && !result && (
                        <p className="text-zinc-400 mt-2">
                            Simulating...
                        </p>
                    )}
                </div>

                <div className="order-3 lg:order-3 w-full min-w-0">
                    <TeamLineup 
                        title="Enemy Team" 
                        team={enemyTeam} 
                    />
                </div>
            </div>
        </section>
    );
}