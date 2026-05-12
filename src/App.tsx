import { Suspense, lazy, useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SecurityGuyTool from "./SecurityGuyTool";
import {
  ExternalLink,
  Shield,
  Code,
  Zap,
  Brain,
  TrendingUp,
  Sparkles,
  Menu,
  X,
  Trophy,
  AlertTriangle,
  AlertCircle,
  Info,
  Flame,
  Target,
  Award,
  CheckCircle,
  Wrench,
  Lock,
  Bot,
  Building2,
} from "lucide-react";

const ThreeParticlesBackground = lazy(() => import("./ThreeParticlesBackground"));

// ═══════════════════════════════════════════════════════════
// CUSTOM CYBER CURSOR
// ═══════════════════════════════════════════════════════════
const CyberCursor = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const dotRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${x}px`;
        dotRef.current.style.top  = `${y}px`;
      }
      if (outerRef.current) {
        outerRef.current.style.left = `${x}px`;
        outerRef.current.style.top  = `${y}px`;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      {/* Ring — amber, tiny CSS transition for subtle trail */}
      <div
        ref={outerRef}
        className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ top: -200, left: -200, transition: "left 60ms linear, top 60ms linear" }}
      >
        <div
          className="w-7 h-7 rounded-full"
          style={{
            border: "1px solid rgba(242,184,75,0.7)",
            boxShadow: "0 0 8px rgba(242,184,75,0.25)",
            mixBlendMode: "screen",
          }}
        />
      </div>
      {/* Dot — teal, no lag */}
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ top: -200, left: -200 }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: "#5eead4",
            boxShadow: "0 0 6px 2px rgba(94,234,212,0.8)",
          }}
        />
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// FALLING HEX DATA STREAM  (canvas — edges only)
// ═══════════════════════════════════════════════════════════
const CHARS = "0123456789ABCDEF";

interface Col { x: number; y: number; speed: number; chars: string[]; opacity: number; }

const DataStream = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number>();

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const SIZE   = 11;
    const EDGE   = Math.max(80, window.innerWidth * 0.07); // 7% of screen width
    const ROWS   = Math.ceil(window.innerHeight / SIZE) + 2;
    const makeCols = (xMin: number, xMax: number) => {
      const count = Math.floor((xMax - xMin) / SIZE);
      return Array.from({ length: count }, (_, i) => ({
        x: xMin + i * SIZE,
        y: -Math.random() * window.innerHeight,
        speed: 0.4 + Math.random() * 0.6,
        chars: Array.from({ length: ROWS }, () => CHARS[Math.floor(Math.random() * 16)]),
        opacity: 0.28 + Math.random() * 0.18,
      }));
    };

    let cols: Col[] = [];
    const buildCols = () => {
      const W = window.innerWidth;
      const E = Math.max(80, W * 0.07);
      cols = [...makeCols(0, E), ...makeCols(W - E, W)];
    };
    buildCols();
    window.addEventListener("resize", buildCols);

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${SIZE}px JetBrains Mono, monospace`;
      frame++;

      cols.forEach(col => {
        col.y += col.speed;
        if (col.y > canvas.height + SIZE * ROWS) col.y = -SIZE * ROWS;
        if (frame % 8 === 0) {
          const idx = Math.floor(Math.random() * col.chars.length);
          col.chars[idx] = CHARS[Math.floor(Math.random() * 16)];
        }
        col.chars.forEach((ch, row) => {
          const y = col.y + row * SIZE;
          if (y < -SIZE || y > canvas.height) return;
          // Lead char brighter
          const isLead = row === col.chars.length - 1;
          ctx.fillStyle = isLead
            ? `rgba(94,234,212,${col.opacity * 3})`
            : `rgba(94,234,212,${col.opacity})`;
          ctx.fillText(ch, col.x, y);
        });
      });

      raf.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", buildCols);
    };
  }, []);

  useEffect(() => {
    const cleanup = init();
    return cleanup;
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
};

// ═══════════════════════════════════════════════════════════
// 3-D TILT HOOK
// ═══════════════════════════════════════════════════════════
const useTilt = (intensity = 6) => {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r   = el.getBoundingClientRect();
    const x   = (e.clientX - r.left)  / r.width  - 0.5;
    const y   = (e.clientY - r.top)   / r.height - 0.5;
    // also drive the radial glow (card-glow CSS)
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
    el.style.transform  = `perspective(900px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) translateZ(10px)`;
    el.style.transition = "transform 0.08s ease";
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform  = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    el.style.transition = "transform 0.55s cubic-bezier(0.03,0.98,0.52,0.99)";
  };

  return { ref, onMouseMove, onMouseLeave };
};

// ═══════════════════════════════════════════════════════════
// FAKE BLOCK HASH  (deterministic from name string)
// ═══════════════════════════════════════════════════════════
const fakeHash = (seed: string) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
};

