"use client";

import { useState } from "react";
import { Player } from "../types/player";
import { MatchResult } from "../lib/simulation";
import { Roster } from "./Roster";
import { TeamLineup } from "./TeamLineup";
import { getMapImage } from "../lib/assets";

type RoundHistoryItem = {
  roundName: string;
  won: boolean;
  wins: number;
  losses: number;
  matchResult: MatchResult;
  enemyTeam: Player[];
};

export function Results({
    result,
    team,
    roundHistory,
    onNewGame,
}: {
    result: string;
    team: Player[];
    roundHistory: RoundHistoryItem[];
    onNewGame: () => void;
}) {
    const [expandedRound, setExpandedRound] = useState<number | null>(null);

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

        <div className="space-y-4 text-left">
        {roundHistory.map((round, index) => (
            <div
                key={`${round.roundName}-${index}`}
                className="bg-zinc-800 rounded-xl overflow-hidden"
            >
            <button
                onClick={() =>
                setExpandedRound(expandedRound === index ? null : index)
                }
                className="w-full flex justify-between items-center px-4 py-4 hover:bg-zinc-700 transition"
            >
                <span className="font-bold text-lg">
                    {round.roundName}
                </span>

                <span
                className={
                    round.won
                    ? "text-green-400 font-bold"
                    : "text-red-400 font-bold"
                }
                >
                {round.won ? "Won" : "Lost"} {round.wins}-{round.losses}
                </span>
            </button>

            {expandedRound === index && (
                <div className="border-t border-zinc-700 p-4 space-y-6">
                <h4 className="text-xl font-bold">
                    Opponent
                </h4>

                <TeamLineup
                    title="Enemy Team"
                    team={round.enemyTeam}
                />

                {round.matchResult.games.map(game => (
                    <div
                    key={game.gameNumber}
                    className="bg-zinc-900 rounded-xl p-4"
                    >
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-xl font-bold">
                            Game {game.gameNumber}
                        </div>

                        <div
                        className={
                            game.won
                            ? "text-green-400 font-bold"
                            : "text-red-400 font-bold"
                        }
                        >
                        {game.won ? "WIN" : "LOSS"}
                        </div>
                    </div>

                    <img
                        src={getMapImage(game.mapName)}
                        alt={game.mapName}
                        className="w-full max-w-[500px] aspect-video object-cover rounded-xl mb-4 border border-zinc-700 mx-auto"
                    />

                    <div className="text-lg font-bold mb-4 text-center">
                        {game.mapName}
                    </div>

                    <div className="space-y-2">
                        {game.events.map((event, eventIndex) => (
                        <p
                            key={eventIndex}
                            className={
                            event.positive
                                ? "text-green-400"
                                : "text-red-400"
                            }
                        >
                            {event.positive ? "+" : "-"} {event.text}
                        </p>
                        ))}
                    </div>
                    </div>
                ))}
                </div>
            )}
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