import { Player } from "../types/player";
import { getPlayerPortrait, getRoleIcon } from "../lib/assets";

export function PlayerCard({
  player,
  onClick,
  disabled,
}: {
  player: Player;
  onClick: () => void;
  disabled?: boolean,
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 bg-zinc-800 
      hover:bg-zinc-700 disabled:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700 rounded-xl p-3 w-80 text-left"
      disabled={disabled}
    >
    <img
      src={`/players/${getPlayerPortrait(player.name)}.webp`}
      alt={player.name}
      onError={e => {
          e.currentTarget.src = "/players/default.webp";
      }}
      className="w-20 h-20 object-cover rounded-lg bg-zinc-900 shrink-0"
    />

      <div className="flex items-center gap-2 min-w-0">
        <img
          src={getRoleIcon(player.role)}
          alt={player.role}
          className="w-6 h-6 shrink-0"
        />

        <span className="text-xl font-bold truncate">
          {player.name}
        </span>
      </div>
    </button>
  );
}