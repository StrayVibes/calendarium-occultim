import { useEffect, useMemo, useRef, useState } from "react";
import {
  describeCode,
  fetchWeather,
  reverseGeocode,
  searchPlaces,
  windRose,
  type GeoPlace,
  type WeatherNow,
} from "@/lib/weather";
import { useStored } from "@/lib/storage";

interface SavedPlace extends GeoPlace {
  auto?: boolean;
}

export function WeatherView() {
  const [place, setPlace] = useStored<SavedPlace | null>("weather:place", null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoPlace[]>([]);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<WeatherNow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    debounce.current = setTimeout(() => {
      searchPlaces(query)
        .then(setSuggestions)
        .catch(() => setSuggestions([]));
    }, 250);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [query]);

  useEffect(() => {
    if (!place) return;
    setLoading(true);
    setError(null);
    fetchWeather(place.lat, place.lon)
      .then(setData)
      .catch(() => setError("Impossibile caricare il meteo. Verifica la connessione."))
      .finally(() => setLoading(false));
  }, [place]);

  const locate = () => {
    if (!("geolocation" in navigator)) {
      setError("Geolocalizzazione non disponibile su questo dispositivo.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const name = await reverseGeocode(latitude, longitude);
        setPlace({ id: "auto", name, lat: latitude, lon: longitude, auto: true });
      },
      () => {
        setLoading(false);
        setError("Permesso di posizione negato. Cerca la città manualmente.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  };

  useEffect(() => {
    if (!place) locate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const desc = data ? describeCode(data.code) : null;
  const hours = useMemo(() => data?.hourly.slice(0, 12) ?? [], [data]);

  return (
    <div className="space-y-4 pb-4">
      <div className="relative">
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Cerca una città…"
            className="h-11 flex-1 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
          />
          <button
            onClick={locate}
            aria-label="Usa la mia posizione"
            className="h-11 w-11 shrink-0 rounded-lg border border-border bg-card text-lg text-gold"
          >
            ⌖
          </button>
        </div>
        {open && suggestions.length > 0 && (
          <ul className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
            {suggestions.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => {
                    setPlace(s);
                    setQuery("");
                    setOpen(false);
                    setSuggestions([]);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
                >
                  <span className="text-foreground">{s.name}</span>{" "}
                  <span className="text-muted-foreground">
                    {[s.admin, s.country].filter(Boolean).join(", ")}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {loading && <p className="text-sm text-muted-foreground">Consultazione dei venti…</p>}

      {place && data && desc && (
        <>
          <section className="panel star-field p-5 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {place.name}
              {place.auto ? " · posizione precisa" : ""}
            </p>
            <div className="mt-2 text-6xl">{desc.icon}</div>
            <p className="mt-1 font-display text-5xl text-gold">{Math.round(data.temp)}°</p>
            <p className="text-sm text-muted-foreground">{desc.it}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Percepita {Math.round(data.apparent)}° · Min {Math.round(data.daily[0].min)}° / Max{" "}
              {Math.round(data.daily[0].max)}°
            </p>
          </section>

          <section className="grid grid-cols-3 gap-2">
            {[
              ["Umidità", `${data.humidity}%`],
              ["Vento", `${Math.round(data.wind)} km/h ${windRose(data.windDir)}`],
              ["Pressione", `${Math.round(data.pressure)} hPa`],
              ["Nuvole", `${data.cloud}%`],
              ["UV", `${Math.round(data.uv)}`],
              ["Pioggia", `${data.precip} mm`],
              ["Alba", data.sunrise.slice(11, 16)],
              ["Tramonto", data.sunset.slice(11, 16)],
              ["Fase", data.isDay ? "Giorno" : "Notte"],
            ].map(([k, v]) => (
              <div key={k} className="panel px-2 py-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</p>
                <p className="mt-1 text-sm text-foreground">{v}</p>
              </div>
            ))}
          </section>

          <section className="panel p-3">
            <h3 className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
              Prossime ore
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {hours.map((h) => (
                <div key={h.time} className="min-w-14 text-center">
                  <p className="text-xs text-muted-foreground">{h.time.slice(11, 16)}</p>
                  <p className="text-xl">{describeCode(h.code).icon}</p>
                  <p className="text-sm">{Math.round(h.temp)}°</p>
                  <p className="text-[10px] text-muted-foreground">{h.precip}%</p>
                </div>
              ))}
            </div>
          </section>

          <section className="panel p-3">
            <h3 className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
              7 giorni
            </h3>
            <ul className="space-y-1">
              {data.daily.map((d) => (
                <li key={d.date} className="flex items-center gap-3 text-sm">
                  <span className="w-16 text-muted-foreground">
                    {new Date(d.date).toLocaleDateString("it-IT", {
                      weekday: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-lg">{describeCode(d.code).icon}</span>
                  <span className="flex-1 text-xs text-muted-foreground">{describeCode(d.code).it}</span>
                  <span className="text-xs text-muted-foreground">{d.precip}%</span>
                  <span className="w-16 text-right">
                    {Math.round(d.min)}° / <span className="text-gold">{Math.round(d.max)}°</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
