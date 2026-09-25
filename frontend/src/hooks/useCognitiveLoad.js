// frontend/hooks/useCognitiveLoad.js
import { useState, useRef, useEffect, useCallback } from 'react';

export function useCognitiveLoad() {
  const [score, setScore] = useState(15); // baseline starting load

  // Telemetry refs to track interaction metrics without re-renders
  const focusTimeRef = useRef(null);
  const activeFieldRef = useRef(null);
  const fieldValuesRef = useRef({});
  const hesitationTimerRef = useRef(null);
  const switchCountRef = useRef(0);

  // Helper to get cognitive level label
  const getLevel = (val) => {
    if (val <= 30) return 'Normal';
    if (val <= 60) return 'Moderate';
    if (val <= 80) return 'High';
    return 'Critical';
  };

  const applyScoreDelta = useCallback((delta, reason = '') => {
    setScore((prev) => {
      const nextScore = Math.min(100, Math.max(0, prev + delta));
      if (nextScore !== prev) {
        console.log(`🧠 [CognitiveLoad] +${delta} (${reason}) => Score: ${nextScore}% [${getLevel(nextScore)}]`);
      }
      return nextScore;
    });
  }, []);

  // 1. Focus Tracking & Hesitation Timer
  const recordFocus = useCallback((field) => {
    if (hesitationTimerRef.current) {
      clearTimeout(hesitationTimerRef.current);
    }

    const now = Date.now();
    const prevField = activeFieldRef.current;

    // Field switching without typing in previous field (hopping/hesitation)
    if (prevField && prevField !== field) {
      const prevVal = fieldValuesRef.current[prevField] || '';
      if (!prevVal.trim()) {
        switchCountRef.current += 1;
        if (switchCountRef.current >= 2) {
          applyScoreDelta(8, `rapid hopping from empty ${prevField}`);
          switchCountRef.current = 0;
        }
      }
    }

    activeFieldRef.current = field;
    focusTimeRef.current = now;

    // Hesitation dwell timer: If user stays on field > 4.5s without typing
    hesitationTimerRef.current = setTimeout(() => {
      applyScoreDelta(12, `hesitation dwell on ${field}`);
    }, 4500);
  }, [applyScoreDelta]);

  // 2. Change Tracking & Deletion/Backtracking Detection
  const recordChange = useCallback((field, value) => {
    // Clear hesitation timer on active typing
    if (hesitationTimerRef.current) {
      clearTimeout(hesitationTimerRef.current);
      hesitationTimerRef.current = null;
    }

    const strVal = typeof value === 'string' ? value : '';
    const prevVal = fieldValuesRef.current[field] || '';

    // Backtracking / frequent corrections
    if (strVal.length < prevVal.length && prevVal.length > 2) {
      applyScoreDelta(6, `backtracking/correction on ${field}`);
    }

    fieldValuesRef.current[field] = strVal;
  }, [applyScoreDelta]);

  // 3. Error Tracking (Validation errors, invalid input ranges)
  const recordError = useCallback((field, errorMsg = '') => {
    applyScoreDelta(15, `validation error on ${field} (${errorMsg})`);
  }, [applyScoreDelta]);

  // 4. Reset function
  const reset = useCallback(() => {
    if (hesitationTimerRef.current) {
      clearTimeout(hesitationTimerRef.current);
    }
    focusTimeRef.current = null;
    activeFieldRef.current = null;
    fieldValuesRef.current = {};
    switchCountRef.current = 0;
    setScore(15);
    console.log('🔄 [CognitiveLoad] Reset to baseline (15%)');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hesitationTimerRef.current) {
        clearTimeout(hesitationTimerRef.current);
      }
    };
  }, []);

  return {
    score,
    level: getLevel(score),
    recordFocus,
    recordChange,
    recordError,
    reset,
    applyScoreDelta
  };
}
