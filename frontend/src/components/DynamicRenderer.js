// frontend/components/DynamicRenderer.js
'use client';

import { useState, useEffect } from 'react';
import { ComponentRegistry } from './registry';

const STATIC_FALLBACK_SPECS = {
  studentInfo: {
    version: '1.0',
    layout: 'step-by-step',
    targetSection: 'studentInfo',
    title: 'AuraGen Assistant: Personal Information',
    subtitle: 'Let’s breeze through your personal contact details step-by-step.',
    aiReasoning: 'Deconstructed applicant identity and contact fields into simple, single-focus steps to eliminate typing friction.',
    isLiveAi: false,
    generatedBy: 'Static Fallback Template',
    steps: [
      {
        id: 'step-applicant-name',
        title: 'Step 1: Your Name & Date of Birth',
        description: 'Provide your official legal name as printed on government IDs.',
        fields: [
          {
            id: 'field-full-name',
            name: 'fullName',
            label: 'Full Name',
            type: 'text',
            required: true,
            placeholder: 'e.g. Johnathan Doe',
            helperText: 'As per Aadhaar, Passport, or 10th marksheet'
          },
          {
            id: 'field-dob',
            name: 'dob',
            label: 'Date of Birth',
            type: 'date',
            required: false,
            helperText: 'Required for eligibility verification'
          }
        ]
      },
      {
        id: 'step-applicant-contact',
        title: 'Step 2: Contact Information',
        description: 'Where should we send your loan approval updates?',
        fields: [
          {
            id: 'field-email',
            name: 'email',
            label: 'Email Address',
            type: 'email',
            required: true,
            placeholder: 'student@example.edu',
            helperText: 'We will send sanction letters to this address.'
          },
          {
            id: 'field-phone',
            name: 'phone',
            label: 'Mobile Number',
            type: 'tel',
            required: true,
            placeholder: '+91 9876543210',
            helperText: 'Used for instant OTP verification.'
          }
        ]
      }
    ],
    actions: {
      submitLabel: 'Apply & Return to Application',
      cancelLabel: 'Use Standard View'
    }
  },

  academicInfo: {
    version: '1.0',
    layout: 'step-by-step',
    targetSection: 'academicInfo',
    title: 'AuraGen Assistant: Academic Background',
    subtitle: 'Quickly specify your enrolled institution and academic credentials.',
    aiReasoning: 'Split institutional enrollment, specialization, and GPA metrics into sequential focused steps.',
    isLiveAi: false,
    generatedBy: 'Static Fallback Template',
    steps: [
      {
        id: 'step-academic-college',
        title: 'Step 1: College & Degree Course',
        description: 'Specify where you are studying and your degree program.',
        fields: [
          {
            id: 'field-college',
            name: 'college',
            label: 'College / University Name',
            type: 'text',
            required: true,
            placeholder: 'e.g. Indian Institute of Technology',
            helperText: 'Select your registered higher education institution.'
          },
          {
            id: 'field-course',
            name: 'course',
            label: 'Degree / Course Name',
            type: 'text',
            placeholder: 'e.g. B.Tech Computer Science',
            helperText: 'Your enrolled or prospective degree program'
          },
          {
            id: 'field-specialization',
            name: 'specialization',
            label: 'Specialization / Major',
            type: 'text',
            placeholder: 'e.g. Artificial Intelligence & Data Science'
          }
        ]
      },
      {
        id: 'step-academic-grades',
        title: 'Step 2: Academic Performance & Year',
        description: 'Review your current grade point average and academic standing.',
        fields: [
          {
            id: 'field-cgpa',
            name: 'cgpa',
            label: 'CGPA / Percentage (0 - 10)',
            type: 'number',
            min: 0,
            max: 10,
            step: 0.01,
            placeholder: '8.5',
            helperText: 'Enter your latest cumulative GPA score.'
          },
          {
            id: 'field-year-of-study',
            name: 'yearOfStudy',
            label: 'Current Year of Study',
            type: 'select',
            options: [
              { label: '1st Year', value: '1' },
              { label: '2nd Year', value: '2' },
              { label: '3rd Year', value: '3' },
              { label: '4th Year', value: '4' },
              { label: '5+ Year', value: '5+' }
            ]
          }
        ]
      }
    ],
    actions: {
      submitLabel: 'Apply & Return to Application',
      cancelLabel: 'Use Standard View'
    }
  },

  loanInfo: {
    version: '1.0',
    layout: 'step-by-step',
    targetSection: 'loanInfo',
    title: 'AuraGen Assistant: Loan Amount & Purpose',
    subtitle: 'Customize your loan financing requirements effortlessly.',
    aiReasoning: 'Simplifies financial calculations by separating loan sizing from expense purpose descriptions.',
    isLiveAi: false,
    generatedBy: 'Static Fallback Template',
    steps: [
      {
        id: 'step-loan-req',
        title: 'Step 1: Required Loan Amount',
        description: 'How much total financing do you need for your education?',
        fields: [
          {
            id: 'field-loan-amount',
            name: 'loanAmount',
            label: 'Required Loan Amount (₹)',
            type: 'number',
            required: true,
            min: 10000,
            placeholder: 'e.g. 1200000',
            helperText: 'Includes tuition, hostel, equipment, and living allowances.'
          }
        ]
      },
      {
        id: 'step-loan-breakdown',
        title: 'Step 2: Purpose & Expense Breakdown',
        description: 'Specify which academic costs this loan will cover.',
        fields: [
          {
            id: 'field-purpose',
            name: 'purpose',
            label: 'Expense Coverage Summary',
            type: 'textarea',
            placeholder: 'e.g. Tuition fee (₹8L), campus accommodation (₹2L), laptop & books (₹2L)...',
            helperText: 'Briefly list the primary expenses covered by the requested loan.'
          }
        ]
      }
    ],
    actions: {
      submitLabel: 'Apply & Return to Application',
      cancelLabel: 'Use Standard View'
    }
  },

  studyLocation: {
    version: '1.0',
    layout: 'step-by-step',
    targetSection: 'studyLocation',
    title: 'AuraGen Assistant: Study Location & Academic Plan',
    subtitle: 'We simplified this step to help you select your destination and program easily.',
    aiReasoning: 'Standard verified template: Guided step-by-step breakdown for location, academic institution, and program duration.',
    isLiveAi: false,
    generatedBy: 'Static Fallback Template',
    steps: [
      {
        id: 'step-study-destination',
        title: 'Step 1: Study Destination',
        description: 'Where do you plan to pursue your education?',
        fields: [
          {
            id: 'field-study-location',
            name: 'studyLocation',
            label: 'Study Location',
            type: 'select',
            required: true,
            options: [
              { label: 'India', value: 'India' },
              { label: 'Abroad', value: 'Abroad' }
            ],
            helperText: 'Select India for domestic universities, or Abroad for international education.'
          },
          {
            id: 'field-destination-country',
            name: 'country',
            label: 'Destination Country',
            type: 'select',
            options: [
              { label: 'United States', value: 'USA' },
              { label: 'United Kingdom', value: 'UK' },
              { label: 'Canada', value: 'Canada' },
              { label: 'Germany', value: 'Germany' },
              { label: 'Australia', value: 'Australia' },
              { label: 'Other Country', value: 'Other' }
            ],
            dependsOn: { field: 'studyLocation', value: 'Abroad' },
            helperText: 'Select your host country of study.'
          },
          {
            id: 'field-destination-city',
            name: 'city',
            label: 'City / Campus Region',
            type: 'text',
            placeholder: 'e.g. Boston, London, Toronto',
            dependsOn: { field: 'studyLocation', value: 'Abroad' }
          }
        ]
      },
      {
        id: 'step-university-program',
        title: 'Step 2: University & Program Details',
        description: 'Provide details about your enrolled or prospective institution.',
        fields: [
          {
            id: 'field-university-name',
            name: 'university',
            label: 'Target University / Institute',
            type: 'text',
            placeholder: 'e.g. Harvard University or IIT Bombay',
            required: false,
            helperText: 'Name of the college or university you plan to attend.'
          },
          {
            id: 'field-course-duration',
            name: 'courseDuration',
            label: 'Program Duration (Years)',
            type: 'number',
            min: 1,
            max: 10,
            placeholder: '4',
            helperText: 'Total standard duration of the degree course.'
          },
          {
            id: 'field-study-level',
            name: 'studyLevel',
            label: 'Degree Level',
            type: 'select',
            options: [
              { label: 'Undergraduate / Bachelors', value: 'Undergraduate' },
              { label: 'Postgraduate / Masters', value: 'Masters' },
              { label: 'Doctorate / PhD', value: 'PhD' },
              { label: 'Diploma / Certificate', value: 'Diploma' }
            ]
          }
        ]
      },
      {
        id: 'step-study-purpose',
        title: 'Step 3: Purpose of Loan',
        description: 'Briefly explain what financing coverage you require.',
        fields: [
          {
            id: 'field-loan-purpose',
            name: 'purpose',
            label: 'Primary Expense Coverage',
            type: 'textarea',
            placeholder: 'e.g. Tuition fee, campus accommodation, living costs, books, lab equipments...',
            helperText: 'Provide a brief summary of tuition and living expenses.'
          }
        ]
      }
    ],
    actions: {
      submitLabel: 'Apply & Return to Application',
      cancelLabel: 'Use Standard View'
    }
  },

  existingLoansAndCredit: {
    version: '1.0',
    layout: 'step-by-step',
    targetSection: 'existingLoansAndCredit',
    title: 'AuraGen Smart Assistant: Existing Loans & Credit',
    subtitle: 'We simplified this step to help you breeze through liability details effortlessly.',
    aiReasoning: 'Standard verified template: Splitting complex financial liabilities and credit checks into sequential, low-cognitive-load screens.',
    isLiveAi: false,
    generatedBy: 'Static Fallback Template',
    steps: [
      {
        id: 'step-existing-status',
        title: 'Step 1: Current Loan Obligations',
        description: 'Do you currently have active loan commitments with any financial institution?',
        fields: [
          {
            id: 'field-has-loan',
            name: 'hasExistingLoan',
            label: 'Do you currently hold any active loans?',
            type: 'radio',
            required: true,
            options: [
              { label: 'Yes, I have active loans', value: 'Yes' },
              { label: 'No, I have zero debt obligations', value: 'No' }
            ],
            helperText: 'Select "No" if all past loans have been fully repaid and closed.'
          }
        ]
      },
      {
        id: 'step-loan-details',
        title: 'Step 2: Loan Breakdown',
        description: 'Specify the particulars of your primary ongoing loan obligation.',
        fields: [
          {
            id: 'field-loan-type',
            name: 'existingLoanType',
            label: 'Loan Category',
            type: 'select',
            options: [
              { label: 'Education Loan', value: 'Education' },
              { label: 'Personal Loan', value: 'Personal' },
              { label: 'Vehicle / Auto Loan', value: 'Vehicle' },
              { label: 'Home Loan', value: 'Home' },
              { label: 'Other Credit Facility', value: 'Other' }
            ],
            dependsOn: { field: 'hasExistingLoan', value: 'Yes' }
          },
          {
            id: 'field-loan-amount',
            name: 'existingLoanAmount',
            label: 'Outstanding Principal Amount (₹)',
            type: 'number',
            min: 0,
            placeholder: 'e.g. 150000',
            helperText: 'Approximate remaining loan balance',
            dependsOn: { field: 'hasExistingLoan', value: 'Yes' }
          },
          {
            id: 'field-loan-emi',
            name: 'existingLoanEmi',
            label: 'Monthly EMI Outflow (₹)',
            type: 'number',
            min: 0,
            placeholder: 'e.g. 4500',
            helperText: 'Monthly installment deducted from bank account',
            dependsOn: { field: 'hasExistingLoan', value: 'Yes' }
          },
          {
            id: 'field-loan-remaining',
            name: 'existingLoanRemaining',
            label: 'Remaining Duration (Months)',
            type: 'number',
            min: 0,
            placeholder: 'e.g. 18',
            helperText: 'Estimated number of EMIs left',
            dependsOn: { field: 'hasExistingLoan', value: 'Yes' }
          }
        ]
      },
      {
        id: 'step-credit-check',
        title: 'Step 3: Credit Bureau Verification',
        description: 'Review your pre-fetched bureau rating or enter your estimated score.',
        fields: [
          {
            id: 'field-credit-score',
            name: 'creditScore',
            label: 'Credit Score (CIBIL / Experian)',
            type: 'number',
            min: 300,
            max: 900,
            placeholder: '750',
            helperText: 'Standard range between 300 and 900. A score above 720 accelerates loan approval.'
          }
        ]
      }
    ],
    actions: {
      submitLabel: 'Apply & Return to Application',
      cancelLabel: 'Use Standard View'
    }
  },

  coApplicantInfo: {
    version: '1.0',
    layout: 'step-by-step',
    targetSection: 'coApplicantInfo',
    title: 'AuraGen Assistant: Co-applicant Information',
    subtitle: 'Add details for your co-borrower or guarantor.',
    aiReasoning: 'Guides co-signer relationship and financial capacity evaluation through step-by-step entry.',
    isLiveAi: false,
    generatedBy: 'Static Fallback Template',
    steps: [
      {
        id: 'step-coapplicant-relation',
        title: 'Step 1: Co-applicant Relationship',
        description: 'Who will be your primary co-borrower or guarantor?',
        fields: [
          {
            id: 'field-coapplicant-relation',
            name: 'coApplicantRelation',
            label: 'Relationship to Applicant',
            type: 'select',
            required: true,
            options: [
              { label: 'Father', value: 'Father' },
              { label: 'Mother', value: 'Mother' },
              { label: 'Guardian', value: 'Guardian' },
              { label: 'Other', value: 'Other' }
            ],
            helperText: 'Parent or legal guardian is recommended for quick approval.'
          }
        ]
      },
      {
        id: 'step-coapplicant-finances',
        title: 'Step 2: Occupation & Income',
        description: 'Provide employment and annual earning details.',
        fields: [
          {
            id: 'field-coapplicant-occupation',
            name: 'coApplicantOccupation',
            label: 'Primary Occupation',
            type: 'text',
            placeholder: 'e.g. Senior Software Engineer / Business Owner'
          },
          {
            id: 'field-coapplicant-income',
            name: 'annualIncome',
            label: 'Annual Income (₹)',
            type: 'number',
            required: true,
            min: 100000,
            placeholder: 'e.g. 1500000',
            helperText: 'Gross annual family income before tax.'
          }
        ]
      }
    ],
    actions: {
      submitLabel: 'Apply & Return to Application',
      cancelLabel: 'Use Standard View'
    }
  },

  documents: {
    version: '1.0',
    layout: 'step-by-step',
    targetSection: 'documents',
    title: 'AuraGen Assistant: Documents Verification',
    subtitle: 'Upload essential KYC and admission proofs easily.',
    aiReasoning: 'Breaks document verification into a guided checklist for quick completion.',
    isLiveAi: false,
    generatedBy: 'Static Fallback Template',
    steps: [
      {
        id: 'step-docs-academic',
        title: 'Step 1: University Admission & Academic Letter',
        description: 'Verify your admission offer and degree records.',
        fields: [
          {
            id: 'field-admission-letter',
            name: 'admissionLetter',
            label: 'University Admission / Offer Letter',
            type: 'text',
            placeholder: 'e.g. Harvard_Offer_Letter.pdf',
            helperText: 'Official university letter stating course and tuition fee.'
          },
          {
            id: 'field-academic-certificate',
            name: 'academicCertificate',
            label: 'Academic Certificate / Marksheets',
            type: 'text',
            placeholder: 'e.g. 10th_12th_BTech_Marksheets.pdf'
          }
        ]
      },
      {
        id: 'step-docs-income',
        title: 'Step 2: Income Proof',
        description: 'Upload salary slip or ITR of co-applicant.',
        fields: [
          {
            id: 'field-income-proof',
            name: 'incomeProof',
            label: 'Co-applicant Income Proof / ITR',
            type: 'text',
            placeholder: 'e.g. Form_16_Salary_Slip.pdf',
            helperText: 'Last 3 months salary slip or ITR statement.'
          }
        ]
      }
    ],
    actions: {
      submitLabel: 'Apply & Return to Application',
      cancelLabel: 'Use Standard View'
    }
  },

  generic: {
    version: '1.0',
    layout: 'step-by-step',
    targetSection: 'general',
    title: 'AuraGen Smart Assistant: Guided Flow',
    subtitle: 'Simplified guided questions to assist your progress.',
    aiReasoning: 'Deconstructed input fields into sequential steps to minimize cognitive load.',
    isLiveAi: false,
    generatedBy: 'Static Fallback Template',
    steps: [
      {
        id: 'step-general-review',
        title: 'Step 1: General Details',
        description: 'Please review and confirm your entries.',
        fields: [
          {
            id: 'field-general-notes',
            name: 'notes',
            label: 'Additional Information',
            type: 'textarea',
            placeholder: 'Enter any additional details or notes here...'
          }
        ]
      }
    ],
    actions: {
      submitLabel: 'Apply & Return to Application',
      cancelLabel: 'Use Standard View'
    }
  }
};

