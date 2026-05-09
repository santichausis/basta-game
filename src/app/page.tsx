"use client";

import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

const ALL_CATEGORIES = [
  // Pedidas
  "Políticos K corruptos",
  "Políticos LLA corruptos",
  "Barrios de CABA",
  "Localidades de GBA",
  "Barrios de GBA",
  "Restaurantes / Bodegones",
  "Boliches",
  // Geo & mundo
  "Países de América",
  "Países de Europa",
  "Ciudades del mundo",
  "Capitales del mundo",
  // Nombres
  "Nombres de mujer",
  "Nombres de varón",
  "Apodos / Sobrenombres",
  // Entretenimiento
  "Series de streaming",
  "Películas argentinas",
  "Películas de los 90",
  "Artistas argentinos",
  "Bandas de rock nacional",
  "Canciones de los 90",
  "Canciones de los 2000",
  "Videojuegos de la infancia",
  "Personajes de dibujitos animados",
  // Comida & bebida
  "Comidas típicas argentinas",
  "Marcas de cerveza",
  "Vinos argentinos",
  "Aperitivos / Tragos",
  "Marcas de gaseosas",
  // Deporte
  "Equipos de fútbol argentinos",
  "Jugadores de fútbol históricos",
  "Deportistas argentinos",
  // Marcas & consumo
  "Marcas de ropa",
  "Marcas de autos",
  "Marcas de zapatillas",
  "Juguetes de los 90",
  // Naturaleza
  "Animales",
  "Frutas y verduras",
  // Laburo & vida
  "Profesiones",
  "Objetos del hogar",
  "Lugares para veranear en Argentina",
  "Programas de TV argentinos",
  // Humor argentino
  "Cosas que te dicen en un asado",
  "Excusas para no ir al gimnasio",
  "Apodos de jugadores de fútbol",
  "Insultos / Puteadas argentinas",
  "Cosas que dice una abuela argentina",
  // Pop culture
  "Villanos de películas",
  "Series / Películas de Netflix",
  "Influencers / Youtubers",
  "Canciones de reggaetón",
  // Creativas
  "Cosas que encontrás debajo de la cama",
  "Equipos de fútbol del interior del país",
  "Palabras en lunfardo",
];

const TEAM_COLORS = [
  { btn: "bg-blue-600",    flash: "bg-blue-100 border-blue-300",   label: "text-blue-600" },
  { btn: "bg-rose-500",    flash: "bg-rose-100 border-rose-300",    label: "text-rose-500" },
  { btn: "bg-emerald-500", flash: "bg-emerald-100 border-emerald-300", label: "text-emerald-500" },
  { btn: "bg-amber-500",   flash: "bg-amber-100 border-amber-300",  label: "text-amber-500" },
];

