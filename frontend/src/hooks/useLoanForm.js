// frontend/hooks/useLoanForm.js
import { useState } from 'react';

export function useLoanForm() {
  const [formData, setFormData] = useState({
    // Student
    fullName: '',
    dob: '',
    email: '',
    phone: '',

    // Academic
    college: '',
    course: '',
    specialization: '',
    cgpa: '',
    yearOfStudy: '',

    // Loan
    loanAmount: '',
    studyLocation: '',
    courseDuration: '',
    purpose: '',

    // Existing loans & credit
    hasExistingLoan: '', // 'Yes' | 'No'
    existingLoanType: '', // 'Education' | 'Personal' | 'Vehicle' | 'Home' | 'Other'
    existingLoanAmount: '',
    existingLoanEmi: '',
    existingLoanRemaining: '',
    creditScore: '',
    creditScoreSource: 'Mock CIBIL-like bureau',
    creditVerificationStatus: '', // 'VERIFIED' | 'LOW_SCORE' | 'NO_HISTORY'
    creditRemarks: '',

    // Co-applicant
    coApplicantRelation: '',
    coApplicantOccupation: '',
    annualIncome: '',

    // Documents (mock)
    admissionLetter: null,
    incomeProof: null,
    academicCertificate: null
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const setField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return { formData, updateField, setField, setFormData };
}