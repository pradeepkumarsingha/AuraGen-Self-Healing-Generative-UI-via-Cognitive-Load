// backend/src/ai/uiGenerator.js
import dotenv from 'dotenv';
dotenv.config();
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { validateUiSpec } from '../validation/uiSpecSchema.js';


// Component library knowledge provided to the LLM
const COMPONENT_LIBRARY_DOCS = `
Available UI Components in AuraGen Design System:
- "text": Single-line string input. Supports label, placeholder, helperText, required.
- "number": Numeric input. Supports min, max, step, placeholder, helperText, required.
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

const FALLBACK_SPECS = {
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
  }
};

/**
 * Generates an adaptive, simplified step-by-step UI spec based on the user's friction metrics using LangChain & Gemini.
 * @param {Object} context - { score, section, formState }
 * @returns {Object} Validated UI Specification
 */
export async function generateAdaptiveUiSpec({ score, section = 'existingLoansAndCredit', formState = {} }) {
  console.log(`🤖 [AuraGen AI Generator] Generating adaptive UI spec for section: ${section} (Cognitive Friction: ${score}%)`);

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (apiKey) {
    try {
      console.log('⚡ [AuraGen LangChain Pipeline] Invoking Gemini LLM with UI Component Library Schema...');
      
      const model = new ChatGoogleGenerativeAI({
        model: 'gemini-1.5-flash',
        apiKey,
        temperature: 0.2
      });

      const promptTemplate = PromptTemplate.fromTemplate(`
You are AuraGen UI Healing Engine, an expert system specializing in Generative UI and Cognitive Load reduction.
A user filling out a financial loan form is experiencing high cognitive friction (Cognitive Load Score: {score}%).
The user is stuck or struggling on section: "{section}".

Current known form values:
{formState}

COMPONENT SYSTEM SPECIFICATION:
{componentDocs}

YOUR TASK:
Generate a simplified, multi-step "step-by-step" UI specification (JSON only) to guide the user seamlessly through the "{section}" section.
- Deconstruct intimidating questions into small, sequential steps (2-3 steps max).
- Use radio buttons for yes/no branch decisions with "dependsOn" conditionals for detailed fields.
- Include helpful placeholder values and concise helperText.
- Include an "aiReasoning" string explaining why this UI layout relieves cognitive load for a friction score of {score}%.
- Output MUST be valid JSON adhering to this exact schema structure:
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
        formState: JSON.stringify(formState, null, 2),
        componentDocs: COMPONENT_LIBRARY_DOCS
      });

      const response = await model.invoke(formattedPrompt);
      const rawText = typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
      
      // Sanitize potential markdown fence if present
      const cleanedJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsedSpec = JSON.parse(cleanedJson);

      // Validate against Zod schema
      const validationResult = validateUiSpec(parsedSpec);
      if (validationResult.success) {
        console.log('✅ [AuraGen LangChain Pipeline] Successfully generated and validated LLM UI Spec!');
        return validationResult.data;
      } else {
        console.warn('⚠️ [AuraGen LangChain Pipeline] LLM generated spec did not pass Zod schema. Falling back to static template:', validationResult.error);
      }
    } catch (llmError) {
      console.error('⚠️ [AuraGen LangChain Pipeline] LLM generation error, falling back to verified spec:', llmError.message);
    }
  } else {
    console.log('ℹ️ [AuraGen AI Generator] No GEMINI_API_KEY found in environment. Using verified template.');
  }

  // Fallback to verified static spec
  const fallback = FALLBACK_SPECS[section] || FALLBACK_SPECS.existingLoansAndCredit;
  const validationResult = validateUiSpec(fallback);
  if (!validationResult.success) {
    throw new Error('Default fallback UI Spec validation failed: ' + JSON.stringify(validationResult.error));
  }
  return validationResult.data;
}