const TEAM_EMOJIS = [
  "🔥","⚡","🦁","🐯","🦊","🐺","🦅","🦈","🐉","🌊",
  "💪","⭐","🎯","🚀","👑","🎮","💎","🍀","🌙","🏴‍☠️",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "setup" | "game" | "end";

interface Team {
  name: string;
  emoji: string;
  score: number;
  scoreKey: number; // increments to re-trigger pop animation
}

const DEFAULT_TEAMS: Team[] = [
  { name: "", emoji: "🔥", score: 0, scoreKey: 0 },
  { name: "", emoji: "⚡", score: 0, scoreKey: 0 },
];

export default function Home() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS);
  const [deck, setDeck] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [flashIndex, setFlashIndex] = useState<number | null>(null);
  const confettiInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (confettiInterval.current) clearInterval(confettiInterval.current); };
  }, []);

  /* ── helpers ── */
  const updateTeam = (i: number, patch: Partial<Team>) =>
    setTeams((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));

  const addTeam = () => {
    if (teams.length >= 4) return;
    const usedEmojis = teams.map((t) => t.emoji);
    const nextEmoji = TEAM_EMOJIS.find((e) => !usedEmojis.includes(e)) ?? "🎯";
    setTeams((prev) => [...prev, { name: "", emoji: nextEmoji, score: 0, scoreKey: 0 }]);
  };

  const removeTeam = (i: number) => {
    if (teams.length <= 2) return;
    setTeams((prev) => prev.filter((_, idx) => idx !== i));
  };

  const canStart = teams.every((t) => t.name.trim().length > 0);

  const startGame = () => {
    if (!canStart) return;
    setDeck(shuffle(ALL_CATEGORIES));
    setIndex(0);
    setTeams((prev) => prev.map((t) => ({ ...t, score: 0, scoreKey: 0 })));
    setPhase("game");
  };

  const addPoint = (teamIndex: number) => {
    setTeams((prev) =>
      prev.map((t, i) =>
        i === teamIndex ? { ...t, score: t.score + 1, scoreKey: t.scoreKey + 1 } : t
      )
    );
    setFlashIndex(teamIndex);
    setTimeout(() => setFlashIndex(null), 600);
    goNext();
  };

  const goNext = () => {
    const nextIndex = index + 1;
    if (nextIndex >= deck.length) {
      setPhase("end");
      launchConfetti();
    } else {
      setIndex(nextIndex);
    }
  };

  const launchConfetti = () => {
    const end = Date.now() + 4000;
    confettiInterval.current = setInterval(() => {
      if (Date.now() > end) { clearInterval(confettiInterval.current!); return; }
      confetti({ particleCount: 60, angle: 60,  spread: 55, origin: { x: 0 }, colors: ["#f59e0b","#3b82f6","#10b981","#ef4444","#8b5cf6"] });
      confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#f59e0b","#3b82f6","#10b981","#ef4444","#8b5cf6"] });
    }, 300);
  };

  const resetGame = () => {
    if (confettiInterval.current) clearInterval(confettiInterval.current);
    setPhase("setup");
    setTeams((prev) => prev.map((t) => ({ ...t, score: 0, scoreKey: 0 })));
    setIndex(0);
  };

  /* ══════════════════════════════════════════
     SETUP SCREEN
  ══════════════════════════════════════════ */
  if (phase === "setup") {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Basta</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">¿Quiénes juegan?</h1>

        <div className="w-full flex flex-col gap-5 mb-6">
          {teams.map((team, i) => (
            <div key={i} className="flex flex-col gap-2">
              {/* label + remove */}
              <div className="flex items-center justify-between">
                <label className={`text-xs font-semibold uppercase tracking-wider ${TEAM_COLORS[i].label}`}>
                  Equipo {i + 1}
                </label>
                {i >= 2 && (
                  <button onClick={() => removeTeam(i)} className="text-xs text-gray-400 hover:text-red-400 transition-colors">
                    Eliminar
                  </button>
                )}
              </div>

              {/* name input */}
              <input
                type="text"
                value={team.name}
                onChange={(e) => updateTeam(i, { name: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && startGame()}
                placeholder="Nombre del equipo..."
                maxLength={24}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-lg font-semibold text-gray-900 placeholder-gray-300 outline-none focus:border-gray-400 transition-colors"
              />

              {/* emoji picker */}
              <div className="flex flex-wrap gap-1.5">
                {TEAM_EMOJIS.map((emoji) => {
                  const takenByOther = teams.some((t, ti) => ti !== i && t.emoji === emoji);
                  return (
                    <button
                      key={emoji}
                      onClick={() => !takenByOther && updateTeam(i, { emoji })}
                      disabled={takenByOther}
                      className={`text-xl w-9 h-9 rounded-xl flex items-center justify-center transition-all
                        ${team.emoji === emoji
                          ? "bg-gray-900 scale-110 shadow-sm"
                          : takenByOther
                          ? "opacity-20 cursor-not-allowed"
                          : "bg-gray-100 hover:bg-gray-200 active:scale-95"
                        }`}
                    >
                      {emoji}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {teams.length < 4 && (
          <button
            onClick={addTeam}
            className="w-full py-3 rounded-2xl border border-dashed border-gray-300 text-gray-400 text-sm font-semibold tracking-wide hover:border-gray-400 hover:text-gray-500 transition-colors mb-6"
          >
            + Agregar equipo
          </button>
        )}

        <button
          onClick={startGame}
          disabled={!canStart}
          className="w-full py-4 rounded-2xl bg-gray-900 text-white text-lg font-semibold tracking-wide active:scale-95 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Empezar
        </button>
      </main>
    );
  }

  /* ══════════════════════════════════════════
     END SCREEN
  ══════════════════════════════════════════ */
  if (phase === "end") {
    const sorted = [...teams].sort((a, b) => b.score - a.score);
    const topScore = sorted[0].score;
    const winners = sorted.filter((t) => t.score === topScore);
    const tie = winners.length > 1;

    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto text-center">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-medium">Fin del juego</p>

        {tie ? (
          <>
            <p className="text-6xl mb-4 animate-trophy inline-block">🤝</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-1 tracking-tight">¡Empate!</h1>
            <p className="text-lg text-gray-500 mb-1">{winners.map((w) => `${w.emoji} ${w.name}`).join(" y ")}</p>
            <p className="text-xl text-gray-400 mb-8">{topScore} puntos</p>
          </>
        ) : (
          <>
            <p className="text-7xl mb-2 animate-trophy inline-block">🏆</p>
            <p className="text-4xl mb-1">{sorted[0].emoji}</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-1 tracking-tight">{sorted[0].name}</h1>
            <p className="text-xl text-gray-400 mb-8">{topScore} puntos</p>
          </>
        )}

        {/* Ranking */}
        <div className="w-full flex flex-col gap-2 mb-8">
          {sorted.map((team, i) => {
            const originalIndex = teams.findIndex((t) => t.name === team.name && t.emoji === team.emoji);
            const medals = ["🥇", "🥈", "🥉", "4️⃣"];
            return (
              <div key={i} className="flex items-center justify-between px-5 py-3 rounded-2xl bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{medals[i]}</span>
                  <span className="text-lg">{team.emoji}</span>
                  <span className={`text-base font-semibold ${TEAM_COLORS[originalIndex].label}`}>
                    {team.name}
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900">{team.score}</span>
              </div>
            );
          })}
        </div>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => {
              setDeck(shuffle(ALL_CATEGORIES));
              setIndex(0);
              setTeams((prev) => prev.map((t) => ({ ...t, score: 0, scoreKey: 0 })));
              setPhase("game");
            }}
            className="w-full py-4 rounded-2xl bg-gray-900 text-white text-lg font-semibold tracking-wide active:scale-95 transition-transform"
          >
            Jugar de nuevo
          </button>
          <button
            onClick={resetGame}
            className="w-full py-4 rounded-2xl border border-gray-200 text-gray-500 text-lg font-semibold tracking-wide active:scale-95 transition-transform"
          >
            Cambiar equipos
          </button>
        </div>
      </main>
    );
  }

  /* ══════════════════════════════════════════
     GAME SCREEN
  ══════════════════════════════════════════ */
  const current = deck[index] ?? "";
  const progress = ((index + 1) / deck.length) * 100;

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-between px-6 py-10 max-w-md mx-auto">

      {/* Scoreboard */}
      <div className="w-full grid gap-2" style={{ gridTemplateColumns: `repeat(${teams.length}, 1fr)` }}>
        {teams.map((team, i) => (
          <div
            key={i}
            className={`rounded-2xl px-3 py-3 text-center transition-all duration-300 border-2 ${
              flashIndex === i ? TEAM_COLORS[i].flash : "bg-gray-50 border-transparent"
            }`}
          >
            <p className="text-base mb-0.5">{team.emoji}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 truncate">{team.name}</p>
            {/* key changes on each point → remount → animation re-fires */}
            <p
              key={team.scoreKey}
              className={`text-4xl font-bold text-gray-900 mt-0.5 ${team.scoreKey > 0 ? "animate-score-pop" : ""}`}
            >
              {team.score}
            </p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full mt-3">
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-900 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-300 text-center mt-1">
          {index + 1} / {deck.length}
        </p>
      </div>

      {/* Category card — key=index causes remount → slide-in animation */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div
          key={index}
          className="animate-card-in w-full rounded-3xl border bg-gray-50 border-gray-100 px-8 py-14 text-center"
        >
          <p className="text-3xl font-bold text-gray-900 leading-tight tracking-tight">
            {current}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          {teams.map((team, i) => (
            <button
              key={i}
              onClick={() => addPoint(i)}
              className={`py-4 rounded-2xl text-white text-sm font-semibold tracking-wide active:scale-95 transition-transform ${TEAM_COLORS[i].btn}`}
            >
              {team.emoji} +1 {team.name}
            </button>
          ))}
        </div>
        <button
          onClick={goNext}
          className="w-full py-3.5 rounded-2xl border border-gray-200 text-gray-500 text-base font-semibold tracking-wide active:scale-95 transition-transform"
        >
          Omitir
        </button>
      </div>
    </main>
  );
}
