import { useMemo } from "react";
import { moonAt, nextPhase, MOON_ADVICE } from "@/lib/moon";
import { getFullMoons, MOON_NAMES } from "@/data/holidays";
import type { Lang } from "@/data/holidays";

export function MoonView({ lang }: { lang: Lang }) {
  const now = new Date();
  const info = moonAt(now);
  const year = now.getFullYear();

  const upcoming = useMemo(() => {
    const list = [...getFullMoons(year), ...getFullMoons(year + 1)]
      .filter((d) => d.getTime() >= now.getTime() - 86400000)
      .slice(0, 8);
    const seen: Record<number, number> = {};
    return list.map((d) => {
      const m = d.getUTCMonth();
      seen[m] = (seen[m] ?? 0) + 1;
      const nameSet = MOON_NAMES[m];
      return { date: d, name: seen[m] === 2 ? "Luna Blu" : (nameSet ? nameSet[lang] : "Luna Piena") };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, lang]);

  const nextFull = nextPhase(0.5);
  const nextNew = nextPhase(0.999);

  const cycle = Array.from({ length: 15 }, (_, i) => {
    const d = new Date(now.getTime() + (i - 3) * 86400000);
    return { d, info: moonAt(d) };
  });

  return (
    <div className="space-y-4 pb-4">
      <section className="panel star-field p-6 text-center">
        <div className="text-7xl">{info.glyph}</div>
        <h2 className="mt-2 font-display text-2xl text-gold">{info.name}</h2>
        <p className="text-sm text-muted-foreground">
          Illuminazione {Math.round(info.illumination * 100)}% · età {info.age.toFixed(1)} giorni
        </p>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed">{MOON_ADVICE[info.name]}</p>
      </section>

      <section className="grid grid-cols-2 gap-2">
        <div className="panel p-4 text-center">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Prossima piena</p>
          <p className="mt-1 text-2xl">🌕</p>
          <p className="text-sm">{nextFull.toLocaleDateString("it-IT", { dateStyle: "medium" })}</p>
        </div>
        <div className="panel p-4 text-center">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Prossima nuova</p>
          <p className="mt-1 text-2xl">🌑</p>
          <p className="text-sm">{nextNew.toLocaleDateString("it-IT", { dateStyle: "medium" })}</p>
        </div>
      </section>

      <section className="panel p-3">
        <h3 className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Ciclo attuale</h3>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {cycle.map(({ d, info: i }) => (
            <div key={d.toISOString()} className="min-w-12 text-center">
              <p className="text-[10px] text-muted-foreground">
                {d.toLocaleDateString("it-IT", { day: "numeric", month: "short" })}
              </p>
              <p className="text-2xl">{i.glyph}</p>
              <p className="text-[10px] text-muted-foreground">{Math.round(i.illumination * 100)}%</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-4">
        <h3 className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
          Prossime lune piene
        </h3>
        <ul className="space-y-2">
          {upcoming.map((m) => (
            <li key={m.date.toISOString()} className="flex items-center justify-between text-sm">
              <span className="text-gold">🌕 {m.name}</span>
              <span className="text-muted-foreground">
                {m.date.toLocaleDateString("it-IT", { dateStyle: "medium" })}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel space-y-2 p-4 text-sm text-muted-foreground">
        <h3 className="text-xs uppercase tracking-widest">Pratica lunare</h3>
        <p>
          Esponi rune, tarocchi, cristalli e pendoli alla luce della luna piena dalla sera fino
          all'alba per ricaricarli. Accendi una candela bianca o argentata e lascia un bicchiere
          d'acqua sotto la luna, da bere il giorno dopo.
        </p>
      </section>
    </div>
  );
}
