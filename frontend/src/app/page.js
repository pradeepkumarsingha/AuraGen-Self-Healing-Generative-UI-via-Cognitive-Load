// frontend/src/app/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  const [demoFriction, setDemoFriction] = useState(25);
  const [activeTab, setActiveTab] = useState('telemetry');

  // Derive mini-demo state
  const isHealed = demoFriction > 80;
  const getFrictionLabel = (val) => {
    if (val <= 30) return { text: 'Normal Cognitive State', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
    if (val <= 60) return { text: 'Moderate Hesitation', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    if (val <= 80) return { text: 'High Interaction Friction', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' };
    return { text: 'Critical Friction — UI Healing Active', color: 'text-rose-400', bg: 'bg-rose-500/15', border: 'border-rose-500/40' };
  };

  const statusInfo = getFrictionLabel(demoFriction);

  const stats = [
    { label: 'Perceived Latency', value: '<50ms', sub: 'In-Memory SHA256 Cache' },
    { label: 'Data Loss Rate', value: '0%', sub: 'Contextual State Preservation' },
    { label: 'Adaptive Threshold', value: '80%', sub: 'Real-time Telemetry Trigger' },
    { label: 'Schema Compliance', value: '100%', sub: 'Zod Guardrail Validation' }
  ];

  const features = [
    {
      icon: '🎯',
      tag: 'Real-time Biometrics',
      title: 'Cognitive Friction Telemetry',
      desc: 'Passively monitors mouse velocity, trajectory jitter, rage clicking, dwell hesitation, and backtracking without disrupting the user flow.',
      gradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      icon: '✨',
      tag: 'Dynamic Generation',
      title: 'Autonomous UI Deconstruction',
      desc: 'Transforms intimidating, complex multi-field forms into sequential, low-cognitive-load guided wizards generated live by LangChain & Groq LLMs.',
      gradient: 'from-indigo-500/20 to-purple-500/20'
    },
    {
      icon: '🛡️',
      tag: 'Zero Keystroke Loss',
      title: 'Contextual State Preservation',
      desc: 'Never resets user progress. Existing input values are preserved and injected directly into the newly morphed interface seamlessly.',
      gradient: 'from-purple-500/20 to-pink-500/20'
    },
    {
      icon: '⚡',
      tag: 'High Performance',
      title: 'SHA-256 Cache & Fallbacks',
      desc: 'Sub-2s response time with in-memory hashing cache and pre-verified layout fallbacks for 100% reliable graceful degradation.',
      gradient: 'from-amber-500/20 to-orange-500/20'
    }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Passive Interaction Tracking',
      desc: 'The user interacts with the form. Background telemetry tracks erratic cursor shakes, rapid backspacing, and hesitation timers (>4.5s).'
    },
    {
      step: '02',
      title: 'WebSocket Friction Trigger',
      desc: 'When friction crosses 80%, a COGNITIVE_LOAD_HIGH event transmits the active form state and target section to the backend engine.'
    },
    {
      step: '03',
      title: 'LangChain LLM Synthesis',
      desc: 'Groq / OpenAI / Gemini decomposes the troubled section into a validated step-by-step UI spec with dependency branching.'
    },
    {
      step: '04',
      title: 'Seamless UI Morphing',
      desc: 'Framer Motion executes a smooth layout morph, mounting the simplified wizard while preserving every typed character.'
    }
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 overflow-x-hidden font-sans">
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-1/3 -right-48 w-[600px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-10 -left-48 w-[650px] h-[500px] bg-purple-600/15 blur-[160px] rounded-full" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-24">
        {/* Header / Navbar */}
        <header className="flex items-center justify-between py-4 px-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-[1px] shadow-lg shadow-indigo-500/25">
              <div className="h-full w-full bg-slate-950 rounded-[11px] flex items-center justify-center text-lg">
                ✨
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white tracking-tight">AuraGen-AI</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[10px] font-mono uppercase tracking-wider font-semibold">
                  v2.0
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block font-medium">
                Self-Healing Generative UI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-semibold rounded-xl group bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:from-indigo-600 group-hover:to-purple-700 hover:text-white text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition"
            >
              <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-slate-950 rounded-[10px] group-hover:bg-opacity-0 flex items-center gap-1.5">
                Launch Live Demo <span className="text-indigo-400 group-hover:text-white transition">→</span>
              </span>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-8 pt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide shadow-inner shadow-indigo-500/10"
          >
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            Next-Gen Autonomous UI Adaptation Engine
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]"
          >
            Real-Time UI That Heals When Users{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent underline decoration-indigo-500/30 decoration-wavy underline-offset-8">
              Struggle.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            AuraGen-AI continuously measures real-time cognitive friction—mouse jitter, rage clicks, and hesitation—and autonomously morphs intimidating forms into intuitive, AI-generated step-by-step wizards.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/demo"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              <span>🚀 Launch Interactive Demo</span>
            </Link>

            <a
              href="#interactive-simulator"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-200 font-semibold text-sm transition flex items-center justify-center gap-2"
            >
              <span>⚡ Try Simulator Below</span>
            </a>
          </motion.div>
        </section>

        {/* Live Interactive Friction Simulator Widget */}
        <section id="interactive-simulator" className="max-w-4xl mx-auto">
          <div className="p-1 rounded-3xl bg-gradient-to-b from-indigo-500/30 via-purple-500/20 to-transparent shadow-2xl">
            <div className="p-6 sm:p-8 rounded-[23px] bg-slate-950/90 border border-slate-800/80 backdrop-blur-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">🧪</span>
                    <h2 className="text-lg sm:text-xl font-bold text-white">
                      Interactive Healing Sandbox
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Adjust the simulated cognitive friction score to see how AuraGen dynamically heals the interface.
                  </p>
                </div>

                <div className={`px-4 py-2 rounded-xl border ${statusInfo.bg} ${statusInfo.border} self-start sm:self-center`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-bold ${statusInfo.color}`}>
                      {demoFriction}% Friction
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className={`text-xs font-semibold ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </div>
                </div>
              </div>

              {/* Slider & Quick Simulation Buttons */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Simulated Cognitive Friction Score</span>
                  <span className="font-mono text-indigo-400">{demoFriction}% / 100%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={demoFriction}
                  onChange={(e) => setDemoFriction(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setDemoFriction(20)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-medium text-slate-300 transition"
                  >
                    Normal (20%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoFriction(55)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-medium text-amber-300 transition"
                  >
                    Moderate (55%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoFriction(88)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-[11px] font-semibold text-indigo-200 transition flex items-center gap-1.5"
                  >
                    <span>✨ Trigger Healing (88%)</span>
                  </button>
                </div>
              </div>

              {/* Morphing Preview Container */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 min-h-[220px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {!isHealed ? (
                    <motion.div
                      key="standard-preview"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          Standard Form Layout (High Density)
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          Friction &lt; 80% (Passive Monitoring)
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 opacity-75">
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-400 font-mono">Existing Loan Category</span>
                          <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-400 font-mono">Outstanding Principal (₹)</span>
                          <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-400 font-mono">Monthly EMI Deductions</span>
                          <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-400 font-mono">CIBIL / Bureau Score</span>
                          <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 text-center italic">
                        Move the slider above 80% to trigger the AI Generative UI Morph.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="healed-preview"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                          <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                            ✨ AuraGen Healed Step Wizard
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">
                          Groq LLM Active • 0% Data Loss
                        </span>
                      </div>
                      <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white">Step 1 of 2: Do you currently have active loans?</span>
                          <span className="text-indigo-300 font-mono">50% Complete</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-3 rounded-lg bg-indigo-600/30 border border-indigo-500 text-center text-xs font-semibold text-white shadow-sm">
                            ✓ Yes, active loans
                          </div>
                          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
                            No active debt
                          </div>
                        </div>
                        <p className="text-[11px] text-indigo-300/80 italic">
                          💡 AI Reasoning: Decomposed dense financial liabilities into binary progressive steps.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  Ready to test on full forms with real mouse & keyboard telemetry?
                </span>
                <Link
                  href="/demo"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline flex items-center gap-1"
                >
                  Open Full Application Demo →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl text-center space-y-1 hover:border-indigo-500/30 transition duration-300"
            >
              <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200">
                {stat.label}
              </div>
              <div className="text-[11px] text-slate-500">
                {stat.sub}
              </div>
            </div>
          ))}
        </section>

        {/* Key Features Bento Grid */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Architected for Frictionless Experiences
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Four robust pillars guaranteeing seamless real-time adaptation without data loss or user disruption.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 backdrop-blur-xl transition duration-300 hover:shadow-2xl hover:shadow-indigo-950/40 group relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} blur-2xl rounded-full pointer-events-none`} />
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-3 rounded-2xl bg-slate-950 border border-slate-800 w-fit">
                      {feature.icon}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
                      {feature.tag}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-300 transition">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4-Step Interactive Workflow */}
        <section className="p-8 sm:p-12 rounded-3xl bg-slate-900/40 border border-slate-800/80 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              Autonomous Loop
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              How Self-Healing Generative UI Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3 relative">
                <span className="text-2xl font-extrabold font-mono text-indigo-500/40 block">
                  {item.step}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-indigo-900/50 via-purple-900/40 to-slate-900/80 border border-indigo-500/30 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Experience Self-Healing Interfaces?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Test the full Education Loan Application demo with live biometrics, simulation triggers, and real-time Groq LLM synthesis.
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              href="/demo"
              className="px-9 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Start Full Application Demo 🚀
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 pb-4 border-t border-slate-900 text-center space-y-3">
          <p className="text-xs font-mono text-slate-400">
            Tech Stack: Next.js 14 • Node.js/Express • Socket.IO • LangChain • Groq / OpenAI / Gemini • Framer Motion
          </p>
          <p className="text-xs text-slate-500">
            Developed by <span className="text-slate-300 font-semibold">Pradeep Kumar Singha</span> • AuraGen-AI Phase 5
          </p>
        </footer>
      </div>
    </main>
  );
}