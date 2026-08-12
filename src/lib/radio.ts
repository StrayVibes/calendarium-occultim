export interface Station {
  id: string;
  name: string;
  url: string;
  favicon: string;
  country: string;
  tags: string;
  bitrate: number;
}

const BASES = [
  "https://de1.api.radio-browser.info",
  "https://fi1.api.radio-browser.info",
  "https://nl1.api.radio-browser.info",
];

export const GENRES = {
  nordic: {
    label: "Nordic",
    glyph: "ᚱ",
    tags: ["nordic", "viking", "folk", "celtic", "medieval", "pagan"],
    hint: "Folk nordico, viking e pagan music",
  },
  tribe: {
    label: "Tribe",
    glyph: "☾",
    tags: ["tribal", "shamanic", "ethnic", "world", "drums", "didgeridoo"],
    hint: "Percussioni tribali, sciamanico, world",
  },
  psy: {
    label: "Psy Ambient",
    glyph: "◉",
    tags: ["psychedelic", "psybient", "ambient", "goa", "chillout", "downtempo"],
    hint: "Ambient psichedelico, psybient, chill",
  },
} as const;

export type GenreKey = keyof typeof GENRES;

async function call(path: string): Promise<any[]> {
  let lastErr: unknown;
  for (const base of BASES) {
    try {
      const res = await fetch(`${base}${path}`, { headers: { Accept: "application/json" } });
      if (res.ok) return (await res.json()) as any[];
      lastErr = new Error(String(res.status));
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("radio unavailable");
}

function map(rows: any[]): Station[] {
  const seen = new Set<string>();
  return rows
    .filter((r) => r.url_resolved && !seen.has(r.name) && seen.add(r.name))
    .map((r) => ({
      id: r.stationuuid as string,
      name: (r.name as string).trim(),
      url: r.url_resolved as string,
      favicon: r.favicon as string,
      country: r.country as string,
      tags: r.tags as string,
      bitrate: r.bitrate as number,
    }));
}

/** Stations for a genre section — strictly filtered on that genre's tags. */
export async function stationsByGenre(genre: GenreKey): Promise<Station[]> {
  const lists = await Promise.all(
    GENRES[genre].tags.map((tag) =>
      call(
        `/json/stations/bytagexact/${encodeURIComponent(tag)}?hidebroken=true&order=clickcount&reverse=true&limit=30`,
      ).catch(() => []),
    ),
  );
  return map(lists.flat()).slice(0, 60);
}

/** Free-text search, still constrained to the section's genre tags. */
export async function searchStations(genre: GenreKey, query: string): Promise<Station[]> {
  const rows = await call(
    `/json/stations/search?name=${encodeURIComponent(query)}&hidebroken=true&order=clickcount&reverse=true&limit=120`,
  );
  const tags = GENRES[genre].tags;
  const filtered = rows.filter((r) => {
    const hay = `${r.tags ?? ""} ${r.name ?? ""}`.toLowerCase();
    return tags.some((t) => hay.includes(t));
  });
  return map(filtered.length ? filtered : []).slice(0, 60);
}
