// frontend/components/DynamicRenderer.js
'use client';

import { useState } from 'react';
import { ComponentRegistry } from './registry';

export default function DynamicRenderer({ uiSpec, formData, updateField, onComplete, onCancel }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!uiSpec || !uiSpec.steps || uiSpec.steps.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-sm">
        No active dynamic UI specification available.
      </div>
    );
  }

  const steps = uiSpec.steps;
  const currentStep = steps[currentStepIndex] || steps[0];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  // Filter fields based on dependsOn rules
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
    <div className="bg-slate-900/95 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40 backdrop-blur-2xl space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Generative UI Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-2">
            <span className="animate-spin text-xs">✨</span> AuraGen Adaptive Interface
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {uiSpec.title || 'Simplified Guided Flow'}
          </h2>
          {uiSpec.subtitle && (
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {uiSpec.subtitle}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="self-start sm:self-center text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
        >
          {uiSpec.actions?.cancelLabel || 'Standard View'}
        </button>
      </div>

      {/* AI Reasoning Pill */}
      {uiSpec.aiReasoning && (
        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3">
          <span className="text-sm">🤖</span>
          <p className="text-xs text-indigo-200/90 leading-relaxed">
            <strong className="text-indigo-100">AI Adaptation Trigger:</strong> {uiSpec.aiReasoning}
          </p>
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

      {/* Dynamically Rendered Input Fields */}
      <div className="space-y-5 py-2">
        {visibleFields.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-400">
            No active fields required for this step. Click &ldquo;Continue&rdquo; to proceed.
          </div>
        ) : (
          visibleFields.map((field) => {
            const Component = ComponentRegistry[field.type] || ComponentRegistry.text;
            return (
              <Component
                key={field.id}
                id={field.id}
                name={field.name}
                label={field.label}
                value={formData[field.name]}
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
          {isLastStep ? (uiSpec.actions?.submitLabel || 'Complete & Return') : 'Next Step →'}
        </button>
      </div>
    </div>
  );
}
