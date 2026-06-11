"use client";

import { useEffect, useState } from "react";
import { players } from "../data/players";
import { Player } from "../types/player";
import { PlayerCard } from "../components/PlayerCard";
import { TeamLineup } from "../components/TeamLineup";
import { getRoleIcon, getTeamLogo, getMapImage } from "../lib/assets";
import {
  generateEnemyTeam,
  getTeamNames,
  simulateSeries,
  MatchResult,
} from "../lib/simulation";

export default function Home() {
  const [team, setTeam] = useState<Player[]>([]);
  const [enemyTeam, setEnemyTeam] = useState<Player[]>([]);
  const [result, setResult] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [rerollsLeft, setRerollsLeft] = useState(1);
  const [teamAppearances, setTeamAppearances] = useState<
    Record<string, number>
  >({});
  const rounds = ["Group Stage", "Quarterfinals", "Semifinals", "Grand Final"];
  const [roundIndex, setRoundIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [visibleEventCount, setVisibleEventCount] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  
  const [teamChoices, setTeamChoices] = useState<string[]>([]);
  const roleCounts = {
    Tank: team.filter(player => player.role === "Tank").length,
    DPS: team.filter(player => player.role === "DPS").length,
    Support: team.filter(player => player.role === "Support").length,
  };

  const playerChoices = selectedTeam
    ? players.filter(player => player.team === selectedTeam && canDraftPlayer(player))
    : [];

  const [showMatchIntro, setShowMatchIntro] = useState(false);
  function canDraftPlayer(player: Player) {
    if (team.some(drafted => drafted.name === player.name)) {
      return false;
    }

    if (player.role === "Tank") {
      return roleCounts.Tank < 1;
    }

    if (player.role === "DPS") {
      return roleCounts.DPS < 2;
    }

    if (player.role === "Support") {
      return roleCounts.Support < 2;
    }

    return false;
  }
  
  function weightedShuffle(teams: string[]) {
    return [...teams].sort((a, b) => {
      const aCount = teamAppearances[a] || 0;
      const bCount = teamAppearances[b] || 0;

      const aWeight = 1 / (aCount + 1);
      const bWeight = 1 / (bCount + 1);

      return Math.random() * bWeight - Math.random() * aWeight;
    });
  }

  function rollTeams() {
    const availableTeamNames = getTeamNames(players).filter(teamName =>
      players.some(
        player => player.team === teamName && canDraftPlayer(player)
      )
    );

    const shuffled = weightedShuffle(availableTeamNames);
    const selected = shuffled.slice(0, 2);

    setTeamChoices(selected);
    setTeamAppearances(prev => {
      const updated = { ...prev };
      for (const team of selected) {
        updated[team] = (updated[team] || 0) + 1;
      }

      return updated;
    });
  }

  function rerollTeams() {
    if (rerollsLeft === 0 || selectedTeam || result) {
      return;
    }

    setRerollsLeft(rerollsLeft - 1);
    rollTeams();
  }

  useEffect(() => {
    if (result || selectedTeam) {
      return;
    }

    rollTeams();
  }, [team.length, result]);

  function simulateRound(finalTeam: Player[], currentRoundIndex = roundIndex) {
    const generatedEnemyTeam = generateEnemyTeam(
      players,
      finalTeam,
      currentRoundIndex
    );

    let requiredWins = 3;
    if ( currentRoundIndex === rounds.length - 1) {
      requiredWins = 4;
    } else if (currentRoundIndex === 0) {
      requiredWins = 2;
    }
    const simulatedMatch = simulateSeries(
      finalTeam,
      generatedEnemyTeam,
      requiredWins
    );


    setEnemyTeam(generatedEnemyTeam);
    setMatchResult(simulatedMatch);
    setCurrentGameIndex(0);
    setVisibleEventCount(0);
    setGameFinished(false);
    setMessage("");
    setShowMatchIntro(true);
  }

  function draftPlayer(player: Player) {
    if (!canDraftPlayer(player)) {
      return;
    }

    const newTeam = [...team, player];

    setTeam(newTeam);
    setSelectedTeam(null);

    if (newTeam.length === 5) {
      simulateRound(newTeam);
    }
  }

  function advanceMatchLog() {
    if (!matchResult) {
      return;
    }

    const currentGame = matchResult.games[currentGameIndex];

    if (visibleEventCount < currentGame.events.length) {
      setVisibleEventCount(visibleEventCount + 1);
      return;
    }

    if (!gameFinished) {
      setGameFinished(true);
      return;
    }

    const isLastGame = currentGameIndex === matchResult.games.length - 1;

    if (!isLastGame) {
      setCurrentGameIndex(currentGameIndex + 1);
      setVisibleEventCount(0);
      setGameFinished(false);
      return;
    }

    if (!matchResult.wonMatch) {
      setResult(
        `Eliminated in ${rounds[roundIndex]} (${matchResult.wins} - ${matchResult.losses})`
      );
      return;
    }

    if (roundIndex === rounds.length - 1) {
      setResult(
        `CHAMPIONS! You won the Grand Final (${matchResult.wins} - ${matchResult.losses})`
      );
      return;
    }

    setMessage(
      `Won ${rounds[roundIndex]} (${matchResult.wins} - ${matchResult.losses})`
    );
  }

  useEffect(() => {
    if (!matchResult || message || result || showMatchIntro) {
      return;
    }

    const currentGame = matchResult.games[currentGameIndex];

    let delay = 1000;

    if (visibleEventCount >= currentGame.events.length && !gameFinished) {
      delay = 1200;
    }

    if (gameFinished) {
      delay = 1600;
    }

    const timeoutId = setTimeout(() => {
      advanceMatchLog();
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [
    matchResult,
    currentGameIndex,
    visibleEventCount,
    gameFinished,
    message,
    result,
    showMatchIntro,
  ]);

  function startMatch() {
    setShowMatchIntro(false);
  }

  function nextRound() {
    const nextIndex = roundIndex + 1;

    setRoundIndex(nextIndex);
    setEnemyTeam([]);
    setMessage("");
    setMatchResult(null);
    setCurrentGameIndex(0);
    setVisibleEventCount(0);
    setGameFinished(false);

    simulateRound(team, nextIndex);
  }

  function resetGame() {
    setTeam([]);
    setEnemyTeam([]);
    setResult("");
    setSelectedTeam(null);
    setTeamChoices([]);
    setRerollsLeft(1);
    setTeamAppearances({});
    setRoundIndex(0);
    setMessage("");
    setMatchResult(null);
    setCurrentGameIndex(0);
    setVisibleEventCount(0);
    setGameFinished(false);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8">
        OWCS Draft Mayhem
      </h1>
      {!matchResult && (
        <>
          <section className="mb-8 w-full max-w-6xl">
            <h2 className="text-2xl font-bold mb-4">Your Team</h2>
            <div className="flex flex-wrap gap-4">
              {team.map(player => (
                <PlayerCard key={player.name} player={player} onClick={() => draftPlayer(player)} />
              ))}
            </div>
          </section>
        </>
      )}
      {showMatchIntro && matchResult && (
        <section className="mt-8 mb-8 w-full max-w-7xl bg-zinc-900 border border-zinc-700 rounded-xl p-6">
          {(() => {
            const currentGame = matchResult.games[currentGameIndex];

            return (
              <div className="grid grid-cols-3 gap-8 items-start">
                <TeamLineup title="Your Team" team={team} />

                <div className="flex flex-col items-center text-center">
                  <h2 className="text-3xl font-bold mb-4">
                    {rounds[roundIndex]}
                  </h2>

                  <img
                    src={getMapImage(currentGame.mapName)}
                    alt={currentGame.mapName}
                    className="w-full max-w-[700px] aspect-video object-cover rounded-xl mb-4 border border-zinc-700"
                  />

                  <h3 className="text-2xl font-bold mb-6">
                    {currentGame.mapName}
                  </h3>

                  <div className="text-5xl font-bold text-zinc-400 mb-6">
                    VS
                  </div>

                  <button
                    onClick={startMatch}
                    className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg font-bold"
                  >
                    Start Match
                  </button>
                </div>

                <TeamLineup title="Enemy Team" team={enemyTeam} />
              </div>
            );
          })()}
        </section>
      )}

      {matchResult && !showMatchIntro && (
        <section className="mt-8 mb-8 w-full max-w-7xl bg-zinc-900 border border-zinc-700 rounded-xl p-6">
          {(() => {
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
              <div className="grid grid-cols-3 gap-8 items-start">

                {/* YOUR TEAM */}
                <TeamLineup
                  title="Your Team"
                  team={team}
                />

                {/* MATCH CENTER */}
                <div className="flex flex-col items-center text-center">

                  <h2 className="text-3xl font-bold mb-4">
                    {rounds[roundIndex]}
                  </h2>

                  <img
                    src={getMapImage(currentGame.mapName)}
                    alt={currentGame.mapName}
                    className="w-full max-w-[700px] aspect-video object-cover rounded-xl mb-4 border border-zinc-700"
                  />

                  <h3 className="text-2xl font-bold mb-2">
                    {currentGame.mapName}
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

                  {message && !result && (
                    <button
                      onClick={nextRound}
                      className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-bold"
                    >
                      Next Round
                    </button>
                  )}
                  {!message && !result && (
                    <p className="text-zinc-400 mt-2">
                      Simulating...
                    </p>
                  )}
                </div>

                {/* ENEMY TEAM */}
                <TeamLineup
                  title="Enemy Team"
                  team={enemyTeam}
                />
              </div>
            );
          })()}
        </section>
      )}
      
      {!result && team.length < 5 && (
        <section className="mb-8  w-full max-w-6xl">
          <h2 className="text-2xl font-bold mb-4">
            Pick a Team
          </h2>
          <p className="text-zinc-400 mb-4">
            Tank {roleCounts.Tank}/1 · DPS {roleCounts.DPS}/2 · Support {roleCounts.Support}/2
          </p>

          {!selectedTeam && (
            <div className="flex flex-wrap gap-4">
            {teamChoices.map(teamName => {
            const teamPlayers = players.filter(
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
                onClick={() => setSelectedTeam(null)}
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
      )}

      {message && (
        <div className="text-2xl font-bold mt-8">
          {message}
        </div>
      )}

    <div className="flex gap-4 mt-6">
      {!result &&
        !selectedTeam &&
        !matchResult &&
        !showMatchIntro && (
        <button
          onClick={rerollTeams}
          disabled={rerollsLeft === 0}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-700 disabled:text-zinc-400 px-4 py-2 rounded-lg font-bold"
        >
          Reroll ({rerollsLeft})
        </button>
      )}
      {result && (
        <div className="text-3xl font-bold mt-8">
          {result}
        </div>
      )}
    </div>
    {result && (
      <div className="flex gap-4 mt-6">
        <button
          onClick={resetGame}
          className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-bold"
        >
          New Game
        </button>
      </div>
    )}
    </main>
  );
}