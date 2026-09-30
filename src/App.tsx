import { useEffect, useLayoutEffect } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import CustomCursor from "./components/CustomCursor";
import EasterEgg from "./components/EasterEgg";
import Nav from "./components/Nav";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import SkillsSection from "./components/SkillsSection";
import ProjectsSection from "./components/ProjectsSection";
import ContactSection from "./components/ContactSection";

export default function App() {
  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    const selector = ".reveal, .reveal-left, .reveal-right";
    const timer = setTimeout(() => {
      document.querySelectorAll(selector).forEach(el => obs.observe(el));
    }, 100);
    return () => { clearTimeout(timer); obs.disconnect(); };
  }, []);

  return (
    <div style={{ background: "var(--bg)", color: "var(--fg)", minHeight: "100%" }}>
      <CustomCursor />
      <EasterEgg />
      <Nav />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
      <SpeedInsights />
    </div>
  );
}
