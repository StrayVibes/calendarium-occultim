import { useCallback, useEffect, useState } from "react";

const PREFIX = "calocc:";

export function readStore<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStore<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* quota */
  }
}

/** Persisted state. Hydration-safe: reads storage after mount. */
export function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(readStore<T>(key, initial));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (hydrated) writeStore(key, value);
  }, [key, value, hydrated]);

  const reset = useCallback(() => setValue(initial), [initial]);

  return [value, setValue, hydrated, reset] as const;
}

export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}
