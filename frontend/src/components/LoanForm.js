// frontend/components/LoanForm.js
'use client';

export default function LoanForm({ formData, updateField, onSubmit, onRecordFocus, onRecordChange }) {
  const handleInputChange = (field) => (e) => {
    updateField(field, e.target.value);
    onRecordChange?.(field, e.target.value);
  };

  const handleRadioChange = (field) => (e) => {
    const value = e.target.value;
    updateField(field, value);
    onRecordChange?.(field, value);

    if (field === 'hasExistingLoan' && value === 'No') {
      // Clear existing loan fields when "No" is selected
      updateField('existingLoanType', '');
      updateField('existingLoanAmount', '');
      updateField('existingLoanEmi', '');
      updateField('existingLoanRemaining', '');
    }
  };

  const handleFileChange = (field) => (e) => {
    const file = e.target.files[0] || null;
    updateField(field, file ? file.name : null);
    onRecordChange?.(field, file ? file.name : null);
  };

  const handleFocus = (field) => () => {
    onRecordFocus?.(field);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section 1: Student Information */}
      <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm transition-all duration-200 hover:border-slate-700">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Student Information</h2>
            <p className="text-xs text-slate-400">Primary applicant personal & contact details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              value={formData.fullName || ''}
              onChange={handleInputChange('fullName')}
              onFocus={handleFocus('fullName')}
              placeholder="e.g. Johnathan Doe"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              value={formData.dob || ''}
              onChange={handleInputChange('dob')}
              onFocus={handleFocus('dob')}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              required
              className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              value={formData.email || ''}
              onChange={handleInputChange('email')}
              onFocus={handleFocus('email')}
              placeholder="student@example.edu"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Phone Number <span className="text-rose-400">*</span>
            </label>
            <input
              type="tel"
              required
              className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              value={formData.phone || ''}
              onChange={handleInputChange('phone')}
              onFocus={handleFocus('phone')}
              placeholder="+91 9876543210"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Academic Information */}
      <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm transition-all duration-200 hover:border-slate-700">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Academic Information</h2>
            <p className="text-xs text-slate-400">Institutional and enrollment background</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              College / University <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              value={formData.college || ''}
              onChange={handleInputChange('college')}
              onFocus={handleFocus('college')}
              placeholder="e.g. Indian Institute of Technology"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Degree / Course Name
            </label>
            <input
              type="text"
              className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              value={formData.course || ''}
              onChange={handleInputChange('course')}
              onFocus={handleFocus('course')}
              placeholder="e.g. B.Tech Computer Science"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Specialization
            </label>
            <input
              type="text"
              className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              value={formData.specialization || ''}
              onChange={handleInputChange('specialization')}
              onFocus={handleFocus('specialization')}
              placeholder="e.g. Artificial Intelligence & Data Science"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                CGPA (0 - 10)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                value={formData.cgpa || ''}
                onChange={handleInputChange('cgpa')}
                onFocus={handleFocus('cgpa')}
                placeholder="8.5"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Year of Study
              </label>
              <select
                className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                value={formData.yearOfStudy || ''}
                onChange={handleInputChange('yearOfStudy')}
                onFocus={handleFocus('yearOfStudy')}
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5+">5+ Year</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Loan Information */}
      <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm transition-all duration-200 hover:border-slate-700">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Loan Information</h2>
            <p className="text-xs text-slate-400">Financing details, purpose & tenure</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Loan Amount (₹) <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              value={formData.loanAmount || ''}
              onChange={handleInputChange('loanAmount')}
              onFocus={handleFocus('loanAmount')}
              placeholder="e.g. 1200000"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Study Location
              </label>
              <select
                className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                value={formData.studyLocation || ''}
                onChange={handleInputChange('studyLocation')}
                onFocus={handleFocus('studyLocation')}
              >
                <option value="">Select Location</option>
                <option value="India">India</option>
                <option value="Abroad">Abroad</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Duration (Years)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                value={formData.courseDuration || ''}
                onChange={handleInputChange('courseDuration')}
                onFocus={handleFocus('courseDuration')}
                placeholder="4"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Purpose of Loan
            </label>
            <textarea
              rows={3}
              className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
              value={formData.purpose || ''}
              onChange={handleInputChange('purpose')}
              onFocus={handleFocus('purpose')}
              placeholder="Breakdown of tuition, accommodation, books, lab expenses, etc."
            />
          </div>
        </div>
      </section>

      {/* Section 3.5: Existing Loans & Credit Verification */}
      <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm transition-all duration-200 hover:border-slate-700">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
            3.5
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Existing Loans & Credit Verification</h2>
            <p className="text-xs text-slate-400">Current liability obligations & bureau score overview</p>
          </div>
        </div>

        {/* Existing Loans Toggle */}
        <div className="mb-6 p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Do you have any existing loans? <span className="text-rose-400">*</span>
          </label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-200">
              <input
                type="radio"
                name="hasExistingLoan"
                value="Yes"
                className="w-4 h-4 text-indigo-500 bg-slate-900 border-slate-700 focus:ring-indigo-500"
                checked={formData.hasExistingLoan === 'Yes'}
                onChange={handleRadioChange('hasExistingLoan')}
              />
              <span className="font-medium">Yes</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-200">
              <input
                type="radio"
                name="hasExistingLoan"
                value="No"
                className="w-4 h-4 text-indigo-500 bg-slate-900 border-slate-700 focus:ring-indigo-500"
                checked={formData.hasExistingLoan === 'No'}
                onChange={handleRadioChange('hasExistingLoan')}
              />
              <span className="font-medium">No</span>
            </label>
          </div>

          {/* Conditional existing loan fields */}
          {formData.hasExistingLoan === 'Yes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-800/60 animate-in fade-in slide-in-from-top-2 duration-300">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Loan Type</label>
                <select
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.existingLoanType || ''}
                  onChange={handleInputChange('existingLoanType')}
                  onFocus={handleFocus('existingLoanType')}
                >
                  <option value="">Select Type</option>
                  <option value="Education">Education</option>
                  <option value="Personal">Personal</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Home">Home</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Outstanding Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.existingLoanAmount || ''}
                  onChange={handleInputChange('existingLoanAmount')}
                  onFocus={handleFocus('existingLoanAmount')}
                  placeholder="e.g. 250000"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Monthly EMI (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.existingLoanEmi || ''}
                  onChange={handleInputChange('existingLoanEmi')}
                  onFocus={handleFocus('existingLoanEmi')}
                  placeholder="e.g. 8500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Remaining (Months)</label>
                <input
                  type="number"
                  min="0"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.existingLoanRemaining || ''}
                  onChange={handleInputChange('existingLoanRemaining')}
                  onFocus={handleFocus('existingLoanRemaining')}
                  placeholder="e.g. 24"
                />
              </div>
            </div>
          )}
        </div>

        {/* Credit Verification (Mock) */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Credit Bureau Data</span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono">Mock Bureau</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Credit Score (300 - 900)</label>
              <input
                type="number"
                min="300"
                max="900"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.creditScore || ''}
                onChange={handleInputChange('creditScore')}
                onFocus={handleFocus('creditScore')}
                placeholder="e.g. 780"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Credit Score Source</label>
              <input
                type="text"
                readOnly
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-400 cursor-not-allowed"
                value={formData.creditScoreSource || 'Mock CIBIL-like bureau'}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Verification Status</label>
              <input
                type="text"
                readOnly
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-400 cursor-not-allowed"
                value={formData.creditVerificationStatus || 'Pending verification'}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Credit Remarks</label>
              <input
                type="text"
                readOnly
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-400 cursor-not-allowed"
                value={formData.creditRemarks || 'Auto-generated remarks will populate here'}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Co-applicant Information */}
      <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm transition-all duration-200 hover:border-slate-700">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
            4
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Co-applicant Information</h2>
            <p className="text-xs text-slate-400">Guarantor or parent/guardian financial profile</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Relationship <span className="text-rose-400">*</span>
            </label>
            <select
              className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              value={formData.coApplicantRelation || ''}
              onChange={handleInputChange('coApplicantRelation')}
              onFocus={handleFocus('coApplicantRelation')}
            >
              <option value="">Select Relationship</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Guardian">Guardian</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Occupation
            </label>
            <input
              type="text"
              className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              value={formData.coApplicantOccupation || ''}
              onChange={handleInputChange('coApplicantOccupation')}
              onFocus={handleFocus('coApplicantOccupation')}
              placeholder="e.g. Senior Software Engineer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Annual Income (₹) <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              value={formData.annualIncome || ''}
              onChange={handleInputChange('annualIncome')}
              onFocus={handleFocus('annualIncome')}
              placeholder="e.g. 1500000"
            />
          </div>
        </div>
      </section>

      {/* Section 5: Documents (Mock Uploads) */}
      <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm transition-all duration-200 hover:border-slate-700">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
            5
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Documents (Mock Uploads)</h2>
            <p className="text-xs text-slate-400">PDF / Image proof for verification</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Admission Letter
              </label>
              <p className="text-[11px] text-slate-400 mb-3">University offer letter</p>
            </div>
            <input
              type="file"
              className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
              onChange={handleFileChange('admissionLetter')}
              onFocus={handleFocus('admissionLetter')}
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Income Proof
              </label>
              <p className="text-[11px] text-slate-400 mb-3">Salary slips / ITR returns</p>
            </div>
            <input
              type="file"
              className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
              onChange={handleFileChange('incomeProof')}
              onFocus={handleFocus('incomeProof')}
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Academic Certificate
              </label>
              <p className="text-[11px] text-slate-400 mb-3">10th/12th/Degree marksheets</p>
            </div>
            <input
              type="file"
              className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
              onChange={handleFileChange('academicCertificate')}
              onFocus={handleFocus('academicCertificate')}
            />
          </div>
        </div>
      </section>

      {/* Submission Bar */}
      <div className="pt-4 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          All inputs are securely processed for demo evaluation.
        </p>
        <button
          type="submit"
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all active:scale-[0.98] cursor-pointer"
        >
          Submit Loan Application
        </button>
      </div>
    </form>
  );
}