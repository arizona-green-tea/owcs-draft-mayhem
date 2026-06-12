import { Player } from "../types/player";
import { getPlayerPortrait, getRoleIcon } from "../lib/assets";

const rosterSlots: Player["role"][] = [
  "Tank",
  "DPS",
  "DPS",
  "Support",
  "Support",
];

function getPlayersBySlot(team: Player[]) {
  const remaining = [...team];

  return rosterSlots.map(role => {
    const index = remaining.findIndex(player => player.role === role);

    if (index === -1) {
      return null;
    }

    const player = remaining[index];
    remaining.splice(index, 1);

    return player;
  });
}

export function Roster({
  title,
  team,
}: {
  title: string,
  team: Player[];
}) {
  const slots = getPlayersBySlot(team);

  return (
    <section className="mb-8 w-full max-w-7xl bg-zinc-900 border border-zinc-700 rounded-xl p-6">
      <h2 className="text-3xl font-bold text-center mb-2">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {slots.map((player, index) => {
          const role = rosterSlots[index];

          return (
            <div
              key={index}
              className="bg-zinc-950 border border-zinc-700 rounded-xl overflow-hidden min-h-[260px] flex flex-col justify-end"
            >
              {player ? (
                <>
                  <img
                    src={`/players/${getPlayerPortrait(player.name)}.webp`}
                    alt={player.name}
                    onError={e => {
                      e.currentTarget.src = "/players/default.webp";
                    }}
                    className="w-full h-48 object-cover bg-zinc-900"
                  />

                  <div className="p-4 text-center">
                    <div className="flex justify-center items-center gap-2 text-zinc-400 mb-2">
                      <img
                        src={getRoleIcon(player.role)}
                        alt={player.role}
                        className="w-5 h-5"
                      />
                      <span className="text-sm font-bold">
                        {player.role}
                      </span>
                    </div>

                    <div className="text-xl font-bold">
                      {player.name}
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-4 text-zinc-500">
                  <div className="text-5xl mb-4">+</div>

                  <div className="flex items-center gap-2">
                    <img
                      src={getRoleIcon(role)}
                      alt={role}
                      className="w-5 h-5 opacity-60"
                    />
                    <span className="font-bold">{role}</span>
                  </div>

                  <div className="text-xl mt-2">-</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}