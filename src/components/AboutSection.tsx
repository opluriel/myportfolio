import { useEffect, useRef, useState } from "react";

interface Stat {
  label: string;
  value: number;
  suffix: string;
  color: string;
}

const stats: Stat[] = [
  { label: "Années XP", value: 4, suffix: "ans", color: "var(--primary)" },
  { label: "Projets livrés", value: 23, suffix: "", color: "var(--violet)" },
  { label: "Langages", value: 8, suffix: "+", color: "var(--cyan)" },
  { label: "Datasets analysés", value: 150, suffix: "+", color: "var(--primary)" },
];

const sysInfo = [
  { key: "OS", val: "ArchLinux 6.8.0" },
  { key: "Kernel", val: "creative-mind-x86_64" },
  { key: "Uptime", val: "4 years, 3 months" },
  { key: "Shell", val: "zsh 5.9 + fish" },
  { key: "CPU", val: "Problem Solver × 8 cores" },
  { key: "Memory", val: "∞ GB curiosity used" },
  { key: "Locale", val: "fr_FR.UTF-8 / en_US" },
  { key: "DE", val: "Design system + VS Code" },
];

function AnimatedCounter({ value, suffix, color, started }: { value: number; suffix: string; color: string; started: boolean }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const duration = 1400;
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [started, value]);

  return (
    <span className="font-mono font-bold" style={{ color, fontSize: "3rem", lineHeight: 1, textShadow: `0 0 20px ${color}55` }}>
      {display}{suffix}
    </span>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach(el => revealObs.observe(el));
    return () => revealObs.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-28 px-8 md:px-16 lg:px-24 relative overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Decorative */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 70%)", transform: "translate(-50%,-50%)" }} />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="reveal mb-16 flex items-center gap-4">
          <span className="font-mono text-xs" style={{ color: "var(--fg-muted)" }}>01.</span>
          <h2 className="font-mono font-bold text-4xl" style={{ color: "var(--fg)" }}>À propos</h2>
          <div className="h-px flex-1 max-w-xs" style={{ background: "linear-gradient(to right, var(--border), transparent)" }} />
          <span className="font-mono text-xs px-2 py-1 border" style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>
            SYS_INFO
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left — terminal profile */}
          <div className="reveal-left">
            <div className="rounded-sm border overflow-hidden" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
              {/* Terminal chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.3)" }}>
                <span className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#28CA41" }} />
                <span className="font-mono text-xs ml-2" style={{ color: "var(--fg-muted)" }}>neofetch — profile.sh</span>
              </div>
              <div className="p-6">
                {/* ASCII art / header */}
                <div className="flex gap-6 mb-6">
                  <div className="font-mono text-xs leading-none whitespace-pre" style={{ color: "var(--primary)" }}>
{`██████╗ ███████╗██╗   ██╗
██╔══██╗██╔════╝██║   ██║
██║  ██║█████╗  ██║   ██║
██║  ██║██╔══╝  ╚██╗ ██╔╝
██████╔╝███████╗ ╚████╔╝
╚═════╝ ╚══════╝  ╚═══╝  `}
                  </div>
                </div>
                <div className="font-mono text-xs leading-7 space-y-1">
                  <p><span style={{ color: "var(--primary)" }}>ouedraogo</span><span style={{ color: "var(--fg-muted)" }}>@</span><span style={{ color: "var(--cyan)" }}>portfolio</span></p>
                  <p style={{ color: "var(--border)" }}>{"─".repeat(24)}</p>
                  {sysInfo.map(({ key, val }) => (
                    <p key={key}>
                      <span style={{ color: "var(--violet)" }}>{key.padEnd(8)}</span>
                      <span style={{ color: "var(--fg-muted)" }}>: </span>
                      <span style={{ color: "var(--fg)" }}>{val}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6 pl-4 border-l-2" style={{ borderColor: "var(--primary)" }}>
              <p className="text-base leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                Développeur web et data analyst basé à Abidjan. Je navigue entre la construction
                d'expériences utilisateur fluides et l'exploration de jeux de données complexes.
                Mon double profil me permet de créer des <span style={{ color: "var(--fg)" }}>dashboards data-driven</span>,
                des outils d'analyse interactifs, et des interfaces qui transforment
                les données brutes en <span style={{ color: "var(--primary)" }}>décisions éclairées</span>.
              </p>
            </div>
          </div>

          {/* Right — stats grid */}
          <div className="reveal-right">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {stats.map(s => (
                <div key={s.label} className="p-5 border rounded-sm relative overflow-hidden group"
                  style={{ borderColor: "var(--border)", background: "var(--card2)" }}
                  data-hover>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at 50% 50%, ${s.color}08, transparent 70%)` }} />
                  <AnimatedCounter value={s.value} suffix={s.suffix} color={s.color} started={started} />
                  <p className="font-mono text-xs mt-2" style={{ color: "var(--fg-muted)" }}>{s.label}</p>
                  <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                    style={{ background: s.color }} />
                </div>
              ))}
            </div>

            {/* Skills preview tags */}
            <div className="p-4 border rounded-sm" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
              <p className="font-mono text-xs mb-3" style={{ color: "var(--fg-muted)" }}>&gt; ls ./stack</p>
              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "Node.js", "Python", "Pandas", "SQL", "D3.js", "FastAPI", "PostgreSQL", "Scikit-learn", "Tailwind", "Docker"].map(tag => (
                  <span key={tag} className="font-mono text-xs px-2 py-1 rounded-sm border transition-all duration-200 hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    style={{ borderColor: "var(--border)", color: "var(--fg-muted)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
