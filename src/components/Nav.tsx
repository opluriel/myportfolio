import { useEffect, useState, type MouseEvent } from "react";

const links = ["À propos", "Compétences", "Projets", "Expérience", "Contact"];
const ids = ["about", "skills", "projects", "experience", "contact"];

export default function ProjectsSection() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(-1);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigateTo = (id: string, event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const section = document.getElementById(id);
    if (!section) return;

    window.history.pushState(null, "", `#${id}`);
    section.classList.remove("section-focus");
    void section.offsetWidth;
    section.classList.add("section-focus");
    window.setTimeout(() => section.classList.remove("section-focus"), 700);
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = ids.map(id => document.getElementById(id));
      let idx = -1;
      sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < 120) idx = i; });
      setActive(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[9990] nav-animate ${scrolled ? "nav-glass" : ""} transition-all duration-500`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
        <a href="#" onClick={event => navigateTo("hero", event)} className="font-mono text-sm flex items-center gap-2" style={{ color: "var(--primary)" }}>
          <span style={{ color: "var(--fg-muted)" }}>&gt;_</span>
          <span>ouedraogo.adama</span>
          <span className="cursor-blink" style={{ color: "var(--fg-muted)" }}>█</span>
        </a>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l, i) => (
            <li key={l}>
              <a
                href={`#${ids[i]}`}
                onClick={event => navigateTo(ids[i], event)}
                className="font-mono text-xs tracking-wider transition-all duration-200"
                style={{
                  color: active === i ? "var(--primary)" : "var(--fg-muted)",
                  textShadow: active === i ? "0 0 10px rgba(0,255,136,0.5)" : "none",
                }}
              >
                {String(i + 1).padStart(2, "0")}.{l}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden font-mono text-xs"
          style={{ color: "var(--primary)" }}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setMenuOpen(v => !v)}
        >
          {menuOpen ? "[×]" : "[≡]"}
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-navigation" className="md:hidden nav-glass px-6 py-4 flex flex-col gap-4" onClick={() => setMenuOpen(false)}>
          {links.map((l, i) => (
            <a key={l} href={`#${ids[i]}`} onClick={event => navigateTo(ids[i], event)} className="font-mono text-sm" style={{ color: active === i ? "var(--primary)" : "var(--fg-muted)" }}>
              {String(i + 1).padStart(2, "0")}.{l}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
