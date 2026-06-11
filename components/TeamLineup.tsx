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
  compactOnMobile = false,
}: {
  title: string;
  team: Player[];
  compactOnMobile?: boolean;
}) {
  return (
    <div className="w-full min-w-0">
      <h3 className="text-xl font-bold mb-4">{title}</h3>

      <div className={compactOnMobile ? "grid grid-cols-2 gap-2 lg:space-y-3 lg:block" : "space-y-3"}>
        {sortRoster(team).map(player => (
          <div
            key={player.name}
            className="flex items-center gap-2 bg-zinc-800 rounded-lg px-2 py-2 min-w-0"
          >
            <img
              src={`/players/${getPlayerPortrait(player.name)}.webp`}
              alt={player.name}
              onError={e => {
                e.currentTarget.src = "/players/default.webp";
              }}
              className="w-10 h-10 lg:w-12 lg:h-12 object-cover rounded-lg bg-zinc-900 shrink-0"
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 text-zinc-400">
                <img
                  src={getRoleIcon(player.role)}
                  alt={player.role}
                  className="w-3 h-3 lg:w-4 lg:h-4 shrink-0"
                />
                <span className="text-[10px] lg:text-xs">{player.role}</span>
              </div>

              <div className="font-bold text-sm lg:text-base truncate">
                {player.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}