export default function DynamicRenderer({ uiSpec, formData, updateField, onComplete, onCancel }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [useStaticMode, setUseStaticMode] = useState(false);

  // Determine active section from the received uiSpec
  const activeSectionKey = uiSpec?.targetSection || 'studentInfo';
  const staticFallback = STATIC_FALLBACK_SPECS[activeSectionKey] || STATIC_FALLBACK_SPECS.studentInfo || STATIC_FALLBACK_SPECS.studyLocation;
  const activeSpec = useStaticMode ? staticFallback : (uiSpec || staticFallback);

  // Reset step index when target section changes
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [uiSpec?.targetSection, uiSpec?.title]);

  if (!activeSpec || !activeSpec.steps || activeSpec.steps.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-sm">
        No active dynamic UI specification available.
      </div>
    );
  }

  const steps = activeSpec.steps;
  const currentStep = steps[currentStepIndex] || steps[0];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  // Filter fields based on dependsOn rules
  const visibleFields = (currentStep.fields || []).filter((field) => {
    if (!field.dependsOn) return true;
    const parentVal = formData[field.dependsOn.field];
    return parentVal === field.dependsOn.value;
  });

  // Debug logging for current render
  console.log(`[DynamicRenderer] Section being rendered: "${activeSpec.targetSection || activeSectionKey}"`);
  console.log(`[DynamicRenderer] Fields being rendered:`, visibleFields.map((f) => f.name));

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

  const toggleUiMode = () => {
    setUseStaticMode((prev) => !prev);
    setCurrentStepIndex(0);
  };

  return (
    <div className="bg-slate-900/95 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40 backdrop-blur-2xl space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Generative UI Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase">
              <span className="animate-spin text-xs">✨</span> AuraGen Adaptive Interface
            </span>
            
            {/* Live Model Verification Badge */}
            {activeSpec.isLiveAi ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium shadow-[0_0_12px_rgba(52,211,153,0.15)]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Live Groq AI: {activeSpec.generatedBy || 'openai/gpt-oss-120b'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium">
                Static UI Fallback
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
          {/* Fallback / Real-time switch button */}
          <button
            type="button"
            onClick={toggleUiMode}
            className="text-xs text-indigo-300 hover:text-white px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-700/50 hover:border-indigo-500 transition cursor-pointer flex items-center gap-1.5"
            title="Switch between Real-Time AI UI and Static Template"
          >
            <span>🔄</span>
            {useStaticMode ? 'Switch to Groq AI UI' : 'Switch to Static UI'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
          >
            {activeSpec.actions?.cancelLabel || 'Standard View'}
          </button>
        </div>
      </div>

      {/* AI Reasoning Pill */}
      {uiSpec.aiReasoning && (
        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3">
          <span className="text-sm">🤖</span>
          <div className="space-y-1">
            <p className="text-xs text-indigo-200/90 leading-relaxed">
              <strong className="text-indigo-100">AI Reasoning:</strong> {uiSpec.aiReasoning}
            </p>
            {uiSpec.generatedAt && (
              <span className="text-[10px] font-mono text-indigo-400/70 block">
                Generated live at {uiSpec.generatedAt}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Raw JSON Spec Inspector Drawer */}
      <details className="text-xs text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 cursor-pointer">
        <summary className="font-mono text-[11px] text-slate-400 hover:text-indigo-300 select-none">
          🔍 Inspect Raw AI-Generated JSON Specification
        </summary>
        <pre className="mt-2.5 p-3 rounded-lg bg-slate-950 text-[11px] font-mono text-emerald-400/90 overflow-x-auto border border-slate-800 max-h-52 overflow-y-auto">
          {JSON.stringify(uiSpec, null, 2)}
        </pre>
      </details>


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
