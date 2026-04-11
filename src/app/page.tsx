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
type ScoreFlash = "team1" | "team2" | null;

export default function Home() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [team1Name, setTeam1Name] = useState("");
  const [team2Name, setTeam2Name] = useState("");
  const [deck, setDeck] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [flash, setFlash] = useState<ScoreFlash>(null);
  const confettiInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (confettiInterval.current) clearInterval(confettiInterval.current);
    };
  }, []);

  const startGame = () => {
    if (!team1Name.trim() || !team2Name.trim()) return;
    setDeck(shuffle(ALL_CATEGORIES));
    setIndex(0);
    setScore1(0);
    setScore2(0);
    setPhase("game");
  };

  const addPoint = (team: 1 | 2) => {
    if (team === 1) setScore1((s) => s + 1);
    else setScore2((s) => s + 1);
    setFlash(team === 1 ? "team1" : "team2");
    setTimeout(() => setFlash(null), 600);
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
    setTeam1Name("");
    setTeam2Name("");
    setScore1(0);
    setScore2(0);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-10 tracking-tight">
          ¿Quiénes juegan?
        </h1>

        <div className="w-full flex flex-col gap-4 mb-10">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Equipo 1
            </label>
            <input
              type="text"
              value={team1Name}
              onChange={(e) => setTeam1Name(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && startGame()}
              placeholder="Nombre del equipo..."
              maxLength={24}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-lg font-semibold text-gray-900 placeholder-gray-300 outline-none focus:border-gray-400 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Equipo 2
            </label>
            <input
              type="text"
              value={team2Name}
              onChange={(e) => setTeam2Name(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && startGame()}
              placeholder="Nombre del equipo..."
              maxLength={24}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-lg font-semibold text-gray-900 placeholder-gray-300 outline-none focus:border-gray-400 transition-colors"
            />
          </div>
        </div>

        <button
          onClick={startGame}
          disabled={!team1Name.trim() || !team2Name.trim()}
          className="w-full py-4 rounded-2xl bg-gray-900 text-white text-lg font-semibold tracking-wide active:scale-95 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Empezar
        </button>
      </main>
    );
  }

  // ── End screen ──────────────────────────────────────────────────────────────
  if (phase === "end") {
    const tie = score1 === score2;
    const winner = score1 > score2 ? team1Name : team2Name;
    const winnerScore = score1 > score2 ? score1 : score2;
    const loserScore = score1 > score2 ? score2 : score1;

    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto text-center">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-medium">
          Fin del juego
        </p>

        {tie ? (
          <>
            <p className="text-6xl mb-4">🤝</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              ¡Empate!
            </h1>
            <p className="text-xl text-gray-500 mb-8">
              {score1} – {score2}
            </p>
          </>
        ) : (
          <>
            <p className="text-6xl mb-4">🏆</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              {winner}
            </h1>
            <p className="text-xl text-gray-500 mb-8">
              {winnerScore} – {loserScore}
            </p>
          </>
        )}

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => {
              setDeck(shuffle(ALL_CATEGORIES));
              setIndex(0);
              setScore1(0);
              setScore2(0);
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
      <div className="w-full flex items-center justify-between gap-4">
        <div
          className={`flex-1 rounded-2xl px-4 py-3 text-center transition-all duration-300 ${
            flash === "team1"
              ? "bg-blue-100 border-2 border-blue-300"
              : "bg-gray-50 border-2 border-transparent"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 truncate">
            {team1Name}
          </p>
          <p className="text-4xl font-bold text-gray-900 mt-0.5">{score1}</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-xs uppercase tracking-widest text-gray-300 font-medium">
            Basta
          </p>
          <p className="text-xs text-gray-300 mt-0.5">
            {index + 1}/{deck.length}
          </p>
        </div>

        <div
          className={`flex-1 rounded-2xl px-4 py-3 text-center transition-all duration-300 ${
            flash === "team2"
              ? "bg-rose-100 border-2 border-rose-300"
              : "bg-gray-50 border-2 border-transparent"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 truncate">
            {team2Name}
          </p>
          <p className="text-4xl font-bold text-gray-900 mt-0.5">{score2}</p>
        </div>
      </div>

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
        {/* Team score buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => addPoint(1)}
            className="flex-1 py-4 rounded-2xl bg-blue-600 text-white text-base font-semibold tracking-wide active:scale-95 transition-transform"
          >
            +1 {team1Name}
          </button>
          <button
            onClick={() => addPoint(2)}
            className="flex-1 py-4 rounded-2xl bg-rose-500 text-white text-base font-semibold tracking-wide active:scale-95 transition-transform"
          >
            +1 {team2Name}
          </button>
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
