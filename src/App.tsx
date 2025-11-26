import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  ExternalLink,
  Linkedin,
  Code,
  Zap,
  Shield,
  TestTube,
  Link as LinkIcon,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Rocket,
  Brain,
  TrendingUp,
  // Blocks,
  // GitPullRequestDraft,
  // Lock,
  // Server,
  // Activity,
  CircuitBoard,
  // Cpu, // REMOVED: No longer needed for blinking pink stuff
  Terminal,
  Trophy,
  Award,
  Mail,
  MessageCircle,
  Twitter,
  CheckCircle,
} from "lucide-react";

// Import the Three.js particle background component
import ThreeParticlesBackground from "./ThreeParticlesBackground";

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      const sections = ["about", "status", "audits", "deployment", "tech", "projects", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const techStack = [
    {
      category: "Smart Contracts",
      tools: "Solidity, Foundry, Hardhat",
      icon: <Code className="w-5 h-5" />,
    },
    {
      category: "Security",
      tools: "Foundry Fuzz, Echidna, Slither, Mythril",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      category: "ZK/Privacy",
      tools: "Noir, Circom, SnarkJS",
      icon: <CircuitBoard className="w-5 h-5" />,
    },
    {
      category: "AI Agents",
      tools: "ElizaOS Plugins, TypeScript, Python",
      icon: <Brain className="w-5 h-5" />,
    },
    {
      category: "Infrastructure",
      tools: "Chainlink Automation, OZ Upgrades",
      icon: <LinkIcon className="w-5 h-5" />,
    },
  ];

  const auditFindings = [
    {
      protocol: "Octant V2-Core",
      type: "DeFi",
      platform: "Cantina",
      findings: "1 High, 2 Info",
      rank: "#6",
      link: "https://cantina.xyz/code/917d796b-48d0-41d0-bb40-be137b7d3db5/overview/leaderboard",
    },
    {
      protocol: "Pike Finance",
      type: "Lending",
      platform: "Cantina",
      findings: "1 Med (Solo), 1 Low",
      rank: "#7",
      link: "https://cantina.xyz/code/917d796b-48d0-41d0-bb40-be137b7d3db5/overview/leaderboard",
    },
    {
      protocol: "Mellow Flexible Vaults",
      type: "Vaults",
      platform: "Sherlock",
      findings: "1 Med",
      rank: "#43",
      link: "https://audits.sherlock.xyz/contests/964/leaderboard",
    },
    {
      protocol: "Malda",
      type: "Lending",
      platform: "Sherlock",
      findings: "1 Med",
      rank: "#46",
      link: "https://audits.sherlock.xyz/contests/1029/leaderboard",
    },
    {
      protocol: "Kuru",
      type: "CLOB",
      platform: "Cantina",
      findings: "1 Low, 2 Info",
      rank: "Results",
      link: "https://cantina.xyz/code/cdce21ba-b787-4df4-9c56-b31d085388e7/overview",
    },
    {
      protocol: "Megapot",
      type: "DeFi",
      platform: "Code4rena",
      findings: "1 Low",
      rank: "Pending",
      link: "#",
    },
  ];

  const projects = [
    {
      title: "AI-Powered Yield Optimizer",
      description:
        "Yearn-style vaults where strategy rotation is dictated by off-chain ElizaOS AI agents via Chainlink Automation. Advanced DeFi yield optimization platform with AI-driven decision making.",
      github: "https://github.com/nagatejakachapuram/yield-optimizer-prod",
      demo: "https://cipher-ai.vercel.app/",
      tags: [
        "DeFi",
        "AI Agents",
        "Yield Farming",
        "Chainlink Automation",
        "ElizaOS",
      ],
      icon: <Brain className="w-8 h-8" />,
      color: "text-amber-400",
    },
    {
      title: "Flare-AMM DEX",
      description:
        "A custom-built modular DEX supporting unique pricing curves and prediction markets. Combines traditional DEX functionality with prediction market capabilities on Flare Network.",
      github: "https://github.com/nagatejakachapuram/Flare-Dex-Prediction",
      demo: "https://dex-predication.vercel.app",
      tags: ["DEX", "Prediction Markets", "Flare Network", "AMM", "Trading"],
      icon: <TrendingUp className="w-8 h-8" />,
      color: "text-indigo-400",
    },
    {
      title: "Vale Finance",
      description:
        "A decentralized finance protocol built with security-first principles. Features comprehensive smart contract architecture for lending, borrowing, and yield generation with advanced risk management mechanisms.",
      github: "https://github.com/nagatejakachapuram/Vale-Finance",
      demo: "#",
      tags: ["DeFi", "Lending", "Smart Contracts", "Security", "Yield"],
      icon: <Shield className="w-8 h-8" />,
      color: "text-green-400",
    },
    {
      title: "web3AiX",
      description:
        "An AI-powered Web3 platform integrating advanced AI agents with blockchain infrastructure. Enables intelligent automation, smart contract interactions, and AI-driven decentralized applications.",
      github: "https://github.com/nagatejakachapuram/web3AiX",
      demo: "#",
      tags: ["Web3", "AI", "Blockchain", "Automation", "Smart Contracts"],
      icon: <Sparkles className="w-8 h-8" />,
      color: "text-purple-400",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-x-hidden relative font-sans">
      {/* Animated Background - Now solely using Three.js for the main particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <ThreeParticlesBackground />{" "}
        {/* This is your main particle visualization */}
        {/* More prominent ZK Circuit Board Icons - for a structural element (subtle) */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`circuit-board-${i}`}
            className="absolute text-sky-700/10" // Darker sky color, very subtle
            style={{
              left: `${i * 25 + Math.random() * 15}%`,
              top: `${Math.random() * 90}%`,
              width: `${Math.random() * 180 + 250}px`, // Even larger
              height: `${Math.random() * 180 + 250}px`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0, 0.05, 0], // Super subtle background structure
              scale: [0.8, 1.1, 0.8],
              rotate: [0, Math.random() > 0.5 ? 90 : -90, 0],
            }}
            transition={{
              duration: Math.random() * 25 + 20, // Very long duration
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
              delay: i * 5,
            }}
          >
            <CircuitBoard className="w-full h-full" />
          </motion.div>
        ))}
        {/* REMOVED: The section that generated the blinking pink CPU icons */}
        {/*
        {[...Array(25)].map((_, i) => (
            <motion.div
                key={`cpu-node-${i}`}
                className="absolute w-2.5 h-2.5 bg-fuchsia-500 rounded-full blur-sm"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                    opacity: [0, 1, 0],
                    scale: [0.8, 2, 0.8],
                }}
                transition={{
                    duration: Math.random() * 2 + 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: Math.random() * 5,
                }}
            >
                <Cpu className="w-full h-full text-white/90" />
            </motion.div>
        ))}
        */}
        {/* Grid Pattern (subtle, adds structure) */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <motion.div
                key={i}
                className="border border-neutral-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.1, 0] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  delay: i * 0.05,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 w-full bg-black/90 backdrop-blur-md border-b border-neutral-900 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            className="text-3xl font-extrabold text-white"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Naga<span className="text-sky-400">teja</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {["about", "status", "audits", "deployment", "tech", "projects", "contact"].map((section) => (
              <motion.button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`capitalize font-medium transition-all duration-300 relative text-lg ${
                  activeSection === section
                    ? "text-sky-400"
                    : "text-neutral-400 hover:text-sky-300"
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {section === "status" ? "Status" : section === "audits" ? "Audits" : section === "deployment" ? "Deployment" : section}
                {activeSection === section && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-sky-400"
                    layoutId="activeSection"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 text-neutral-400 hover:text-sky-400 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {mobileMenuOpen ? (
              <X className="w-7 h-7" />
            ) : (
              <Menu className="w-7 h-7" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden bg-black/95 backdrop-blur-md border-t border-neutral-900"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-6 py-4 space-y-4">
                {["about", "status", "audits", "deployment", "tech", "projects", "contact"].map((section) => (
                  <motion.button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className="block w-full text-left capitalize font-medium text-neutral-300 hover:text-sky-400 transition-colors py-2 text-lg"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {section === "status" ? "Status" : section === "audits" ? "Audits" : section === "deployment" ? "Deployment" : section}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section
        id="about"
        className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden pt-24 pb-12"
      >
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants} className="mb-8">
              <motion.h1
                className="text-6xl md:text-8xl font-black mb-6 leading-tight text-white"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-sky-400">Nagateja</span>
                <br />
                <span className="font-light">Kachapuram</span>
              </motion.h1>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4 mb-12">
              <motion.div
                className="flex flex-wrap justify-center gap-4 text-xl md:text-2xl font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {[
                  {
                    text: "Security Researcher",
                    icon: <Shield className="w-6 h-6" />,
                    delay: 0.8,
                  },
                  {
                    text: "Core Engineer",
                    icon: <Code className="w-6 h-6" />,
                    delay: 1.0,
                  },
                  {
                    text: "Full-Stack Web3 Developer",
                    icon: <Zap className="w-6 h-6" />,
                    delay: 1.2,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2 px-5 py-2 bg-black rounded-full border border-neutral-800 shadow-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: item.delay }}
                    whileHover={{
                      scale: 1.05,
                      borderColor: "rgb(56 189 248)",
                    }}
                  >
                    <span className="text-sky-400">{item.icon}</span>
                    <span className="text-neutral-300">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-xl text-neutral-300 max-w-4xl mx-auto mb-12 leading-relaxed font-light"
            >
              I am a smart contract security engineer and full-stack Web3 developer. My focus is adversarial testing, securing DeFi primitives, and architecting the infrastructure for the next generation of AI-driven decentralized applications.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center gap-6"
            >
              <motion.button
                onClick={() => scrollToSection("projects")}
                className="group relative px-9 py-4 bg-sky-600 rounded-xl font-semibold text-white overflow-hidden shadow-lg hover:bg-sky-700 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  View Projects
                </span>
              </motion.button>

              <motion.button
                onClick={() => scrollToSection("contact")}
                className="px-9 py-4 border-2 border-neutral-800 rounded-xl font-semibold text-sky-400 hover:bg-black hover:border-sky-400 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.05, borderColor: "rgb(56 189 248)" }}
                whileTap={{ scale: 0.95 }}
              >
                Get In Touch
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-7 h-7 text-neutral-400" />
        </motion.div>
      </section>

      {/* System Status Section */}
      <section id="status" className="py-20 px-6 bg-black relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6 text-white">
              System <span className="text-sky-400">Status</span>
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto font-light">
              Current operations and clearance level
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="bg-black rounded-2xl p-8 border border-neutral-900 shadow-xl hover:border-sky-500/30 transition-all duration-300"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-sky-600/20 rounded-xl">
                  <Code className="w-8 h-8 text-sky-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Primary Operations</h3>
              </div>
              <p className="text-neutral-300 mb-4 text-lg font-semibold">
                Core Smart Contract Developer @ <span className="text-sky-400">BIFY</span> (Full-Time)
              </p>
              <p className="text-neutral-400 mb-4">
                Specialization: High-severity bug hunting, invariant analysis, and ZK-privacy implementation.
              </p>
            </motion.div>

            <motion.div
              className="bg-black rounded-2xl p-8 border border-neutral-900 shadow-xl hover:border-sky-500/30 transition-all duration-300"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-amber-600/20 rounded-xl">
                  <Trophy className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Clearance Level</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span className="text-neutral-300">
                    <span className="font-semibold text-white">Top 7 Global Auditor</span> (Multiple high-rank finishes on Cantina)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-400" />
                  <span className="text-neutral-300">
                    <span className="font-semibold text-white">Top 300 All-Time</span> Ranked (Cantina)
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Active Deployment Section */}
      <section id="deployment" className="py-20 px-6 bg-neutral-950 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6 text-white">
              Active <span className="text-sky-400">Deployment</span>
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto font-light">
              Current full-time engagement
            </p>
          </motion.div>

          <motion.div
            className="bg-black rounded-2xl p-8 md:p-12 border border-neutral-900 shadow-xl relative overflow-hidden hover:border-sky-500/30 transition-all duration-300"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-600/20 rounded-xl">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    BIFY <span className="text-sky-400">(Base Network)</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm font-semibold border border-green-600/30">
                      LIVE
                    </span>
                    <a
                      href="https://x.com/BIFYOfficial"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
              <p className="text-neutral-300 text-lg mb-6 leading-relaxed">
                I am currently deployed full-time as a core developer for BIFY, architecting an AI-powered marketplace on Base where creators, collectors, and brands converge.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Code className="w-5 h-5 text-sky-400" />
                    Engineering
                  </h4>
                  <p className="text-neutral-400">
                    Developing secure smart contracts for NFT minting, marketplace logic, and Real-World Asset (RWA) tokenization.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    Innovation
                  </h4>
                  <p className="text-neutral-400">
                    Implementing standards for interactive, AI-agent driven NFTs and gated content mechanisms.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Audit Log Section */}
      <section id="audits" className="py-20 px-6 bg-black relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6 text-white">
              Audit <span className="text-sky-400">Log</span>
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto font-light mb-4">
              High-impact security findings and achievements
            </p>
            <p className="text-neutral-500 max-w-3xl mx-auto font-light text-sm">
              My independent security work focuses on shattering assumptions in live protocols through adversarial review and advanced fuzzing.
            </p>
          </motion.div>

          {/* Hall of Fame */}
          <motion.div
            className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {[
              { rank: "#6", protocol: "Octant V2-Core", platform: "Cantina", severity: "High" },
              { rank: "#7", protocol: "Pike Finance", platform: "Cantina", severity: "Medium" },
              { rank: "#43", protocol: "Mellow Vaults", platform: "Sherlock", severity: "Medium" },
            ].map((achievement, index) => (
              <motion.div
                key={index}
                className="bg-black rounded-xl p-6 border border-neutral-900 hover:border-sky-500 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <Trophy className="w-6 h-6 text-amber-400" />
                  <span className="text-2xl font-bold text-sky-400">{achievement.rank}</span>
                </div>
                <h4 className="text-white font-semibold mb-1">{achievement.protocol}</h4>
                <p className="text-neutral-400 text-sm">{achievement.platform}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-red-600/20 text-red-400 rounded text-xs font-semibold border border-red-600/30">
                  {achievement.severity}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Audit Table */}
          <motion.div
            className="bg-black rounded-2xl border border-neutral-900 shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-950 border-b border-neutral-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">Protocol</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Type</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Platform</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Findings</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {auditFindings.map((audit, index) => (
                    <motion.tr
                      key={index}
                      className="border-b border-neutral-900 hover:bg-neutral-950 transition-colors"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <td className="px-6 py-4 text-white font-medium">{audit.protocol}</td>
                      <td className="px-6 py-4 text-neutral-400">{audit.type}</td>
                      <td className="px-6 py-4 text-neutral-400">{audit.platform}</td>
                      <td className="px-6 py-4 text-neutral-300">{audit.findings}</td>
                      <td className="px-6 py-4">
                        {audit.link !== "#" ? (
                          <a
                            href={audit.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
                          >
                            {audit.rank}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-neutral-400">{audit.rank}</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="py-20 px-6 bg-black relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6 text-white">
              <span className="text-sky-400">Tech</span> Stack
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto font-light">
              A comprehensive toolkit for building robust blockchain
              applications and smart contract systems
            </p>
          </motion.div>

          <motion.div
            className="bg-black rounded-2xl border border-neutral-900 shadow-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 bg-neutral-950 border-b border-neutral-900">
              <div className="p-6 border-b md:border-b-0 md:border-r border-neutral-900">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <Code className="w-6 h-6 text-sky-400" />
                  Category
                </h3>
              </div>
              <div className="p-6 border-b md:border-b-0 border-neutral-900">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <Zap className="w-6 h-6 text-purple-400" />
                  Tools/Tech
                </h3>
              </div>
            </div>

            {/* Tech Stack Items */}
            {techStack.map((item, index) => (
              <motion.div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 hover:bg-neutral-950 transition-all duration-300 group border-b border-neutral-900 last:border-b-0"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-6 border-b md:border-b-0 md:border-r border-neutral-900 flex items-center gap-3">
                  <span className="text-sky-400 group-hover:text-purple-400 transition-colors">
                    {item.icon}
                  </span>
                  <span className="font-semibold text-white text-lg">
                    {item.category}
                  </span>
                </div>
                <div className="p-6 border-b md:border-b-0 border-neutral-900">
                  <span className="text-neutral-300 font-mono text-base">
                    {item.tools}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 bg-neutral-950 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6 text-white">
              R&D <span className="text-sky-400">Labs</span>
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto font-light">
              Independent builds focused on merging AI agents with on-chain DeFi and exploring zero-knowledge cryptography
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                className="group relative bg-black rounded-2xl p-8 border border-neutral-900 shadow-xl hover:border-sky-500 transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                {/* Subtle Background Glow on Hover */}
                <div
                  className={`absolute inset-0 ${project.color.replace(
                    "text",
                    "bg"
                  )}/10 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      className={`p-3 bg-neutral-950 rounded-xl ${project.color} shadow-md border border-neutral-900`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {project.icon}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-neutral-300 mb-6 leading-relaxed font-light">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.map((tag, tagIndex) => (
                      <motion.span
                        key={tagIndex}
                        className="px-3.5 py-1.5 bg-neutral-950 text-neutral-300 rounded-full text-sm font-medium border border-neutral-900"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: tagIndex * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "rgb(64 64 64)",
                        }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-neutral-950 hover:bg-black px-6 py-3 rounded-xl transition-all duration-300 font-medium border border-neutral-900 hover:border-sky-500 text-white shadow-md"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </motion.a>
                    {project.demo !== "#" ? (
                      <motion.a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 bg-sky-600 hover:bg-sky-700 px-6 py-3 rounded-xl transition-all duration-300 font-medium text-white shadow-md`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </motion.a>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-black relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6 text-white">
              Let's <span className="text-sky-400">Connect</span>
            </h2>
            <p className="text-xl text-neutral-400 mb-12 max-w-3xl mx-auto font-light">
              Open to collaborating on innovative blockchain projects, security audits, and DeFi protocols. Let's build the future of decentralized finance together.
            </p>
            <p className="text-sm text-neutral-500 mb-8 max-w-3xl mx-auto font-light">
              ⚠️ <span className="font-semibold">Secure Comms:</span> These are my only official channels. Verify all contacts.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {[
              {
                href: "https://x.com/developerx_sec",
                icon: <Twitter className="w-6 h-6" />,
                label: "X / Twitter",
                color: "text-gray-400",
              },
              {
                href: "https://github.com/nagatejakachapuram",
                icon: <Github className="w-6 h-6" />,
                label: "GitHub",
                color: "text-gray-400",
              },
              {
                href: "https://www.linkedin.com/in/nagatejakachapuram/",
                icon: <Linkedin className="w-6 h-6" />,
                label: "LinkedIn",
                color: "text-blue-400",
              },
              {
                href: "mailto:nagateja.devx@gmail.com",
                icon: <Mail className="w-6 h-6" />,
                label: "Email",
                color: "text-red-400",
              },
              {
                href: null,
                icon: <MessageCircle className="w-6 h-6" />,
                label: "Discord: developerx_sec",
                color: "text-indigo-400",
              },
            ].map((social, index) =>
              social.href ? (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-3 bg-black hover:bg-neutral-950 px-8 py-4 rounded-xl transition-all duration-300 font-medium border border-neutral-900 hover:border-sky-500 text-white shadow-lg`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span
                    className={`${social.color} group-hover:text-white transition-colors`}
                  >
                    {social.icon}
                  </span>
                  <span className="text-white">{social.label}</span>
                </motion.a>
              ) : (
                <motion.div
                  key={index}
                  className={`group flex items-center gap-3 bg-black px-8 py-4 rounded-xl transition-all duration-300 font-medium border border-neutral-900 text-white shadow-lg cursor-default`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span
                    className={`${social.color} transition-colors`}
                  >
                    {social.icon}
                  </span>
                  <span className="text-white">{social.label}</span>
                </motion.div>
              )
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-neutral-900 bg-black relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.p
            className="text-neutral-400 font-light"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            &copy; 2025 Nagateja Kachapuram. Building the future of DeFi.
          </motion.p>
        </div>
      </footer>
    </div>
  );
}

export default App;
