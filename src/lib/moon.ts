export interface MoonInfo {
  phase: number; // 0..1
  illumination: number; // 0..1
  age: number; // days
  name: string;
  glyph: string;
}

const SYNODIC = 29.530588853;
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

const PHASES: { max: number; name: string; glyph: string }[] = [
  { max: 0.02, name: "Luna Nuova", glyph: "🌑" },
  { max: 0.24, name: "Luna Crescente", glyph: "🌒" },
  { max: 0.26, name: "Primo Quarto", glyph: "🌓" },
  { max: 0.48, name: "Gibbosa Crescente", glyph: "🌔" },
  { max: 0.52, name: "Luna Piena", glyph: "🌕" },
  { max: 0.74, name: "Gibbosa Calante", glyph: "🌖" },
  { max: 0.76, name: "Ultimo Quarto", glyph: "🌗" },
  { max: 0.98, name: "Luna Calante", glyph: "🌘" },
  { max: 1.01, name: "Luna Nuova", glyph: "🌑" },
];

export function moonAt(date: Date): MoonInfo {
  const days = (date.getTime() - KNOWN_NEW_MOON) / 86400000;
  const phase = ((days % SYNODIC) + SYNODIC) % SYNODIC / SYNODIC;
  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;
  const found = PHASES.find((p) => phase < p.max)!;
  return {
    phase,
    illumination,
    age: phase * SYNODIC,
    name: found.name,
    glyph: found.glyph,
  };
}

export function nextPhase(target: number, from = new Date()): Date {
  const step = 3600000;
  let t = from.getTime();
  for (let i = 0; i < 24 * 40; i++) {
    t += step;
    const p = moonAt(new Date(t)).phase;
    const prev = moonAt(new Date(t - step)).phase;
    if (prev < target && p >= target) return new Date(t);
    if (prev > p && target === 0) return new Date(t);
  }
  return new Date(t);
}

export const MOON_ADVICE: Record<string, string> = {
  "Luna Nuova": "Momento di semina: fissa intenzioni, inizia cicli, resta in silenzio.",
  "Luna Crescente": "Costruisci slancio: agisci sui piccoli passi, alimenta i progetti.",
  "Primo Quarto": "Prova di forza: supera l'ostacolo, correggi la rotta.",
  "Gibbosa Crescente": "Rifinisci: perfeziona ciò che hai avviato, cura i dettagli.",
  "Luna Piena": "Culmine: divinazione, ricarica di strumenti rituali, gratitudine.",
  "Gibbosa Calante": "Condividi e distribuisci ciò che hai raccolto.",
  "Ultimo Quarto": "Taglia ciò che non serve, chiudi conti aperti.",
  "Luna Calante": "Riposo e purificazione: prepara il vuoto per il nuovo ciclo.",
};
