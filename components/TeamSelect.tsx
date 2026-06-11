import { Player } from "../types/player";
import { getRoleIcon, getTeamLogo } from "../lib/assets";
import { PlayerCard } from "./PlayerCard";

export function TeamSelect({
    roleCounts,
    teamChoices,
    selectedTeam,
    playerChoices,
    setSelectedTeam,
    backToTeams,
    draftPlayer,
    canDraftPlayer,
}: {
    roleCounts: {
        Tank: number;
        DPS: number;
        Support: number;
    };
    teamChoices: string[];
    selectedTeam: string | null;
    playerChoices: Player[];
    setSelectedTeam: (teamName: string) => void;
    backToTeams: () => void;
    draftPlayer: (player: Player) => void;
    canDraftPlayer: (player: Player) => boolean;
}) {
    return (
        <section className="mb-8  w-full max-w-6xl">
            <h2 className="text-2xl font-bold mb-4">
                Pick a Team
            </h2>
            {!selectedTeam && (
                <div className="flex flex-wrap gap-4">
                {teamChoices.map(teamName => {
                const teamPlayers = playerChoices.filter(
                player => player.team === teamName && canDraftPlayer(player)
                );

                return (
                <button
                    key={teamName}
                    onClick={() => setSelectedTeam(teamName)}
                    className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl p-4 w-72 text-left"
                >
                    <div className="flex items-center gap-3 mb-3">
                    <img
                        src={getTeamLogo(teamName)}
                        alt={teamName}
                        className="w-10 h-10 object-contain"
                    />

                    <h3 className="text-xl font-bold">
                        {teamName}
                    </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-zinc-300">
                    {teamPlayers.map(player => (
                        <div
                        key={player.name}
                        className="flex items-center gap-1 bg-zinc-900 rounded-md px-2 py-1 min-w-0"
                        >
                        <img
                            src={getRoleIcon(player.role)}
                            alt={player.role}
                            className="w-4 h-4 shrink-0"
                        />

                        <span className="text-sm">
                            {player.name}
                        </span>
                        </div>
                    ))}
                    </div>
                </button>
                );
            })}
                </div>
            )}

            {selectedTeam && (
                <>
                <button
                    onClick={backToTeams}
                    className="mb-4 bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg"
                >
                    Back to Teams
                </button>

                <h3 className="text-xl font-bold mb-4">
                    Pick a Player from {selectedTeam}
                </h3>

                <div className="flex flex-wrap gap-4">
                    {playerChoices.map(player => (
                    <PlayerCard
                        key={player.name}
                        player={player}
                        onClick={() => draftPlayer(player)}
                        disabled={!canDraftPlayer(player)}
                    />
                    ))}
                </div>
                </>
            )}
            </section>
    )
};