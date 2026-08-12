export type Lang = "it" | "en" | "la";
export type L10n = Record<Lang, string>;

export interface Tradition {
  color: string;
  symbol: string;
  label: L10n;
}

export interface Holiday {
  id: string;
  month: number;
  day: number;
  year?: number;
  tradition: string;
  isMoon?: boolean;
  name: L10n;
  desc: L10n;
  celebration: L10n;
}

export declare const TRADITIONS: Record<string, Tradition>;
export declare const MOON_NAMES: L10n[];
export declare const HOLIDAYS: Holiday[];
export declare const PERSONAL_HOLIDAY: Omit<Holiday, "id" | "month" | "day">;
export declare function getFullMoons(year: number): Date[];
export declare function getMoonHolidays(year: number): Holiday[];
