import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
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
} from "lucide-react";

// Modern Gradient Mesh Background with Aurora Effect
const AestheticBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let time = 0;

    // Aurora wave configuration
    const waves = [
      { amplitude: 80, frequency: 0.003, speed: 0.008, color: 'rgba(16, 185, 129, 0.15)', yOffset: 0.3 },
      { amplitude: 100, frequency: 0.002, speed: 0.006, color: 'rgba(6, 182, 212, 0.12)', yOffset: 0.4 },
      { amplitude: 70, frequency: 0.004, speed: 0.01, color: 'rgba(139, 92, 246, 0.1)', yOffset: 0.5 },
      { amplitude: 90, frequency: 0.0025, speed: 0.007, color: 'rgba(20, 184, 166, 0.08)', yOffset: 0.6 },
    ];

    // Floating gradient blobs
    const blobs = [
      { x: 0.2, y: 0.25, size: 0.4, speedX: 0.0002, speedY: 0.00015, color1: 'rgba(16, 185, 129, 0.12)', color2: 'transparent' },
      { x: 0.75, y: 0.65, size: 0.35, speedX: -0.00015, speedY: 0.0002, color1: 'rgba(6, 182, 212, 0.1)', color2: 'transparent' },
      { x: 0.5, y: 0.8, size: 0.45, speedX: 0.00018, speedY: -0.00012, color1: 'rgba(139, 92, 246, 0.08)', color2: 'transparent' },
    ];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 1;

      // Draw animated gradient blobs
      blobs.forEach(blob => {
        // Update position with smooth oscillation
        const offsetX = Math.sin(time * blob.speedX * 100) * 50;
        const offsetY = Math.cos(time * blob.speedY * 100) * 50;
        
        const x = blob.x * canvas.width + offsetX;
        const y = blob.y * canvas.height + offsetY;
        const size = blob.size * Math.min(canvas.width, canvas.height);

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, blob.color1);
        gradient.addColorStop(0.5, blob.color1.replace(/[\d.]+\)$/, '0.05)'));
        gradient.addColorStop(1, blob.color2);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw aurora waves
      waves.forEach(wave => {
        ctx.beginPath();
        const baseY = canvas.height * wave.yOffset;
        
        for (let x = 0; x <= canvas.width; x += 3) {
          const y = baseY + 
            Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude +
            Math.sin(x * wave.frequency * 1.5 + time * wave.speed * 0.8) * (wave.amplitude * 0.5);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        // Create gradient fill below the wave
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(0, baseY - wave.amplitude, 0, canvas.height);
        gradient.addColorStop(0, wave.color);
        gradient.addColorStop(0.5, wave.color.replace(/[\d.]+\)$/, '0.03)'));
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Add subtle noise/grain texture effect
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 8;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
      }
      ctx.putImageData(imageData, 0, 0);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const cleanup = initCanvas();
    return cleanup;
  }, [initCanvas]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

