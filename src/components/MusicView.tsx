import { useEffect, useRef, useState } from "react";
import { GENRES, searchStations, stationsByGenre, type GenreKey, type Station } from "@/lib/radio";
import { useStored } from "@/lib/storage";

export function MusicView() {
  const [genre, setGenre] = useState<GenreKey>("nordic");
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [playing, setPlaying] = useState<Station | null>(null);
  const [favs, setFavs] = useStored<Station[]>("radio:favs", []);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setQuery("");
    setLoading(true);
    setError(null);
    stationsByGenre(genre)
      .then(setStations)
      .catch(() => setError("Radio non raggiungibili. Riprova più tardi."))
      .finally(() => setLoading(false));
  }, [genre]);

  useEffect(() => () => audio.current?.pause(), []);

  const runSearch = () => {
    setLoading(true);
    setError(null);
    const p = query.trim() ? searchStations(genre, query.trim()) : stationsByGenre(genre);
    p.then(setStations)
      .catch(() => setError("Ricerca fallita."))
      .finally(() => setLoading(false));
  };

  const play = (s: Station) => {
    if (playing?.id === s.id) {
      audio.current?.pause();
      setPlaying(null);
      return;
    }
    if (!audio.current) audio.current = new Audio();
    audio.current.src = s.url;
    audio.current.play().catch(() => setError("Questa stazione non risponde."));
    setPlaying(s);
  };

  const toggleFav = (s: Station) =>
    setFavs((prev) => (prev.some((f) => f.id === s.id) ? prev.filter((f) => f.id !== s.id) : [s, ...prev]));

  return (
    <div className="space-y-4 pb-24">
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(GENRES) as GenreKey[]).map((k) => (
          <button
            key={k}
            onClick={() => setGenre(k)}
            className={`panel p-3 text-center ${genre === k ? "border-primary bg-primary/10" : ""}`}
          >
            <span className="block text-xl text-gold">{GENRES[k].glyph}</span>
            <span className="block font-display text-xs">{GENRES[k].label}</span>
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground">{GENRES[genre].hint}</p>

      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch()}
          placeholder={`Cerca in ${GENRES[genre].label}…`}
          className="h-11 flex-1 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
        />
        <button onClick={runSearch} className="h-11 rounded-lg bg-primary px-4 text-sm text-primary-foreground">
          Cerca
        </button>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Sintonizzazione…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {favs.length > 0 && (
        <section>
          <h3 className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Preferite</h3>
          <ul className="space-y-2">
            {favs.map((s) => (
              <StationRow
                key={`f-${s.id}`}
                s={s}
                playing={playing?.id === s.id}
                fav
                onPlay={() => play(s)}
                onFav={() => toggleFav(s)}
              />
            ))}
          </ul>
        </section>
      )}

      <ul className="space-y-2">
        {stations.map((s) => (
          <StationRow
            key={s.id}
            s={s}
            playing={playing?.id === s.id}
            fav={favs.some((f) => f.id === s.id)}
            onPlay={() => play(s)}
            onFav={() => toggleFav(s)}
          />
        ))}
        {!loading && !stations.length && !error && (
          <li className="panel p-6 text-center text-sm text-muted-foreground">
            Nessuna stazione trovata in questa sezione.
          </li>
        )}
      </ul>

      {playing && (
        <div className="fixed inset-x-0 bottom-16 z-40 mx-auto max-w-2xl px-3">
          <div className="panel flex items-center gap-3 p-3 shadow-lg">
            <span className="text-xl text-gold">♪</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{playing.name}</p>
              <p className="text-[11px] text-muted-foreground">In riproduzione · {playing.country}</p>
            </div>
            <button
              onClick={() => {
                audio.current?.pause();
                setPlaying(null);
              }}
              className="rounded-lg border border-border px-3 py-1 text-xs"
            >
              Stop
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StationRow({
  s,
  playing,
  fav,
  onPlay,
  onFav,
}: {
  s: Station;
  playing: boolean;
  fav: boolean;
  onPlay: () => void;
  onFav: () => void;
}) {
  return (
    <li className={`panel flex items-center gap-3 p-3 ${playing ? "border-primary" : ""}`}>
      <button
        onClick={onPlay}
        className="h-9 w-9 shrink-0 rounded-full border border-border text-sm text-gold"
        aria-label="Riproduci"
      >
        {playing ? "■" : "▶"}
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">{s.name}</p>
        <p className="truncate text-[11px] text-muted-foreground">
          {[s.country, s.bitrate ? `${s.bitrate} kbps` : null, s.tags.split(",").slice(0, 3).join(" · ")]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
      <button onClick={onFav} className={`text-lg ${fav ? "text-gold" : "text-muted-foreground"}`}>
        ★
      </button>
    </li>
  );
}
