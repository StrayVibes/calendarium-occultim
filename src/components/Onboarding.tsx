import { useState } from "react";
import type { Profile, Settings } from "@/lib/types";

const STEPS = ["benvenuto", "permessi", "profilo", "pronto"] as const;

export function Onboarding({
  profile,
  setProfile,
  settings,
  setSettings,
  onDone,
}: {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  onDone: () => void;
}) {
  const [step, setStep] = useState(0);
  const [geo, setGeo] = useState<"idle" | "ok" | "no">("idle");
  const [notif, setNotif] = useState<"idle" | "ok" | "no">("idle");
  const [audio, setAudio] = useState<"idle" | "ok">("idle");

  const askGeo = () => {
    if (!("geolocation" in navigator)) return setGeo("no");
    navigator.geolocation.getCurrentPosition(
      () => setGeo("ok"),
      () => setGeo("no"),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const askNotif = async () => {
    if (!("Notification" in window)) return setNotif("no");
    const res = await Notification.requestPermission();
    setNotif(res === "granted" ? "ok" : "no");
  };

  const askAudio = () => {
    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctor();
      void ctx.resume();
      setAudio("ok");
    } catch {
      setAudio("ok");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-background">
      <div className="star-field flex flex-1 flex-col items-center justify-center px-6 text-center">
        {step === 0 && (
          <>
            <span className="text-6xl text-gold glyph-glow">☿</span>
            <h1 className="mt-4 font-display text-3xl text-gold">Calendarium Occultum</h1>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Calendario esoterico, lune, meteo in tempo reale, diario dell'umore, task,
              meditazione e radio nordica, tribale e psichedelica. Tutto resta sul tuo dispositivo.
            </p>
          </>
        )}

        {step === 1 && (
          <div className="w-full max-w-sm space-y-3 text-left">
            <h2 className="text-center font-display text-2xl text-gold">Permessi</h2>
            <p className="text-center text-xs text-muted-foreground">
              Concedili una sola volta: puoi cambiarli dopo dalle impostazioni.
            </p>
            <PermRow
              icon="⌖"
              title="Posizione precisa"
              desc="Per il meteo in tempo reale dove ti trovi"
              state={geo}
              onAsk={askGeo}
            />
            <PermRow
              icon="✦"
              title="Notifiche"
              desc="Promemoria del diario e delle ricorrenze"
              state={notif}
              onAsk={askNotif}
            />
            <PermRow
              icon="♪"
              title="Audio"
              desc="Suoni bianchi, rune e radio online"
              state={audio === "ok" ? "ok" : "idle"}
              onAsk={askAudio}
            />
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-sm space-y-3 text-left">
            <h2 className="text-center font-display text-2xl text-gold">Il tuo profilo</h2>
            <Field label="Nome">
              <input
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                className="input"
                placeholder="Come vuoi essere chiamato"
              />
            </Field>
            <Field label="Data di nascita">
              <input
                type="date"
                value={profile.birthday ?? ""}
                onChange={(e) => setProfile((p) => ({ ...p, birthday: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Via seguita">
              <input
                value={profile.path}
                onChange={(e) => setProfile((p) => ({ ...p, path: e.target.value }))}
                className="input"
                placeholder="Norreno, Wicca, Ermetismo…"
              />
            </Field>
            <Field label="Intenzione per quest'anno">
              <textarea
                value={profile.intention}
                onChange={(e) => setProfile((p) => ({ ...p, intention: e.target.value }))}
                rows={3}
                className="input"
                placeholder="Cosa vuoi coltivare"
              />
            </Field>
            <Field label="Promemoria diario (ora)">
              <input
                type="number"
                min={0}
                max={23}
                value={settings.reminderHour}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, reminderHour: Number(e.target.value) }))
                }
                className="input"
              />
            </Field>
          </div>
        )}

        {step === 3 && (
          <>
            <span className="text-6xl text-gold glyph-glow">ᛝ</span>
            <h2 className="mt-4 font-display text-2xl text-gold">Tutto pronto</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {profile.name ? `Bentornato, ${profile.name}. ` : ""}
              Il diario si salva da solo mentre scrivi e ogni anno riceverai il quadro completo di
              come stai.
            </p>
          </>
        )}
      </div>

      <div className="space-y-3 p-6">
        <div className="flex justify-center gap-2">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-8 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="rounded-lg border border-border px-4 py-3 text-sm"
            >
              Indietro
            </button>
          )}
          <button
            onClick={() => (step === STEPS.length - 1 ? onDone() : setStep((s) => s + 1))}
            className="flex-1 rounded-lg bg-primary py-3 text-sm text-primary-foreground"
          >
            {step === STEPS.length - 1 ? "Entra" : "Avanti"}
          </button>
        </div>
        {step < STEPS.length - 1 && (
          <button onClick={onDone} className="w-full text-xs text-muted-foreground">
            Salta
          </button>
        )}
      </div>
    </div>
  );
}

function PermRow({
  icon,
  title,
  desc,
  state,
  onAsk,
}: {
  icon: string;
  title: string;
  desc: string;
  state: "idle" | "ok" | "no";
  onAsk: () => void;
}) {
  return (
    <div className="panel flex items-center gap-3 p-3">
      <span className="text-xl text-gold">{icon}</span>
      <div className="flex-1">
        <p className="text-sm">{title}</p>
        <p className="text-[11px] text-muted-foreground">{desc}</p>
      </div>
      <button
        onClick={onAsk}
        disabled={state === "ok"}
        className={`rounded-lg border px-3 py-1 text-xs ${
          state === "ok"
            ? "border-gold text-gold"
            : state === "no"
              ? "border-destructive text-destructive"
              : "border-border"
        }`}
      >
        {state === "ok" ? "Concesso" : state === "no" ? "Negato" : "Consenti"}
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
