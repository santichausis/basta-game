"use client";

import { useState, useEffect } from "react";

const CATEGORIES = [
  "Políticos K corruptos",
  "Políticos LLA corruptos",
  "Barrios de CABA",
  "Localidades de GBA",
  "Barrios de GBA",
  "Restaurantes / Bodegones",
  "Boliches",
  "Nombres de mujer",
  "Nombres de varón",
  "Países de América",
  "Animales",
  "Frutas y verduras",
  "Marcas de ropa",
  "Películas argentinas",
  "Artistas argentinos",
  "Equipos de fútbol",
  "Ciudades del mundo",
  "Comidas típicas argentinas",
  "Marcas de autos",
  "Series de Netflix",
  "Objetos del hogar",
  "Profesiones",
  "Países de Europa",
  "Canciones de los 90",
  "Marcas de cerveza",
];

type Votes = Record<string, { up: number; down: number }>;

export default function Home() {
  const [index, setIndex] = useState(0);
  const [votes, setVotes] = useState<Votes>({});
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("basta-votes");
    if (stored) setVotes(JSON.parse(stored));
  }, []);

  const saveVotes = (updated: Votes) => {
    setVotes(updated);
    localStorage.setItem("basta-votes", JSON.stringify(updated));
  };

  const current = CATEGORIES[index];
  const currentVotes = votes[current] ?? { up: 0, down: 0 };

  const handleVote = (type: "up" | "down") => {
    const updated = {
      ...votes,
      [current]: {
        up: currentVotes.up + (type === "up" ? 1 : 0),
        down: currentVotes.down + (type === "down" ? 1 : 0),
      },
    };
    saveVotes(updated);
    setFeedback(type);
    setTimeout(() => {
      setFeedback(null);
      setIndex((i) => (i + 1) % CATEGORIES.length);
    }, 500);
  };

  const handleNext = () => {
    setIndex((i) => (i + 1) % CATEGORIES.length);
    setFeedback(null);
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-between px-6 py-12 max-w-md mx-auto">
      {/* Header */}
      <div className="w-full text-center">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-1 font-medium">
          Basta
        </p>
        <p className="text-xs text-gray-300">
          {index + 1} / {CATEGORIES.length}
        </p>
      </div>

      {/* Category Card */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div
          className={`w-full rounded-3xl border px-8 py-14 text-center transition-all duration-300 ${
            feedback === "up"
              ? "bg-green-50 border-green-200"
              : feedback === "down"
              ? "bg-red-50 border-red-200"
              : "bg-gray-50 border-gray-100"
          }`}
        >
          <p className="text-3xl font-bold text-gray-900 leading-tight tracking-tight">
            {current}
          </p>
          {(currentVotes.up > 0 || currentVotes.down > 0) && (
            <div className="mt-6 flex justify-center gap-5 text-sm text-gray-400">
              <span>👍 {currentVotes.up}</span>
              <span>👎 {currentVotes.down}</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="w-full flex flex-col items-center gap-6">
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-gray-900 text-white text-lg font-semibold tracking-wide active:scale-95 transition-transform"
        >
          Siguiente
        </button>

        <div className="flex gap-12">
          <button
            onClick={() => handleVote("up")}
            className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
          >
            <span className="text-5xl">👍</span>
            <span className="text-xs text-gray-400 mt-1">Me gusta</span>
          </button>
          <button
            onClick={() => handleVote("down")}
            className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
          >
            <span className="text-5xl">👎</span>
            <span className="text-xs text-gray-400 mt-1">No me gusta</span>
          </button>
        </div>
      </div>
    </main>
  );
}
