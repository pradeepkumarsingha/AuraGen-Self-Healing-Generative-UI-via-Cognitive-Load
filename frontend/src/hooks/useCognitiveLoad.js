// frontend/hooks/useCognitiveLoad.js
import { useState, useRef, useEffect, useCallback } from 'react';

export const FIELD_TO_SECTION_MAP = {
  // Study Location & Program
  studyLocation: 'studyLocation',
  courseDuration: 'studyLocation',
  country: 'studyLocation',
  city: 'studyLocation',
  university: 'studyLocation',
  intake: 'studyLocation',
  studyLevel: 'studyLocation',
  purpose: 'studyLocation',

  // Existing Loans & Credit
  hasExistingLoan: 'existingLoansAndCredit',
  existingLoanType: 'existingLoansAndCredit',
  existingLoanAmount: 'existingLoansAndCredit',
  existingLoanEmi: 'existingLoansAndCredit',
  existingLoanRemaining: 'existingLoansAndCredit',
  creditScore: 'existingLoansAndCredit',
  creditScoreSource: 'existingLoansAndCredit',
  creditVerificationStatus: 'existingLoansAndCredit',
  creditRemarks: 'existingLoansAndCredit',
  monthlyEmi: 'existingLoansAndCredit',
  outstandingBalance: 'existingLoansAndCredit',
  lenderName: 'existingLoansAndCredit',

  // Student Info
  fullName: 'studentInfo',
  dob: 'studentInfo',
  email: 'studentInfo',
  phone: 'studentInfo',

  // Academic Info
  college: 'academicInfo',
  course: 'academicInfo',
  specialization: 'academicInfo',
  cgpa: 'academicInfo',
  yearOfStudy: 'academicInfo',

  // Loan Info
  loanAmount: 'loanInfo',

  // Co-applicant Info
  coApplicantRelation: 'coApplicantInfo',
  coApplicantOccupation: 'coApplicantInfo',
  annualIncome: 'coApplicantInfo',

  // Documents
  admissionLetter: 'documents',
  incomeProof: 'documents',
  academicCertificate: 'documents'
};

export function useCognitiveLoad() {
  const [score, setScore] = useState(15); // baseline starting load
  const [activeSection, setActiveSection] = useState('studentInfo');
  const [activeField, setActiveField] = useState('fullName');

  // Telemetry refs to track interaction metrics without re-renders
  const focusTimeRef = useRef(null);
  const activeFieldRef = useRef('fullName');
  const activeSectionRef = useRef('studentInfo');
  const fieldValuesRef = useRef({});
  const hesitationTimerRef = useRef(null);
  const switchCountRef = useRef(0);

  // Mouse & click telemetry refs
  const lastMousePosRef = useRef({ x: 0, y: 0, time: Date.now() });
  const mouseTrajectoryRef = useRef([]);
  const clickHistoryRef = useRef([]);

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
  const recordFocus = useCallback((field, explicitSection = null) => {
    if (hesitationTimerRef.current) {
      clearTimeout(hesitationTimerRef.current);
    }

    const now = Date.now();
    const prevField = activeFieldRef.current;
    const determinedSection = explicitSection || FIELD_TO_SECTION_MAP[field] || 'studentInfo';

    activeFieldRef.current = field;
    activeSectionRef.current = determinedSection;
    setActiveField(field);
    setActiveSection(determinedSection);
    console.log(`🎯 [Frontend Telemetry] Focused field: "${field}" -> Active Section: "${determinedSection}"`);

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
  const recordChange = useCallback((field, value, explicitSection = null) => {
    // Clear hesitation timer on active typing
    if (hesitationTimerRef.current) {
      clearTimeout(hesitationTimerRef.current);
      hesitationTimerRef.current = null;
    }

    const determinedSection = explicitSection || FIELD_TO_SECTION_MAP[field] || activeSectionRef.current;
    if (determinedSection && determinedSection !== activeSectionRef.current) {
      activeSectionRef.current = determinedSection;
      setActiveSection(determinedSection);
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
    mouseTrajectoryRef.current = [];
    clickHistoryRef.current = [];
    setScore(15);
    console.log('🔄 [CognitiveLoad] Reset to baseline (15%)');
  }, []);

  // 5. Global Mouse Velocity & Rage Click Telemetry Tracker
  useEffect(() => {
    let lastJitterAlert = 0;
    let lastVelocitySample = Date.now();

    const handleMouseMove = (e) => {
      const now = Date.now();
      const dt = now - lastVelocitySample;
      if (dt < 60) return; // Sample every 60ms

      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const velocity = distance / dt; // pixels per ms

      lastMousePosRef.current = { x: e.clientX, y: e.clientY, time: now };
      lastVelocitySample = now;

      // Keep recent trajectory angles to detect erratic searching/shaking
      const trajectory = mouseTrajectoryRef.current;
      trajectory.push({ x: e.clientX, y: e.clientY, velocity, time: now });
      if (trajectory.length > 8) trajectory.shift();

      // Detect frantic cursor shaking / rapid multi-directional hunting
      if (trajectory.length >= 6 && now - lastJitterAlert > 4000) {
        let directionFlips = 0;
        for (let i = 2; i < trajectory.length; i++) {
          const v1x = trajectory[i - 1].x - trajectory[i - 2].x;
          const v2x = trajectory[i].x - trajectory[i - 1].x;
          if (v1x * v2x < -100) directionFlips += 1;
        }

        if (directionFlips >= 3 && velocity > 0.8) {
          lastJitterAlert = now;
          applyScoreDelta(10, 'erratic cursor jitter / search agitation');
        }
      }
    };

    // Rage click detector (3+ rapid clicks in <= 600ms)
    const handleClick = () => {
      const now = Date.now();
      clickHistoryRef.current.push(now);
      // Keep only clicks within the last 600ms
      clickHistoryRef.current = clickHistoryRef.current.filter((t) => now - t <= 600);

      if (clickHistoryRef.current.length >= 3) {
        applyScoreDelta(14, 'rage clicking / frustration burst');
        clickHistoryRef.current = [];
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      if (hesitationTimerRef.current) {
        clearTimeout(hesitationTimerRef.current);
      }
    };
  }, [applyScoreDelta]);

  return {
    score,
    level: getLevel(score),
    activeSection,
    setActiveSection,
    activeField: activeFieldRef.current,
    recordFocus,
    recordChange,
    recordError,
    reset,
    applyScoreDelta
  };
}

