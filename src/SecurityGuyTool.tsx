import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Lock,
  Wallet,
  Play,
  AlertCircle,
  CheckCircle,
  Loader2,
  Terminal,
  Bot,
  Zap,
  ChevronDown,
} from "lucide-react";
import { BrowserProvider } from "ethers";

// ── Owner wallet whitelist ────────────────────────────────────────────────────
// Add your wallet addresses here (lowercase). Only these can run audits.
const OWNER_WALLETS: string[] = [
  "0x5c0d24821c5289179ff08d950ef55fc1170d0abc",
];

// ── Backend URL ───────────────────────────────────────────────────────────────
// Set VITE_SECURITY_GUY_API_URL in your Vercel env vars after Railway deploy.
const API_BASE =
  (import.meta as Record<string, unknown> & { env: Record<string, string> }).env
    .VITE_SECURITY_GUY_API_URL ?? "https://your-railway-app.railway.app";

// ── Types ─────────────────────────────────────────────────────────────────────
type AuditMode = "light" | "core" | "thorough";

interface AuditJob {
  job_id: string;
  status: string;
}

interface SSEEvent {
  type: "status" | "text" | "thinking" | "tool" | "tool_result" | "subagent" | "done" | "error";
  message?: string;
  text?: string;
  name?: string;
  turn?: number;
  output?: string;
  report?: string;
  turns?: number;
  cost_usd?: number;
  elapsed_seconds?: number;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function SecurityGuyTool() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);

  // Form state
  const [githubUrl, setGithubUrl] = useState("");
  const [branch, setBranch] = useState("");
  const [mode, setMode] = useState<AuditMode>("core");
  const [network, setNetwork] = useState("");
  const [notes, setNotes] = useState("");

  // Job / stream state
  const [jobId, setJobId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [streamEvents, setStreamEvents] = useState<SSEEvent[]>([]);
  const [report, setReport] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [costInfo, setCostInfo] = useState<{ cost_usd: number; turns: number; elapsed_seconds: number } | null>(null);

  const logRef = useRef<HTMLDivElement>(null);
  const esRef = useRef<EventSource | null>(null);

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [streamEvents]);

  // ── Wallet connection ────────────────────────────────────────────────────────
  async function connectWallet() {
    setConnecting(true);
    setWalletError(null);
    try {
      if (!window.ethereum) {
        setWalletError("No Web3 wallet detected. Install MetaMask or similar.");
        return;
      }
      const provider = new BrowserProvider(window.ethereum as Parameters<typeof BrowserProvider>[0]);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = (await signer.getAddress()).toLowerCase();
      setWalletAddress(address);
      setIsOwner(
        OWNER_WALLETS.length === 0
          ? false
          : OWNER_WALLETS.map((a) => a.toLowerCase()).includes(address)
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setWalletError(msg.includes("rejected") ? "Connection rejected." : msg);
    } finally {
      setConnecting(false);
    }
  }

  function disconnectWallet() {
    setWalletAddress(null);
    setIsOwner(false);
    setJobId(null);
    setStreamEvents([]);
    setReport(null);
    setDone(false);
    setCostInfo(null);
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
  }

  // ── Submit audit ─────────────────────────────────────────────────────────────
  async function startAudit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setStreamEvents([]);
    setReport(null);
    setDone(false);
    setCostInfo(null);
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/audit/github`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          github_url: githubUrl,
          branch: branch || undefined,
          mode,
          network: network || undefined,
          notes: notes || undefined,
          proven_only: false,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail ?? "Failed to start audit");
      }

      const job: AuditJob = await res.json();
      setJobId(job.job_id);
      openStream(job.job_id);
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  }

  // ── SSE stream ───────────────────────────────────────────────────────────────
  function openStream(id: string) {
    if (esRef.current) esRef.current.close();
    const es = new EventSource(`${API_BASE}/audit/${id}/stream`);
    esRef.current = es;

    es.onmessage = (ev) => {
      try {
        const data: SSEEvent = JSON.parse(ev.data);
        if (data.type === "done") {
          setReport(data.report ?? null);
          setCostInfo({
            cost_usd: data.cost_usd ?? 0,
            turns: data.turns ?? 0,
            elapsed_seconds: data.elapsed_seconds ?? 0,
          });
          setDone(true);
          es.close();
        } else {
          setStreamEvents((prev) => [...prev.slice(-199), data]);
        }
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      setStreamEvents((prev) => [
        ...prev,
        { type: "error", message: "Stream connection lost." } as SSEEvent,
      ]);
      es.close();
    };
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────
  function formatElapsed(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  }

  function eventColor(type: SSEEvent["type"]) {
    switch (type) {
      case "status": return "text-neutral-400";
      case "text": return "text-emerald-300";
      case "thinking": return "text-purple-400";
      case "tool": return "text-blue-400";
      case "tool_result": return "text-cyan-400";
      case "subagent": return "text-yellow-400";
      case "error": return "text-red-400";
      default: return "text-neutral-300";
    }
  }

  function eventLabel(ev: SSEEvent) {
    switch (ev.type) {
      case "status": return `⚙ ${ev.message}`;
      case "text": return ev.text ?? "";
      case "thinking": return `💭 ${ev.text}`;
      case "tool": return `🔧 [${ev.name}] turn ${ev.turn}`;
      case "tool_result": return `  ↳ ${ev.output}`;
      case "subagent": return `🤖 ${ev.message}`;
      case "error": return `✗ ${ev.message}`;
      default: return JSON.stringify(ev);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-neutral-800/60 bg-neutral-950/60 backdrop-blur-sm p-8"
      >
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          {/* Icon */}
          <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Bot className="w-8 h-8 text-emerald-400" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">The Security Guy</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                AI Agent
              </span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">
              Full autonomous Web3 security audit pipeline. Runs 15–80 parallel AI sub-agents
              — breadth analysis, depth review, chain analysis, PoC verification, and report
              generation — identical to a professional smart contract audit.
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative mt-6 grid grid-cols-3 gap-4">
          {[
            { icon: <Zap className="w-4 h-4" />, label: "Light", value: "~15 agents", sub: "$0.5–2" },
            { icon: <Shield className="w-4 h-4" />, label: "Core", value: "~35 agents", sub: "$3–10" },
            { icon: <Bot className="w-4 h-4" />, label: "Thorough", value: "~80 agents", sub: "$15–40" },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-4 text-center"
            >
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 mb-1">
                {m.icon}
                <span className="text-xs font-semibold uppercase tracking-wider">{m.label}</span>
              </div>
              <div className="text-white font-bold text-sm">{m.value}</div>
              <div className="text-neutral-500 text-xs">{m.sub}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Wallet / Access section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-3xl border border-neutral-800/60 bg-neutral-950/60 backdrop-blur-sm p-6"
      >
        {!walletAddress ? (
          /* Not connected */
          <div className="flex flex-col items-center text-center py-6 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-800/60 border border-neutral-700/50 flex items-center justify-center">
              <Wallet className="w-7 h-7 text-neutral-400" />
            </div>
            <div>
              <p className="text-white font-semibold mb-1">Connect your wallet to continue</p>
              <p className="text-neutral-500 text-sm">Access is restricted to verified owner wallets.</p>
            </div>
            {walletError && (
              <p className="text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {walletError}
              </p>
            )}
            <button
              onClick={connectWallet}
              disabled={connecting}
              className="px-6 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-medium text-sm transition-all duration-200 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {connecting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wallet className="w-4 h-4" />
              )}
              {connecting ? "Connecting…" : "Connect Wallet"}
            </button>
          </div>
        ) : !isOwner ? (
          /* Connected but not owner */
          <div className="flex flex-col items-center text-center py-6 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Lock className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <p className="text-white font-semibold mb-1">Access Restricted</p>
              <p className="text-neutral-500 text-sm">
                Connected as{" "}
                <span className="font-mono text-neutral-300 text-xs">
                  {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
                </span>
                , but this wallet is not authorised to run audits.
              </p>
            </div>
            <button
              onClick={disconnectWallet}
              className="px-4 py-2 rounded-xl border border-neutral-700 text-neutral-400 hover:text-neutral-200 text-sm transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          /* Owner — show audit form */
          <div className="space-y-6">
            {/* Wallet badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Owner access granted</span>
                <span className="text-neutral-600">·</span>
                <span className="font-mono text-neutral-400 text-xs">
                  {walletAddress!.slice(0, 6)}…{walletAddress!.slice(-4)}
                </span>
              </div>
              <button
                onClick={disconnectWallet}
                className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
              >
                Disconnect
              </button>
            </div>

            {/* Audit form */}
            {!jobId ? (
              <form onSubmit={startAudit} className="space-y-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5 font-medium">
                    GitHub Repository URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/owner/repo"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1.5 font-medium">
                      Branch (optional)
                    </label>
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      placeholder="main"
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1.5 font-medium">
                      Network (optional)
                    </label>
                    <input
                      type="text"
                      value={network}
                      onChange={(e) => setNetwork(e.target.value)}
                      placeholder="ethereum"
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5 font-medium">
                    Audit Mode
                  </label>
                  <div className="relative">
                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value as AuditMode)}
                      className="w-full appearance-none px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors pr-10"
                    >
                      <option value="light">Light — ~15 agents, $0.5–2, 5–15 min</option>
                      <option value="core">Core — ~35 agents, $3–10, 20–50 min</option>
                      <option value="thorough">Thorough — ~80 agents, $15–40, 60–120 min</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5 font-medium">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Focus areas, known issues, special instructions…"
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                  />
                </div>

                {submitError && (
                  <p className="text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting || !githubUrl}
                  className="w-full py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {submitting ? "Starting audit…" : "Run Security Audit"}
                </button>
              </form>
            ) : (
              /* Live stream view */
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Terminal className="w-4 h-4" />
                    <span className="font-mono text-xs">Job {jobId}</span>
                  </div>
                  {!done && (
                    <span className="flex items-center gap-1.5 text-emerald-400 text-xs">
                      <Loader2 className="w-3 h-3 animate-spin" /> Running…
                    </span>
                  )}
                  {done && (
                    <span className="flex items-center gap-1.5 text-emerald-400 text-xs">
                      <CheckCircle className="w-3 h-3" /> Complete
                    </span>
                  )}
                </div>

                {/* Log */}
                <div
                  ref={logRef}
                  className="h-72 overflow-y-auto rounded-xl bg-neutral-950 border border-neutral-800 p-4 space-y-1 font-mono text-xs"
                >
                  <AnimatePresence initial={false}>
                    {streamEvents.map((ev, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`leading-relaxed ${eventColor(ev.type)}`}
                      >
                        {eventLabel(ev)}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {streamEvents.length === 0 && !done && (
                    <p className="text-neutral-700 italic">Waiting for pipeline to start…</p>
                  )}
                </div>

                {/* Cost info */}
                {done && costInfo && (
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Turns", value: costInfo.turns },
                      { label: "Cost", value: `$${costInfo.cost_usd.toFixed(3)}` },
                      { label: "Time", value: formatElapsed(costInfo.elapsed_seconds) },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-3 text-center"
                      >
                        <div className="text-neutral-500 text-xs mb-0.5">{s.label}</div>
                        <div className="text-white font-semibold text-sm">{s.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Report */}
                {done && report && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-white flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-400" /> Audit Report
                      </p>
                      <button
                        onClick={() => {
                          const blob = new Blob([report], { type: "text/markdown" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `audit-${jobId}.md`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        Download .md
                      </button>
                    </div>
                    <pre className="h-96 overflow-y-auto rounded-xl bg-neutral-950 border border-neutral-800 p-4 text-xs text-neutral-300 whitespace-pre-wrap font-mono leading-relaxed">
                      {report}
                    </pre>
                  </div>
                )}

                {/* New audit */}
                {done && (
                  <button
                    onClick={() => {
                      setJobId(null);
                      setStreamEvents([]);
                      setReport(null);
                      setDone(false);
                      setCostInfo(null);
                    }}
                    className="w-full py-2.5 rounded-xl border border-neutral-700 text-neutral-400 hover:text-neutral-200 text-sm transition-colors"
                  >
                    Run Another Audit
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
