import { Player, Role } from "../types/player";

export const neededRoles: Role[] = [
  "Tank",
  "DPS",
  "DPS",
  "Support",
  "Support",
];

const teamTiers: Record<string, number> = {
  "Crazy Raccoon": 5,
  "ZETA DIVISION": 5,
  "Team Falcons": 5,
  "Twisted Minds": 5,

  "T1": 4,
  "Weibo Gaming": 4,
  "Dallas Fuel": 4,
  "Team Liquid": 4,
  "Virtus.pro": 4,

  "Spacestation": 3,
  "JD Gaming": 3,
  "VARREL": 3,
  "Geekay Esports": 3,
  "O2 Blast": 3,
  "ZANSIDE GAMING": 3,

  "All Gamers": 2,
  "Al Qadsiah": 2,
  "Superbad": 2,
  "Poker Face": 2,
  "Cheeseburger": 2,

  "Team Secret": 1,
  "SHENGSHI": 1,
  "Solus Victorem": 1,
  "LuneX Gaming": 1,
  "Disguised": 1,
  "1234": 1,
  "Telacity": 1,
  "The Kafe": 1,
  "Team Peps": 1,
};

export type MatchEvent = {
  text: string;
  positive: boolean;
};

export type GameResult = {
  gameNumber: number;
  mapName: string;
  won: boolean;
  yourScore: number;
  enemyScore: number;
  events: MatchEvent[];
};

export type MatchResult = {
  games: GameResult[];
  wins: number;
  losses: number;
  wonMatch: boolean;
};

const maps = [
  "Lijiang Tower",
  "King's Row",
  "Circuit Royal",
  "Esperança",
  "Suravasa",
  "Colosseo",
  "Watchpoint: Gibraltar",
  "Numbani",
  "Ilios",
];

const positiveMessages = [
  "scores an ace!",
  "successfully backcaps.",
  "wins an opening duel.",
  "lands a massive ultimate.",
  "clutches a last-fight situation.",
  "shuts down the enemy engage.",
  "simply clutches.",
  "locked in.",
  "had the better ult trade.",
  "had the press Q to win ult.",
  "decided to kill 5.",
  "made a huge opening pick.",
  "turned the entire fight around.",
  "hard carried the map.",
  "refused to lose.",
  "found a massive flank.",
  "survived with 1 HP somehow.",
  "went absolutely nuclear.",
  "made a good trade.",
  "diffed the enemy backline.",
  "forced every cooldown.",
  "saved the fight with a huge peel.",
  "hit a disgusting headshot.",
  "single-handedly won overtime.",
  "baited every ultimate.",
  "held W and won.",
  "won the a 1v3.",
  "built ult at light speed.",
  "turned on the aim assist.",
  "found the cleanest engage imaginable.",
  "made the observers lose track of the POV.",
  "remembered they are HIM.",
  "activated carry mode.",
  "farmed the enemy supports.",
  "got a 5k in overtime.",
  "forced a c9 panic touch.",
  "won the mental game.",
  "had unreal mechanics that fight.",
  "made the enemy team look lost.",
  "perfectly timed the re-engage.",
  "absolutely rolled in the neutral.",
  "won despite being down players.",
  "carried the map kicking and screaming.",
  "hard punished the enemy positioning.",
  "had a map-winning ultimate.",
  "hit a cross-map pick.",
  "made the overtime touch.",
  "won every duel that map.",
  "diffed the enemy mirror.",
  "had unreal target focus.",
  "found a fight winning boop.",
  "just wanted it more."
];

const negativeMessages = [
  "gets first-picked on last fight.",
  "whiffs a key ultimate.",
  "gets caught out of position.",
  "loses an opening duel.",
  "gets staggered before overtime.",
  "fails to touch the objective.",
  "c9's the objective.",
  "died while ulting.",
  "forgot to press Q.",
  "got a paypal notification.",
  "was staggered before final fight.",
  "used every cooldown and still died.",
  "got hard focused immediately.",
  "fed before the fight even started.",
  "walked into a widow sightline.",
  "traded their life for no reason.",
  "had a tragic overtime touch.",
  "used their ult after the fight ended.",
  "forgot about the enemy flank.",
  "missed every shot that fight.",
  "got hit by the most obvious shatter ever.",
  "died with ultimate available.",
  "got spawncamped.",
  "had zero healing output somehow.",
  "took the worst duel imaginable.",
  "was caught emoting mid-fight.",
  "lost to the environment.",
  "tried to hero play and exploded.",
  "peeked one too many times.",
  "forgot the objective existed.",
  "got anti'd and instantly evaporated.",
  "hard threw the recontest.",
  "had negative ult value.",
  "got rolled in the neutral.",
  "fed support ult charge.",
  "got pulse bombed instantly.",
  "had their backline deleted.",
  "could not survive the dive.",
  "missed the overtime touch by inches.",
  "did not kite the kitsune.",
  "tried to touch and got deleted.",
  "had a brutal C9 moment.",
  "walked into a graviton surge.",
  "was simply not him that map.",
  "got hit with the solo shatter.",
  "could not win a duel.",
  "had the supports screaming.",
  "tilted after one death.",
  "forgot to regroup.",
  "was sent back to spawn repeatedly.",
  "got cat-napped.",
  "ate a full zen volley to the face.",
  "walked straight into mines.",
  "didn't know what they were aiming at.",
  "emptied a whole clip into a wall.",
  "took tp into a pit.",
  "forgot where the health packs were.",
  "engaged the feed drive to warp speed."
];

