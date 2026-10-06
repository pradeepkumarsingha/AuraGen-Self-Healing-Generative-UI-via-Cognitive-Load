// Backend/src/ai/uiGenerator.js
import dotenv from 'dotenv';
dotenv.config();
import { createHash } from 'crypto';
import { ChatGroq } from '@langchain/groq';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { validateUiSpec } from '../validation/uiSpecSchema.js';

// In-memory LRU-like UI cache to ensure sub-2s perceived latency
const uiCache = new Map();

function cacheKey(section, formState = {}) {
  return createHash('sha256')
    .update(JSON.stringify({ section, formState }))
    .digest('hex');
}

// Component library knowledge provided to the LLM
const COMPONENT_LIBRARY_DOCS = `
Available UI Components in AuraGen Design System:
- "text": Single-line string input. Supports label, placeholder, helperText, required, defaultValue.
- "number": Numeric input. Supports min, max, step, placeholder, helperText, required, defaultValue.
- "email": Validated email format input.
- "tel": Telephone/mobile input with numerical keypad mode.
- "date": Date picker.
- "select": Dropdown selection. Requires "options": [{ label: string, value: string | number }].
- "radio": Radio group pills for quick binary/multi-choice decisions. Requires "options": [{ label: string, value: string }].
- "textarea": Multi-line expanded text area.

Conditional Fields:
- "dependsOn": { "field": string, "value": any } -> only shows field when parent field equals value.

Layout Formats:
- "step-by-step": Step wizard splitting complex multi-field forms into sequential, low-cognitive-load screens.
`;

