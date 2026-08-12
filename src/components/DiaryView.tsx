import { useEffect, useMemo, useState } from "react";
import { useStored } from "@/lib/storage";
import { MOODS, MOOD_TAGS, todayISO, type DiaryEntry, type MoodKey } from "@/lib/types";
import { moonAt } from "@/lib/moon";

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

export function DiaryView() {
  const [entries, setEntries] = useStored<DiaryEntry[]>("diary", []);
  const [date, setDate] = useState(todayISO());
  const [tab, setTab] = useState<"scrivi" | "storico" | "overview">("scrivi");

  const current = entries.find((e) => e.date === date);
  const [text, setText] = useState("");
  const [mood, setMood] = useState<MoodKey>(3);
  const [energy, setEnergy] = useState(3);
  const [tags, setTags] = useState<string[]>([]);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setText(current?.text ?? "");
    setMood(current?.mood ?? 3);
    setEnergy(current?.energy ?? 3);
    setTags(current?.tags ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  // salvataggio automatico (debounce 700ms)
  useEffect(() => {
    const has = text.trim() || tags.length || current;
    if (!has) return;
    const t = setTimeout(() => {
      setEntries((prev) => {
        const rest = prev.filter((e) => e.date !== date);
        return [
          ...rest,
          {
            id: date,
            date,
            updatedAt: Date.now(),
            text,
            mood,
            energy,
            tags,
          },
        ].sort((a, b) => b.date.localeCompare(a.date));
      });
      setSavedAt(Date.now());
    }, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, mood, energy, tags, date]);

  return (
    <div className="space-y-4 pb-4">
      <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
        {(["scrivi", "storico", "overview"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-md px-2 py-2 text-xs uppercase tracking-widest ${
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "scrivi" && (
        <section className="panel space-y-4 p-4">
          <div className="flex items-center justify-between gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
            <span className="text-xs text-muted-foreground">
              {moonAt(new Date(date)).glyph} {moonAt(new Date(date)).name}
            </span>
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Umore</p>
            <div className="flex justify-between gap-1">
              {MOODS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMood(m.key)}
                  className={`flex-1 rounded-lg border py-2 text-2xl ${
                    mood === m.key ? "border-primary bg-primary/15" : "border-border"
                  }`}
                  title={m.label}
                >
                  {m.glyph}
                </button>
              ))}
            </div>
            <p className="mt-1 text-center text-xs text-muted-foreground">
              {MOODS.find((m) => m.key === mood)?.label}
            </p>
          </div>

          <div>
            <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">
              Energia · {energy}/5
            </p>
            <input
              type="range"
              min={1}
              max={5}
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              className="w-full accent-[var(--color-primary)]"
            />
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Fattori</p>
            <div className="flex flex-wrap gap-2">
              {MOOD_TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() =>
                    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
                  }
                  className={`rounded-full border px-3 py-1 text-xs ${
                    tags.includes(t) ? "border-gold text-gold" : "border-border text-muted-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Cosa è successo oggi? Cosa hai sentito?"
            className="w-full resize-y rounded-lg border border-border bg-background p-3 text-sm outline-none focus:border-primary"
          />
          <p className="text-right text-xs text-muted-foreground">
            {savedAt ? `Salvato automaticamente ${new Date(savedAt).toLocaleTimeString("it-IT")}` : "Salvataggio automatico attivo"}
          </p>
        </section>
      )}

      {tab === "storico" && <History entries={entries} onOpen={(d) => { setDate(d); setTab("scrivi"); }} onDelete={(d) => setEntries((p) => p.filter((e) => e.date !== d))} />}
      {tab === "overview" && <Overview entries={entries} />}
    </div>
  );
}

function History({
  entries,
  onOpen,
  onDelete,
}: {
  entries: DiaryEntry[];
  onOpen: (d: string) => void;
  onDelete: (d: string) => void;
}) {
  const [q, setQ] = useState("");
  const list = entries.filter(
    (e) => e.text.toLowerCase().includes(q.toLowerCase()) || e.tags.join(" ").includes(q.toLowerCase()),
  );
  if (!entries.length)
    return <p className="panel p-6 text-center text-sm text-muted-foreground">Nessuna nota ancora.</p>;
  return (
    <div className="space-y-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Cerca nel diario…"
        className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
      />
      {list.map((e) => (
        <article key={e.id} className="panel p-3">
          <div className="flex items-center justify-between">
            <button onClick={() => onOpen(e.date)} className="font-display text-sm text-gold">
              {new Date(e.date).toLocaleDateString("it-IT", { dateStyle: "full" })}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-lg">{MOODS.find((m) => m.key === e.mood)?.glyph}</span>
              <button onClick={() => onDelete(e.date)} className="text-xs text-muted-foreground">
                ✕
              </button>
            </div>
          </div>
          {e.text && <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{e.text}</p>}
          {e.tags.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">{e.tags.join(" · ")}</p>
          )}
        </article>
      ))}
    </div>
  );
}

function Overview({ entries }: { entries: DiaryEntry[] }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const ofYear = useMemo(
    () => entries.filter((e) => e.date.startsWith(String(year))),
    [entries, year],
  );

  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, m) => {
        const list = ofYear.filter((e) => Number(e.date.slice(5, 7)) === m + 1);
        return { m, count: list.length, mood: avg(list.map((e) => e.mood)), energy: avg(list.map((e) => e.energy)) };
      }),
    [ofYear],
  );

  const overall = avg(ofYear.map((e) => e.mood));
  const half = Math.floor(ofYear.length / 2);
  const sorted = [...ofYear].sort((a, b) => a.date.localeCompare(b.date));
  const firstHalf = avg(sorted.slice(0, half).map((e) => e.mood));
  const secondHalf = avg(sorted.slice(half).map((e) => e.mood));
  const trend = secondHalf - firstHalf;

  const tagStats = useMemo(() => {
    const map = new Map<string, number[]>();
    ofYear.forEach((e) => e.tags.forEach((t) => map.set(t, [...(map.get(t) ?? []), e.mood])));
    return [...map.entries()]
      .filter(([, v]) => v.length >= 2)
      .map(([tag, v]) => ({ tag, mood: avg(v), n: v.length }))
      .sort((a, b) => b.mood - a.mood);
  }, [ofYear]);

  const best = tagStats.slice(0, 3);
  const worst = [...tagStats].reverse().slice(0, 3);

  const weekday = useMemo(() => {
    const map = new Map<number, number[]>();
    ofYear.forEach((e) => {
      const d = new Date(e.date).getDay();
      map.set(d, [...(map.get(d) ?? []), e.mood]);
    });
    return [...map.entries()].map(([d, v]) => ({ d, mood: avg(v) })).sort((a, b) => b.mood - a.mood);
  }, [ofYear]);

  const dayNames = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];

  if (!ofYear.length)
    return (
      <div className="panel p-6 text-center text-sm text-muted-foreground">
        Scrivi qualche nota e qui comparirà il tuo quadro annuale.
      </div>
    );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={() => setYear((y) => y - 1)} className="px-3 text-gold">
          ‹
        </button>
        <h3 className="font-display text-lg">Anno {year}</h3>
        <button onClick={() => setYear((y) => y + 1)} className="px-3 text-gold">
          ›
        </button>
      </div>

      <section className="panel grid grid-cols-3 gap-2 p-4 text-center">
        <div>
          <p className="font-display text-2xl text-gold">{ofYear.length}</p>
          <p className="text-[10px] uppercase text-muted-foreground">Giorni annotati</p>
        </div>
        <div>
          <p className="font-display text-2xl text-gold">{overall.toFixed(1)}</p>
          <p className="text-[10px] uppercase text-muted-foreground">Umore medio</p>
        </div>
        <div>
          <p className="font-display text-2xl text-gold">
            {trend >= 0 ? "+" : ""}
            {trend.toFixed(1)}
          </p>
          <p className="text-[10px] uppercase text-muted-foreground">Tendenza</p>
        </div>
      </section>

      <section className="panel p-4">
        <h4 className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
          Andamento mensile
        </h4>
        <div className="flex h-32 items-end gap-1">
          {months.map((m) => (
            <div key={m.m} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-primary/70"
                style={{ height: `${(m.mood / 5) * 100}%`, minHeight: m.count ? 4 : 0 }}
                title={`${m.mood.toFixed(1)} · ${m.count} note`}
              />
              <span className="text-[9px] text-muted-foreground">
                {new Date(2000, m.m, 1).toLocaleDateString("it-IT", { month: "narrow" })}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel space-y-2 p-4">
        <h4 className="text-xs uppercase tracking-widest text-muted-foreground">
          Cosa ti fa stare bene
        </h4>
        {best.length ? (
          best.map((t) => (
            <div key={t.tag} className="flex justify-between text-sm">
              <span className="text-gold">{t.tag}</span>
              <span className="text-muted-foreground">
                umore {t.mood.toFixed(1)} · {t.n} volte
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Servono più note con i fattori selezionati.</p>
        )}
        <h4 className="pt-2 text-xs uppercase tracking-widest text-muted-foreground">
          Cosa ti pesa
        </h4>
        {worst.map((t) => (
          <div key={t.tag} className="flex justify-between text-sm">
            <span className="text-destructive">{t.tag}</span>
            <span className="text-muted-foreground">
              umore {t.mood.toFixed(1)} · {t.n} volte
            </span>
          </div>
        ))}
      </section>

      <section className="panel space-y-2 p-4">
        <h4 className="text-xs uppercase tracking-widest text-muted-foreground">Come migliorarti</h4>
        <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
          {best[0] && (
            <li>
              Ripeti più spesso <span className="text-gold">{best[0].tag}</span>: nei giorni in cui
              compare il tuo umore sale a {best[0].mood.toFixed(1)}.
            </li>
          )}
          {worst[0] && worst[0].mood < overall && (
            <li>
              Riduci o gestisci <span className="text-destructive">{worst[0].tag}</span>: abbassa la
              media di {(overall - worst[0].mood).toFixed(1)} punti.
            </li>
          )}
          {weekday[0] && (
            <li>
              Il tuo giorno migliore è <span className="text-gold">{dayNames[weekday[0].d]}</span>
              {weekday[weekday.length - 1] && (
                <>
                  , il più duro {dayNames[weekday[weekday.length - 1]!.d]}: pianifica lì riposo o
                  meditazione.
                </>
              )}
            </li>
          )}
          <li>
            {trend > 0.2
              ? `Sei migliorato: nella seconda metà dell'anno la media è salita di ${trend.toFixed(1)}.`
              : trend < -0.2
                ? `La seconda metà è più pesante (${trend.toFixed(1)}): torna alle abitudini della prima parte dell'anno.`
                : "Il tuo umore è stabile: prova a introdurre una nuova abitudine e misurala qui."}
          </li>
          <li>
            Hai annotato {ofYear.length} giorni su 365 ({Math.round((ofYear.length / 365) * 100)}%):
            più costanza = analisi più precisa.
          </li>
        </ul>
      </section>
    </div>
  );
}
