import { useEffect, useRef, useState } from "react";
import { audioEngine, RUNES, SOLFEGGIO, type NoiseKind } from "@/lib/audio";
import { useStored } from "@/lib/storage";

interface Session {
  id: string;
  at: number;
  minutes: number;
  kind: string;
}

const PRESETS: { key: NoiseKind; label: string; desc: string }[] = [
  { key: "white", label: "Rumore bianco", desc: "Maschera i suoni, focus assoluto" },
  { key: "pink", label: "Rumore rosa", desc: "Morbido, per il sonno" },
  { key: "brown", label: "Rumore bruno", desc: "Profondo, come un tuono lontano" },
];

const GUIDED = [
  { m: 5, label: "Respiro breve", desc: "5 min · centratura rapida" },
  { m: 10, label: "Radicamento", desc: "10 min · Yggdrasil, radici e terra" },
  { m: 20, label: "Trance runica", desc: "20 min · canto interiore della runa" },
  { m: 30, label: "Notte profonda", desc: "30 min · rilascio totale" },
];

export function MeditationView() {
  const [noise, setNoise] = useState<NoiseKind | null>(null);
  const [tones, setTones] = useState<number[]>([]);
  const [volume, setVolume] = useState(0.6);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [minutes, setMinutes] = useState(10);
  const [sessions, setSessions] = useStored<Session[]>("meditation:sessions", []);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => audioEngine.stopAll(), []);

  useEffect(() => {
    audioEngine.setVolume(volume);
  }, [volume]);

  const finish = (completed: boolean) => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setRunning(false);
    setRemaining(0);
    audioEngine.stopAll();
    setNoise(null);
    setTones([]);
    if (completed) {
      setSessions((prev) => [
        { id: crypto.randomUUID(), at: Date.now(), minutes, kind: noise ?? "silenzio" },
        ...prev,
      ]);
    }
  };

  const start = (m: number) => {
    setMinutes(m);
    setRemaining(m * 60);
    setRunning(true);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          finish(true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  };

  const totalMin = sessions.reduce((a, s) => a + s.minutes, 0);

  return (
    <div className="space-y-4 pb-4">
      <section className="panel star-field p-6 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Sessione</p>
        <p className="my-2 font-display text-5xl text-gold">
          {String(Math.floor(remaining / 60)).padStart(2, "0")}:
          {String(remaining % 60).padStart(2, "0")}
        </p>
        <div className="flex justify-center gap-2">
          {running ? (
            <button
              onClick={() => finish(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm"
            >
              Interrompi
            </button>
          ) : (
            <button
              onClick={() => start(minutes)}
              className="rounded-lg bg-primary px-5 py-2 text-sm text-primary-foreground"
            >
              Inizia {minutes} min
            </button>
          )}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {sessions.length} sessioni · {totalMin} minuti totali
        </p>
      </section>

      <section className="grid grid-cols-2 gap-2">
        {GUIDED.map((g) => (
          <button
            key={g.m}
            onClick={() => start(g.m)}
            className={`panel p-3 text-left ${minutes === g.m ? "border-primary" : ""}`}
          >
            <p className="font-display text-sm text-gold">{g.label}</p>
            <p className="text-xs text-muted-foreground">{g.desc}</p>
          </button>
        ))}
      </section>

      <section className="panel space-y-3 p-4">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground">Suoni bianchi</h3>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              onClick={() => {
                if (noise === p.key) {
                  audioEngine.stopNoise();
                  setNoise(null);
                } else {
                  audioEngine.startNoise(p.key);
                  setNoise(p.key);
                }
              }}
              className={`rounded-lg border p-2 text-xs ${
                noise === p.key ? "border-gold text-gold" : "border-border text-muted-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {PRESETS.find((p) => p.key === noise)?.desc ?? "Seleziona una texture sonora."}
        </p>
        <div>
          <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Volume</p>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full accent-[var(--color-primary)]"
          />
        </div>
      </section>

      <section className="panel space-y-3 p-4">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
          Frequenze delle rune
        </h3>
        <p className="text-xs text-muted-foreground">
          Tocca una runa per attivarne il tono continuo. Puoi sovrapporne più di una.
        </p>
        <div className="grid grid-cols-4 gap-2">
          {RUNES.map((r) => {
            const active = tones.includes(r.hz);
            return (
              <button
                key={r.name}
                onClick={() => {
                  const on = audioEngine.toggleTone(r.hz);
                  setTones((prev) => (on ? [...prev, r.hz] : prev.filter((h) => h !== r.hz)));
                }}
                className={`rounded-lg border p-2 text-center ${
                  active ? "border-gold bg-gold/10" : "border-border"
                }`}
                title={`${r.name} — ${r.meaning}`}
              >
                <span className={`block text-xl ${active ? "text-gold glyph-glow" : ""}`}>
                  {r.glyph}
                </span>
                <span className="block text-[9px] text-muted-foreground">{r.name}</span>
                <span className="block text-[9px] text-muted-foreground">{r.hz}Hz</span>
              </button>
            );
          })}
        </div>
        {tones.length > 0 && (
          <button
            onClick={() => {
              tones.forEach((h) => audioEngine.stopTone(h));
              setTones([]);
            }}
            className="w-full rounded-lg border border-border py-2 text-xs"
          >
            Silenzia tutti i toni
          </button>
        )}
      </section>

      <section className="panel space-y-2 p-4">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
          Frequenze solfeggio
        </h3>
        <div className="flex flex-wrap gap-2">
          {SOLFEGGIO.map((hz) => {
            const active = tones.includes(hz);
            return (
              <button
                key={hz}
                onClick={() => {
                  const on = audioEngine.toggleTone(hz);
                  setTones((prev) => (on ? [...prev, hz] : prev.filter((h) => h !== hz)));
                }}
                className={`rounded-full border px-3 py-1 text-xs ${
                  active ? "border-gold text-gold" : "border-border text-muted-foreground"
                }`}
              >
                {hz} Hz
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
