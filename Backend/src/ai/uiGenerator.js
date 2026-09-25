// backend/src/ai/uiGenerator.js
import { validateUiSpec } from '../validation/uiSpecSchema.js';

/**
 * Generates an adaptive, simplified step-by-step UI spec based on the user's friction metrics.
 * @param {Object} context - { score, section, formState }
 * @returns {Object} Validated UI Specification
 */
export async function generateAdaptiveUiSpec({ score, section = 'existingLoansAndCredit', formState = {} }) {
  console.log(`🤖 [AuraGen AI Generator] Generating UI healing spec for section: ${section} (Friction Score: ${score}%)`);

  // Default fallback generative UI spec designed specifically for simplifying complex financial & existing loan calculations
  const spec = {
    version: '1.0',
    layout: 'step-by-step',
    targetSection: section,
    title: 'AuraGen Smart Assistant: Existing Loans & Credit',
    subtitle: 'We simplified this step to help you breeze through liability details effortlessly.',
    aiReasoning: `Detected elevated cognitive friction (${score}%). Splitting complex financial liabilities and credit checks into bite-sized guided questions with auto-calculations.`,
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
  };

  // Validate the generated UI Spec against Zod schema
  const validationResult = validateUiSpec(spec);
  if (!validationResult.success) {
    console.error('❌ [AuraGen AI Generator] UI Spec validation failed:', validationResult.error);
    throw new Error('Generated UI Spec is invalid');
  }

  console.log('✅ [AuraGen AI Generator] Valid UI Spec created successfully.');
  return validationResult.data;
}
