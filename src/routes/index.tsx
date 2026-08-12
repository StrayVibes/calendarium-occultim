import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useStored, useHydrated } from "@/lib/storage";
import type { Profile, Settings } from "@/lib/types";
import { Onboarding } from "@/components/Onboarding";
import { CalendarView } from "@/components/CalendarView";
import { MoonView } from "@/components/MoonView";
import { WeatherView } from "@/components/WeatherView";
import { DiaryView } from "@/components/DiaryView";
import { TasksView } from "@/components/TasksView";
import { MeditationView } from "@/components/MeditationView";
import { MusicView } from "@/components/MusicView";
import { SettingsView } from "@/components/SettingsView";
import { moonAt } from "@/lib/moon";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Calendarium Occultum — Calendario esoterico, lune e diario" },
      {
        name: "description",
        content:
          "Calendario esoterico multi-tradizione con fasi lunari, meteo in tempo reale, diario dell'umore, task, meditazione runica e radio nordica, tribale e psichedelica.",
      },
      { property: "og:title", content: "Calendarium Occultum — Calendario esoterico, lune e diario" },
      {
        property: "og:description",
        content:
          "Calendario esoterico multi-tradizione con fasi lunari, meteo in tempo reale, diario dell'umore, task, meditazione runica e radio nordica, tribale e psichedelica.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0a0a0e" },
    ],
  }),
  component: App,
});

const TABS = [
  { key: "calendario", glyph: "☿", label: "Calendario" },
  { key: "lune", glyph: "☾", label: "Lune" },
  { key: "meteo", glyph: "☁", label: "Meteo" },
  { key: "diario", glyph: "✒", label: "Diario" },
  { key: "task", glyph: "✓", label: "Task" },
  { key: "medita", glyph: "ᛜ", label: "Medita" },
  { key: "musica", glyph: "♪", label: "Musica" },
  { key: "impostazioni", glyph: "⚙", label: "Setup" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const DEFAULT_PROFILE: Profile = { name: "", path: "", intention: "", goals: [] };
const DEFAULT_SETTINGS: Settings = {
  lang: "it",
  theme: "dark",
  autosave: true,
  reminderHour: 21,
  traditions: [],
};

function App() {
  const hydrated = useHydrated();
  const [tab, setTab] = useState<TabKey>("calendario");
  const [onboarded, setOnboarded] = useStored("onboarded", false);
  const [profile, setProfile] = useStored<Profile>("profile", DEFAULT_PROFILE);
  const [settings, setSettings] = useStored<Settings>("settings", DEFAULT_SETTINGS);

  useEffect(() => {
    document.documentElement.classList.toggle("theme-light", settings.theme === "light");
  }, [settings.theme]);

  const moon = moonAt(new Date());

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
        <span className="text-2xl text-gold glyph-glow">☿</span>
        <div className="flex-1">
          <h1 className="font-display text-base leading-tight">Calendarium Occultum</h1>
          <p className="text-[11px] text-muted-foreground">
            {moon.glyph} {moon.name} · {new Date().toLocaleDateString("it-IT", { dateStyle: "long" })}
          </p>
        </div>
        <span className="text-xs text-muted-foreground">{profile.name}</span>
      </header>

      <main className="flex-1 px-3 py-4">
        {tab === "calendario" && (
          <CalendarView lang={settings.lang} activeTraditions={settings.traditions} />
        )}
        {tab === "lune" && <MoonView lang={settings.lang} />}
        {tab === "meteo" && <WeatherView />}
        {tab === "diario" && <DiaryView />}
        {tab === "task" && <TasksView />}
        {tab === "medita" && <MeditationView />}
        {tab === "musica" && <MusicView />}
        {tab === "impostazioni" && (
          <SettingsView
            profile={profile}
            setProfile={setProfile}
            settings={settings}
            setSettings={setSettings}
            onRestartOnboarding={() => setOnboarded(false)}
          />
        )}
      </main>

      <nav className="sticky bottom-0 z-40 grid grid-cols-8 border-t border-border bg-background/95 backdrop-blur">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex flex-col items-center gap-0.5 py-2 text-[9px] ${
              tab === t.key ? "text-gold" : "text-muted-foreground"
            }`}
          >
            <span className="text-lg leading-none">{t.glyph}</span>
            {t.label}
          </button>
        ))}
      </nav>

      {hydrated && !onboarded && (
        <Onboarding
          profile={profile}
          setProfile={setProfile}
          settings={settings}
          setSettings={setSettings}
          onDone={() => setOnboarded(true)}
        />
      )}
    </div>
  );
}
