import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  hue: number;
}

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });
  const particles = useRef<Particle[]>([]);
  const raf = useRef(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      init();
    };

    const init = () => {
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 7000), 120);
      particles.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 1.8 + 0.4,
        hue: Math.random() > 0.5 ? 0 : 1, // 0 = green, 1 = violet
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const ps = particles.current;
      const mx = mouse.current.x;
      const my = mouse.current.y;

      for (const p of ps) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.hypot(dx, dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120;
          p.vx += (dx / dist) * force * 0.3;
          p.vy += (dy / dist) * force * 0.3;
        }
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > canvas.width) { p.x = canvas.width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > canvas.height) { p.y = canvas.height; p.vy *= -1; }

        const color = p.hue === 0 ? "0,255,136" : "123,47,255";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, 0.7)`;
        ctx.fill();
      }

      // Connections
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.25;
            const sameHue = ps[i].hue === ps[j].hue;
            const color = sameHue
              ? (ps[i].hue === 0 ? `rgba(0,255,136,${alpha})` : `rgba(123,47,255,${alpha})`)
              : `rgba(0,212,255,${alpha * 0.8})`;
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Connect to mouse
        const dmx = ps[i].x - mx;
        const dmy = ps[i].y - my;
        const md = Math.hypot(dmx, dmy);
        if (md < 160 && md > 0) {
          const alpha = (1 - md / 160) * 0.6;
          ctx.beginPath();
          ctx.moveTo(ps[i].x, ps[i].y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      raf.current = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouse.current = { x: -999, y: -999 }; };
    const onScroll = () => setScrollY(window.scrollY);
    const onResize = () => resize();

    window.addEventListener("mousemove", onMouse);
    canvas.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMouse);
      canvas.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const fade = Math.max(0, 1 - scrollY / 400);

  return (
    <section id="hero" className="relative h-screen overflow-hidden flex items-center" style={{ background: "var(--bg)" }}>
      {/* Grid */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: fade }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(5,10,20,0.85) 100%)" }} />

      {/* Content */}
      <div className="relative z-10 px-8 md:px-16 lg:px-24 pt-16 max-w-6xl" style={{ opacity: fade, transform: `translateY(${scrollY * 0.2}px)` }}>
        <div className="font-mono text-xs mb-4 flex items-center gap-2" style={{ color: "var(--fg-muted)" }}>
          <span style={{ color: "var(--primary)" }}>●</span>
          <span>root@portfolio:~$</span>
          <span style={{ color: "var(--primary)" }}>whoami</span>
        </div>

        <h1 className="font-mono font-bold leading-[0.9] mb-6 tracking-tight"
          style={{ fontSize: "clamp(3rem, 10vw, 8rem)", color: "var(--fg)" }}>
          <span className="neon-green block">Ouedraogo</span>
          <span className="block" style={{ color: "var(--fg)" }}>Adama</span>
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="h-px w-24" style={{ background: "linear-gradient(to right, var(--primary), transparent)" }} />
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-3 py-1 border" style={{ borderColor: "var(--cyan)", color: "var(--cyan)" }}>
              Web Dev
            </span>
            <span className="font-mono text-xs" style={{ color: "var(--fg-muted)" }}>×</span>
            <span className="font-mono text-xs px-3 py-1 border" style={{ borderColor: "var(--violet)", color: "var(--violet)" }}>
              Data Analyst
            </span>
          </div>
        </div>

        <p className="text-base mb-10 max-w-lg leading-relaxed" style={{ color: "var(--fg-muted)", fontFamily: "var(--font-sans)" }}>
          Du pixel au pipeline — je conçois des interfaces qui respirent<br />
          et des modèles qui révèlent ce que les données murmurent.
        </p>

        <div className="flex flex-wrap gap-3">
          <a href="#projects" data-hover
            className="font-mono text-sm px-6 py-3 border transition-all duration-300 hover:bg-[#00FF88] hover:text-[#050A14] hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]"
            style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>
            &gt; voir_projets()
          </a>
          <a href="#contact" data-hover
            className="font-mono text-sm px-6 py-3 border transition-all duration-300 hover:bg-[#7B2FFF] hover:text-white hover:shadow-[0_0_20px_rgba(123,47,255,0.4)]"
            style={{ borderColor: "var(--violet)", color: "var(--violet)" }}>
            &gt; me_contacter()
          </a>
        </div>

        {/* Hint */}
        <p className="font-mono text-xs mt-8 opacity-40" style={{ color: "var(--fg-muted)" }}>
          // tapez "data" pour découvrir un easter egg
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 md:right-16 flex flex-col items-center gap-2" style={{ opacity: fade * 0.6 }}>
        <div className="w-px h-16 relative overflow-hidden" style={{ background: "rgba(0,255,136,0.15)" }}>
          <div className="absolute top-0 left-0 w-full h-6"
            style={{ background: "linear-gradient(to bottom, var(--primary), transparent)", animation: "scrollDown 2s ease-in-out infinite" }} />
        </div>
        <span className="font-mono text-xs" style={{ color: "var(--fg-muted)", writingMode: "vertical-rl" }}>scroll</span>
      </div>

      <style>{`
        @keyframes scrollDown {
          0% { transform: translateY(-24px); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translateY(64px); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