function getRandomPlayer(team: Player[]) {
  return team[Math.floor(Math.random() * team.length)];
}

function getRandomMessage(team: Player[], positive: boolean): MatchEvent {
  const player = getRandomPlayer(team);
  const messages = positive ? positiveMessages : negativeMessages;
  const message = messages[Math.floor(Math.random() * messages.length)];

  return {
    text: `${player.name} ${message}`,
    positive,
  };
}

function getRandomMap(usedMaps: string[]) {
  const availableMaps = maps.filter(map => !usedMaps.includes(map));
  return availableMaps[Math.floor(Math.random() * availableMaps.length)];
}


export function getTeamScore(team: Player[]) {
  const baseScore = team.reduce((sum, player) => sum + player.rating, 0);
  const variance = Math.floor(Math.random() * 15);

  return baseScore + variance;
}

export function getAvailableTeams(
  availablePlayers: Player[],
  role: Role
) {
  const teams = availablePlayers
    .filter(player => player.role === role)
    .map(player => player.team);

  return [...new Set(teams)];
}

export function getTeamNames(players: Player[]) {
  return [...new Set(players.map(player => player.team))];
}

function getAllowedTiers(roundIndex: number) {
  if (roundIndex === 0) {
    return [1, 2, 3];
  }

  if (roundIndex === 1) {
    return [2, 3, 4, 5];
  } 

  return [4, 5];
}

export function generateEnemyTeam(
  allPlayers: Player[],
  yourTeam: Player[],
  roundIndex = 0
) {
  const enemyTeam: Player[] = [];
  const yourNames = yourTeam.map(player => player.name);

  const allowedTiers = getAllowedTiers(roundIndex);

  const validEnemyPlayers = allPlayers.filter(player => {
    const tier = teamTiers[player.team] || 1;

    return (
      allowedTiers.includes(tier) &&
      !yourNames.includes(player.name)
    );
  });

  for (const role of neededRoles) {
    let validPlayers = validEnemyPlayers.filter(
      player =>
        player.role === role &&
        !enemyTeam.some(enemy => enemy.name === player.name)
    );

    if (validPlayers.length === 0) {
      validPlayers = allPlayers.filter(
        player =>
          player.role === role &&
          !yourNames.includes(player.name) &&
          !enemyTeam.some(enemy => enemy.name === player.name)
      );
    }

    const randomPlayer =
      validPlayers[Math.floor(Math.random() * validPlayers.length)];

    enemyTeam.push(randomPlayer);
  }

  return enemyTeam;
}

export function simulateSeries(
  yourTeam: Player[],
  enemyTeam: Player[],
  requiredWins = 3
): MatchResult {
  const games: GameResult[] = [];
  const usedMaps: string[] = [];

  let wins = 0;
  let losses = 0;
  let yourMomentum = 0;
  let enemyMomentum = 0;

  while (wins < requiredWins && losses < requiredWins) {
    const yourMapBonus = Math.floor(Math.random() * 21) - 10;
    const enemyMapBonus = Math.floor(Math.random() * 21) - 10;

    const yourScore =
      getTeamScore(yourTeam) +
      yourMapBonus +
      yourMomentum;

    const enemyScore =
      getTeamScore(enemyTeam) +
      enemyMapBonus +
      enemyMomentum;

    const scoreDiff = yourScore - enemyScore;
    const winChance = 1 / (1 + Math.exp(-scoreDiff / 12));
    const won = Math.random() < winChance;

    if (won) {
      wins++;
      yourMomentum += 1;
      enemyMomentum = 0;
    } else {
      losses++;
      enemyMomentum += 3;
      yourMomentum = 0;
    }

    const events: MatchEvent[] = [];

    for (let i = 0; i < 2; i++) {
      const positive = Math.random() < 0.5;
      events.push(getRandomMessage(yourTeam, positive));
    }

    events.push(getRandomMessage(yourTeam, won));

    const mapName = getRandomMap(usedMaps);
    usedMaps.push(mapName);

    games.push({
      gameNumber: games.length + 1,
      mapName,
      won,
      yourScore,
      enemyScore,
      events,
    });
  }

  return {
    games,
    wins,
    losses,
    wonMatch: wins === requiredWins,
  };
}