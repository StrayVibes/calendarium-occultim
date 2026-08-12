import { TRADITIONS } from "@/data/holidays";
import type { Profile, Settings, DiaryEntry, Task } from "@/lib/types";
import { readStore } from "@/lib/storage";

export function SettingsView({
  profile,
  setProfile,
  settings,
  setSettings,
  onRestartOnboarding,
}: {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  onRestartOnboarding: () => void;
}) {
  const entries = readStore<DiaryEntry[]>("diary", []);
  const tasks = readStore<Task[]>("tasks", []);

  const exportData = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            profile,
            settings,
            diary: entries,
            tasks,
            exportedAt: new Date().toISOString(),
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `calendarium-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (data.profile) window.localStorage.setItem("calocc:profile", JSON.stringify(data.profile));
        if (data.settings) window.localStorage.setItem("calocc:settings", JSON.stringify(data.settings));
        if (data.diary) window.localStorage.setItem("calocc:diary", JSON.stringify(data.diary));
        if (data.tasks) window.localStorage.setItem("calocc:tasks", JSON.stringify(data.tasks));
        window.location.reload();
      } catch {
        alert("File di backup non valido.");
      }
    };
    reader.readAsText(file);
  };

  const toggleTradition = (key: string) =>
    setSettings((s) => ({
      ...s,
      traditions: s.traditions.includes(key)
        ? s.traditions.filter((t) => t !== key)
        : [...s.traditions, key],
    }));

  const doneTasks = tasks.filter((t) => t.done).length;
  const streak = computeStreak(entries);

  return (
    <div className="space-y-4 pb-4">
      <section className="panel space-y-3 p-4">
        <h3 className="font-display text-sm text-gold">Profilo di crescita personale</h3>
        <label className="block">
          <span className="label">Nome</span>
          <input
            className="input"
            value={profile.name}
            onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
          />
        </label>
        <label className="block">
          <span className="label">Data di nascita</span>
          <input
            type="date"
            className="input"
            value={profile.birthday ?? ""}
            onChange={(e) => setProfile((p) => ({ ...p, birthday: e.target.value }))}
          />
        </label>
        <label className="block">
          <span className="label">Via seguita</span>
          <input
            className="input"
            value={profile.path}
            onChange={(e) => setProfile((p) => ({ ...p, path: e.target.value }))}
          />
        </label>
        <label className="block">
          <span className="label">Intenzione dell'anno</span>
          <textarea
            rows={3}
            className="input"
            value={profile.intention}
            onChange={(e) => setProfile((p) => ({ ...p, intention: e.target.value }))}
          />
        </label>
        <div>
          <span className="label">Obiettivi</span>
          <ul className="space-y-1">
            {profile.goals.map((g, i) => (
              <li key={i} className="flex gap-2">
                <input
                  className="input"
                  value={g}
                  onChange={(e) =>
                    setProfile((p) => ({
                      ...p,
                      goals: p.goals.map((x, j) => (j === i ? e.target.value : x)),
                    }))
                  }
                />
                <button
                  onClick={() =>
                    setProfile((p) => ({ ...p, goals: p.goals.filter((_, j) => j !== i) }))
                  }
                  className="px-2 text-muted-foreground"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setProfile((p) => ({ ...p, goals: [...p.goals, ""] }))}
            className="mt-2 rounded-lg border border-border px-3 py-1 text-xs"
          >
            + Aggiungi obiettivo
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2 text-center">
          <Stat label="Note" value={entries.length} />
          <Stat label="Task fatti" value={doneTasks} />
          <Stat label="Giorni di fila" value={streak} />
        </div>
      </section>

      <section className="panel space-y-3 p-4">
        <h3 className="font-display text-sm text-gold">Preferenze</h3>
        <label className="block">
          <span className="label">Lingua delle ricorrenze</span>
          <select
            className="input"
            value={settings.lang}
            onChange={(e) => setSettings((s) => ({ ...s, lang: e.target.value as Settings["lang"] }))}
          >
            <option value="it">Italiano</option>
            <option value="en">English</option>
            <option value="la">Latina</option>
          </select>
        </label>
        <label className="block">
          <span className="label">Tema</span>
          <select
            className="input"
            value={settings.theme}
            onChange={(e) =>
              setSettings((s) => ({ ...s, theme: e.target.value as Settings["theme"] }))
            }
          >
            <option value="dark">Notte</option>
            <option value="light">Pergamena</option>
          </select>
        </label>
        <label className="flex items-center justify-between">
          <span className="text-sm">Salvataggio automatico del diario</span>
          <input
            type="checkbox"
            checked={settings.autosave}
            onChange={(e) => setSettings((s) => ({ ...s, autosave: e.target.checked }))}
            className="h-5 w-5 accent-[var(--color-primary)]"
          />
        </label>
        <label className="block">
          <span className="label">Ora del promemoria</span>
          <input
            type="number"
            min={0}
            max={23}
            className="input"
            value={settings.reminderHour}
            onChange={(e) => setSettings((s) => ({ ...s, reminderHour: Number(e.target.value) }))}
          />
        </label>
      </section>

      <section className="panel space-y-2 p-4">
        <h3 className="font-display text-sm text-gold">Tradizioni nel calendario</h3>
        <p className="text-xs text-muted-foreground">Nessuna selezione = mostra tutte.</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(TRADITIONS).map(([key, t]) => (
            <button
              key={key}
              onClick={() => toggleTradition(key)}
              className={`rounded-full border px-3 py-1 text-xs ${
                settings.traditions.includes(key) ? "border-gold text-gold" : "border-border text-muted-foreground"
              }`}
            >
              {t.symbol} {t.label.it.split("·")[0]?.trim()}
            </button>
          ))}
        </div>
      </section>

      <section className="panel space-y-2 p-4">
        <h3 className="font-display text-sm text-gold">Permessi e dati</h3>
        <button
          onClick={() => navigator.geolocation?.getCurrentPosition(() => {}, () => {})}
          className="w-full rounded-lg border border-border py-2 text-sm"
        >
          Richiedi di nuovo la posizione
        </button>
        <button
          onClick={() => void Notification.requestPermission?.()}
          className="w-full rounded-lg border border-border py-2 text-sm"
        >
          Richiedi le notifiche
        </button>
        <button onClick={exportData} className="w-full rounded-lg border border-border py-2 text-sm">
          Esporta backup (JSON)
        </button>
        <label className="block w-full cursor-pointer rounded-lg border border-border py-2 text-center text-sm">
          Importa backup
          <input
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && importData(e.target.files[0])}
          />
        </label>
        <button
          onClick={onRestartOnboarding}
          className="w-full rounded-lg border border-border py-2 text-sm"
        >
          Rivedi l'introduzione
        </button>
        <button
          onClick={() => {
            if (confirm("Cancellare tutti i dati locali?")) {
              Object.keys(window.localStorage)
                .filter((k) => k.startsWith("calocc:"))
                .forEach((k) => window.localStorage.removeItem(k));
              window.location.reload();
            }
          }}
          className="w-full rounded-lg border border-destructive py-2 text-sm text-destructive"
        >
          Cancella tutti i dati
        </button>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-display text-2xl text-gold">{value}</p>
      <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
    </div>
  );
}

function computeStreak(entries: DiaryEntry[]) {
  const dates = new Set(entries.map((e) => e.date));
  let streak = 0;
  const d = new Date();
  for (;;) {
    const iso = d.toISOString().slice(0, 10);
    if (!dates.has(iso)) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
