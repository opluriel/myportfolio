import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);
  const hovering = useRef(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!finePointer) return;

    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const enterLink = () => { hovering.current = true; };
    const leaveLink = () => { hovering.current = false; };

    document.addEventListener("mousemove", move);
    const hoverTargets = document.querySelectorAll("a, button, [data-hover]");
    hoverTargets.forEach(el => {
      el.addEventListener("mouseenter", enterLink);
      el.addEventListener("mouseleave", leaveLink);
    });

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      }
      if (ringRef.current) {
        const scale = hovering.current ? 1.8 : 1;
        ringRef.current.style.transform = `translate(${ring.current.x - 16}px, ${ring.current.y - 16}px) scale(${scale})`;
        ringRef.current.style.borderColor = hovering.current ? "rgba(123, 47, 255, 0.8)" : "rgba(0, 255, 136, 0.5)";
      }

      raf.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      document.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf.current);
      hoverTargets.forEach(el => {
        el.removeEventListener("mouseenter", enterLink);
        el.removeEventListener("mouseleave", leaveLink);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999] w-2 h-2 rounded-full"
        style={{ background: "#00FF88", boxShadow: "0 0 8px #00FF88" }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[99998] w-8 h-8 rounded-full border transition-[border-color,transform] duration-150"
        style={{ borderColor: "rgba(0, 255, 136, 0.5)", transition: "border-color 0.2s ease" }}
      />
    </>
  );
}