// Severity badge component
const SeverityBadge = ({ type, count }: { type: string; count: number }) => {
  const config: Record<string, { icon: JSX.Element; bg: string; text: string; border: string; glow: string }> = {
    H: {
      icon: <Flame className="w-3.5 h-3.5" />,
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/30",
      glow: "shadow-red-500/20",
    },
    M: {
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      bg: "bg-orange-500/10",
      text: "text-orange-400",
      border: "border-orange-500/30",
      glow: "shadow-orange-500/20",
    },
    L: {
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      bg: "bg-yellow-500/10",
      text: "text-yellow-400",
      border: "border-yellow-500/30",
      glow: "shadow-yellow-500/20",
    },
    I: {
      icon: <Info className="w-3.5 h-3.5" />,
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/30",
      glow: "shadow-blue-500/20",
    },
  };

  const c = config[type];
  if (!c) return null;

  return (
    <motion.div
      className={`flex items-center gap-1.5 px-2.5 py-1 ${c.bg} ${c.text} ${c.border} border rounded-lg shadow-lg ${c.glow}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      {c.icon}
      <span className="font-bold text-sm">{count}</span>
    </motion.div>
  );
};

// Parse findings string
const parseFindings = (findings: string) => {
  const result: { type: string; count: number }[] = [];
  const parts = findings.split(",").map(s => s.trim());
  
  parts.forEach(part => {
    const match = part.match(/(\d+)\s*([HMLI])/i);
    if (match) {
      result.push({ count: parseInt(match[1]), type: match[2].toUpperCase() });
    }
  });
  
  return result;
};

// Platform logos mapping
const platformLogos: Record<string, string> = {
  Cantina: "/cantina.png",
  Code4rena: "/c4-logo-icon.svg",
  Sherlock: "/sherlock.png",
};

// Protocol data with images - corrected findings
const protocols = [
  {
    name: "Octant V2-Core",
    image: "/octant-v2-core.webp",
    platform: "Cantina",
    type: "DeFi",
    findings: "1H, 2I",
    rank: "#6",
    link: "https://cantina.xyz/code/917d796b-48d0-41d0-bb40-be137b7d3db5/overview/leaderboard",
    twitter: "https://x.com/OctantApp",
    featured: true,
  },
  {
    name: "Pike Finance",
    image: "/pike.webp",
    platform: "Cantina",
    type: "Lending",
    findings: "1M, 1L",
    rank: "#7",
    link: "https://cantina.xyz/code/917d796b-48d0-41d0-bb40-be137b7d3db5/overview/leaderboard",
    twitter: "https://x.com/PikeFinance",
    featured: true,
  },
  {
    name: "Megapot",
    image: "/Megapot.webp",
    platform: "Code4rena",
    type: "DeFi",
    findings: "1L",
    rank: "#50",
    link: "https://code4rena.com/audits/2025-11-megapot/dashboard",
    twitter: "",
    featured: false,
  },
  {
    name: "Kuru",
    image: "/Kuru.webp",
    platform: "Cantina",
    type: "CLOB",
    findings: "1L, 2I",
    rank: "#24",
    link: "https://cantina.xyz/code/cdce21ba-b787-4df4-9c56-b31d085388e7/overview",
    twitter: "https://x.com/kaboratory0",
    featured: false,
  },
  {
    name: "Panoptic",
    image: "/Panoptic.webp",
    platform: "Code4rena",
    type: "Options",
    findings: "1M",
    rank: "#42",
    link: "https://code4rena.com/audits/2024-04-panoptic",
    twitter: "https://x.com/Panoptic_xyz",
    featured: false,
  },
  {
    name: "Mellow Vaults",
    image: "/Mellow.webp",
    platform: "Sherlock",
    type: "Vaults",
    findings: "1M",
    rank: "#43",
    link: "https://audits.sherlock.xyz/contests/964/leaderboard",
    twitter: "https://x.com/maboratory0",
    featured: false,
  },
  {
    name: "Malda",
    image: "/Malda.webp",
    platform: "Sherlock",
    type: "Lending",
    findings: "1M",
    rank: "#46",
    link: "https://audits.sherlock.xyz/contests/1029/leaderboard",
    twitter: "https://x.com/maboratory0",
    featured: false,
  },
];

const projects = [
  {
    title: "AI-Powered Yield Optimizer",
    description:
      "Yearn-style vaults with AI agents via Chainlink Automation for strategy rotation.",
    github: "https://github.com/nagatejakachapuram/yield-optimizer-prod",
    demo: "https://cipher-ai.vercel.app/",
    tags: ["DeFi", "AI Agents", "Chainlink"],
    icon: <Brain className="w-5 h-5" />,
  },
  {
    title: "Flare-AMM DEX",
    description:
      "Custom modular DEX supporting unique pricing curves and prediction markets on Flare.",
    github: "https://github.com/nagatejakachapuram/Flare-Dex-Prediction",
    demo: "https://dex-predication.vercel.app",
    tags: ["DEX", "Prediction Markets", "AMM"],
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    title: "Vale Finance",
    description:
      "Security-first DeFi protocol for lending, borrowing with advanced risk management.",
    github: "https://github.com/nagatejakachapuram/Vale-Finance",
    demo: "https://valefinancex.netlify.app/",
    tags: ["DeFi", "Lending", "Security"],
    icon: <Shield className="w-5 h-5" />,
  },
  {
    title: "web3AiX",
    description:
      "AI-powered Web3 platform integrating agents with blockchain infrastructure.",
    github: "https://github.com/nagatejakachapuram/web3AiX",
    demo: "https://web-ai-x.vercel.app/",
    tags: ["Web3", "AI", "Automation"],
    icon: <Sparkles className="w-5 h-5" />,
  },
];

function App() {
  const [activeTab, setActiveTab] = useState<"audits" | "projects">("audits");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredProtocol, setHoveredProtocol] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#05050a] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Aesthetic Animated Background */}
      <AestheticBackground />
      
      {/* Gradient Overlays */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[130px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-500/5 rounded-full blur-[180px]" />
        <div className="absolute top-1/4 right-1/3 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Scanline effect */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.03) 2px,
              rgba(255,255,255,0.03) 4px
            )`
          }}
        />

        {/* Vignette effect */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(5,5,10,0.4) 100%)'
          }}
        />
      </div>

      {/* Mobile Menu Button */}
      <motion.button
        className="fixed top-6 right-6 z-50 p-3 bg-neutral-900/90 backdrop-blur-xl rounded-xl border border-neutral-800 md:hidden shadow-xl"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        whileTap={{ scale: 0.95 }}
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </motion.button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[#05050a]/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[
              { href: "https://x.com/developerx_sec", icon: <img src="/X.png" alt="" className="w-6 h-6 object-contain" />, label: "X / Twitter" },
              { href: "https://github.com/nagatejakachapuram", icon: <img src="/github.webp" alt="" className="w-6 h-6 object-contain" />, label: "GitHub" },
              { href: "https://audits.sherlock.xyz/watson/DeveloperX", icon: <img src="/sherlock.png" alt="" className="w-6 h-6 object-contain" />, label: "Sherlock" },
              { href: "https://medium.com/@developerx-security", icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>, label: "Medium" },
            ].map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-2xl text-neutral-300 hover:text-emerald-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {item.icon} {item.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left Column - Profile */}
          <motion.div
            className="lg:col-span-4 lg:sticky lg:top-16 lg:self-start"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : -50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative">
              {/* Glow effect behind card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/20 via-cyan-600/20 to-emerald-600/20 rounded-[2rem] blur-xl opacity-50" />
              
              <div className="relative bg-gradient-to-br from-neutral-900/95 to-neutral-950/95 backdrop-blur-xl rounded-3xl p-8 border border-neutral-800/50 shadow-2xl">
                {/* Profile Image with glow */}
                <motion.div
                  className="relative w-36 h-36 mx-auto mb-8"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="absolute -inset-2 bg-gradient-to-br from-emerald-500 via-cyan-500 to-emerald-500 rounded-2xl opacity-30 blur-lg animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl rotate-6 opacity-40" />
                  <img
                    src="/IMG_1371.JPG"
                    alt="DeveloperX"
                    className="relative w-full h-full object-cover rounded-2xl border-2 border-neutral-700 shadow-2xl"
                  />
                  {/* Status badge */}
                  <motion.div 
                    className="absolute -bottom-3 -right-3 px-3 py-1.5 bg-emerald-500 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/30"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-black">AVAILABLE</span>
                  </motion.div>
                </motion.div>

                {/* Name & Title */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
                    DeveloperX
                  </h1>
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <p className="text-emerald-400 font-semibold text-sm tracking-wide uppercase">
                      Security Researcher
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-neutral-400 text-sm leading-relaxed text-center mb-8">
                  Smart contract security engineer & Core Developer @ <span className="text-white font-medium">BIFY</span>. 
                  Top auditor on Cantina. Breaking DeFi assumptions.
                </p>

                {/* Stats with icons */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { value: "7+", label: "Audits", icon: <Target className="w-4 h-4" /> },
                    { value: "#6", label: "Best Rank", icon: <Trophy className="w-4 h-4" />, highlight: true },
                    { value: "300+", label: "All-Time", icon: <Award className="w-4 h-4" /> },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      className={`text-center p-3 rounded-xl ${stat.highlight ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-neutral-800/30'}`}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      <div className={`flex justify-center mb-1 ${stat.highlight ? 'text-emerald-400' : 'text-neutral-500'}`}>
                        {stat.icon}
                      </div>
                      <div className={`text-xl font-bold ${stat.highlight ? 'text-emerald-400' : 'text-white'}`}>
                        {stat.value}
                      </div>
                      <div className="text-[10px] text-neutral-500 uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Expertise Tags */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {["DeFi", "Lending", "Vaults", "ZK", "Fuzzing"].map((tag) => (
                    <motion.span
                      key={tag}
                      className="px-3 py-1.5 bg-neutral-800/50 text-neutral-300 rounded-lg text-xs font-medium border border-neutral-700/50 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-default"
                      whileHover={{ scale: 1.05 }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>

                {/* Social Links with Custom Icons */}
                <div className="flex justify-center gap-3">
                  {/* X / Twitter */}
                  <motion.a
                    href="https://x.com/developerx_sec"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-neutral-800/50 hover:bg-neutral-700/50 rounded-xl transition-all duration-300 border border-neutral-700/50 hover:border-neutral-600 group"
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img 
                      src="/X.png" 
                      alt="X" 
                      className="w-5 h-5 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  </motion.a>
                  
                  {/* GitHub */}
                  <motion.a
                    href="https://github.com/nagatejakachapuram"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-neutral-800/50 hover:bg-neutral-700/50 rounded-xl transition-all duration-300 border border-neutral-700/50 hover:border-neutral-600 group"
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img 
                      src="/github.webp" 
                      alt="GitHub" 
                      className="w-5 h-5 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  </motion.a>
                  
                  {/* Discord */}
                  <motion.div
                    className="p-3 bg-neutral-800/50 hover:bg-indigo-500/10 rounded-xl transition-all duration-300 border border-neutral-700/50 hover:border-indigo-500/30 group relative cursor-pointer"
                    whileHover={{ y: -3, scale: 1.05 }}
                  >
                    <svg className="w-5 h-5 text-neutral-400 group-hover:text-indigo-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                    </svg>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-neutral-800 rounded-lg text-xs text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-neutral-700">
                      developerx_sec
                    </div>
                  </motion.div>
                  
                  {/* Sherlock Profile */}
                  <motion.a
                    href="https://audits.sherlock.xyz/watson/DeveloperX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-neutral-800/50 hover:bg-purple-500/10 rounded-xl transition-all duration-300 border border-neutral-700/50 hover:border-purple-500/30 group"
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img 
                      src="/sherlock.png" 
                      alt="Sherlock" 
                      className="w-5 h-5 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  </motion.a>
                  
                  {/* Medium */}
                  <motion.a
                    href="https://medium.com/@developerx-security"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-neutral-800/50 hover:bg-green-500/10 rounded-xl transition-all duration-300 border border-neutral-700/50 hover:border-green-500/30 group"
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5 text-neutral-400 group-hover:text-green-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                    </svg>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            className="lg:col-span-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            {/* About Me Section - Always visible */}
            <motion.div
              className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-neutral-900/60 to-neutral-950/60 border border-neutral-800/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs text-emerald-400 uppercase tracking-wider font-bold">About Me</span>
              </div>
              <p className="text-neutral-300 leading-relaxed mb-4">
                Smart contract security engineer and full-stack Web3 developer. My focus is adversarial testing, 
                securing DeFi primitives, and architecting infrastructure for AI-driven decentralized applications.
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="px-3 py-1.5 bg-neutral-800/50 text-neutral-400 rounded-lg border border-neutral-700/50">
                  Foundry Fuzz
                </span>
                <span className="px-3 py-1.5 bg-neutral-800/50 text-neutral-400 rounded-lg border border-neutral-700/50">
                  Echidna
                </span>
                <span className="px-3 py-1.5 bg-neutral-800/50 text-neutral-400 rounded-lg border border-neutral-700/50">
                  Slither
                </span>
                <span className="px-3 py-1.5 bg-neutral-800/50 text-neutral-400 rounded-lg border border-neutral-700/50">
                  ZK/Noir
                </span>
              </div>
            </motion.div>

            {/* Medium / Blog Section - Always visible */}
            <motion.div
              className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-neutral-900/60 to-neutral-950/60 border border-neutral-800/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-green-400 uppercase tracking-wider font-bold">Latest Article</span>
                </div>
                <motion.a
                  href="https://medium.com/@developerx-security"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors flex items-center gap-1"
                  whileHover={{ x: 3 }}
                >
                  View all on Medium <ExternalLink className="w-3 h-3" />
                </motion.a>
              </div>
              
              <motion.a
                href="https://medium.com/@developerx-security/how-to-hunt-3k-solo-mediums-like-a-professional-ac666bc5a1e1"
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
                whileHover={{ scale: 1.01 }}
              >
                <div className="p-4 rounded-xl bg-neutral-800/30 border border-neutral-700/30 hover:border-green-500/30 hover:bg-neutral-800/50 transition-all">
                  <h4 className="text-white font-semibold mb-2 group-hover:text-green-400 transition-colors">
                    How to Hunt $3K+ Solo Mediums Like a Professional
                  </h4>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                    A comprehensive guide on finding high-severity bugs in smart contract audits. Learn the methodology and mindset to consistently earn solo medium findings.
                  </p>
                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span className="px-2 py-1 bg-neutral-800 rounded">Security</span>
                    <span className="px-2 py-1 bg-neutral-800 rounded">Auditing</span>
                    <span className="px-2 py-1 bg-neutral-800 rounded">DeFi</span>
                  </div>
                </div>
              </motion.a>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 mb-8 p-1.5 bg-neutral-900/50 backdrop-blur-sm rounded-2xl border border-neutral-800/50 w-fit">
              {[
                { id: "audits", label: "Security Audits", icon: <Shield className="w-4 h-4" /> },
                { id: "projects", label: "Projects", icon: <Code className="w-4 h-4" /> },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                  whileHover={{ scale: activeTab === tab.id ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tab.icon}
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Audits Content */}
            <AnimatePresence mode="wait">
              {activeTab === "audits" && (
                <motion.div
                  key="audits"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Section Header with Compact Stats */}
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                    <div>
                      <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">
                        Security <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Audits</span>
                      </h2>
                      <p className="text-neutral-500">
                        High-impact findings from competitive audit platforms
                      </p>
                    </div>
                    {/* Compact Achievement Stats */}
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-amber-400 font-bold text-xs">#6</span>
                        <span className="text-neutral-500 text-[10px]">Best</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Target className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold text-xs">x2</span>
                        <span className="text-neutral-500 text-[10px]">Top 10</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Award className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-cyan-400 font-bold text-xs">300</span>
                        <span className="text-neutral-500 text-[10px]">All-Time</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-neutral-900/30 rounded-xl border border-neutral-800/50">
                    <span className="text-xs text-neutral-500 uppercase tracking-wider">Severity:</span>
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-red-400" />
                      <span className="text-xs text-neutral-400">High</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-xs text-neutral-400">Medium</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />
                      <span className="text-xs text-neutral-400">Low</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-xs text-neutral-400">Info</span>
                    </div>
                  </div>

                  {/* Protocol Cards Grid - 2 Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {protocols.map((protocol, index) => (
                      <motion.div
                        key={protocol.name}
                        className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 ${
                          hoveredProtocol === protocol.name
                            ? "bg-neutral-800/60 border-emerald-500/30 shadow-xl shadow-emerald-500/5"
                            : "bg-neutral-900/40 border-neutral-800/50 hover:bg-neutral-800/50"
                        }`}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        onMouseEnter={() => setHoveredProtocol(protocol.name)}
                        onMouseLeave={() => setHoveredProtocol(null)}
                        whileHover={{ y: -4 }}
                      >
                        {/* Featured ribbon */}
                        {protocol.featured && (
                          <div className="absolute top-4 right-4">
                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                              Featured
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-4 p-5">
                          {/* Protocol Image */}
                          <motion.div 
                            className="relative w-16 h-16 flex-shrink-0"
                            whileHover={{ scale: 1.05, rotate: 2 }}
                          >
                            <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                            <img
                              src={protocol.image}
                              alt={protocol.name}
                              className="relative w-full h-full object-cover rounded-lg border border-neutral-700 shadow-lg"
                            />
                          </motion.div>

                          {/* Protocol Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <h3 className="font-bold text-white text-base truncate group-hover:text-emerald-400 transition-colors">
                                {protocol.name}
                              </h3>
                              {/* Only show rank for top 10 finishes */}
                              {parseInt(protocol.rank.replace('#', '')) <= 10 && (
                                <motion.span 
                                  className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-xs font-bold border border-emerald-500/30"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  {protocol.rank}
                                </motion.span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 mb-3">
                              <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded text-xs font-medium flex items-center gap-1.5">
                                <img 
                                  src={platformLogos[protocol.platform]} 
                                  alt="" 
                                  className="w-3 h-3 object-contain"
                                />
                                {protocol.platform}
                              </span>
                              <span className="text-neutral-600">•</span>
                              <span className="text-xs text-neutral-500">{protocol.type}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              {/* Severity Badges */}
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {parseFindings(protocol.findings).map((finding, i) => (
                                  <SeverityBadge key={i} type={finding.type} count={finding.count} />
                                ))}
                              </div>

                              {/* Links */}
                              <div className="flex items-center gap-1.5">
                                {protocol.twitter && (
                                  <motion.a
                                    href={protocol.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 hover:bg-neutral-700/50 rounded-lg transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <img src="/X.png" alt="X" className="w-3.5 h-3.5 object-contain opacity-50 hover:opacity-100 transition-opacity" />
                                  </motion.a>
                                )}
                                <motion.a
                                  href={protocol.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-emerald-500/20 rounded-lg text-xs font-medium text-neutral-300 hover:text-emerald-400 transition-all border border-neutral-700 hover:border-emerald-500/30"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  View <ExternalLink className="w-3 h-3" />
                                </motion.a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* More Coming */}
                  <motion.div
                    className="mt-8 text-center py-10 border-2 border-dashed border-neutral-800/50 rounded-2xl bg-gradient-to-br from-neutral-900/20 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Zap className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
                    <p className="text-neutral-600 text-sm">More audits in progress...</p>
                  </motion.div>
                </motion.div>
              )}

              {/* Projects Content */}
              {activeTab === "projects" && (
                <motion.div
                  key="projects"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Section Header */}
                  <div className="mb-10">
                    <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">
                      R&D <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Projects</span>
                    </h2>
                    <p className="text-neutral-500 text-lg">
                      Building at the intersection of AI, DeFi, and security
                    </p>
                  </div>

                  {/* Current Deployment */}
                  <motion.div
                    className="relative overflow-hidden rounded-2xl mb-8 bg-neutral-900/40 border border-neutral-800/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="relative p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <motion.div 
                            className="flex items-center gap-3 mb-3"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50" />
                            <span className="text-xs text-emerald-400 uppercase tracking-wider font-bold">
                              Active Deployment
                            </span>
                          </motion.div>
                          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                            BIFY
                            <span className="text-sm font-normal text-neutral-500">• Base Network</span>
                          </h3>
                        </div>
                        <motion.a
                          href="https://x.com/BIFYOfficial"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-neutral-800/50 hover:bg-neutral-700/50 rounded-xl transition-colors border border-neutral-700/50 hover:border-neutral-600"
                          whileHover={{ scale: 1.05, y: -2 }}
                        >
                          <img src="/X.png" alt="X" className="w-5 h-5 object-contain opacity-70 hover:opacity-100 transition-opacity" />
                        </motion.a>
                      </div>
                      <p className="text-neutral-400 leading-relaxed max-w-2xl">
                        Core developer architecting an AI-powered NFT marketplace. Building secure smart contracts 
                        for minting, marketplace logic, and Real-World Asset (RWA) tokenization.
                      </p>
                      <div className="flex items-center gap-3 mt-6">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-neutral-500">Full-time engagement</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Projects Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((project, index) => (
                      <motion.div
                        key={project.title}
                        className="group relative overflow-hidden rounded-2xl bg-neutral-900/40 border border-neutral-800/50 hover:border-emerald-500/30 hover:bg-neutral-800/50 transition-all duration-500"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                      >
                        <div className="p-5">
                          <div className="flex items-start gap-4 mb-4">
                            <motion.div 
                              className="p-3 rounded-xl bg-neutral-800/80 border border-neutral-700/50 text-emerald-400"
                              whileHover={{ scale: 1.1 }}
                            >
                              {project.icon}
                            </motion.div>
                            <div className="flex-1">
                              <h3 className="font-bold text-white text-base mb-1 group-hover:text-emerald-400 transition-colors">
                                {project.title}
                              </h3>
                              <p className="text-neutral-500 text-sm leading-relaxed">
                                {project.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-neutral-800/50 text-neutral-400 rounded text-xs font-medium border border-neutral-700/30"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-2">
                            <motion.a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700/80 rounded-lg text-xs font-medium text-neutral-300 transition-all border border-neutral-700"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <img src="/github.webp" alt="" className="w-4 h-4 object-contain opacity-70" />
                              Code
                            </motion.a>
                            <motion.a
                              href={project.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-emerald-500/20 rounded-lg text-xs font-medium text-neutral-300 hover:text-emerald-400 transition-all border border-neutral-700 hover:border-emerald-500/30"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Live Demo
                              <ExternalLink className="w-3.5 h-3.5" />
                            </motion.a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-neutral-900/50 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-neutral-600 text-sm">
            © 2025 DeveloperX • Building secure DeFi
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
