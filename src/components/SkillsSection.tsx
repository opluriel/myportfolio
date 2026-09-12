import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useEffect, useRef, type CSSProperties } from "react";

const radarData = [
  { skill: "React / Next", web: 96, data: 45 },
  { skill: "TypeScript", web: 92, data: 40 },
  { skill: "Node.js", web: 88, data: 35 },
  { skill: "CSS / Design", web: 85, data: 20 },
  { skill: "Python", web: 60, data: 95 },
  { skill: "SQL", web: 55, data: 92 },
  { skill: "Pandas/NumPy", web: 30, data: 90 },
  { skill: "ML / Stats", web: 20, data: 85 },
];

const barSkills = [
  { name: "React.js", pct: 96, type: "web" },
  { name: "TypeScript", pct: 92, type: "web" },
  { name: "Node.js / REST", pct: 88, type: "web" },
  { name: "Python", pct: 95, type: "data" },
  { name: "SQL / PostgreSQL", pct: 91, type: "data" },
  { name: "Pandas / NumPy", pct: 90, type: "data" },
  { name: "Data Viz (D3/Recharts)", pct: 84, type: "web" },
  { name: "Machine Learning", pct: 78, type: "data" },
];

function SkillBar({ name, pct, type, delay }: { name: string; pct: number; type: string; delay: number }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setTimeout(() => {
          if (barRef.current) barRef.current.style.width = `${pct}%`;
        }, delay);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    if (barRef.current) obs.observe(barRef.current);
    return () => obs.disconnect();
  }, [pct, delay]);

  const color = type === "web" ? "var(--cyan)" : "var(--violet)";

  return (
    <div className="group proficiency-row" style={{ "--skill-color": color, "--skill-level": `${pct}%` } as CSSProperties}>
      <div className="flex justify-between items-center mb-1">
        <span className="font-mono text-xs" style={{ color: "var(--fg)" }}>{name}</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs px-1.5 rounded-sm text-[0.6rem]"
            style={{ background: type === "web" ? "rgba(0,212,255,0.1)" : "rgba(123,47,255,0.1)", color }}>
            {type === "web" ? "WEB" : "DATA"}
          </span>
          <span className="font-mono text-xs" style={{ color }}>{pct}%</span>
        </div>
      </div>
      <div className="proficiency-track h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div ref={barRef} className="proficiency-fill h-full rounded-full transition-[width] duration-1000 ease-out" style={{ width: 0, background: `linear-gradient(90deg, ${color}, ${color}88)`, boxShadow: `0 0 8px ${color}55` }}>
          <span className="proficiency-scan" />
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 border rounded-sm font-mono text-xs" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
      <p style={{ color: "var(--fg)" }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function SkillsSection() {
  return (
    <section id="skills" className="py-28 px-8 md:px-16 lg:px-24 relative" style={{ background: "var(--card2)" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(123,47,255,0.04) 0%, transparent 60%)" }} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="reveal mb-16 flex items-center gap-4">
          <span className="font-mono text-xs" style={{ color: "var(--fg-muted)" }}>02.</span>
          <h2 className="font-mono font-bold text-4xl" style={{ color: "var(--fg)" }}>Compétences</h2>
          <div className="h-px flex-1 max-w-xs" style={{ background: "linear-gradient(to right, var(--border2), transparent)" }} />
          <span className="font-mono text-xs px-2 py-1 border" style={{ borderColor: "var(--violet)", color: "var(--violet)" }}>
            SKILL_MAP
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Radar chart */}
          <div className="reveal-left">
            <div className="p-6 border rounded-sm proficiency-panel" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs" style={{ color: "var(--fg-muted)" }}>// radar_chart.tsx</span>
              </div>
              <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: "var(--cyan)" }} />
                  <span className="font-mono text-xs" style={{ color: "var(--cyan)" }}>Web Dev</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: "var(--violet)" }} />
                  <span className="font-mono text-xs" style={{ color: "var(--violet)" }}>Data</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis
                    dataKey="skill"
                    tick={{ fill: "rgba(226,234,244,0.6)", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  />
                  <Radar name="Web Dev" dataKey="web" stroke="var(--cyan)" fill="rgba(0,212,255,0.12)" strokeWidth={1.5} dot={false} />
                  <Radar name="Data" dataKey="data" stroke="var(--violet)" fill="rgba(123,47,255,0.12)" strokeWidth={1.5} dot={false} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar chart */}
          <div className="reveal-right">
            <div className="p-6 border rounded-sm" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-xs" style={{ color: "var(--fg-muted)" }}>// proficiency_bars.tsx</span>
              </div>
              <div className="space-y-5">
                {barSkills.map((s, i) => (
                  <SkillBar key={s.name} name={s.name} pct={s.pct} type={s.type} delay={i * 80} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tools grid */}
        <div className="reveal mt-12">
          <div className="p-6 border rounded-sm" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
            <p className="font-mono text-xs mb-5" style={{ color: "var(--fg-muted)" }}>&gt; cat tools.json</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Frameworks", items: ["React", "Next.js", "FastAPI", "Express"], color: "var(--cyan)" },
                { label: "Data & ML", items: ["Pandas", "Scikit-learn", "Spark", "dbt"], color: "var(--violet)" },
                { label: "Databases", items: ["PostgreSQL", "Redis", "MongoDB", "BigQuery"], color: "var(--primary)" },
                { label: "Infra / DevOps", items: ["Docker", "GitHub CI", "Vercel", "GCP"], color: "var(--cyan)" },
              ].map(group => (
                <div key={group.label}>
                  <p className="font-mono text-xs mb-3 font-semibold" style={{ color: group.color }}>{group.label}</p>
                  <ul className="space-y-1">
                    {group.items.map(item => (
                      <li key={item} className="font-mono text-xs flex items-center gap-2" style={{ color: "var(--fg-muted)" }}>
                        <span style={{ color: group.color }}>›</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
