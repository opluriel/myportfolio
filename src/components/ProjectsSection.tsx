import { useRef } from "react";

interface Project {
  id: string;
  title: string;
  desc: string;
  type: "Data";
  tech: string[];
  preview: "chart" | "code" | "dashboard" | "graph";
  href: string;
  accent: string;
}

const projects: Project[] = [
  {
    id: "churn-analysis-project",
    title: "Customer Churn Analysis",
    desc: "Analyse de 7 043 clients télécom, comparaison de modèles de risque et simulateur de scoring pour orienter les actions de fidélisation.",
    type: "Data",
    tech: ["Python", "pandas", "scikit-learn", "Streamlit"],
    preview: "graph",
    href: "https://github.com/opluriel/churn-analysis-project",
    accent: "var(--violet)",
  },
  {
    id: "data-analystic-project",
    title: "Global Layoffs Analysis",
    desc: "Nettoyage et exploration SQL, puis modélisation et dashboard Power BI sur les licenciements mondiaux de 2020 à 2023.",
    type: "Data",
    tech: ["MySQL", "SQL", "Power BI", "DAX"],
    preview: "chart",
    href: "https://github.com/opluriel/data-analystic-project",
    accent: "var(--cyan)",
  },
  {
    id: "data-professional-survey-dashboard",
    title: "Data Professionals Survey",
    desc: "Dashboard Power BI basé sur 630 réponses pour explorer les salaires, les outils utilisés et la satisfaction des professionnels de la donnée.",
    type: "Data",
    tech: ["Power BI", "Power Query", "DAX", "Excel"],
    preview: "graph",
    href: "https://github.com/opluriel/data-professional-survey-dashboard",
    accent: "var(--violet)",
  },
  {
    id: "bike-buyers-analysis",
    title: "Bike Buyers Analysis",
    desc: "Analyse Excel de 1 000 clients pour comparer les taux d’achat de vélos selon l’âge, la distance domicile-travail et d’autres profils.",
    type: "Data",
    tech: ["Excel", "Tableaux croisés", "Dashboard"],
    preview: "chart",
    href: "https://github.com/opluriel/bike-buyers-analysis",
    accent: "var(--cyan)",
  },
];

