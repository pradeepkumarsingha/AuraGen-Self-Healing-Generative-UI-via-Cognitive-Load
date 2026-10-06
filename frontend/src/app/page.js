// frontend/src/app/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  const [demoFriction, setDemoFriction] = useState(30);
  const [activeTab, setActiveTab] = useState('overview');

  // Derive cognitive level state
  const isHealed = demoFriction > 80;
  
  const getFrictionTheme = (val) => {
    if (val <= 30) {
      return {
        label: 'Calm / Optimal',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        bar: 'from-emerald-500 to-teal-400',
        pulse: 'bg-emerald-400'
      };
    }
    if (val <= 60) {
      return {
        label: 'Moderate Hesitation',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        bar: 'from-amber-500 to-yellow-400',
        pulse: 'bg-amber-400'
      };
    }
    if (val <= 80) {
      return {
        label: 'High Interaction Agitation',
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        bar: 'from-orange-500 to-red-400',
        pulse: 'bg-orange-400'
      };
    }
    return {
      label: 'Critical Friction — AI UI Morph Active',
      color: 'text-rose-400',
      bg: 'bg-rose-500/15',
      border: 'border-rose-500/40',
      bar: 'from-rose-500 via-purple-500 to-indigo-500',
      pulse: 'bg-rose-400'
    };
  };

  const currentTheme = getFrictionTheme(demoFriction);

  const stats = [
    { label: 'Perceived Latency', value: '<50ms', sub: 'SHA-256 Hashing Cache', icon: '⚡' },
    { label: 'Data Loss Rate', value: '0.0%', sub: 'State Vault Context Preservation', icon: '🛡️' },
    { label: 'Friction Threshold', value: '80%', sub: 'Autonomous WebSocket Trigger', icon: '🧠' },
    { label: 'Schema Compliance', value: '100%', sub: 'Zod Type-Safe Guardrails', icon: '✨' }
  ];

  const features = [
    {
      icon: '🎯',
      badge: 'Biometric Telemetry',
      title: 'Passive Interaction Engine',
      description: 'Continuous background analysis of mouse trajectory jitter, cursor velocity (px/ms), rage-clicking bursts, and hesitation dwell clocks (>4.5s) with zero user disruption.',
      gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
      border: 'group-hover:border-blue-500/50'
    },
    {
      icon: '🪄',
      badge: 'LangChain + Groq LLM',
      title: 'Autonomous UI Deconstruction',
      description: 'Instantaneously deconstructs dense, multi-field form sections into bite-sized, sequential step-by-step wizards with dynamic dependency branching (dependsOn).',
      gradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
      border: 'group-hover:border-purple-500/50'
    },
    {
      icon: '🔒',
      badge: 'Zero Data Loss',
      title: 'Contextual State Vault',
      description: 'Never wipes user progress. Every typed keystroke is preserved and injected directly as default values into the newly synthesized AI wizard.',
      gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      border: 'group-hover:border-emerald-500/50'
    },
    {
      icon: '🚀',
      badge: 'Sub-2s Response',
      title: 'SHA-256 Cache & Fallbacks',
      description: 'Combines an ultra-fast in-memory hashing cache with pre-verified layout fallbacks, guaranteeing instantaneous recovery even if network or API limits occur.',
      gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
      border: 'group-hover:border-amber-500/50'
    }
  ];

  const techBadges = [
    { name: 'Next.js 14', role: 'Frontend & App Router' },
    { name: 'Groq / Gemini', role: 'LangChain LLM' },
    { name: 'Node.js & Express', role: 'Backend Server' },
    { name: 'Socket.IO', role: 'Bi-directional WebSockets' },
    { name: 'Framer Motion', role: 'UI Morphing Transitions' },
    { name: 'Zod Schema', role: 'Type-Safe Guardrails' }
  ];

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 selection:bg-indigo-500/40 selection:text-white font-sans overflow-x-hidden">
      {/* Cinematic Ambient Glow Lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-indigo-600/25 via-purple-600/15 to-transparent blur-[160px] rounded-full" />
        <div className="absolute top-1/3 -right-60 w-[700px] h-[600px] bg-cyan-600/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-10 -left-60 w-[700px] h-[600px] bg-purple-700/15 blur-[180px] rounded-full" />
        {/* Futuristic Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_80%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-28">
        
        {/* Top Navbar */}
        <header className="flex items-center justify-between py-3.5 px-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-2xl shadow-2xl shadow-black/40">
          <div className="flex items-center gap-3.5">
            <img
              src="/logo.png"
              alt="AuraGen Logo"
              className="h-10 w-10 rounded-xl object-contain shadow-lg shadow-indigo-500/30 border border-indigo-500/30 bg-slate-950"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-white tracking-tight">AuraGen-AI</span>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-mono font-semibold uppercase tracking-wider">
                  v2.0 Active
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block font-medium">
                Self-Healing Generative UI via Cognitive Load
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="relative inline-flex items-center justify-center p-[1px] overflow-hidden text-xs font-semibold rounded-xl group bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover:from-indigo-600 group-hover:to-pink-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition duration-300"
            >
              <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-slate-950 rounded-[11px] group-hover:bg-opacity-0 flex items-center gap-2 font-medium">
                <span>Launch Interactive Demo</span>
                <span className="text-indigo-400 group-hover:text-white transition">→</span>
              </span>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-8 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide shadow-lg shadow-indigo-950/50 backdrop-blur-md"
          >
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_#818cf8]" />
            <span>Autonomous Real-Time UI Adaptation Engine</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.12]"
          >
            Self-Healing Interfaces That Adapt When Users{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent underline decoration-indigo-500/40 decoration-wavy underline-offset-8">
              Struggle.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            AuraGen-AI monitors biometric interaction telemetry—mouse jitter, rage clicks, and hesitation dwell—and autonomously regenerates confusing forms into guided step-by-step wizards with <strong className="text-white font-semibold">zero data loss</strong>.
          </motion.p>

          {/* CTA Button Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link
              href="/demo"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5"
            >
              <span>🚀 Launch Full Education Loan Demo</span>
            </Link>

            <a
              href="#sandbox"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-200 font-semibold text-sm transition flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <span>🧪 Try Live Interactive Sandbox</span>
            </a>
          </motion.div>

          {/* Tech Badges Pill Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-6 flex flex-wrap items-center justify-center gap-2.5"
          >
            {techBadges.map((t, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center gap-1.5 backdrop-blur-sm"
              >
                <span className="text-indigo-400 font-semibold">{t.name}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-500">{t.role}</span>
              </span>
            ))}
          </motion.div>
        </section>

        {/* Interactive Cognitive Load Oscilloscope & Morphing Sandbox */}
        <section id="sandbox" className="max-w-5xl mx-auto space-y-6">
          <div className="p-[1px] rounded-3xl bg-gradient-to-b from-indigo-500/40 via-purple-500/20 to-slate-800/30 shadow-2xl shadow-indigo-950/40">
            <div className="p-6 sm:p-9 rounded-[23px] bg-slate-950/95 border border-slate-800/80 backdrop-blur-3xl space-y-8">
              
              {/* Header bar of sandbox */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="text-xl">🎛️</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Live Cognitive Load & UI Morphing Sandbox
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Simulate real-time user friction to witness AuraGen&rsquo;s autonomous UI healing pipeline in action.
                  </p>
                </div>

                <div className={`px-4 py-2 rounded-2xl border ${currentTheme.bg} ${currentTheme.border} self-start sm:self-center backdrop-blur-md`}>
                  <div className="flex items-center gap-2.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${currentTheme.pulse} animate-ping`} />
                    <span className={`text-xs font-mono font-bold ${currentTheme.color}`}>
                      {demoFriction}% Friction
                    </span>
                    <span className="text-xs text-slate-600">•</span>
                    <span className={`text-xs font-semibold ${currentTheme.color}`}>
                      {currentTheme.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Slider & Quick Simulation Controls */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">Simulate Biometric Friction Level</span>
                  <span className="font-mono text-indigo-400 font-bold">{demoFriction}% / 100%</span>
                </div>

                {/* Range Slider with Glow Bar */}
                <div className="relative py-2">
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full bg-gradient-to-r ${currentTheme.bar} transition-all duration-300`}
                      style={{ width: `${demoFriction}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={demoFriction}
                    onChange={(e) => setDemoFriction(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {/* Quick Simulation Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDemoFriction(20)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 transition"
                    >
                      🟢 Calm State (20%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDemoFriction(55)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-amber-300 transition"
                    >
                      🟡 Moderate Hesitation (55%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDemoFriction(88)}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600/30 to-purple-600/30 hover:from-indigo-600/50 hover:to-purple-600/50 border border-indigo-500/50 text-xs font-bold text-indigo-200 shadow-md shadow-indigo-500/20 transition flex items-center gap-1.5"
                    >
                      <span>✨ Trigger Critical Healing (88%)</span>
                    </button>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500">
                    Healing threshold: &gt;80%
                  </span>
                </div>
              </div>

              {/* Live Morphing Viewport Area */}
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-slate-800/90 min-h-[260px] flex flex-col justify-center relative overflow-hidden shadow-inner">
                <AnimatePresence mode="wait">
                  {!isHealed ? (
                    <motion.div
                      key="standard-preview"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-slate-500" />
                          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                            Standard Form Layout (High Cognitive Friction)
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">
                          Status: Passive Biometrics Active
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 opacity-80">
                        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                          <span className="text-[11px] text-slate-400 font-semibold">Existing Loan Category</span>
                          <div className="h-3 bg-slate-800 rounded w-3/4"></div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                          <span className="text-[11px] text-slate-400 font-semibold">Outstanding Balance (₹)</span>
                          <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                          <span className="text-[11px] text-slate-400 font-semibold">Monthly EMI Outflow</span>
                          <div className="h-3 bg-slate-800 rounded w-2/3"></div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                          <span className="text-[11px] text-slate-400 font-semibold">CIBIL Bureau Score</span>
                          <div className="h-3 bg-slate-800 rounded w-1/3"></div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-center">
                        <p className="text-xs text-slate-400">
                          👆 Move the friction slider above <strong className="text-indigo-300">80%</strong> to trigger the AI Generative UI Morph!
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="healed-preview"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                            <span>✨</span> AuraGen Adaptive Interface Mounted
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-medium">
                            ⚡ Cached (&lt;50ms)
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[10px] font-mono">
                            Live Groq LLM
                          </span>
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 space-y-4 shadow-xl shadow-indigo-950/50">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white text-sm">Step 1 of 2: Current Loan Obligations</span>
                          <span className="text-indigo-300 font-mono font-semibold">50% Complete</span>
                        </div>

                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <div className="h-full w-1/2 bg-gradient-to-r from-indigo-500 to-purple-500" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3.5 rounded-xl bg-indigo-600/30 border border-indigo-500 text-center text-xs font-semibold text-white shadow-lg shadow-indigo-500/20">
                            ✓ Yes, I hold active loans
                          </div>
                          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center text-xs text-slate-400">
                            No, zero debt obligations
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-xs text-indigo-200 flex items-start gap-2">
                          <span>🤖</span>
                          <p className="leading-relaxed">
                            <strong className="text-indigo-100">AI Reasoning:</strong> Detected elevated cognitive friction on financial liabilities. Deconstructed into binary sequential steps.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom footer bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <span className="text-xs text-slate-400">
                  Ready to test with live mouse velocity, dwell timers & real loan inputs?
                </span>
                <Link
                  href="/demo"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>Open Full Application Demo</span>
                  <span>→</span>
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* Real-Time Benchmark Stats Strip */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-2xl text-center space-y-1.5 hover:border-indigo-500/30 transition duration-300 shadow-xl shadow-black/30"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent font-mono">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-200">
                {stat.label}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {stat.sub}
              </div>
            </div>
          ))}
        </section>

        {/* Feature Bento Grid */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Architected for Zero User Friction
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Four robust engineering pillars ensuring real-time UI healing with absolute data integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 ${feature.border} backdrop-blur-2xl transition duration-300 hover:shadow-2xl hover:shadow-indigo-950/40 group relative overflow-hidden`}
              >
                <div className={`absolute top-0 right-0 w-44 h-44 bg-gradient-to-br ${feature.gradient} blur-3xl rounded-full pointer-events-none`} />
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-3.5 rounded-2xl bg-slate-950 border border-slate-800 w-fit shadow-md">
                      {feature.icon}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 font-semibold">
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4-Step Interactive Workflow */}
        <section className="p-8 sm:p-14 rounded-3xl bg-slate-900/40 border border-slate-800/80 space-y-12 backdrop-blur-xl">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              Autonomous Loop
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How the Self-Healing Engine Operates
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              From continuous biometric observation to seamless generative UI morphing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Passive Interaction Tracking',
                desc: 'Client-side telemetry tracks mouse velocity, erratic trajectory jitter, and hesitation dwell (>4.5s) without intrusive surveys.'
              },
              {
                step: '02',
                title: 'Friction Threshold Alert',
                desc: 'When friction crosses 80%, a COGNITIVE_LOAD_HIGH event transmits form state and section context over real-time WebSockets.'
              },
              {
                step: '03',
                title: 'LangChain & Groq Synthesis',
                desc: 'Groq LLM synthesizes an optimized, low-cognitive-load step wizard with Zod schema validation and section guardrails.'
              },
              {
                step: '04',
                title: 'Zero-Data-Loss UI Morph',
                desc: 'Framer Motion executes an animated morph, mounting the wizard while preserving every previously entered form field.'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3 relative shadow-md">
                <span className="text-3xl font-extrabold font-mono text-indigo-500/30 block">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Cinematic Call to Action Banner */}
        <section className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-slate-900/90 border border-indigo-500/40 text-center space-y-7 relative overflow-hidden shadow-2xl shadow-indigo-950/50">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-500/25 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Experience the Future of Adaptive Interfaces
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Interact with the full Education Loan Application demo featuring live biometrics, simulation triggers, and real-time Groq LLM synthesis.
            </p>
          </div>

          <div className="pt-2 flex justify-center relative z-10">
            <Link
              href="/demo"
              className="px-10 py-4.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white font-bold text-base shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <span>Launch Interactive Demo 🚀</span>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 pb-6 border-t border-slate-900 text-center space-y-3">
          <p className="text-xs font-mono text-slate-400">
            Tech Stack: Next.js 14 • Node.js/Express • Socket.IO • LangChain • Groq / OpenAI / Gemini • Framer Motion
          </p>
          <p className="text-xs text-slate-500">
            Developed by <span className="text-slate-300 font-semibold">Pradeep Kumar Singha</span> • AuraGen-AI Phase 5 Submission
          </p>
        </footer>

      </div>
    </div>
  );
}