// ═══════════════════════════════════════════════════════════
// SEVERITY BADGE
// ═══════════════════════════════════════════════════════════
const SeverityBadge = ({ type, count }: { type: string; count: number }) => {
  const cfg: Record<string, { icon: JSX.Element; bg: string; text: string; border: string }> = {
    H: { icon: <Flame    className="w-3 h-3" />, bg: "bg-red-500/10",    text: "text-red-400",    border: "border-red-500/30" },
    M: { icon: <AlertTriangle className="w-3 h-3" />, bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30" },
    L: { icon: <AlertCircle  className="w-3 h-3" />, bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30" },
    I: { icon: <Info     className="w-3 h-3" />, bg: "bg-blue-500/10",   text: "text-blue-400",   border: "border-blue-500/30"  },
  };
  const c = cfg[type];
  if (!c) return null;
  return (
    <motion.span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold border ${c.bg} ${c.text} ${c.border}`}
      whileHover={{ scale: 1.08 }}
      transition={{ type: "spring", stiffness: 500 }}
    >
      {c.icon}{count}
    </motion.span>
  );
};

const parseFindings = (s: string) =>
  s.split(",").map(p => p.trim()).flatMap(p => {
    const m = p.match(/(\d+)\s*([HMLI])/i);
    return m ? [{ count: parseInt(m[1]), type: m[2].toUpperCase() }] : [];
  });

// ═══════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════
const platformLogos: Record<string, string> = {
  Cantina:   "/images/cantina.png",
  Code4rena: "/images/c4-logo-icon.svg",
  Sherlock:  "/images/sherlock.png",
};

const protocols = [
  { name: "Octant V2",                   image: "/images/octant-v2-core.webp", platform: "Cantina",   type: "DeFi",           findings: "1H, 2I",       rank: "#6",  link: "https://cantina.xyz/code/917d796b-48d0-41d0-bb40-be137b7d3db5/overview/leaderboard", twitter: "https://x.com/OctantApp",    featured: true  },
  { name: "Pike Finance",                 image: "/images/pike.webp",           platform: "Cantina",   type: "Lending",        findings: "1M, 1L",       rank: "#7",  link: "https://cantina.xyz/code/917d796b-48d0-41d0-bb40-be137b7d3db5/overview/leaderboard", twitter: "https://x.com/PikeFinance",  featured: true  },
  { name: "Reserve Governor",             image: "/images/reserve-governor.jpeg", platform: "Cantina", type: "DeFi",           findings: "1M, 1L",       rank: "",    link: "",                                                                                         twitter: "https://x.com/reserveprotocol", featured: false },
  { name: "Revert Finance",               image: "/images/revert-finance.png",  platform: "Cantina",   type: "DeFi",           findings: "2M",           rank: "",    link: "",                                                                                         twitter: "https://x.com/revertfinance", featured: false },
  { name: "Megapot",                      image: "/images/Megapot.webp",        platform: "Code4rena", type: "DeFi",           findings: "1L",           rank: "#50", link: "https://code4rena.com/audits/2025-11-megapot/dashboard",                            twitter: "https://x.com/megapot",     featured: false },
  { name: "Kuru",                         image: "/images/Kuru.webp",           platform: "Cantina",   type: "CLOB",           findings: "1L, 2I",       rank: "#24", link: "https://cantina.xyz/code/cdce21ba-b787-4df4-9c56-b31d085388e7/overview",           twitter: "https://x.com/KuruExchange", featured: false },
  { name: "Panoptic",                     image: "/images/Panoptic.webp",       platform: "Code4rena", type: "Options",        findings: "1M",           rank: "#42", link: "https://code4rena.com/audits/2024-04-panoptic",                                     twitter: "https://x.com/Panoptic_xyz", featured: false },
  { name: "Mellow Vaults",                image: "/images/Mellow.webp",         platform: "Sherlock",  type: "Vaults",         findings: "1M",           rank: "#43", link: "https://audits.sherlock.xyz/contests/964/leaderboard",                              twitter: "https://x.com/mellowprotocol", featured: false },
  { name: "Malda",                        image: "/images/Malda.webp",          platform: "Sherlock",  type: "Lending",        findings: "1M",           rank: "#46", link: "https://audits.sherlock.xyz/contests/1029/leaderboard",                             twitter: "https://x.com/malda_xyz",   featured: false },
  { name: "Chainlink Payment Abstraction V2", image: "/images/Chainlink.webp",  platform: "Code4rena", type: "Infrastructure", findings: "1L",           rank: "",    link: "https://code4rena.com/audits/2026-03-chainlink-payment-abstraction-v2",             twitter: "https://x.com/chainlink",   featured: false },
  { name: "Private Audit #1", image: "", platform: "Private", type: "Lending",      findings: "1H, 2M, 2L", rank: "", link: "", twitter: "", featured: false, isPrivate: true },
  { name: "Private Audit #2", image: "", platform: "Private", type: "DeFi / Vaults",findings: "2M, 3L",     rank: "", link: "", twitter: "", featured: false, isPrivate: true },
  { name: "Private Audit #3", image: "", platform: "Private", type: "Cross-chain",  findings: "1H, 1M",     rank: "", link: "", twitter: "", featured: false, isPrivate: true },
];

const projects = [
  { title: "AI-Powered Yield Optimizer",   desc: "Yearn-style vaults with AI agents via Chainlink Automation for strategy rotation.",                                                                                               github: "https://github.com/nagatejakachapuram/yield-optimizer-prod", demo: "https://cipher-ai.vercel.app/",        tags: ["DeFi","AI Agents","Chainlink"],           icon: <Brain      className="w-5 h-5" />, network: "Ethereum"  },
  { title: "Flare-AMM DEX",                desc: "Custom modular DEX supporting unique pricing curves and prediction markets on Flare.",                                                                                             github: "https://github.com/nagatejakachapuram/Flare-Dex-Prediction", demo: "https://dex-predication.vercel.app", tags: ["DEX","Prediction Markets","AMM"],          icon: <TrendingUp className="w-5 h-5" />, network: "Flare"     },
  { title: "Vale Finance",                  desc: "Security-first DeFi protocol for lending, borrowing with advanced risk management.",                                                                                              github: "https://github.com/nagatejakachapuram/Vale-Finance",          demo: "https://valefinancex.netlify.app/",    tags: ["DeFi","Lending","Security"],               icon: <Shield     className="w-5 h-5" />, network: "EVM"       },
  { title: "web3AiX",                       desc: "AI-powered Web3 platform integrating agents with blockchain infrastructure.",                                                                                                     github: "https://github.com/nagatejakachapuram/web3AiX",              demo: "https://web-ai-x.vercel.app/",         tags: ["Web3","AI","Automation"],                  icon: <Sparkles   className="w-5 h-5" />, network: "Multi"     },
  { title: "RWA Marketplace",               desc: "On-chain marketplace for tokenizing and trading Real World Assets using Circle's CCTP and W3S SDK — enabling compliant issuance, transfer, and settlement of RWA tokens across chains.", github: "", demo: "", tags: ["RWA","Circle SDK","Tokenization","Cross-chain"], icon: <Building2  className="w-5 h-5" />, network: "Base",    disableLinks: true },
  { title: "Trading Agent on Hyperliquid",  desc: "Autonomous trading agent on Hyperliquid perpetuals powered by Claude AI for decision-making, TradingView webhook signals, and custom on-chain metrics for entry/exit logic.",   github: "", demo: "", tags: ["Hyperliquid","Claude AI","TradingView","Automation"], icon: <Bot className="w-5 h-5" />, network: "Perps",   disableLinks: true },
];

// ═══════════════════════════════════════════════════════════
// PROTOCOL CARD
// ═══════════════════════════════════════════════════════════
const ProtocolCard = ({ protocol, index }: { protocol: typeof protocols[number]; index: number }) => {
  const tilt = useTilt(5);
  const isPrivate = (protocol as any).isPrivate;
  const isTop10   = protocol.rank && parseInt(protocol.rank.replace("#","")) <= 10;
  const hasReport = Boolean(protocol.link);
  const hasTwitter = Boolean(protocol.twitter);
  const hash      = fakeHash(protocol.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className={`circuit-card tilt-card card-glow rounded-2xl`}
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
    >
      <div
        className="group relative overflow-hidden rounded-2xl h-full"
        style={{
          background: "rgba(18,16,12,0.92)",
          border: "1px solid rgba(255,255,255,0.13)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Scan line sweeps on hover */}
        <div className="scan-line opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top ambient gradient */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "radial-gradient(ellipse at 50% -10%, rgba(94,234,212,0.22) 0%, transparent 65%)" }}
        />

        {/* Featured badge */}
        {protocol.featured && (
          <div className="absolute top-3 right-3 z-10">
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest font-mono"
              style={{
                background: "rgba(94,234,212,0.08)",
                border: "1px solid rgba(94,234,212,0.25)",
                color: "#5eead4",
              }}
            >
              featured
            </span>
          </div>
        )}

        <div className="flex items-center gap-4 p-5 pb-3">
          {/* Image */}
          <motion.div className="relative w-14 h-14 flex-shrink-0" whileHover={{ scale: 1.06 }}>
            <div
              className="absolute -inset-1 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "linear-gradient(135deg, rgba(94,234,212,0.25), rgba(242,184,75,0.15))" }}
            />
            {isPrivate ? (
              <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/[0.07] shadow-lg">
                <img src="/images/kann.png" alt="Kann Audits" className="w-full h-full object-cover" />
              </div>
            ) : (
              <img
                src={protocol.image}
                alt={protocol.name}
                className="relative w-full h-full object-cover rounded-xl shadow-lg"
                style={{ border: "1px solid rgba(255,255,255,0.07)" }}
              />
            )}
          </motion.div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-bold text-white text-sm truncate group-hover:text-teal-300 transition-colors duration-300">
                {protocol.name}
              </h3>
              {isTop10 && (
                <motion.span
                  className="px-1.5 py-0.5 rounded text-[10px] font-black font-mono flex-shrink-0"
                  style={{ background: "rgba(242,184,75,0.12)", border: "1px solid rgba(242,184,75,0.3)", color: "#f2b84b" }}
                  whileHover={{ scale: 1.1 }}
                >
                  {protocol.rank}
                </motion.span>
              )}
            </div>

            {/* Platform */}
            <div className="flex items-center gap-2 mb-2.5">
              {isPrivate ? (
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1.5 font-mono"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#9ca3af" }}
                >
                  <img src="/images/kann.png" alt="" className="w-3 h-3 object-contain rounded-full" />
                  Kann Audits
                </span>
              ) : (
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1.5 font-mono"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#9ca3af" }}
                >
                  <img src={platformLogos[protocol.platform]} alt="" className="w-3 h-3 object-contain" />
                  {protocol.platform}
                </span>
              )}
              <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
              <span className="text-[11px] font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>{protocol.type}</span>
            </div>

            {/* Findings + links */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 flex-wrap">
                {!isPrivate && parseFindings(protocol.findings).map((f, i) => (
                  <SeverityBadge key={i} type={f.type} count={f.count} />
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                {!isPrivate && (
                  hasTwitter ? (
                    <motion.a
                      href={protocol.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg transition-colors hover:bg-white/[0.05]"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={e => e.stopPropagation()}
                    >
                      <img src="/images/X.png" alt="X" className="w-3.5 h-3.5 object-contain opacity-40 hover:opacity-75 transition-opacity" />
                    </motion.a>
                  ) : (
                    <motion.button
                      type="button"
                      className="p-1.5 rounded-lg transition-colors hover:bg-white/[0.05]"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={e => e.stopPropagation()}
                    >
                      <img src="/images/X.png" alt="X" className="w-3.5 h-3.5 object-contain opacity-40 hover:opacity-75 transition-opacity" />
                    </motion.button>
                  )
                )}
                {isPrivate ? (
                  <span
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-mono select-none"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#4b5563" }}
                  >
                    <Lock className="w-2.5 h-2.5" />NDA
                  </span>
                ) : (
                  hasReport ? (
                    <motion.a
                      href={protocol.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all"
                      style={{ background: "rgba(94,234,212,0.06)", border: "1px solid rgba(94,234,212,0.18)", color: "#5eead4" }}
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(94,234,212,0.12)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </motion.a>
                  ) : (
                    <motion.button
                      type="button"
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all"
                      style={{ background: "rgba(94,234,212,0.06)", border: "1px solid rgba(94,234,212,0.18)", color: "#5eead4" }}
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(94,234,212,0.12)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </motion.button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Block hash footer */}
        <div
          className="flex items-center justify-between px-5 py-2 mt-1"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <span className="font-mono text-[9px]" style={{ color: "rgba(94,234,212,0.25)" }}>
            0x{hash}…
          </span>
          <span className="font-mono text-[9px]" style={{ color: "rgba(255,255,255,0.12)" }}>
            {isPrivate ? "ENCRYPTED" : "VERIFIED"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════
// PROJECT CARD
// ═══════════════════════════════════════════════════════════
const ProjectCard = ({ project, index }: { project: typeof projects[number]; index: number }) => {
  const tilt = useTilt(5);
  const hash = fakeHash(project.title);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="circuit-card tilt-card card-glow rounded-2xl"
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
    >
      <div
        className="group relative overflow-hidden rounded-2xl h-full"
        style={{
          background: "rgba(18,16,12,0.92)",
          border: "1px solid rgba(255,255,255,0.13)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="scan-line opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "radial-gradient(ellipse at 50% -10%, rgba(242,184,75,0.22) 0%, transparent 60%)" }}
        />

        <div className="p-5 pb-3">
          {/* Icon + title */}
          <div className="flex items-start gap-4 mb-3">
            <motion.div
              className="p-2.5 rounded-xl flex-shrink-0 relative"
              style={{ background: "rgba(94,234,212,0.07)", border: "1px solid rgba(94,234,212,0.15)", color: "#5eead4" }}
              whileHover={{ scale: 1.12, rotate: 5 }}
            >
              <div
                className="absolute inset-0 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(94,234,212,0.2)" }}
              />
              <span className="relative">{project.icon}</span>
            </motion.div>
            <div className="flex-1 min-w-0">
              {/* network chip */}
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="px-1.5 py-px rounded text-[9px] font-mono font-bold"
                  style={{ background: "rgba(242,184,75,0.08)", border: "1px solid rgba(242,184,75,0.2)", color: "#f2b84b" }}
                >
                  {(project as any).network ?? "EVM"}
                </span>
              </div>
              <h3 className="font-bold text-white text-sm mb-1 group-hover:text-teal-300 transition-colors duration-300">
                {project.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                {project.desc}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-[10px] font-medium font-mono"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)" }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          {!(project as any).disableLinks && (
            <div className="flex items-center gap-2">
              <motion.a href={project.github} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)" }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <img src="/images/github.webp" alt="" className="w-3.5 h-3.5 object-contain opacity-70" />Code
              </motion.a>
              <motion.a href={project.demo} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                style={{ background: "rgba(94,234,212,0.06)", border: "1px solid rgba(94,234,212,0.18)", color: "#5eead4" }}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(94,234,212,0.12)" }} whileTap={{ scale: 0.98 }}>
                Live Demo <ExternalLink className="w-3 h-3" />
              </motion.a>
            </div>
          )}
        </div>

        {/* Hash footer */}
        <div
          className="flex items-center justify-between px-5 py-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <span className="font-mono text-[9px]" style={{ color: "rgba(242,184,75,0.25)" }}>
            tx·0x{hash}
          </span>
          <span className="font-mono text-[9px]" style={{ color: "rgba(255,255,255,0.12)" }}>
            {(project as any).disableLinks ? "PRIVATE" : "DEPLOYED"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════
function App() {
  const [activeTab, setActiveTab] = useState<"audits" | "projects" | "tools">("audits");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => { setIsLoaded(true); }, []);

  return (
    <div className="min-h-screen text-white font-sans overflow-x-hidden" style={{ background: "#080705" }}>

      {/* Custom cursor */}
      <CyberCursor />

      {/* Three.js blockchain background */}
      <Suspense fallback={<div className="fixed inset-0 z-0" style={{ background: "#080705" }} />}>
        <ThreeParticlesBackground />
      </Suspense>

      {/* Falling hex data stream on edges */}
      <DataStream />

      {/* Cinematic compositing */}
      <div className="fixed inset-0 pointer-events-none z-[3]">
        {/* Radial vignette — keeps centre readable */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 48% 24%, transparent 0%, rgba(8,7,5,0.03) 48%, rgba(8,7,5,0.55) 100%)" }}
        />
        {/* Top aurora tint matching Three.js lights */}
        <div
          className="absolute inset-x-0 top-0 h-[34rem]"
          style={{ background: "linear-gradient(180deg, rgba(242,184,75,0.10), rgba(94,234,212,0.055) 48%, transparent)" }}
        />
        {/* Subtle hex grid */}
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage: "linear-gradient(rgba(94,234,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(94,234,212,0.5) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
            maskImage: "linear-gradient(to bottom, black, transparent 60%)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent 60%)",
          }}
        />
      </div>

      {/* Mobile menu button */}
      <motion.button
        className="fixed top-6 right-6 z-50 p-3 rounded-xl md:hidden shadow-xl"
        style={{ background: "rgba(8,7,5,0.85)", border: "1px solid rgba(94,234,212,0.15)", backdropFilter: "blur(16px)" }}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        whileTap={{ scale: 0.95 }}
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </motion.button>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 md:hidden"
            style={{ background: "rgba(8,7,5,0.97)", backdropFilter: "blur(24px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            {[
              { href: "https://x.com/developerx_sec",            icon: <img src="/images/X.png"       alt="" className="w-6 h-6 object-contain" />, label: "X / Twitter" },
              { href: "https://github.com/nagatejakachapuram",    icon: <img src="/images/github.webp" alt="" className="w-6 h-6 object-contain" />, label: "GitHub" },
              { href: "https://audits.sherlock.xyz/watson/DeveloperX", icon: <img src="/images/sherlock.png" alt="" className="w-6 h-6 object-contain" />, label: "Sherlock" },
              { href: "https://medium.com/@developerx-security", icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>, label: "Medium" },
            ].map((item, i) => (
              <motion.a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 text-xl"
                style={{ color: "rgba(255,255,255,0.7)" }}
                onClick={() => setMobileMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {item.icon}{item.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main layout ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

          {/* ════════════════════
              LEFT — Profile card
          ════════════════════ */}
          <motion.div
            className="lg:col-span-4 lg:sticky lg:top-16 lg:self-start"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : -50 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
          >
            <div className="relative">
              {/* Halo behind card */}
              <div
                className="absolute -inset-3 rounded-[2rem] blur-2xl opacity-40"
                style={{ background: "conic-gradient(from 0deg, rgba(94,234,212,0.15), rgba(242,184,75,0.1), rgba(255,107,53,0.08), rgba(94,234,212,0.15))" }}
              />

              <div
                className="relative circuit-card rounded-3xl p-8 shadow-2xl"
                style={{ background: "rgba(8,7,5,0.82)", backdropFilter: "blur(24px)", border: "1px solid rgba(94,234,212,0.12)" }}
              >
                {/* ── Avatar ── */}
                <motion.div
                  className="relative w-32 h-32 mx-auto mb-8"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <img
                    src="/images/IMG_1371.JPG"
                    alt="DeveloperX"
                    className="w-full h-full rounded-2xl object-cover"
                    style={{ border: "1px solid rgba(94,234,212,0.2)" }}
                  />

                  {/* Status badge */}
                  <motion.div
                    className="absolute -bottom-2 -right-2 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black"
                    style={{ background: "#5eead4", color: "#080705", boxShadow: "0 0 12px rgba(94,234,212,0.5)" }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full node-pulse relative"
                      style={{ background: "rgba(8,7,5,0.6)" }}
                    />
                    LIVE
                  </motion.div>
                </motion.div>

                {/* ── Name + role ── */}
                <div className="text-center mb-7">
                  <h1 className="text-3xl font-black text-white mb-2 tracking-tight">DeveloperX</h1>
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="w-3.5 h-3.5" style={{ color: "#5eead4" }} />
                    <p className="font-mono text-xs font-bold tracking-widest uppercase" style={{ color: "#5eead4" }}>
                      Security Researcher
                    </p>
                    <span className="term-cursor" />
                  </div>
                </div>

                {/* ── Bio ── */}
                <p className="text-xs leading-relaxed text-center mb-7" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Smart contract security engineer & Core Developer @{" "}
                  <span className="text-white font-semibold">BIFY</span>.{" "}
                  Security Intern @{" "}
                  <span className="text-white font-semibold">Kann Audits</span>.{" "}
                  Building AI security agents with{" "}
                  <span style={{ color: "#f2b84b" }} className="font-semibold">Claude</span>. Breaking DeFi assumptions.
                </p>

                {/* ── Stats ── */}
                <div className="grid grid-cols-3 gap-3 mb-7">
                  {[
                    { val: "15+",  label: "Audits",    icon: <Target className="w-3.5 h-3.5" />,  hi: false },
                    { val: "#6",   label: "Best Rank", icon: <Trophy className="w-3.5 h-3.5" />,  hi: true  },
                    { val: "300+", label: "All-Time",  icon: <Award  className="w-3.5 h-3.5" />,  hi: false },
                  ].map(s => (
                    <motion.div
                      key={s.label}
                      className="text-center p-3 rounded-xl transition-all duration-300"
                      style={s.hi
                        ? { background: "rgba(94,234,212,0.07)", border: "1px solid rgba(94,234,212,0.2)", boxShadow: "0 0 16px rgba(94,234,212,0.08)" }
                        : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }
                      }
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      <div className="flex justify-center mb-1" style={{ color: s.hi ? "#5eead4" : "rgba(255,255,255,0.25)" }}>
                        {s.icon}
                      </div>
                      <div className="text-xl font-black font-mono" style={{ color: s.hi ? "#5eead4" : "#fff" }}>
                        {s.val}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest mt-0.5 font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>
                        {s.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* ── Expertise tags ── */}
                <div className="flex flex-wrap justify-center gap-2 mb-7">
                  {[
                    { label: "DeFi",    ai: false },
                    { label: "Lending", ai: false },
                    { label: "Vaults",  ai: false },
                    { label: "ZK",      ai: false },
                    { label: "Fuzzing", ai: false },
                    { label: "Claude AI",  ai: true },
                    { label: "AI Agents",  ai: true },
                  ].map(t => (
                    <motion.span
                      key={t.label}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-medium font-mono transition-all"
                      style={t.ai
                        ? { background: "rgba(242,184,75,0.07)", border: "1px solid rgba(242,184,75,0.2)", color: "#f2b84b" }
                        : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }
                      }
                      whileHover={{ scale: 1.05 }}
                    >
                      {t.label}
                    </motion.span>
                  ))}
                </div>

                {/* ── Social links ── */}
                <div className="flex justify-center gap-2">
                  {[
                    { href: "https://x.com/developerx_sec",         img: "/images/X.png",       alt: "X" },
                    { href: "https://github.com/nagatejakachapuram", img: "/images/github.webp", alt: "GitHub" },
                    { href: "https://audits.sherlock.xyz/watson/DeveloperX", img: "/images/sherlock.png", alt: "Sherlock" },
                  ].map(s => (
                    <motion.a key={s.alt} href={s.href} target="_blank" rel="noopener noreferrer"
                      className="p-3 rounded-xl transition-all group"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 0 14px rgba(94,234,212,0.08)",
                      }}
                      whileHover={{ y: -3, scale: 1.05, borderColor: "rgba(94,234,212,0.25)" }}
                      whileTap={{ scale: 0.95 }}>
                      <img
                        src={s.img}
                        alt={s.alt}
                        className={`w-4 h-4 object-contain transition-all ${s.alt === "GitHub" ? "opacity-95 group-hover:opacity-100" : "opacity-75 group-hover:opacity-100"}`}
                        style={{
                          filter: s.alt === "GitHub"
                            ? "drop-shadow(0 0 9px rgba(255,255,255,0.48))"
                            : "drop-shadow(0 0 7px rgba(94,234,212,0.25))",
                        }}
                      />
                    </motion.a>
                  ))}
                  {/* Discord */}
                  <motion.div
                    className="p-3 rounded-xl transition-all group relative"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 0 14px rgba(129,140,248,0.10)",
                    }}
                    whileHover={{ y: -3, scale: 1.05 }}
                  >
                    <svg
                      className="w-4 h-4 opacity-80 group-hover:opacity-100 transition-all"
                      style={{ color: "#818cf8", filter: "drop-shadow(0 0 8px rgba(129,140,248,0.35))" }}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                    </svg>
                    <div
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                      style={{ background: "rgba(8,7,5,0.95)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}
                    >
                      developerx_sec
                    </div>
                  </motion.div>
                  {/* Medium */}
                  <motion.a href="https://medium.com/@developerx-security" target="_blank" rel="noopener noreferrer"
                    className="p-3 rounded-xl transition-all group"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 0 14px rgba(74,222,128,0.10)",
                    }}
                    whileHover={{ y: -3, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <svg
                      className="w-4 h-4 opacity-80 group-hover:opacity-100 transition-all"
                      style={{ color: "#4ade80", filter: "drop-shadow(0 0 8px rgba(74,222,128,0.35))" }}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                    </svg>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ════════════════════
              RIGHT — Content
          ════════════════════ */}
          <motion.div
            className="lg:col-span-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
            transition={{ duration: 0.85, delay: 0.3, ease: "easeOut" }}
          >
            {/* ── About ── */}
            <motion.div
              className="mb-8 p-6 rounded-2xl circuit-card"
              style={{ background: "rgba(18,16,12,0.90)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(20px)" }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-1.5 rounded-full node-pulse" style={{ background: "#5eead4" }} />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: "#5eead4" }}>
                  About Me
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
                Smart contract security engineer and full-stack Web3 developer. Security Intern at{" "}
                <span className="text-white font-semibold">Kann Audits</span>. Building autonomous AI security agents
                powered by <span style={{ color: "#f2b84b" }} className="font-semibold">Claude</span> — running full
                multi-agent audit pipelines end-to-end. Adversarial testing, DeFi primitive security, and
                AI-driven decentralized infrastructure.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { l: "Foundry Fuzz", ai: false }, { l: "Echidna", ai: false },
                  { l: "Slither", ai: false },       { l: "ZK/Noir", ai: false },
                  { l: "Claude AI", ai: true },       { l: "AI Agents", ai: true },
                ].map(t => (
                  <span key={t.l} className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium"
                    style={t.ai
                      ? { background: "rgba(242,184,75,0.07)", border: "1px solid rgba(242,184,75,0.2)", color: "#f2b84b" }
                      : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }
                    }>
                    {t.l}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* ── Blog ── */}
            <motion.div
              className="mb-10 p-6 rounded-2xl circuit-card"
              style={{ background: "rgba(18,16,12,0.90)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(20px)" }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#4ade80", boxShadow: "0 0 6px rgba(74,222,128,0.5)" }} />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: "#4ade80" }}>Latest Article</span>
                </div>
                <motion.a href="https://medium.com/@developerx-security" target="_blank" rel="noopener noreferrer"
                  className="text-[10px] font-mono flex items-center gap-1 transition-colors" style={{ color: "rgba(255,255,255,0.3)" }}
                  whileHover={{ x: 3, color: "rgba(255,255,255,0.6)" }}>
                  View all <ExternalLink className="w-2.5 h-2.5" />
                </motion.a>
              </div>
              <motion.a href="https://medium.com/@developerx-security/how-to-hunt-3k-solo-mediums-like-a-professional-ac666bc5a1e1"
                target="_blank" rel="noopener noreferrer" className="block group" whileHover={{ scale: 1.01 }}>
                <div className="p-4 rounded-xl transition-all"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(74,222,128,0.2)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)")}>
                  <h4 className="text-white text-sm font-semibold mb-2 group-hover:text-green-400 transition-colors">
                    How to Hunt $3K+ Solo Mediums Like a Professional
                  </h4>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
                    A comprehensive guide on finding high-severity bugs in smart contract audits. The methodology and mindset to consistently earn solo medium findings.
                  </p>
                  <div className="flex items-center gap-2">
                    {["Security","Auditing","DeFi"].map(t => (
                      <span key={t} className="px-2 py-0.5 rounded text-[9px] font-mono"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.a>
            </motion.div>

            {/* ── Tab navigation ── */}
            <div
              className="flex items-center gap-1 mb-8 p-1.5 rounded-2xl w-fit"
              style={{ background: "rgba(8,7,5,0.8)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}
            >
              {[
                { id: "audits",   label: "Security Audits", icon: <Shield className="w-3.5 h-3.5" /> },
                { id: "projects", label: "Projects",        icon: <Code   className="w-3.5 h-3.5" /> },
                { id: "tools",    label: "Tools",           icon: <Wrench className="w-3.5 h-3.5" /> },
              ].map(tab => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs transition-all duration-300 flex items-center gap-2 font-mono"
                  style={activeTab === tab.id
                    ? { background: "rgba(94,234,212,0.1)", color: "#5eead4", border: "1px solid rgba(94,234,212,0.25)" }
                    : { color: "rgba(255,255,255,0.35)", border: "1px solid transparent" }
                  }
                  whileHover={{ scale: activeTab === tab.id ? 1 : 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {tab.icon}{tab.label}
                </motion.button>
              ))}
            </div>

            {/* ── Tab content ── */}
            <AnimatePresence mode="wait">

              {/* AUDITS */}
              {activeTab === "audits" && (
                <motion.div key="audits"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>

                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                    <div>
                      <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
                        Security{" "}
                        <span className="glitch gradient-text" data-text="Audits">Audits</span>
                      </h2>
                      <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
                        High-impact findings from competitive audit platforms
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {[
                        { icon: <Trophy className="w-3 h-3" />, val: "#6",  sub: "Best",   c: "rgba(242,184,75" },
                        { icon: <Target className="w-3 h-3" />, val: "×2",  sub: "Top 10", c: "rgba(94,234,212" },
                        { icon: <Award  className="w-3 h-3" />, val: "300", sub: "Points", c: "rgba(94,234,212" },
                      ].map(s => (
                        <motion.div key={s.sub}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-mono"
                          style={{ background: `${s.c},0.08)`, border: `1px solid ${s.c},0.2)`, color: `${s.c},1)` }}
                          whileHover={{ scale: 1.05 }}>
                          {s.icon}
                          <span className="font-black text-xs text-white">{s.val}</span>
                          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>{s.sub}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Legend */}
                  <div
                    className="flex flex-wrap items-center gap-4 mb-8 px-4 py-3 rounded-xl font-mono"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <span className="text-[9px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>Severity:</span>
                    {[
                      { icon: <Flame className="w-3 h-3 text-red-400" />,         label: "High" },
                      { icon: <AlertTriangle className="w-3 h-3 text-orange-400" />, label: "Medium" },
                      { icon: <AlertCircle   className="w-3 h-3 text-yellow-400" />, label: "Low" },
                      { icon: <Info          className="w-3 h-3 text-blue-400"   />, label: "Info" },
                    ].map(l => (
                      <div key={l.label} className="flex items-center gap-1.5">
                        {l.icon}
                        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{l.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {protocols.map((p, i) => <ProtocolCard key={p.name} protocol={p} index={i} />)}
                  </div>

                  {/* Footer */}
                  <motion.div
                    className="mt-8 text-center py-10 rounded-2xl"
                    style={{ border: "1px dashed rgba(255,255,255,0.06)" }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                  >
                    <Zap className="w-7 h-7 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.1)" }} />
                    <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
                      // more audits in progress…
                    </p>
                  </motion.div>
                </motion.div>
              )}

              {/* PROJECTS */}
              {activeTab === "projects" && (
                <motion.div key="projects"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>

                  <div className="mb-10">
                    <h2 className="text-4xl font-black text-white mb-3 tracking-tight">
                      R&D{" "}
                      <span className="glitch gradient-text" data-text="Projects">Projects</span>
                    </h2>
                    <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
                      Building at the intersection of AI, DeFi, and security
                    </p>
                  </div>

                  {/* Active deployment */}
                  <motion.div
                    className="relative overflow-hidden rounded-2xl mb-8 circuit-card"
                    style={{ background: "rgba(10,9,7,0.78)", border: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  >
                    {/* Holographic shimmer */}
                    <div className="absolute inset-0 rounded-2xl holographic opacity-60 pointer-events-none" />
                    <div className="relative p-6">
                      <div className="flex items-start justify-between mb-5">
                        <div>
                          <motion.div className="flex items-center gap-3 mb-3"
                            animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                            <div className="w-2.5 h-2.5 rounded-full node-pulse" style={{ background: "#5eead4" }} />
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: "#5eead4" }}>
                              Active Deployment
                            </span>
                          </motion.div>
                          <h3 className="text-2xl font-black text-white flex items-center gap-3">
                            BIFY
                            <span className="text-xs font-mono font-normal" style={{ color: "rgba(255,255,255,0.3)" }}>· Base Network</span>
                          </h3>
                        </div>
                        <motion.a href="https://x.com/BIFYOfficial" target="_blank" rel="noopener noreferrer"
                          className="p-2.5 rounded-xl transition-all group"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                          whileHover={{ scale: 1.05, y: -2 }}>
                          <img src="/images/X.png" alt="X" className="w-4 h-4 object-contain opacity-40 group-hover:opacity-70 transition-opacity" />
                        </motion.a>
                      </div>
                      <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "rgba(255,255,255,0.45)" }}>
                        Core developer architecting an AI-powered NFT marketplace. Building secure smart contracts
                        for minting, marketplace logic, and Real-World Asset (RWA) tokenization.
                      </p>
                      <div className="flex items-center gap-2 mt-5">
                        <CheckCircle className="w-3.5 h-3.5" style={{ color: "#5eead4" }} />
                        <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>Full-time engagement</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Projects grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((p, i) => <ProjectCard key={p.title} project={p} index={i} />)}
                  </div>
                </motion.div>
              )}

              {/* TOOLS */}
              {activeTab === "tools" && (
                <motion.div key="tools"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
                  <SecurityGuyTool />
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 mt-20" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.18)" }}>
            © 2025 DeveloperX · Building secure DeFi
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
