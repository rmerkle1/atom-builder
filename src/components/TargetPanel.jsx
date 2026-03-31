import { CHALLENGES } from '../data/challenges.js';

const CATEGORY_COLORS = {
  Element: 'text-emerald-400 bg-emerald-950/50 border-emerald-800',
  Isotope: 'text-amber-400 bg-amber-950/50 border-amber-800',
  Ion:     'text-purple-400 bg-purple-950/50 border-purple-800',
};

export default function TargetPanel({ challenge, onSelectChallenge }) {
  return (
    <div className="flex items-center gap-4 px-6 py-3 bg-slate-800/80 border-b border-slate-700/60
                    shrink-0">
      {/* Target label */}
      <div className="flex flex-col gap-0.5">
        <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Target</span>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${CATEGORY_COLORS[challenge.category] || 'text-slate-400'}`}>
            {challenge.category}
          </span>
          <span className="text-white font-bold text-base">{challenge.displayName}</span>
        </div>
        <span className="text-slate-400 text-xs italic">{challenge.hint}</span>
      </div>

      {/* Target details */}
      <div className="flex gap-4 text-xs ml-4 text-slate-400">
        <span><span className="text-red-400 font-semibold">P:</span> {challenge.protons}</span>
        <span><span className="text-slate-300 font-semibold">N:</span> {challenge.neutrons}</span>
        <span><span className="text-blue-400 font-semibold">e⁻:</span> {challenge.electrons}</span>
      </div>

      {/* Challenge selector */}
      <div className="ml-auto flex items-center gap-2">
        <label className="text-slate-500 text-xs">Challenge:</label>
        <select
          className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200
                     focus:outline-none focus:border-blue-500"
          value={challenge.id}
          onChange={e => onSelectChallenge(e.target.value)}
        >
          {CHALLENGES.map(c => (
            <option key={c.id} value={c.id}>{c.displayName}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
