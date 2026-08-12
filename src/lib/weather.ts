export interface GeoPlace {
  id: string;
  name: string;
  admin?: string;
  country?: string;
  lat: number;
  lon: number;
}

export interface WeatherNow {
  temp: number;
  apparent: number;
  humidity: number;
  wind: number;
  windDir: number;
  pressure: number;
  precip: number;
  cloud: number;
  uv: number;
  isDay: boolean;
  code: number;
  sunrise: string;
  sunset: string;
  hourly: { time: string; temp: number; code: number; precip: number }[];
  daily: { date: string; min: number; max: number; code: number; precip: number }[];
}

export async function searchPlaces(query: string, lang = "it"): Promise<GeoPlace[]> {
  if (query.trim().length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query,
  )}&count=8&language=${lang}&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("geocoding failed");
  const json = (await res.json()) as { results?: any[] };
  return (json.results ?? []).map((r) => ({
    id: String(r.id),
    name: r.name,
    admin: r.admin1,
    country: r.country,
    lat: r.latitude,
    lon: r.longitude,
  }));
}

export async function reverseGeocode(lat: number, lon: number, lang = "it"): Promise<string> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${lang}`,
    );
    const j = (await res.json()) as { city?: string; locality?: string; countryName?: string };
    return [j.city || j.locality, j.countryName].filter(Boolean).join(", ") || "Posizione attuale";
  } catch {
    return "Posizione attuale";
  }
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherNow> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    "&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,is_day,uv_index" +
    "&hourly=temperature_2m,weather_code,precipitation_probability" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset" +
    "&timezone=auto&forecast_days=7";
  const res = await fetch(url);
  if (!res.ok) throw new Error("weather failed");
  const j = (await res.json()) as any;
  const nowIdx = Math.max(
    0,
    (j.hourly.time as string[]).findIndex((t) => new Date(t).getTime() >= Date.now() - 3600_000),
  );
  return {
    temp: j.current.temperature_2m,
    apparent: j.current.apparent_temperature,
    humidity: j.current.relative_humidity_2m,
    wind: j.current.wind_speed_10m,
    windDir: j.current.wind_direction_10m,
    pressure: j.current.pressure_msl,
    precip: j.current.precipitation,
    cloud: j.current.cloud_cover,
    uv: j.current.uv_index ?? 0,
    isDay: j.current.is_day === 1,
    code: j.current.weather_code,
    sunrise: j.daily.sunrise[0],
    sunset: j.daily.sunset[0],
    hourly: (j.hourly.time as string[]).slice(nowIdx, nowIdx + 24).map((t, i) => ({
      time: t,
      temp: j.hourly.temperature_2m[nowIdx + i],
      code: j.hourly.weather_code[nowIdx + i],
      precip: j.hourly.precipitation_probability[nowIdx + i] ?? 0,
    })),
    daily: (j.daily.time as string[]).map((d, i) => ({
      date: d,
      min: j.daily.temperature_2m_min[i],
      max: j.daily.temperature_2m_max[i],
      code: j.daily.weather_code[i],
      precip: j.daily.precipitation_probability_max[i] ?? 0,
    })),
  };
}

const CODES: Record<number, { it: string; icon: string }> = {
  0: { it: "Sereno", icon: "☀" },
  1: { it: "Prevalentemente sereno", icon: "🌤" },
  2: { it: "Parzialmente nuvoloso", icon: "⛅" },
  3: { it: "Coperto", icon: "☁" },
  45: { it: "Nebbia", icon: "🌫" },
  48: { it: "Nebbia gelata", icon: "🌫" },
  51: { it: "Pioviggine debole", icon: "🌦" },
  53: { it: "Pioviggine", icon: "🌦" },
  55: { it: "Pioviggine intensa", icon: "🌦" },
  61: { it: "Pioggia debole", icon: "🌧" },
  63: { it: "Pioggia", icon: "🌧" },
  65: { it: "Pioggia forte", icon: "🌧" },
  71: { it: "Neve debole", icon: "🌨" },
  73: { it: "Neve", icon: "🌨" },
  75: { it: "Neve forte", icon: "❄" },
  77: { it: "Granelli di neve", icon: "❄" },
  80: { it: "Rovesci", icon: "🌦" },
  81: { it: "Rovesci intensi", icon: "🌧" },
  82: { it: "Rovesci violenti", icon: "⛈" },
  85: { it: "Rovesci di neve", icon: "🌨" },
  86: { it: "Forti rovesci di neve", icon: "🌨" },
  95: { it: "Temporale", icon: "⛈" },
  96: { it: "Temporale con grandine", icon: "⛈" },
  99: { it: "Temporale violento", icon: "⛈" },
};

export function describeCode(code: number) {
  return CODES[code] ?? { it: "—", icon: "•" };
}

export function windRose(deg: number) {
  const dirs = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  return dirs[Math.round(deg / 45) % 8];
}
