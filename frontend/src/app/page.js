// frontend/app/page.js
'use client';

import { useEffect, useState, useRef } from 'react';
import { useLoanForm } from '../hooks/useLoanForm';
import { useCognitiveLoad } from '../hooks/useCognitiveLoad';
import { useSocket } from '../hooks/useSocket';
import LoanForm from '../components/LoanForm';
import CognitiveLoadBadge from '../components/CognitiveLoadBadge';
import DynamicRenderer from '../components/DynamicRenderer';

export default function Home() {
  const { formData, updateField } = useLoanForm();
  const {
    score,
    level,
    recordFocus,
    recordChange,
    recordError,
    reset,
    applyScoreDelta
  } = useCognitiveLoad();

  const { socket, socketStatus, isConnected, lastTrigger, setLastTrigger } = useSocket();
  const [submittedData, setSubmittedData] = useState(null);
  const [activeUiSpec, setActiveUiSpec] = useState(null);
  const hasTriggeredRef = useRef(false);

  // When backend sends AURAGEN_TRIGGERED with a UI Spec, mount the dynamic generative UI
  useEffect(() => {
    if (lastTrigger?.uiSpec) {
      console.log('✨ [AuraGen UI Healing] Mounting dynamic AI-generated UI spec...');
      setActiveUiSpec(lastTrigger.uiSpec);
    }
  }, [lastTrigger]);

  // Monitor score and emit COGNITIVE_LOAD_HIGH when score > 80
  useEffect(() => {
    if (score > 80 && !hasTriggeredRef.current && isConnected && socket) {
      console.log('🚨 [Telemetry Threshold Exceeded] Cognitive load score > 80! Emitting COGNITIVE_LOAD_HIGH...');
      hasTriggeredRef.current = true;

      socket.emit('COGNITIVE_LOAD_HIGH', {
        score,
        page: 'education-loan',
        section: 'existingLoansAndCredit',
        formState: formData
      });
    } else if (score <= 80) {
      hasTriggeredRef.current = false;
    }
  }, [score, isConnected, socket, formData]);

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
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-2">
              AuraGen Engine • Phase 5
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Education Loan Application
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Adaptive loan application with live cognitive state evaluation & dynamic UI generation.
            </p>
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

        {/* Dynamic AI-Generated Self-Healing UI View */}
        {activeUiSpec ? (
          <DynamicRenderer
            uiSpec={activeUiSpec}
            formData={formData}
            updateField={updateField}
            onComplete={handleCompleteDynamicFlow}
            onCancel={() => setActiveUiSpec(null)}
          />
        ) : (
          /* Standard Loan Application Form */
          <LoanForm
            formData={formData}
            updateField={updateField}
            onSubmit={handleSubmit}
            onRecordFocus={recordFocus}
            onRecordChange={recordChange}
            onRecordError={recordError}
          />
        )}

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
              The full form payload has been logged to the browser console.
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