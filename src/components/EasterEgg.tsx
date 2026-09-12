import { useEffect, useState, useRef } from "react";

const QUERY = "SELECT * FROM skills WHERE level = 'expert' ORDER BY xp DESC;";
const RESULT = [
  { skill: "React.js", type: "Web", xp: 98, level: "expert" },
  { skill: "Python", type: "Data", xp: 95, level: "expert" },
  { skill: "TypeScript", type: "Web", xp: 92, level: "expert" },
  { skill: "SQL", type: "Data", xp: 91, level: "expert" },
  { skill: "Pandas", type: "Data", xp: 88, level: "expert" },
];

export default function EasterEgg() {
  const [visible, setVisible] = useState(false);
  const [typed, setTyped] = useState("");
  const [queryDone, setQueryDone] = useState(false);
  const buffer = useRef("");
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setVisible(false); setQueryDone(false); return; }
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      buffer.current += e.key.toLowerCase();
      if (buffer.current.length > 6) buffer.current = buffer.current.slice(-6);
      if (buffer.current.includes("data")) {
        setVisible(true);
        setQueryDone(false);
        setTyped("");
        let i = 0;
        clearInterval(timerRef.current);
        timerRef.current = setInterval((): void => {
          i++;
          setTyped(QUERY.slice(0, i));
          if (i >= QUERY.length) {
            clearInterval(timerRef.current);
            setTimeout(() => setQueryDone(true), 400);
          }
        }, 35);
        buffer.current = "";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); clearInterval(timerRef.current); };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[99990] flex items-center justify-center" style={{ background: "rgba(5,10,20,0.92)", backdropFilter: "blur(8px)" }}>
      <div className="relative p-6 rounded-sm border max-w-xl w-full mx-4"
        style={{ background: "#091422", borderColor: "rgba(0,255,136,0.3)", boxShadow: "0 0 40px rgba(0,255,136,0.15)" }}>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b" style={{ borderColor: "rgba(0,255,136,0.1)" }}>
          <div className="w-3 h-3 rounded-full cursor-pointer" style={{ background: "#FF5F57" }} onClick={() => { setVisible(false); setQueryDone(false); }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#28CA41" }} />
          <span className="font-mono text-xs ml-2" style={{ color: "var(--fg-muted)" }}>portfolio_db — psql</span>
        </div>
        <p className="font-mono text-xs mb-1" style={{ color: "var(--fg-muted)" }}>-- easter egg découvert 🎉</p>
        <p className="font-mono text-sm mb-4" style={{ color: "var(--primary)" }}>
          {typed}<span className="cursor-blink">█</span>
        </p>
        {queryDone && (
          <div className="font-mono text-xs" style={{ color: "var(--fg)" }}>
            <div className="grid grid-cols-4 gap-3 mb-2 pb-2 border-b" style={{ borderColor: "rgba(0,255,136,0.1)", color: "var(--fg-muted)" }}>
              <span>skill</span><span>type</span><span>xp</span><span>level</span>
            </div>
            {RESULT.map((r, i) => (
              <div key={i} className="grid grid-cols-4 gap-3 py-1" style={{
                color: r.type === "Web" ? "var(--cyan)" : "var(--violet)",
                animationDelay: `${i * 80}ms`
              }}>
                <span>{r.skill}</span>
                <span style={{ color: r.type === "Web" ? "var(--cyan)" : "var(--violet)" }}>{r.type}</span>
                <span style={{ color: "var(--primary)" }}>{r.xp}</span>
                <span>{r.level}</span>
              </div>
            ))}
            <p className="mt-4" style={{ color: "var(--fg-muted)" }}>
              5 rows returned in 0.004ms<br/>
              <span style={{ color: "var(--fg-muted)", fontSize: "0.65rem" }}>Tapez <kbd style={{ color: "var(--primary)" }}>Esc</kbd> pour fermer</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
