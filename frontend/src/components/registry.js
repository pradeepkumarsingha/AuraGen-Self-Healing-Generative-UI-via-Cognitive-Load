// frontend/components/registry.js
'use client';

export const TextInput = ({ id, name, label, value, onChange, placeholder, required, helperText }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
      {label} {required && <span className="text-rose-400">*</span>}
    </label>
    <input
      id={id}
      type="text"
      required={required}
      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
      value={value || ''}
      onChange={(e) => onChange(name, e.target.value)}
      placeholder={placeholder}
    />
    {helperText && <p className="text-[11px] text-slate-400">{helperText}</p>}
  </div>
);

export const NumberInput = ({ id, name, label, value, onChange, placeholder, min, max, step, required, helperText }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
      {label} {required && <span className="text-rose-400">*</span>}
    </label>
    <input
      id={id}
      type="number"
      min={min}
      max={max}
      step={step}
      required={required}
      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
      value={value || ''}
      onChange={(e) => onChange(name, e.target.value)}
      placeholder={placeholder}
    />
    {helperText && <p className="text-[11px] text-slate-400">{helperText}</p>}
  </div>
);

export const SelectInput = ({ id, name, label, value, onChange, options = [], required, helperText }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
      {label} {required && <span className="text-rose-400">*</span>}
    </label>
    <select
      id={id}
      required={required}
      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
      value={value || ''}
      onChange={(e) => onChange(name, e.target.value)}
    >
      <option value="">Select option...</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {helperText && <p className="text-[11px] text-slate-400">{helperText}</p>}
  </div>
);

export const RadioGroup = ({ id, name, label, value, onChange, options = [], required, helperText }) => (
  <div className="space-y-2">
    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
      {label} {required && <span className="text-rose-400">*</span>}
    </label>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((opt, idx) => {
        const isSelected = value === opt.value;
        return (
          <label
            key={idx}
            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
              isSelected
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={isSelected}
              onChange={() => onChange(name, opt.value)}
              className="w-4 h-4 text-indigo-500 bg-slate-900 border-slate-700 focus:ring-indigo-500"
            />
            <span className="text-xs font-medium">{opt.label}</span>
          </label>
        );
      })}
    </div>
    {helperText && <p className="text-[11px] text-slate-400">{helperText}</p>}
  </div>
);

export const TextareaInput = ({ id, name, label, value, onChange, placeholder, required, helperText }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
      {label} {required && <span className="text-rose-400">*</span>}
    </label>
    <textarea
      id={id}
      rows={3}
      required={required}
      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
      value={value || ''}
      onChange={(e) => onChange(name, e.target.value)}
      placeholder={placeholder}
    />
    {helperText && <p className="text-[11px] text-slate-400">{helperText}</p>}
  </div>
);

export const ComponentRegistry = {
  text: TextInput,
  number: NumberInput,
  email: TextInput,
  tel: TextInput,
  date: TextInput,
  select: SelectInput,
  radio: RadioGroup,
  textarea: TextareaInput
};
