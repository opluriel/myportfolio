import { useState, useRef, useEffect } from "react";
import { sendContact } from "../services/api";
import type { ContactForm } from "../types";

type Line = { type: "prompt" | "output" | "success" | "error"; text: string };

const GREETING: Line[] = [
  { type: "output", text: "  ╔══════════════════════════════════╗" },
  { type: "output", text: "  ║  portfolio.contact v1.0.0        ║" },
  { type: "output", text: "  ╚══════════════════════════════════╝" },
  { type: "output", text: "" },
  { type: "output", text: "  Bienvenue ! Remplissez le formulaire" },
  { type: "output", text: "  ou tapez 'help' pour les commandes." },
  { type: "output", text: "" },
];

export default function ContactSection() {
  const [lines, setLines] = useState<Line[]>([
    ...GREETING,
    { type: "prompt", text: "  > Votre nom :" },
  ]);
  const [stage, setStage] = useState<"name" | "email" | "message" | "done">("name");
  const [input, setInput] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const termRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const prompt = stage === "name"
    ? "nom_complet"
    : stage === "email"
      ? "email"
      : stage === "message"
        ? "message"
        : "$";

  const addLine = (line: Line) => setLines(l => [...l, line]);

  useEffect(() => {
    termRef.current?.scrollTo({ top: termRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const handleSend = async (contact: ContactForm) => {
    setSending(true);
    addLine({ type: "output", text: "" });
    addLine({ type: "output", text: "  Envoi en cours..." });
    try {
      await sendContact(contact);
      addLine({ type: "success", text: "  ✓ Message transmis avec succès." });
      addLine({ type: "output", text: "" });
      addLine({ type: "output", text: "  Je vous réponds sous 24h. Merci !" });
      setStage("done");
      setSent(true);
    } catch (error) {
      addLine({ type: "error", text: `  ✗ ${error instanceof Error ? error.message : "Échec de l'envoi. Réessayez plus tard."}` });
      setStage("message");
      setInput(contact.message);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = input.trim();
    if (!val) return;

    if (val.toLowerCase() === "help") {
      addLine({ type: "output", text: `  ${val}` });
      addLine({ type: "output", text: "" });
      addLine({ type: "output", text: "  Commandes : help, clear, quit" });
      addLine({ type: "output", text: "" });
      setInput("");
      return;
    }
    if (val.toLowerCase() === "clear") {
      setLines([]);
      setInput("");
      return;
    }

    addLine({ type: "prompt", text: `  > ${val}` });

    if (stage === "name") {
      if (val.length > 100) {
        addLine({ type: "error", text: "  ✗ Nom trop long (100 caractères maximum). Réessayez :" });
        setInput("");
        return;
      }
      setForm(f => ({ ...f, name: val }));
      addLine({ type: "output", text: `  Bonjour, ${val} !` });
      addLine({ type: "output", text: "" });
      addLine({ type: "prompt", text: "  > Votre email :" });
      setStage("email");
    } else if (stage === "email") {
      if (val.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        addLine({ type: "error", text: "  ✗ Email invalide. Réessayez :" });
      } else {
        setForm(f => ({ ...f, email: val }));
        addLine({ type: "output", text: "" });
        addLine({ type: "prompt", text: "  > Votre message :" });
        setStage("message");
      }
    } else if (stage === "message") {
      if (val.length > 5000) {
        addLine({ type: "error", text: "  ✗ Message trop long (5 000 caractères maximum). Réessayez :" });
        setInput("");
        return;
      }
      setForm(f => ({ ...f, message: val }));
      addLine({ type: "output", text: "" });
      addLine({ type: "output", text: `  Récapitulatif :` });
      addLine({ type: "output", text: `  • Nom     : ${form.name}` });
      addLine({ type: "output", text: `  • Email   : ${form.email}` });
      addLine({ type: "output", text: `  • Message : ${val.slice(0, 40)}${val.length > 40 ? "..." : ""}` });
      addLine({ type: "output", text: "" });
      void handleSend({ ...form, message: val, website: honeypot });
    }

    setInput("");
  };

  const lineColor = (type: Line["type"]) => {
    if (type === "prompt") return "var(--cyan)";
    if (type === "success") return "var(--primary)";
    if (type === "error") return "#FF5F57";
    return "var(--fg-muted)";
  };

  return (
    <section id="contact" className="py-28 px-8 md:px-16 lg:px-24 relative overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto">
        <div className="reveal mb-16 flex items-center gap-4">
          <span className="font-mono text-xs" style={{ color: "var(--fg-muted)" }}>05.</span>
          <h2 className="font-mono font-bold text-4xl" style={{ color: "var(--fg)" }}>Contact</h2>
          <div className="h-px flex-1 max-w-xs" style={{ background: "linear-gradient(to right, var(--border), transparent)" }} />
          <span className="font-mono text-xs px-2 py-1 border" style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>
            OPEN TO WORK
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left — info */}
          <div className="reveal-left space-y-6">
            <div>
              <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--fg-muted)" }}>
                Disponible pour des missions freelance, des projets data/web, ou simplement
                pour échanger autour d'une idée. Mon terminal est ouvert.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: "✉", label: "Email", val: "adamadevmail@gmail.com", color: "var(--primary)" },
                { icon: "◈", label: "LinkedIn", val: "www.linkedin.com/in/adama-ouedraogo-430150183", color: "var(--cyan)" },
                { icon: "⬡", label: "GitHub", val: "github.com/opluriel", color: "var(--violet)" },
                { icon: "◎", label: "Localisation", val: "Abidjan, Côte d'Ivoire · Remote OK", color: "var(--primary)" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-4 p-4 border rounded-sm group hover:border-opacity-60 transition-all duration-200"
                  style={{ borderColor: "var(--border)", background: "var(--card2)" }}>
                  <span className="font-mono text-lg" style={{ color: item.color }}>{item.icon}</span>
                  <div>
                    <p className="font-mono text-xs" style={{ color: "var(--fg-muted)" }}>{item.label}</p>
                    <p className="font-mono text-sm" style={{ color: "var(--fg)" }}>{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — terminal form */}
          <div className="reveal-right">
            <div className="rounded-sm border overflow-hidden" style={{ borderColor: "rgba(0,255,136,0.2)", boxShadow: "0 0 40px rgba(0,255,136,0.06)" }}>
              {/* Chrome */}
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(0,255,136,0.1)", background: "rgba(0,0,0,0.4)" }}>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: "#28CA41" }} />
                </div>
                <span className="font-mono text-xs" style={{ color: "var(--fg-muted)" }}>
                  contact.sh — ouedraogo@portfolio
                </span>
                <span className="font-mono text-xs" style={{ color: "var(--primary)" }}>
                  <span className="pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-current mr-1" />
                  live
                </span>
              </div>

              {/* Output */}
              <div ref={termRef} className="font-mono text-xs p-4 h-72 overflow-y-auto space-y-0.5" style={{ background: "#040810" }}>
                {lines.map((l, i) => (
                  <div key={i} style={{ color: lineColor(l.type) }}>{l.text || <>&nbsp;</>}</div>
                ))}
                {!sent && (
                  <div style={{ color: "var(--fg-muted)" }}>&nbsp;</div>
                )}
              </div>

              {/* Input */}
              {!sent ? (
                <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t" style={{ borderColor: "rgba(0,255,136,0.1)", background: "#040810" }}>
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={event => setHoneypot(event.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute w-px h-px overflow-hidden opacity-0"
                  />
                  <span className="font-mono text-xs flex-shrink-0" style={{ color: "var(--primary)" }}>
                    {prompt}&nbsp;<span style={{ color: "var(--fg-muted)" }}>$</span>
                  </span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={sending || sent}
                    className="flex-1 bg-transparent outline-none font-mono text-xs caret-[var(--primary)]"
                    style={{ color: "var(--fg)", caretColor: "var(--primary)" }}
                    autoFocus
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <span className="cursor-blink" style={{ color: "var(--primary)" }}>█</span>
                  <button type="submit" className="sr-only">
                    Valider
                  </button>
                </form>
              ) : (
                <div className="px-4 py-3 border-t flex items-center gap-3" style={{ borderColor: "rgba(0,255,136,0.1)", background: "#040810" }}>
                  <span className="font-mono text-xs" style={{ color: "var(--primary)" }}>✓ Message envoyé</span>
                  <button onClick={() => { setLines(GREETING); setStage("name"); setForm({ name: "", email: "", message: "" }); setHoneypot(""); setSent(false); setTimeout(() => addLine({ type: "prompt", text: "  > Votre nom :" }), 10); }}
                    className="font-mono text-xs ml-auto px-3 py-1 border transition-all duration-200 hover:border-[var(--primary)]"
                    style={{ borderColor: "var(--border)", color: "var(--fg-muted)" }}>
                    reset
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="reveal mt-20 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: "var(--border)" }}>
          <p className="font-mono text-xs" style={{ color: "var(--fg-muted)" }}>
            © 2026  Ouedraogo Adama · Conçu & développé avec <span style={{ color: "var(--primary)" }}>♥</span>
          </p>
          <p className="font-mono text-xs" style={{ color: "var(--fg-muted)" }}>
            <span style={{ color: "var(--violet)" }}>React</span> × <span style={{ color: "var(--cyan)" }}>TypeScript</span> × <span style={{ color: "var(--primary)" }}>Vite</span>
          </p>
        </div>
      </div>
    </section>
  );
}