export const FALLBACK_SPECS = {
  studentInfo: {
    version: '1.0',
    layout: 'step-by-step',
    targetSection: 'studentInfo',
    title: 'AuraGen Assistant: Personal Information',
    subtitle: 'Let’s breeze through your personal contact details step-by-step.',
    aiReasoning: 'Deconstructed applicant identity and contact fields into simple, single-focus steps to eliminate typing friction.',
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
    aiReasoning: 'Detected cognitive friction while configuring study destination. Guided step-by-step breakdown for location, academic institution, and program duration.',
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
    aiReasoning: 'Detected elevated cognitive friction. Splitting complex financial liabilities and credit checks into bite-sized guided questions with auto-calculations.',
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
    steps: [
      {
        id: 'step-general-1',
        title: 'Step 1: General Details',
        description: 'Please review and confirm your details.',
        fields: [
          {
            id: 'field-general-notes',
            name: 'notes',
            label: 'Additional Information',
            type: 'textarea',
            placeholder: 'Enter any relevant details...'
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

export const SECTION_FIELD_RESTRICTIONS = {
  studentInfo: {
    allowed: ['fullName', 'dob', 'email', 'phone', 'notes'],
    forbidden: ['hasExistingLoan', 'loanAmount', 'studyLocation', 'cgpa', 'college', 'annualIncome']
  },
  academicInfo: {
    allowed: ['college', 'course', 'specialization', 'cgpa', 'yearOfStudy', 'studyLevel', 'notes'],
    forbidden: ['hasExistingLoan', 'existingLoanAmount', 'annualIncome', 'hasExistingLoans', 'creditScore']
  },
  loanInfo: {
    allowed: ['loanAmount', 'purpose', 'notes'],
    forbidden: ['hasExistingLoan', 'hasExistingLoans', 'creditScore', 'studyLocation', 'fullName', 'dob']
  },
  studyLocation: {
    allowed: [
      'studyLocation', 'country', 'city', 'university', 'college', 'course',
      'intake', 'studyLevel', 'courseDuration', 'purpose', 'destinationCountry',
      'programName', 'degreeType', 'campusLocation', 'notes'
    ],
    forbidden: [
      'hasExistingLoan', 'hasExistingLoans', 'existingLoanType', 'loanType',
      'existingLoanAmount', 'existingLoanEmi', 'monthlyEmi',
      'monthlyPayment', 'existingLoanRemaining', 'outstandingBalance',
      'lenderName', 'creditScore', 'creditScoreSource', 'creditVerificationStatus',
      'creditRemarks', 'noLoanComment'
    ]
  },
  existingLoansAndCredit: {
    allowed: [
      'hasExistingLoan', 'hasExistingLoans', 'existingLoanType', 'loanType',
      'existingLoanAmount', 'existingLoanEmi', 'existingLoanRemaining',
      'creditScore', 'creditScoreSource', 'creditVerificationStatus',
      'creditRemarks', 'monthlyEmi', 'monthlyPayment', 'outstandingBalance',
      'lenderName', 'noLoanComment'
    ],
    forbidden: [
      'studyLocation', 'country', 'city', 'university', 'intake', 'studyLevel', 'fullName', 'dob'
    ]
  },
  coApplicantInfo: {
    allowed: ['coApplicantRelation', 'coApplicantOccupation', 'annualIncome', 'notes'],
    forbidden: ['studyLocation', 'hasExistingLoan', 'cgpa', 'dob', 'college']
  },
  documents: {
    allowed: ['admissionLetter', 'incomeProof', 'academicCertificate', 'notes'],
    forbidden: ['hasExistingLoan', 'existingLoanAmount', 'creditScore', 'cgpa']
  }
};

/**
 * Validates that the spec does not contain fields forbidden in the targetSection.
 */
export function validateSectionFields(spec, targetSection) {
  const restriction = SECTION_FIELD_RESTRICTIONS[targetSection];
  if (!restriction) return { valid: true };

  const allFieldNames = [];
  for (const step of spec.steps || []) {
    for (const field of step.fields || []) {
      if (field.name) {
        allFieldNames.push(field.name);
      }
    }
  }

  // Check for forbidden fields
  const forbiddenFound = allFieldNames.filter(name => {
    const lowerName = name.toLowerCase();
    return restriction.forbidden.some(f => lowerName === f.toLowerCase() || (lowerName.includes(f.toLowerCase()) && !restriction.allowed.includes(name)));
  });

  if (forbiddenFound.length > 0) {
    return {
      valid: false,
      reason: `Specification for section "${targetSection}" contains forbidden fields: ${forbiddenFound.join(', ')}`
    };
  }

  return { valid: true };
}

/**
 * Injects existing form values into fallback or generated specs as defaultValue
 */
function injectContextualDefaults(spec, formState = {}) {
  if (!spec || !spec.steps) return spec;
  return {
    ...spec,
    steps: spec.steps.map(step => ({
      ...step,
      fields: (step.fields || []).map(field => ({
        ...field,
        defaultValue: formState[field.name] !== undefined ? formState[field.name] : (field.defaultValue ?? '')
      }))
    }))
  };
}

/**
 * Returns the verified static fallback UI spec for a given section.
 */
export function getStaticFallbackSpec(section = 'studentInfo', formState = {}) {
  console.log(`[Backend AI Generator] Selected fallback specification for section: "${section}"`);
  const fallback = FALLBACK_SPECS[section] || FALLBACK_SPECS.generic || FALLBACK_SPECS.studentInfo;
  const validationResult = validateUiSpec(fallback);
  const baseSpec = validationResult.success ? validationResult.data : fallback;
  
  const prepared = injectContextualDefaults({
    ...baseSpec,
    targetSection: section,
    isLiveAi: false,
    generatedBy: 'Static Fallback Template',
    generatedAt: new Date().toLocaleTimeString()
  }, formState);

  return prepared;
}

/**
 * Generates an adaptive, simplified step-by-step UI spec based on the user's friction metrics using Groq/OpenAI/Gemini LLM.
 * Includes in-memory hashing cache to achieve sub-2s response latency and robust static fallbacks.
 * @param {Object} context - { score, section, field, formState }
 * @returns {Object} Validated UI Specification or Result Object { spec, cached }
 */
export async function generateAdaptiveUiSpec({ score, section = 'studentInfo', field = null, formState = {} }) {
  console.log(`🤖 [Backend AI Generator] Generating UI spec for section: "${section}", focused field: "${field || 'none'}" (Cognitive Friction: ${score}%)`);

  // 1. Latency Optimization: Check In-Memory SHA-256 Cache
  const key = cacheKey(section, formState);
  if (uiCache.has(key)) {
    console.log(`⚡ [Cache Hit] Reusing generated UI spec from memory for section: "${section}"`);
    const cachedSpec = uiCache.get(key);
    const resultObj = { spec: cachedSpec, cached: true };
    // Attach spec properties to resultObj for seamless backward compatibility
    Object.assign(resultObj, cachedSpec);
    return resultObj;
  }

  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  const targetModel = process.env.AI_MODEL || 'openai/gpt-oss-120b';

  if (apiKey) {
    try {
      console.log(`⚡ [AuraGen LangChain Pipeline] Invoking model: ${targetModel} for section: "${section}" (Field: "${field}")...`);
      
      let model;
      if (apiKey.startsWith('gsk_') || process.env.GROQ_API_KEY) {
        model = new ChatGroq({
          apiKey: process.env.GROQ_API_KEY || apiKey,
          model: targetModel,
          temperature: 0.2
        });
      } else {
        model = new ChatOpenAI({
          apiKey: apiKey,
          model: targetModel,
          temperature: 0.2
        });
      }

      const promptTemplate = PromptTemplate.fromTemplate(`
You are AuraGen UI Healing Engine, an expert system specializing in Generative UI and Cognitive Load reduction.
A user filling out a financial loan form is experiencing high cognitive friction (Cognitive Load Score: {score}%).
The user is specifically struggling with field: "{field}" inside section: "{section}".

Current known form values (Contextual Awareness):
{formState}

COMPONENT SYSTEM SPECIFICATION:
{componentDocs}

STRICT SECTION ISOLATION RULES:
- You MUST ONLY generate fields and steps strictly relevant to the requested section: "{section}".
- If "{section}" is "studentInfo":
  * Generate ONLY applicant personal contact details: Full Name, Date of Birth, Email Address, Phone Number.
- If "{section}" is "academicInfo":
  * Generate ONLY university/college enrollment, degree/course name, specialization, CGPA (0-10), and year of study.
- If "{section}" is "loanInfo":
  * Generate ONLY loan amount requested and tuition/expense breakdown description.
- If "{section}" is "studyLocation":
  * Generate ONLY study location choices (India vs. Abroad), target country, city, university, course duration, and study level.
- If "{section}" is "existingLoansAndCredit":
  * Generate ONLY existing loans status (Yes/No), loan category, monthly EMI, outstanding balance, remaining months, and credit bureau score.
- If "{section}" is "coApplicantInfo":
  * Generate ONLY co-applicant relationship, occupation, and annual income.
- If "{section}" is "documents":
  * Generate ONLY admission offer letter, income proof, and academic certificate upload steps.
- The output "targetSection" in your JSON MUST be set exactly to "{section}".
- DO NOT INCLUDE ANY QUESTIONS BELONGING TO OTHER SECTIONS!

CONTEXTUAL AWARENESS & PRESERVATION RULES:
- For each field you generate, set its "defaultValue" from formState[fieldName] if it exists in the known form values.
- Do NOT reset, wipe, or clear existing typed values.
- Deconstruct intimidating questions into small, sequential steps (2-3 steps max).
- Use radio buttons for yes/no branch decisions with "dependsOn" conditionals for detailed fields.
- Include helpful placeholder values and concise helperText.
- Include an "aiReasoning" string explaining why this UI layout relieves cognitive load for a friction score of {score}% on field "{field}".

JSON OUTPUT SCHEMA FORMAT:
{{
  "version": "1.0",
  "layout": "step-by-step",
  "targetSection": "{section}",
  "title": "AuraGen Assistant: ...",
  "subtitle": "...",
  "aiReasoning": "...",
  "steps": [
    {{
      "id": "step-1",
      "title": "Step Title",
      "description": "Short explanation",
      "fields": [
        {{
          "id": "field-1",
          "name": "fieldName",
          "label": "Field Label",
          "type": "radio | text | number | select | textarea",
          "required": true,
          "defaultValue": "...",
          "placeholder": "...",
          "helperText": "...",
          "options": [ {{ "label": "...", "value": "..." }} ],
          "dependsOn": {{ "field": "otherField", "value": "val" }}
        }}
      ]
    }}
  ],
  "actions": {{
    "submitLabel": "Apply & Continue",
    "cancelLabel": "Switch to Standard View"
  }}
}}

Return ONLY the raw JSON object, without markdown formatting or code blocks.
`);

      const formattedPrompt = await promptTemplate.format({
        score: score.toString(),
        section,
        field: field || 'general',
        formState: JSON.stringify(formState, null, 2),
        componentDocs: COMPONENT_LIBRARY_DOCS
      });

      const response = await model.invoke(formattedPrompt);
      const rawText = typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
      
      // Clean code block wrappers and extract JSON
      const cleanedText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON returned by Groq model: ' + rawText.substring(0, 100));
      }

      const parsedSpec = JSON.parse(jsonMatch[0]);

      // Enforce correct targetSection & metadata
      parsedSpec.targetSection = section;
      parsedSpec.isLiveAi = true;
      parsedSpec.generatedBy = targetModel;
      parsedSpec.generatedAt = new Date().toLocaleTimeString();

      // Ensure defaultValue preservation
      const contextualSpec = injectContextualDefaults(parsedSpec, formState);

      // 1. Validate against Zod schema
      const zodValidation = validateUiSpec(contextualSpec);
      if (!zodValidation.success) {
        console.warn('⚠️ [Backend AI Generator] Schema validation failed:', zodValidation.error.issues);
        throw new Error('Zod Schema validation error');
      }

      // 2. Validate section field isolation guardrails
      const sectionIsolation = validateSectionFields(contextualSpec, section);
      if (!sectionIsolation.valid) {
        console.warn('⚠️ [Backend AI Generator] Section isolation violated:', sectionIsolation.reason);
        throw new Error(sectionIsolation.reason);
      }

      console.log(`✅ [Backend AI Generator] Successfully generated & validated live AI spec for: "${section}"`);
      
      // Store in memory cache
      uiCache.set(key, contextualSpec);

      const resultObj = { spec: contextualSpec, cached: false };
      Object.assign(resultObj, contextualSpec);
      return resultObj;

    } catch (llmError) {
      console.warn(`⚠️ [Backend AI Generator] LLM generation failed or violated constraints (${llmError.message}). Using verified fallback spec.`);
    }
  }

  // Graceful Fallback
  const fallbackSpec = getStaticFallbackSpec(section, formState);
  const resultObj = { spec: fallbackSpec, cached: false, isFallback: true };
  Object.assign(resultObj, fallbackSpec);
  return resultObj;
}

export const generateUISpec = generateAdaptiveUiSpec;
