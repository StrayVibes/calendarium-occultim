import { useMemo, useState } from "react";
import { HOLIDAYS, TRADITIONS, getMoonHolidays, PERSONAL_HOLIDAY } from "@/data/holidays";
import type { Holiday, Lang } from "@/data/holidays";
import { moonAt } from "@/lib/moon";

const MONTHS_IT = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];
const WEEKDAYS = ["L", "M", "M", "G", "V", "S", "D"];

export function CalendarView({
  lang,
  activeTraditions,
}: {
  lang: Lang;
  activeTraditions: string[];
}) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Holiday | null>(null);
  const [mode, setMode] = useState<"griglia" | "elenco">("griglia");

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const all = useMemo<Holiday[]>(() => {
    const list = [...HOLIDAYS, ...getMoonHolidays(year)];
    return activeTraditions.length
      ? list.filter((h) => activeTraditions.includes(h.tradition))
      : list;
  }, [year, activeTraditions]);

  const ofMonth = useMemo(
    () => all.filter((h) => h.month === month + 1).sort((a, b) => a.day - b.day),
    [all, month],
  );

  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const shift = (delta: number) => setCursor(new Date(year, month + delta, 1));

  return (
    <div className="space-y-4 pb-4">
      <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
        {(["griglia", "elenco"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-md py-2 text-xs uppercase tracking-widest ${
              mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={() => shift(-1)} className="px-3 text-2xl text-gold">
          ‹
        </button>
        <h2 className="font-display text-lg">
          {MONTHS_IT[month]} {year}
        </h2>
        <button onClick={() => shift(1)} className="px-3 text-2xl text-gold">
          ›
        </button>
      </div>

      {mode === "griglia" ? (
        <div className="panel p-2">
          <div className="grid grid-cols-7 pb-1">
            {WEEKDAYS.map((w, i) => (
              <span key={i} className="text-center text-[10px] uppercase text-muted-foreground">
                {w}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (d === null) return <span key={`e${i}`} />;
              const items = ofMonth.filter((h) => h.day === d);
              const isToday =
                d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              return (
                <button
                  key={d}
                  onClick={() => items[0] && setSelected(items[0])}
                  className={`flex aspect-square flex-col items-center justify-center rounded-md border text-xs ${
                    isToday ? "border-gold" : "border-transparent"
                  } ${items.length ? "bg-secondary" : ""}`}
                >
                  <span className={isToday ? "text-gold" : ""}>{d}</span>
                  <span className="flex gap-0.5">
                    {items.slice(0, 3).map((h) => (
                      <span
                        key={h.id}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: TRADITIONS[h.tradition]?.color }}
                      />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <section className="space-y-2">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
          Ricorrenze di {MONTHS_IT[month]}
        </h3>
        {ofMonth.map((h) => (
          <button
            key={h.id}
            onClick={() => setSelected(h)}
            className="panel flex w-full items-center gap-3 p-3 text-left"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg"
              style={{
                color: TRADITIONS[h.tradition]?.color,
                backgroundColor: `color-mix(in oklch, ${TRADITIONS[h.tradition]?.color} 18%, transparent)`,
              }}
            >
              {TRADITIONS[h.tradition]?.symbol}
            </span>
            <span className="flex-1">
              <span className="block font-display text-sm text-foreground">{h.name[lang]}</span>
              <span className="block text-[11px] text-muted-foreground">
                {h.day} {MONTHS_IT[month]} · {TRADITIONS[h.tradition]?.label[lang]}
              </span>
            </span>
          </button>
        ))}
        {!ofMonth.length && (
          <p className="panel p-6 text-center text-sm text-muted-foreground">
            Nessuna ricorrenza con i filtri attuali.
          </p>
        )}
      </section>

      <section className="panel p-4">
        <h3 className="mb-1 font-display text-sm text-gold">
          {PERSONAL_HOLIDAY.name[lang]} {moonAt(new Date()).glyph}
        </h3>
        <p className="text-xs text-muted-foreground">{PERSONAL_HOLIDAY.desc[lang]}</p>
      </section>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-3 backdrop-blur"
          onClick={() => setSelected(null)}
        >
          <div
            className="panel max-h-[80vh] w-full max-w-lg overflow-y-auto p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest" style={{ color: TRADITIONS[selected.tradition]?.color }}>
                  {TRADITIONS[selected.tradition]?.label[lang]}
                </p>
                <h3 className="font-display text-xl text-gold">{selected.name[lang]}</h3>
                <p className="text-xs text-muted-foreground">
                  {selected.day} {MONTHS_IT[selected.month - 1]}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground">
                ✕
              </button>
            </div>
            <p className="mt-4 text-sm leading-relaxed">{selected.desc[lang]}</p>
            <h4 className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
              Come si celebra
            </h4>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {selected.celebration[lang]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
