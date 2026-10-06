// frontend/src/app/demo/page.js
'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoanForm } from '../../hooks/useLoanForm';
import { useCognitiveLoad } from '../../hooks/useCognitiveLoad';
import { useSocket } from '../../hooks/useSocket';
import LoanForm from '../../components/LoanForm';
import CognitiveLoadBadge from '../../components/CognitiveLoadBadge';
import DynamicRenderer from '../../components/DynamicRenderer';

export default function DemoPage() {
  const { formData, updateField } = useLoanForm();
  const {
    score,
    level,
    activeSection,
    activeField,
    recordFocus,
    recordChange,
    recordError,
    reset,
    applyScoreDelta
  } = useCognitiveLoad();

  const {
    socket,
    socketStatus,
    isConnected,
    isGenerating,
    cached,
    generationStatus,
    lastTrigger,
    setLastTrigger
  } = useSocket();

  const [submittedData, setSubmittedData] = useState(null);
  const [activeUiSpec, setActiveUiSpec] = useState(null);
  const hasTriggeredRef = useRef(false);

  // Mount the dynamic generative UI spec when backend finishes generation
  useEffect(() => {
    if (lastTrigger?.uiSpec || lastTrigger?.spec) {
      const spec = lastTrigger.uiSpec || lastTrigger.spec;
      console.log(`✨ [AuraGen UI Healing] Mounting dynamic UI spec for section: "${spec.targetSection || lastTrigger.section}"...`);
      setActiveUiSpec({ ...spec });
    }
  }, [lastTrigger]);

  // Monitor score and emit COGNITIVE_LOAD_HIGH with full formState when score > 80
  useEffect(() => {
    if (score > 80 && !hasTriggeredRef.current && isConnected && socket) {
      const targetSec = activeSection || 'studentInfo';
      const targetField = activeField || 'fullName';
      console.log(`[Frontend Telemetry] Selected section: "${targetSec}", active field: "${targetField}"`);
      console.log(`[Frontend Telemetry] Emitting COGNITIVE_LOAD_HIGH: section="${targetSec}", field="${targetField}", score=${score}%`);
      hasTriggeredRef.current = true;

      socket.emit('COGNITIVE_LOAD_HIGH', {
        score,
        page: 'education-loan',
        section: targetSec,
        field: targetField,
        formState: formData // Full form state passed for context preservation
      });
    } else if (score <= 80) {
      hasTriggeredRef.current = false;
    }
  }, [score, isConnected, socket, formData, activeSection, activeField]);

  const handleResetTelemetry = () => {
    reset();
    hasTriggeredRef.current = false;
    setLastTrigger(null);
    setActiveUiSpec(null);
  };

  const handleCompleteDynamicFlow = () => {
    console.log('✅ Completed adaptive UI flow. Preserving updated form state:', formData);
    setActiveUiSpec(null);
    reset(); // Reset cognitive load after successful healing
  };

  const handleSubmit = () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.college || !formData.loanAmount) {
      recordError('formSubmission', 'Missing mandatory fields');
      alert('Please fill all required fields marked with *');
      return;
    }

    console.log('📋 Complete Loan Form Submitted:', formData);
    setSubmittedData(formData);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation & Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl">
          <div className="flex items-start gap-4">
            <img
              src="/logo.png"
              alt="AuraGen Logo"
              className="h-12 w-12 rounded-xl object-contain shadow-lg shadow-indigo-500/25 border border-indigo-500/30 bg-slate-950 mt-1 hidden sm:block"
            />
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href="/"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
                >
                  ← Back to Home
                </Link>
                <span className="text-slate-600">•</span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-semibold tracking-wide uppercase">
                  Interactive Demo
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Education Loan Application
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Adaptive loan application with live cognitive state evaluation & dynamic UI generation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                socketStatus === 'Connected'
                  ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]'
                  : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="text-xs font-mono font-medium text-slate-300">
              WebSocket: {socketStatus}
            </span>
          </div>
        </div>

        {/* Cognitive Load Telemetry Real-time Badge */}
        <CognitiveLoadBadge
          score={score}
          level={level}
          onReset={handleResetTelemetry}
          onSimulateHesitation={() => applyScoreDelta(25, 'Simulated High Hesitation')}
          onSimulateError={() => applyScoreDelta(35, 'Simulated Critical Friction')}
        />

        {/* Latency Optimization Loading Skeleton */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/40 text-indigo-200 text-xs flex items-center justify-between shadow-lg shadow-indigo-950/50 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-indigo-400 animate-ping"></span>
              <span className="font-medium">
                Building simplified AI wizard for section &ldquo;{activeSection || 'active'}&rdquo;...
              </span>
            </div>
            <span className="font-mono text-[11px] text-indigo-400/80">Groq LLM Pipeline Active</span>
          </motion.div>
        )}

        {/* Morphing Framer Motion Animation between Standard Form & Generative UI */}
        <AnimatePresence mode="wait">
          {!activeUiSpec ? (
            <motion.div
              key="standard-loan-form"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <LoanForm
                formData={formData}
                updateField={updateField}
                onSubmit={handleSubmit}
                onRecordFocus={recordFocus}
                onRecordChange={recordChange}
                onRecordError={recordError}
              />
            </motion.div>
          ) : (
            <motion.div
              key="auragen-dynamic-renderer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <DynamicRenderer
                uiSpec={activeUiSpec}
                spec={activeUiSpec}
                formData={formData}
                updateField={updateField}
                onComplete={handleCompleteDynamicFlow}
                onCancel={() => setActiveUiSpec(null)}
                cached={cached}
                generationStatus={generationStatus}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Modal / Banner when submitted */}
        {submittedData && (
          <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 shadow-2xl space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎉</span>
                <h3 className="font-semibold text-emerald-100">Application Submitted Successfully!</h3>
              </div>
              <button
                onClick={() => setSubmittedData(null)}
                className="text-xs text-emerald-400 hover:text-emerald-200 cursor-pointer underline"
              >
                Dismiss
              </button>
            </div>
            <p className="text-xs text-emerald-300/80">
              The full form payload has been logged to the browser console with all preserved entries.
            </p>
            <details className="text-xs text-emerald-300/70 cursor-pointer pt-2">
              <summary className="font-medium hover:text-emerald-200">View Submitted JSON Payload</summary>
              <pre className="mt-2 p-4 bg-slate-950 rounded-xl overflow-x-auto text-[11px] text-slate-300 font-mono border border-slate-800">
                {JSON.stringify(submittedData, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </main>
  );
}
