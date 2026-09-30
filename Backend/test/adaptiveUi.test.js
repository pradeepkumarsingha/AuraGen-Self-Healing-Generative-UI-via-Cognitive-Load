// Backend/test/adaptiveUi.test.js
import assert from 'node:assert/strict';
import { 
  generateAdaptiveUiSpec, 
  getStaticFallbackSpec, 
  validateSectionFields,
  FALLBACK_SPECS 
} from '../src/ai/uiGenerator.js';
import { validateUiSpec } from '../src/validation/uiSpecSchema.js';

console.log('🧪 Running AuraGen-AI Adaptive UI Section-Isolation Test Suite...\n');

async function runTests() {
  let passed = 0;
  let total = 0;

  function recordTest(name, fn) {
    total++;
    try {
      fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}`);
      console.error(err);
    }
  }

  async function recordAsyncTest(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}`);
      console.error(err);
    }
  }

  // TEST 1: Input section: "studyLocation"
  await recordAsyncTest('Test 1: Input section "studyLocation" generates study-location fields and NO loan questions', async () => {
    const spec = await generateAdaptiveUiSpec({
      score: 88,
      section: 'studyLocation',
      formState: { studyLocation: 'Abroad' }
    });

    assert.equal(spec.targetSection, 'studyLocation', 'targetSection should be studyLocation');
    
    // Collect all field names across steps
    const allFieldNames = spec.steps.flatMap(step => step.fields.map(f => f.name));
    
    // Check that study location fields exist
    const hasStudyFields = allFieldNames.some(name => 
      ['studyLocation', 'country', 'city', 'university', 'courseDuration', 'studyLevel', 'purpose'].includes(name)
    );
    assert.ok(hasStudyFields, 'Specification must contain study-location related fields');

    // Check that loan questions are NOT present
    const hasLoanQuestions = allFieldNames.some(name => 
      ['hasExistingLoan', 'hasExistingLoans', 'existingLoanType', 'existingLoanAmount', 'monthlyEmi', 'creditScore'].includes(name)
    );
    assert.equal(hasLoanQuestions, false, 'Specification MUST NOT contain loan questions');
  });

  // TEST 2: Input section: "existingLoansAndCredit"
  await recordAsyncTest('Test 2: Input section "existingLoansAndCredit" generates loan question and dependent fields', async () => {
    const spec = await generateAdaptiveUiSpec({
      score: 85,
      section: 'existingLoansAndCredit',
      formState: { hasExistingLoan: 'Yes' }
    });

    assert.equal(spec.targetSection, 'existingLoansAndCredit', 'targetSection should be existingLoansAndCredit');

    const allFieldNames = spec.steps.flatMap(step => step.fields.map(f => f.name));
    const hasLoanFields = allFieldNames.some(name => 
      ['hasExistingLoan', 'hasExistingLoans', 'existingLoanType', 'loanType', 'existingLoanAmount', 'existingLoanEmi', 'creditScore'].includes(name)
    );
    assert.ok(hasLoanFields, 'Specification must contain loan-related fields');

    const hasStudyFields = allFieldNames.some(name => 
      ['studyLocation', 'country', 'city', 'university', 'studyLevel'].includes(name)
    );
    assert.equal(hasStudyFields, false, 'Specification must NOT contain study location fields');
  });

  // TEST 3: Input section "studyLocation" with Groq failure / fallback
  recordTest('Test 3: Study location fallback returns study-location UI and isLiveAi: false', () => {
    const fallbackSpec = getStaticFallbackSpec('studyLocation');

    assert.equal(fallbackSpec.targetSection, 'studyLocation');
    assert.equal(fallbackSpec.isLiveAi, false);

    const allFieldNames = fallbackSpec.steps.flatMap(step => step.fields.map(f => f.name));
    assert.ok(allFieldNames.includes('studyLocation'), 'Fallback must contain studyLocation');
    assert.ok(allFieldNames.includes('country'), 'Fallback must contain country');
    assert.ok(allFieldNames.includes('university'), 'Fallback must contain university');
    assert.ok(!allFieldNames.includes('hasExistingLoan'), 'Fallback must NOT contain hasExistingLoan');
    assert.ok(!allFieldNames.includes('existingLoanAmount'), 'Fallback must NOT contain existingLoanAmount');
  });

  // TEST 4: Input section "studyLocation" with invalid Groq output (contains loan fields or bad schema)
  recordTest('Test 4: Invalid/Bleeding Groq output is rejected and sanitized', () => {
    const corruptedAiSpec = {
      version: '1.0',
      layout: 'step-by-step',
      targetSection: 'studyLocation',
      title: 'Corrupted Output',
      steps: [
        {
          id: 'step-1',
          title: 'Loan Questions on Study Section',
          fields: [
            {
              id: 'field-1',
              name: 'hasExistingLoan', // FORBIDDEN IN studyLocation!
              label: 'Do you have existing loans?',
              type: 'radio'
            }
          ]
        }
      ]
    };

    const validationResult = validateSectionFields(corruptedAiSpec, 'studyLocation');
    assert.equal(validationResult.valid, false, 'Section field validator must reject loan field in studyLocation section');
    assert.ok(validationResult.reason.includes('hasExistingLoan'), 'Rejection reason must mention the forbidden field');
  });

  // TEST 5: Switching from "existingLoansAndCredit" to "studyLocation" preserves separate specifications
  recordTest('Test 5: Section switching returns distinct, non-mutated specifications', () => {
    const loanFallback = getStaticFallbackSpec('existingLoansAndCredit');
    const studyFallback = getStaticFallbackSpec('studyLocation');

    assert.equal(loanFallback.targetSection, 'existingLoansAndCredit');
    assert.equal(studyFallback.targetSection, 'studyLocation');

    const loanFields = loanFallback.steps.flatMap(s => s.fields.map(f => f.name));
    const studyFields = studyFallback.steps.flatMap(s => s.fields.map(f => f.name));

    assert.ok(loanFields.includes('hasExistingLoan'));
    assert.ok(!loanFields.includes('studyLocation'));

    assert.ok(studyFields.includes('studyLocation'));
    assert.ok(!studyFields.includes('hasExistingLoan'));
  });

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} / ${total} passed`);
  console.log(`========================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runTests();
