export type MoodKey = 1 | 2 | 3 | 4 | 5;

export interface DiaryEntry {
  id: string;
  date: string; // yyyy-mm-dd
  updatedAt: number;
  text: string;
  mood: MoodKey;
  energy: number; // 1..5
  tags: string[];
}

export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
  doneAt?: number;
  due?: string;
  priority: "low" | "normal" | "high";
}

export interface Profile {
  name: string;
  birthday?: string;
  path: string; // tradizione seguita
  intention: string;
  goals: string[];
}

export interface Settings {
  lang: "it" | "en" | "la";
  theme: "dark" | "light";
  autosave: boolean;
  reminderHour: number;
  traditions: string[]; // filtro calendario, vuoto = tutte
}

export const MOODS: { key: MoodKey; glyph: string; label: string }[] = [
  { key: 1, glyph: "🌑", label: "Molto giù" },
  { key: 2, glyph: "🌒", label: "Fiacco" },
  { key: 3, glyph: "🌓", label: "Neutro" },
  { key: 4, glyph: "🌔", label: "Bene" },
  { key: 5, glyph: "🌕", label: "Radioso" },
];

export const MOOD_TAGS = [
  "riposo",
  "lavoro",
  "rituale",
  "meditazione",
  "sport",
  "socialità",
  "natura",
  "solitudine",
  "creatività",
  "stress",
  "sonno scarso",
  "alcol",
];

export const todayISO = () => new Date().toISOString().slice(0, 10);
