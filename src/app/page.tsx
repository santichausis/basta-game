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
  {
    btn: "bg-blue-600",
    flash: "bg-blue-100 border-blue-300",
    label: "text-blue-600",
  },
  {
    btn: "bg-rose-500",
    flash: "bg-rose-100 border-rose-300",
    label: "text-rose-500",
  },
  {
    btn: "bg-emerald-500",
    flash: "bg-emerald-100 border-emerald-300",
    label: "text-emerald-500",
  },
  {
    btn: "bg-amber-500",
    flash: "bg-amber-100 border-amber-300",
    label: "text-amber-500",
  },
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
  score: number;
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [teams, setTeams] = useState<Team[]>([
    { name: "", score: 0 },
    { name: "", score: 0 },
  ]);
  const [deck, setDeck] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [flashIndex, setFlashIndex] = useState<number | null>(null);
  const confettiInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (confettiInterval.current) clearInterval(confettiInterval.current);
    };
  }, []);

  const updateTeamName = (i: number, name: string) => {
    setTeams((prev) => prev.map((t, idx) => (idx === i ? { ...t, name } : t)));
  };

  const addTeam = () => {
    if (teams.length >= 4) return;
    setTeams((prev) => [...prev, { name: "", score: 0 }]);
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
    setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
    setPhase("game");
  };

  const addPoint = (teamIndex: number) => {
    setTeams((prev) =>
      prev.map((t, i) => (i === teamIndex ? { ...t, score: t.score + 1 } : t))
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
    const duration = 4000;
    const end = Date.now() + duration;
    confettiInterval.current = setInterval(() => {
      if (Date.now() > end) {
        if (confettiInterval.current) clearInterval(confettiInterval.current);
        return;
      }
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6"],
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6"],
      });
    }, 300);
  };

  const resetGame = () => {
    setPhase("setup");
    setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
    setIndex(0);
    if (confettiInterval.current) clearInterval(confettiInterval.current);
  };

  // ── Setup screen ────────────────────────────────────────────────────────────
  if (phase === "setup") {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">
          Basta
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
          ¿Quiénes juegan?
        </h1>

        <div className="w-full flex flex-col gap-3 mb-6">
          {teams.map((team, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label
                  className={`text-xs font-semibold uppercase tracking-wider ${TEAM_COLORS[i].label}`}
                >
                  Equipo {i + 1}
                </label>
                {i >= 2 && (
                  <button
                    onClick={() => removeTeam(i)}
                    className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Eliminar
                  </button>
                )}
              </div>
              <input
                type="text"
                value={team.name}
                onChange={(e) => updateTeamName(i, e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && startGame()}
                placeholder="Nombre del equipo..."
                maxLength={24}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-lg font-semibold text-gray-900 placeholder-gray-300 outline-none focus:border-gray-400 transition-colors"
              />
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

  // ── End screen ──────────────────────────────────────────────────────────────
  if (phase === "end") {
    const sorted = [...teams].sort((a, b) => b.score - a.score);
    const topScore = sorted[0].score;
    const winners = sorted.filter((t) => t.score === topScore);
    const tie = winners.length > 1;

    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto text-center">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-medium">
          Fin del juego
        </p>

        {tie ? (
          <>
            <p className="text-6xl mb-4">🤝</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-1 tracking-tight">
              ¡Empate!
            </h1>
            <p className="text-lg text-gray-500 mb-2">
              {winners.map((w) => w.name).join(" y ")}
            </p>
            <p className="text-xl text-gray-400 mb-8">{topScore} puntos</p>
          </>
        ) : (
          <>
            <p className="text-6xl mb-4">🏆</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-1 tracking-tight">
              {sorted[0].name}
            </h1>
            <p className="text-xl text-gray-400 mb-8">{topScore} puntos</p>
          </>
        )}

        {/* Ranking */}
        <div className="w-full flex flex-col gap-2 mb-8">
          {sorted.map((team, i) => {
            const originalIndex = teams.findIndex((t) => t.name === team.name);
            return (
              <div
                key={i}
                className="flex items-center justify-between px-5 py-3 rounded-2xl bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 font-semibold w-4">
                    {i + 1}
                  </span>
                  <span
                    className={`text-base font-semibold ${TEAM_COLORS[originalIndex].label}`}
                  >
                    {team.name}
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {team.score}
                </span>
              </div>
            );
          })}
        </div>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => {
              setDeck(shuffle(ALL_CATEGORIES));
              setIndex(0);
              setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
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

  // ── Game screen ─────────────────────────────────────────────────────────────
  const current = deck[index] ?? "";

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-between px-6 py-10 max-w-md mx-auto">
      {/* Header: scores */}
      <div className="w-full grid gap-2" style={{ gridTemplateColumns: `repeat(${teams.length}, 1fr)` }}>
        {teams.map((team, i) => (
          <div
            key={i}
            className={`rounded-2xl px-3 py-3 text-center transition-all duration-300 border-2 ${
              flashIndex === i
                ? TEAM_COLORS[i].flash
                : "bg-gray-50 border-transparent"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 truncate">
              {team.name}
            </p>
            <p className="text-4xl font-bold text-gray-900 mt-0.5">
              {team.score}
            </p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <p className="text-xs text-gray-300 mt-2">
        {index + 1} / {deck.length}
      </p>

      {/* Category Card */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="w-full rounded-3xl border bg-gray-50 border-gray-100 px-8 py-14 text-center">
          <p className="text-3xl font-bold text-gray-900 leading-tight tracking-tight">
            {current}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full flex flex-col gap-3">
        {/* Team score buttons — 2 per row */}
        <div className="grid grid-cols-2 gap-3">
          {teams.map((team, i) => (
            <button
              key={i}
              onClick={() => addPoint(i)}
              className={`py-4 rounded-2xl text-white text-sm font-semibold tracking-wide active:scale-95 transition-transform ${TEAM_COLORS[i].btn}`}
            >
              +1 {team.name}
            </button>
          ))}
        </div>

        {/* Skip */}
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
