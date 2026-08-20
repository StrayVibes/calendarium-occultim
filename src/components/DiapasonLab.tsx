import { useEffect, useMemo, useRef, useState } from "react";
import { audioEngine, FREQ_LIBRARY, type WaveKind } from "@/lib/audio";
import { useStored } from "@/lib/storage";

const MIN_HZ = 20;
const MAX_HZ = 4000;
const RATIO = MAX_HZ / MIN_HZ;

const toHz = (t: number) => Math.round(MIN_HZ * Math.pow(RATIO, t) * 100) / 100;
const toT = (hz: number) => Math.log(hz / MIN_HZ) / Math.log(RATIO);

const WAVES: { key: WaveKind; label: string }[] = [
  { key: "sine", label: "Sine" },
  { key: "triangle", label: "Tri" },
  { key: "square", label: "Quad" },
  { key: "sawtooth", label: "Saw" },
];

interface Fork {
  id: string;
  hz: number;
  on: boolean;
  wave: WaveKind;
  level: number;
}

interface CustomFreq {
  id: string;
  hz: number;
  label: string;
}

const INITIAL: Fork[] = [
  { id: "fork-a", hz: 136.1, on: false, wave: "sine", level: 0.16 },
  { id: "fork-b", hz: 210.42, on: false, wave: "sine", level: 0.16 },
  { id: "fork-c", hz: 528, on: false, wave: "sine", level: 0.14 },
];

function Oscilloscope({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;
    const analyser = audioEngine.getAnalyser();
    const buf = new Uint8Array(analyser.fftSize);
    let raf = 0;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      const w = (canvas.width = canvas.clientWidth * 2);
      const h = (canvas.height = canvas.clientHeight * 2);
      analyser.getByteTimeDomainData(buf);
      ctx2d.clearRect(0, 0, w, h);

      // grid
      ctx2d.strokeStyle = "rgba(255,255,255,0.06)";
      ctx2d.lineWidth = 1;
      for (let i = 1; i < 6; i++) {
        const y = (h / 6) * i;
        ctx2d.beginPath();
        ctx2d.moveTo(0, y);
        ctx2d.lineTo(w, y);
        ctx2d.stroke();
      }

      const style = getComputedStyle(canvas);
      const laser = style.getPropertyValue("--laser").trim() || "#e0b25c";

      ctx2d.lineWidth = 4;
      ctx2d.strokeStyle = laser;
      ctx2d.shadowBlur = 18;
      ctx2d.shadowColor = laser;
      ctx2d.beginPath();
      for (let i = 0; i < buf.length; i++) {
        const v = (buf[i]! - 128) / 128;
        const x = (i / (buf.length - 1)) * w;
        const y = h / 2 + v * (h / 2) * 0.92;
        if (i === 0) ctx2d.moveTo(x, y);
        else ctx2d.lineTo(x, y);
      }
      ctx2d.stroke();
      ctx2d.shadowBlur = 0;
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <canvas
      ref={ref}
      className="h-32 w-full rounded-lg border border-border bg-background [--laser:var(--color-gold)]"
    />
  );
}

