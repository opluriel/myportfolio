import { useRef, type CSSProperties } from "react";

interface Commit {
  hash: string;
  date: string;
  title: string;
  desc: string;
  company: string;
  type: "Web" | "Data" | "Both";
  tags: string[];
}

const commits: Commit[] = [
  {
    hash: "a1f3d9e",
    date: "2024-03 → now",
    title: "Lead Dev · Data Platform",
    desc: "Architecture d'une plateforme d'analyse de données pour 50k utilisateurs. Stack Python/FastAPI + React, déploiement GCP.",
    company: "DataStream SAS",
    type: "Both",
    tags: ["Python", "React", "GCP", "dbt"],
  },
  {
    hash: "c7b2a81",
    date: "2022-09 → 2024-02",
    title: "Frontend Engineer",
    desc: "Développement de composants UI complexes, optimisation des performances (Core Web Vitals), intégration APIs REST.",
    company: "Agence Morpho",
    type: "Web",
    tags: ["TypeScript", "Next.js", "Storybook"],
  },
  {
    hash: "e9d4f0c",
    date: "2021-06 → 2022-08",
    title: "Data Analyst · BI",
    desc: "Création de dashboards Power BI, modélisation SQL, analyses ad hoc pour les équipes marketing et produit.",
    company: "Retail Group France",
    type: "Data",
    tags: ["SQL", "Power BI", "Python"],
  },
  {
    hash: "b5e8a3d",
    date: "2020-09 → 2021-05",
    title: "Développeur Full-Stack (alternance)",
    desc: "Développement d'une application SaaS de gestion RH, de la base de données jusqu'au front React.",
    company: "TechStart Lyon",
    type: "Web",
    tags: ["React", "Node.js", "PostgreSQL"],
  },
  {
    hash: "f2c6d71",
    date: "2019-06 → 2019-08",
    title: "Stage Data Science",
    desc: "Analyse exploratoire, feature engineering et déploiement d'un modèle de recommandation.",
    company: "MediaLabs Paris",
    type: "Data",
    tags: ["Python", "Scikit-learn", "SQL"],
  },
];

export default function ExperienceSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <section id="experience" className="py-28 relative overflow-hidden" style={{ background: "var(--card2)" }}>
      <div className="absolute inset-0 grid-pattern opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="reveal px-8 md:px-16 lg:px-24 mb-16 flex items-center gap-4">
          <span className="font-mono text-xs" style={{ color: "var(--fg-muted)" }}>04.</span>
          <h2 className="font-mono font-bold text-4xl" style={{ color: "var(--fg)" }}>Expérience</h2>
          <div className="h-px flex-1 max-w-xs" style={{ background: "linear-gradient(to right, var(--border), transparent)" }} />
          <div className="flex gap-2">
            <button type="button" aria-label="Voir les expériences précédentes" data-hover onClick={() => scroll(-1)} className="font-mono text-xs px-3 py-2 border transition-all duration-200 hover:border-[var(--primary)]"
              style={{ borderColor: "var(--border)", color: "var(--fg-muted)" }}>←</button>
            <button type="button" aria-label="Voir les expériences suivantes" data-hover onClick={() => scroll(1)} className="font-mono text-xs px-3 py-2 border transition-all duration-200 hover:border-[var(--primary)]"
              style={{ borderColor: "var(--border)", color: "var(--fg-muted)" }}>→</button>
          </div>
        </div>

        {/* Git branch line */}
        <div className="px-8 md:px-16 lg:px-24 mb-4">
          <div className="flex items-center gap-2 font-mono text-xs" style={{ color: "var(--fg-muted)" }}>
            <span style={{ color: "var(--primary)" }}>●</span>
            <span>git log --oneline --graph main</span>
          </div>
        </div>

        {/* Horizontal scroll */}
        <div ref={scrollRef} className="timeline-scroll flex gap-0 pl-8 md:pl-16 lg:pl-24 pr-8 pb-6" style={{ scrollSnapType: "x mandatory" }}>
          {/* Connector line */}
          <div className="relative flex items-center">
            <div className="absolute top-1/2 left-0 h-px pointer-events-none"
              style={{ width: `${commits.length * 340}px`, background: "linear-gradient(to right, var(--primary), var(--violet), var(--cyan))", opacity: 0.3 }} />
          </div>

          {commits.map((c, i) => {
            const typeColor = c.type === "Web" ? "var(--cyan)" : c.type === "Data" ? "var(--violet)" : "var(--primary)";
            return (
              <div key={c.hash} className="flex-none w-80 mr-5 group experience-entry" style={{ scrollSnapAlign: "start", "--experience-color": typeColor } as CSSProperties}>
                {/* Commit dot + branch */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="experience-node w-3 h-3 rounded-full border-2 transition-all duration-300 group-hover:scale-150"
                      style={{ borderColor: typeColor, background: "var(--card2)", boxShadow: `0 0 10px ${typeColor}66` }} />
                  </div>
                  <div className="h-px flex-1" style={{ background: `${typeColor}33` }} />
                  <span className="font-mono text-xs" style={{ color: "var(--fg-muted)" }}>#{i + 1}</span>
                </div>

                {/* Card */}
                <div className="experience-card border rounded-sm p-5 transition-all duration-300 group-hover:border-opacity-100"
                  style={{ borderColor: `${typeColor}22`, background: "var(--card)", borderTopColor: typeColor }}>
                  <div className="experience-card-scan" />
                  <div className="flex items-center justify-between mb-3">
                    <code className="font-mono text-xs" style={{ color: typeColor }}>{c.hash}</code>
                    <span className="font-mono text-xs px-1.5 py-0.5 rounded-sm" style={{ background: `${typeColor}15`, color: typeColor }}>{c.type}</span>
                  </div>

                  <p className="font-mono text-xs mb-1" style={{ color: "var(--fg-muted)" }}>{c.date}</p>
                  <h3 className="font-mono font-semibold text-sm mb-1" style={{ color: "var(--fg)" }}>{c.title}</h3>
                  <p className="font-mono text-xs mb-3" style={{ color: typeColor }}>{c.company}</p>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--fg-muted)" }}>{c.desc}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {c.tags.map(t => (
                      <span key={t} className="font-mono text-xs px-2 py-0.5 rounded-sm" style={{ background: "rgba(255,255,255,0.04)", color: "var(--fg-muted)" }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* End marker */}
          <div className="flex-none w-24 flex items-start pt-5">
            <div className="font-mono text-xs" style={{ color: "var(--fg-muted)" }}>
              <p style={{ color: "var(--primary)" }}>&gt; init</p>
              <p>2019</p>
            </div>
          </div>
        </div>

        {/* Formation */}
        <div className="reveal px-8 md:px-16 lg:px-24 mt-12">
          <div className="p-5 border rounded-sm" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
            <p className="font-mono text-xs mb-4" style={{ color: "var(--fg-muted)" }}>&gt; cat formation.txt</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="font-mono text-sm font-semibold" style={{ color: "var(--fg)" }}>Licence Informatique</p>
                <p className="font-mono text-xs" style={{ color: "var(--violet)" }}>Institut International Polytechnique des Elites d'Abidjan · 2023-2024</p>
              </div>
              <div>
                <p className="font-mono text-sm font-semibold" style={{ color: "var(--fg)" }}>Baccalauréat</p>
                <p className="font-mono text-xs" style={{ color: "var(--cyan)" }}>Collège Bocabo & Associés  · 2021-2022</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
