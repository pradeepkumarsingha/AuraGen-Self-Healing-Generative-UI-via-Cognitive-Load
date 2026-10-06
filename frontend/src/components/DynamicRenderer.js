// frontend/src/components/DynamicRenderer.js
'use client';

import { useState, useEffect } from 'react';
import { ComponentRegistry } from './registry';
import { ErrorBoundary } from './ErrorBoundary';

export default function DynamicRenderer({
  uiSpec,
  spec, // support both prop names
  formData = {},
  updateField,
  onComplete,
  onCancel,
  cached = false,
  generationStatus = null
}) {
  const activeSpec = uiSpec || spec;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Reset step index when target section or spec changes
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [activeSpec?.targetSection, activeSpec?.title]);

  // Graceful degradation check if spec is missing or empty
  if (!activeSpec || !activeSpec.steps || activeSpec.steps.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-sm flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
        <div className="flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <p className="text-xs sm:text-sm">
            The AI layout could not be loaded. Using standard form instead.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold transition cursor-pointer"
        >
          Return to Standard View
        </button>
      </div>
    );
  }

  const steps = activeSpec.steps;
  const currentStep = steps[currentStepIndex] || steps[0];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  // Filter fields based on dependsOn rules with context awareness
  const visibleFields = (currentStep.fields || []).filter((field) => {
    if (!field.dependsOn) return true;
    const parentVal = formData[field.dependsOn.field];
    return parentVal === field.dependsOn.value;
  });

  const handleNext = () => {
    if (isLastStep) {
      onComplete?.();
    } else {
      setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
    }
  };

  const handlePrev = () => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <ErrorBoundary onReset={onCancel}>
      <div className="bg-slate-900/95 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40 backdrop-blur-2xl space-y-6">
        {/* Generative UI Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase">
                <span className="animate-spin text-xs">✨</span> AuraGen Adaptive Interface
              </span>

              {/* Status & Cache Badges */}
              {cached && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium shadow-[0_0_10px_rgba(52,211,153,0.15)]">
                  ⚡ Cached (&lt;50ms)
                </span>
              )}

              {activeSpec.isLiveAi ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium shadow-[0_0_12px_rgba(52,211,153,0.15)]">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live AI: {activeSpec.generatedBy || 'openai/gpt-oss-120b'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium">
                  Fallback Template
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {activeSpec.title || 'Simplified Guided Flow'}
            </h2>
            {activeSpec.subtitle && (
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {activeSpec.subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-slate-200 px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
            >
              {activeSpec.actions?.cancelLabel || 'Standard View'}
            </button>
          </div>
        </div>

        {/* AI Reasoning Pill */}
        {activeSpec.aiReasoning && (
          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3">
            <span className="text-sm">🤖</span>
            <div className="space-y-1">
              <p className="text-xs text-indigo-200/90 leading-relaxed">
                <strong className="text-indigo-100">AI Reasoning:</strong> {activeSpec.aiReasoning}
              </p>
              {activeSpec.generatedAt && (
                <span className="text-[10px] font-mono text-indigo-400/70 block">
                  Generated at {activeSpec.generatedAt}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Step Progress Indicators */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Step {currentStepIndex + 1} of {steps.length}: {currentStep.title}</span>
            <span className="font-mono">{Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Description */}
        {currentStep.description && (
          <p className="text-xs text-slate-400 italic">
            {currentStep.description}
          </p>
        )}

        {/* Dynamically Rendered Input Fields with Contextual State Preservation */}
        <div className="space-y-5 py-2">
          {visibleFields.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-400">
              No active fields required for this step. Click &ldquo;Continue&rdquo; to proceed.
            </div>
          ) : (
            visibleFields.map((field) => {
              const Component = ComponentRegistry[field.type] || ComponentRegistry.text;
              const value = formData?.[field.name] ?? field.defaultValue ?? '';

              return (
                <Component
                  key={field.id || field.name}
                  id={field.id || `field-${field.name}`}
                  name={field.name}
                  label={field.label}
                  value={value}
                  onChange={updateField}
                  placeholder={field.placeholder}
                  options={field.options}
                  required={field.required}
                  helperText={field.helperText}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                />
              );
            })
          )}
        </div>

        {/* Step Navigation Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            disabled={isFirstStep}
            onClick={handlePrev}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition ${
              isFirstStep
                ? 'opacity-40 cursor-not-allowed text-slate-600 bg-slate-950'
                : 'text-slate-300 bg-slate-800 hover:bg-slate-700 cursor-pointer'
            }`}
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition cursor-pointer"
          >
            {isLastStep ? (activeSpec.actions?.submitLabel || 'Complete & Return') : 'Next Step →'}
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
}
