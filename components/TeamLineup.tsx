import { Player } from "../types/player";
import { getPlayerPortrait, getRoleIcon } from "../lib/assets";

const roleOrder = {
  Tank: 0,
  DPS: 1,
  Support: 2,
};

function sortRoster(team: Player[]) {
  return [...team].sort((a, b) => roleOrder[a.role] - roleOrder[b.role]);
}

export function TeamLineup({
  title,
  team,
}: {
  title: string;
  team: Player[];
}) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>

      <div className="space-y-3">
        {sortRoster(team).map(player => (
          <div
            key={player.name}
            className="flex items-center gap-3 bg-zinc-800 rounded-lg px-3 py-2"
          >
            <img
              src={`/players/${getPlayerPortrait(player.name)}.webp`}
              alt={player.name}
              onError={e => {
                  e.currentTarget.src = "/players/default.webp";
              }}
              className="w-12 h-12 object-cover rounded-lg bg-zinc-900 shrink-0"
            />

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-zinc-400">
                <img
                  src={getRoleIcon(player.role)}
                  alt={player.role}
                  className="w-4 h-4"
                />
                <span className="text-xs">{player.role}</span>
              </div>

              <div className="font-bold truncate">
                {player.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}