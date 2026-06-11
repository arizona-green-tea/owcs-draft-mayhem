import { Player } from "../types/player";

export function getRoleIcon(role: Player["role"]) {
  if (role === "Tank") {
    return "/roles/tank.png";
  }

  if (role === "DPS") {
    return "/roles/dps.png";
  }

  return "/roles/support.png";
}

export function getTeamLogo(team: string) {
  return `/logos/${team
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, "-")}.png`;
}

export function getPlayerPortrait(playerName: string) {
  return playerName
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, "-");
}

export function getMapImage(mapName: string) {
  return `/maps/${mapName
    .toLowerCase()
    .replace(/:/g, "")
    .replace(/'/g, "")
    .replace(/ç/g, "c")
    .replace(/\s+/g, "-")}.jpg`;
}