import { useMemo, useState } from "react";
import { useStored } from "@/lib/storage";
import type { Task } from "@/lib/types";

export function TasksView() {
  const [tasks, setTasks] = useStored<Task[]>("tasks", []);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("normal");
  const [due, setDue] = useState("");
  const [filter, setFilter] = useState<"aperte" | "fatte" | "tutte">("aperte");

  const add = () => {
    if (!title.trim()) return;
    setTasks((prev) => [
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        done: false,
        createdAt: Date.now(),
        priority,
        ...(due ? { due } : {}),
      },
      ...prev,
    ]);
    setTitle("");
    setDue("");
    setPriority("normal");
  };

  const visible = useMemo(() => {
    const order = { high: 0, normal: 1, low: 2 } as const;
    return tasks
      .filter((t) => (filter === "tutte" ? true : filter === "fatte" ? t.done : !t.done))
      .sort((a, b) => order[a.priority] - order[b.priority] || b.createdAt - a.createdAt);
  }, [tasks, filter]);

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div className="space-y-4 pb-4">
      <section className="panel space-y-2 p-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Nuovo compito…"
          className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
        />
        <div className="flex gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task["priority"])}
            className="h-10 flex-1 rounded-lg border border-border bg-background px-2 text-sm"
          >
            <option value="high">Alta</option>
            <option value="normal">Normale</option>
            <option value="low">Bassa</option>
          </select>
          <input
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className="h-10 flex-1 rounded-lg border border-border bg-background px-2 text-sm"
          />
          <button
            onClick={add}
            className="h-10 rounded-lg bg-primary px-4 text-sm text-primary-foreground"
          >
            Aggiungi
          </button>
        </div>
      </section>

      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
          {(["aperte", "fatte", "tutte"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1 text-xs uppercase tracking-widest ${
                filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {doneCount}/{tasks.length} completati
        </span>
      </div>

      <ul className="space-y-2">
        {visible.map((t) => (
          <li key={t.id} className="panel flex items-center gap-3 p-3">
            <button
              onClick={() =>
                setTasks((prev) =>
                  prev.map((x) =>
                    x.id === t.id ? { ...x, done: !x.done, doneAt: Date.now() } : x,
                  ),
                )
              }
              className={`h-6 w-6 shrink-0 rounded-full border text-xs ${
                t.done ? "border-gold bg-gold/20 text-gold" : "border-border"
              }`}
              aria-label="Completa"
            >
              {t.done ? "✓" : ""}
            </button>
            <div className="flex-1">
              <p className={`text-sm ${t.done ? "text-muted-foreground line-through" : ""}`}>
                {t.title}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {t.priority === "high" ? "Alta priorità · " : t.priority === "low" ? "Bassa · " : ""}
                {t.due ? `entro ${new Date(t.due).toLocaleDateString("it-IT")}` : "senza scadenza"}
              </p>
            </div>
            <button
              onClick={() => setTasks((prev) => prev.filter((x) => x.id !== t.id))}
              className="text-muted-foreground"
              aria-label="Elimina"
            >
              ✕
            </button>
          </li>
        ))}
        {!visible.length && (
          <li className="panel p-6 text-center text-sm text-muted-foreground">Nulla qui.</li>
        )}
      </ul>
    </div>
  );
}