export function DiapasonLab() {
  const [open, setOpen] = useState(false);
  const [forks, setForks] = useState<Fork[]>(INITIAL);
  const [custom, setCustom] = useStored<CustomFreq[]>("meditation:customFreqs", []);
  const [target, setTarget] = useState<string>("fork-a");
  const [newHz, setNewHz] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [group, setGroup] = useState(FREQ_LIBRARY[0]!.group);

  useEffect(() => {
    if (!open) forks.forEach((f) => audioEngine.stopSlot(f.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => () => INITIAL.forEach((f) => audioEngine.stopSlot(f.id)), []);

  const update = (id: string, patch: Partial<Fork>) =>
    setForks((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const next = { ...f, ...patch };
        if (next.on) audioEngine.setSlot(next.id, next.hz, next.wave, next.level);
        else audioEngine.stopSlot(next.id);
        return next;
      }),
    );

  const activeForks = forks.filter((f) => f.on);
  const beat = useMemo(() => {
    if (activeForks.length < 2) return null;
    const [a, b] = activeForks;
    return Math.abs((a!.hz - b!.hz)).toFixed(2);
  }, [activeForks]);

  const items = FREQ_LIBRARY.find((g) => g.group === group)?.items ?? [];

  const ForkSlider = ({ fork, tall }: { fork: Fork; tall?: boolean }) => (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => update(fork.id, { on: !fork.on })}
        className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-widest ${
          fork.on ? "border-gold text-gold glyph-glow" : "border-border text-muted-foreground"
        }`}
      >
        {fork.id === "fork-a" ? "I" : fork.id === "fork-b" ? "II" : "III"}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.0005}
        value={toT(fork.hz)}
        onChange={(e) => update(fork.id, { hz: toHz(Number(e.target.value)) })}
        style={{ writingMode: "vertical-lr", direction: "rtl" }}
        className={`${tall ? "h-24" : "h-40"} accent-[var(--color-primary)]`}
      />
      <span className="font-display text-xs text-gold">{fork.hz} Hz</span>
      <select
        value={fork.wave}
        onChange={(e) => update(fork.id, { wave: e.target.value as WaveKind })}
        className="rounded border border-border bg-background px-1 py-0.5 text-[10px] text-muted-foreground"
      >
        {WAVES.map((w) => (
          <option key={w.key} value={w.key}>
            {w.label}
          </option>
        ))}
      </select>
      <input
        type="range"
        min={0}
        max={0.4}
        step={0.005}
        value={fork.level}
        onChange={(e) => update(fork.id, { level: Number(e.target.value) })}
        className="w-16 accent-[var(--color-primary)]"
      />
    </div>
  );

  return (
    <section className="panel overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <span>
          <span className="block font-display text-sm text-gold">Laboratorio diapason</span>
          <span className="block text-xs text-muted-foreground">
            Tre diapason modulabili + oscilloscopio laser
          </span>
        </span>
        <span className="text-gold">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="space-y-4 border-t border-border p-4">
          <Oscilloscope active={open} />

          <div className="flex flex-col items-center gap-4">
            <ForkSlider fork={forks[2]!} tall />
            <div className="flex items-end justify-center gap-10">
              <ForkSlider fork={forks[0]!} />
              <ForkSlider fork={forks[1]!} />
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            {activeForks.length === 0
              ? "Accendi i diapason: si sommano ai toni delle rune attive."
              : beat
                ? `Battimento fra i primi due attivi: ${beat} Hz`
                : `${activeForks.length} diapason attivo`}
          </p>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Invia frequenza al diapason
            </p>
            <div className="flex gap-2">
              {forks.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => setTarget(f.id)}
                  className={`flex-1 rounded-lg border py-1 text-xs ${
                    target === f.id ? "border-gold text-gold" : "border-border text-muted-foreground"
                  }`}
                >
                  {["I", "II", "III"][i]}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {FREQ_LIBRARY.map((g) => (
                <button
                  key={g.group}
                  onClick={() => setGroup(g.group)}
                  className={`rounded-full border px-2 py-1 text-[10px] ${
                    group === g.group
                      ? "border-gold text-gold"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {g.group}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {items.map((it) => (
                <button
                  key={`${it.label}-${it.hz}`}
                  onClick={() => update(target, { hz: it.hz, on: true })}
                  className="rounded-lg border border-border p-2 text-left"
                >
                  <span className="block text-xs text-gold">{it.label}</span>
                  <span className="block text-[10px] text-muted-foreground">
                    {it.hz} Hz{it.note ? ` · ${it.note}` : ""}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Frequenze personali
            </p>
            <div className="flex gap-2">
              <input
                className="input"
                placeholder="Hz (es. 111.5)"
                inputMode="decimal"
                value={newHz}
                onChange={(e) => setNewHz(e.target.value)}
              />
              <input
                className="input"
                placeholder="Nome"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
              <button
                onClick={() => {
                  const hz = Number(newHz.replace(",", "."));
                  if (!hz || hz < 1 || hz > 20000) return;
                  setCustom((prev) => [
                    { id: crypto.randomUUID(), hz, label: newLabel.trim() || `${hz} Hz` },
                    ...prev,
                  ]);
                  setNewHz("");
                  setNewLabel("");
                }}
                className="rounded-lg bg-primary px-3 text-sm text-primary-foreground"
              >
                +
              </button>
            </div>
            {custom.length === 0 ? (
              <p className="text-[11px] text-muted-foreground">
                Crea le tue frequenze: restano salvate sul dispositivo.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {custom.map((c) => (
                  <span
                    key={c.id}
                    className="flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs"
                  >
                    <button onClick={() => update(target, { hz: c.hz, on: true })} className="text-gold">
                      {c.label} · {c.hz} Hz
                    </button>
                    <button
                      onClick={() => setCustom((prev) => prev.filter((x) => x.id !== c.id))}
                      className="text-muted-foreground"
                      aria-label={`Elimina ${c.label}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              forks.forEach((f) => audioEngine.stopSlot(f.id));
              setForks((prev) => prev.map((f) => ({ ...f, on: false })));
            }}
            className="w-full rounded-lg border border-border py-2 text-xs"
          >
            Spegni i diapason
          </button>
        </div>
      )}
    </section>
  );
}
