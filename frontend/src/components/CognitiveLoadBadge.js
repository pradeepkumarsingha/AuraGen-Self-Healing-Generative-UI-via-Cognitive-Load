// frontend/components/CognitiveLoadBadge.js
'use client';

export default function CognitiveLoadBadge({ score, level, onReset, onSimulateHesitation, onSimulateError }) {
  const TOTAL_BLOCKS = 20;
  const filledBlocks = Math.round((score / 100) * TOTAL_BLOCKS);

  // Determine styling based on cognitive load level
  const getLevelStyle = () => {
    switch (level) {
      case 'Critical':
        return {
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]',
          blockActive: 'bg-rose-500 shadow-[0_0_8px_#f43f5e]',
          text: 'text-rose-400',
          pulse: 'animate-pulse'
        };
      case 'High':
        return {
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
          blockActive: 'bg-amber-500 shadow-[0_0_8px_#f59e0b]',
          text: 'text-amber-400',
          pulse: ''
        };
      case 'Moderate':
        return {
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          blockActive: 'bg-blue-500',
          text: 'text-blue-400',
          pulse: ''
        };
      case 'Normal':
      default:
        return {
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          blockActive: 'bg-emerald-500',
          text: 'text-emerald-400',
          pulse: ''
        };
    }
  };

  const style = getLevelStyle();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300">
            <span className="text-sm">🧠</span>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-200 tracking-wider uppercase">
              Cognitive Load Telemetry
            </h3>
            <p className="text-[11px] text-slate-400">
              Live user friction & hesitation index
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${style.badge} ${style.pulse} transition-all duration-300`}>
            {level}
          </span>
          <span className={`text-xl font-mono font-bold ${style.text}`}>
            {score}%
          </span>
        </div>
      </div>

      {/* 20 Segment Visual Bar */}
      <div className="space-y-1.5">
        <div
          className="grid gap-1 h-3 bg-slate-950 p-1 rounded-lg border border-slate-800"
          style={{ gridTemplateColumns: 'repeat(20, minmax(0, 1fr))' }}
        >
          {Array.from({ length: TOTAL_BLOCKS }).map((_, index) => {
            const isFilled = index < filledBlocks;
            return (
              <div
                key={index}
                className={`h-full rounded-xs transition-all duration-300 ${
                  isFilled ? style.blockActive : 'bg-slate-800/50'
                }`}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>0% Normal</span>
          <span>40% Moderate</span>
          <span>70% High</span>
          <span>100% Critical</span>
        </div>
      </div>

      {/* Quick Test / Interactive Simulation Controls */}
      <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-[11px] text-slate-400">Simulate interactions:</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSimulateHesitation}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 transition cursor-pointer"
          >
            + Hesitation
          </button>
          <button
            type="button"
            onClick={onSimulateError}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 transition cursor-pointer"
          >
            + Error
          </button>
          <button
            type="button"
            onClick={onReset}
            className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-rose-950/40 hover:text-rose-300 text-slate-400 text-[11px] font-medium border border-slate-700/60 transition cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