function MiniPreview({ type, accent }: { type: Project["preview"]; accent: string }) {
  if (type === "chart") {
    const bars = [40, 70, 50, 90, 60, 85, 45];
    return (
      <div className="h-full flex items-end gap-1 px-4 pb-4 pt-6 relative">
        <div className="absolute top-3 left-4 font-mono text-xs opacity-40" style={{ color: accent }}>analyse.csv</div>
        {bars.map((h, i) => (
          <div key={i} className="flex-1 rounded-sm transition-all duration-300" style={{
            height: `${h}%`, background: `linear-gradient(to top, ${accent}, ${accent}44)`,
            boxShadow: `0 0 6px ${accent}44`,
          }} />
        ))}
      </div>
    );
  }
  if (type === "code") {
    return (
      <div className="h-full p-4 overflow-hidden font-mono text-xs leading-6" style={{ color: "var(--fg-muted)" }}>
        <span style={{ color: "var(--violet)" }}>const </span>
        <span style={{ color: "var(--cyan)" }}>Button</span>
        <span> = (</span>
        <span style={{ color: "var(--primary)" }}>props</span>
        <span>{") => {"}</span><br />
        <span className="pl-4"><span style={{ color: "var(--violet)" }}>return </span></span><br />
        <span className="pl-6" style={{ color: accent }}>&lt;button</span><br />
        <span className="pl-8 text-xs opacity-60">className="btn"</span><br />
        <span className="pl-6" style={{ color: accent }}>&gt;</span><br />
        <span className="pl-8">{"{props.children}"}</span><br />
        <span className="pl-6" style={{ color: accent }}>&lt;/button&gt;</span>
      </div>
    );
  }
  if (type === "graph") {
    const pts = [30, 45, 35, 60, 50, 80, 65, 90];
    const w = 200, h = 80;
    const xs = pts.map((_, i) => (i / (pts.length - 1)) * w);
    const ys = pts.map(p => h - (p / 100) * h);
    const d = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i]}`).join(" ");
    const filled = `${d} L ${xs[xs.length - 1]} ${h} L 0 ${h} Z`;
    return (
      <div className="h-full flex items-center justify-center p-4">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: "80%" }}>
          <defs>
            <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity="0.3" />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={filled} fill="url(#gr)" />
          <path d={d} fill="none" stroke={accent} strokeWidth="1.5" />
          {pts.map((_, i) => (
            <circle key={i} cx={xs[i]} cy={ys[i]} r="2" fill={accent} />
          ))}
        </svg>
      </div>
    );
  }
  // dashboard
  return (
    <div className="h-full p-4 grid grid-cols-2 gap-2">
      {[["12.4k", "Users", "var(--primary)"], ["98.2%", "Uptime", "var(--cyan)"], ["847ms", "P99", "var(--violet)"], ["+23%", "MoM", "var(--primary)"]].map(([v, l, c]) => (
        <div key={l} className="border rounded-sm p-2 flex flex-col gap-1" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <span className="font-mono text-base font-bold" style={{ color: c as string }}>{v}</span>
          <span className="font-mono text-xs opacity-50" style={{ color: "var(--fg)" }}>{l}</span>
        </div>
      ))}
    </div>
  );
}

function TiltCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
    card.style.boxShadow = `${-x * 20}px ${-y * 20}px 40px rgba(0,0,0,0.3), 0 0 30px ${project.accent}22`;
  };

  const onLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(600px) rotateY(0) rotateX(0) scale(1)";
    card.style.boxShadow = "none";
  };

  return (
    <a
      ref={cardRef}
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Voir ${project.title} sur GitHub (nouvel onglet)`}
      className="project-card block border rounded-sm overflow-hidden cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-4"
      style={{ borderColor: `${project.accent}22`, background: "var(--card)", color: "var(--fg)", textDecoration: "none", transition: "transform 0.15s ease, box-shadow 0.3s ease" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* Preview */}
      <div className="h-44 border-b relative overflow-hidden" style={{ borderColor: `${project.accent}18`, background: "rgba(0,0,0,0.3)" }}>
        <MiniPreview type={project.preview} accent={project.accent} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent 60%, rgba(13,26,42,0.8) 100%)" }} />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-mono font-bold text-lg" style={{ color: "var(--fg)" }}>{project.title}</h3>
          <span className="font-mono text-xs px-2 py-0.5 rounded-sm border ml-3 flex-shrink-0"
            style={{ borderColor: project.accent, color: project.accent, background: `${project.accent}10` }}>
            {project.type}
          </span>
        </div>

        <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--fg-muted)" }}>{project.desc}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map(t => (
            <span key={t} className="font-mono text-xs px-2 py-0.5 rounded-sm" style={{ background: "rgba(255,255,255,0.04)", color: "var(--fg-muted)" }}>
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: project.accent }}>
          <span>voir le projet</span>
          <span>→</span>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500" style={{ background: project.accent }} />
      </div>
    </a>
  );
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-28 px-8 md:px-16 lg:px-24 relative overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="absolute top-1/2 right-0 w-96 h-96 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)", transform: "translate(30%, -50%)" }} />

      <div className="max-w-7xl mx-auto">
        <div className="reveal mb-16 flex items-center gap-4">
          <span className="font-mono text-xs" style={{ color: "var(--fg-muted)" }}>03.</span>
          <h2 className="font-mono font-bold text-4xl" style={{ color: "var(--fg)" }}>Projets</h2>
          <div className="h-px flex-1 max-w-xs" style={{ background: "linear-gradient(to right, var(--border), transparent)" }} />
          <span className="font-mono text-xs px-2 py-1 border" style={{ borderColor: "var(--cyan)", color: "var(--cyan)" }}>
            4 FEATURED
          </span>
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="reveal" style={{ transitionDelay: "0ms" }}>
            <TiltCard project={projects[0]} />
          </div>
          <div className="reveal lg:col-span-1 lg:mt-12" style={{ transitionDelay: "80ms" }}>
            <TiltCard project={projects[1]} />
          </div>
          <div className="reveal lg:row-span-1 lg:-mt-4" style={{ transitionDelay: "160ms" }}>
            <TiltCard project={projects[2]} />
          </div>
          <div className="reveal md:col-span-2 lg:col-span-1 lg:col-start-2" style={{ transitionDelay: "240ms" }}>
            <TiltCard project={projects[3]} />
          </div>
        </div>

        <div className="reveal mt-12 text-center">
          <a href="https://github.com/opluriel?tab=repositories" target="_blank" rel="noopener noreferrer" data-hover className="font-mono text-sm border px-8 py-3 inline-block transition-all duration-300 hover:bg-[rgba(0,255,136,0.08)]"
            style={{ borderColor: "var(--border)", color: "var(--fg-muted)" }}>
            voir tous les projets →
          </a>
        </div>
      </div>
    </section>
  );
}
