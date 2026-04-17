import { CHALLENGES } from '../data/challenges.js';

const CATEGORY_STYLES = {
  Element: { text: '#85c441', bg: 'rgba(133,196,65,0.1)',  border: 'rgba(133,196,65,0.4)' },
  Isotope: { text: '#fdb714', bg: 'rgba(253,183,20,0.1)',  border: 'rgba(253,183,20,0.4)' },
  Ion:     { text: '#748ac5', bg: 'rgba(116,138,197,0.1)', border: 'rgba(116,138,197,0.4)' },
};

export default function TargetPanel({ challenge, onSelectChallenge, onStartTutorial }) {
  const style = CATEGORY_STYLES[challenge.category] || CATEGORY_STYLES.Element;

  return (
    <div className="flex items-center px-6 py-3 bg-slate-800/80 border-b border-slate-700/60 shrink-0 gap-4">
      {/* Left: challenge selector */}
      <div className="flex items-center gap-2 shrink-0">
        <label className="text-slate-500 text-xs">Challenge:</label>
        <select
          className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200
                     focus:outline-none focus:border-slate-400"
          value={challenge.id}
          onChange={e => onSelectChallenge(e.target.value)}
        >
          {CHALLENGES.map(c => (
            <option key={c.id} value={c.id}>{c.displayName}</option>
          ))}
        </select>
      </div>

      {/* Center: big target name */}
      <div className="flex-1 flex flex-col items-center gap-1">
        <span className="text-slate-500 text-xs uppercase tracking-widest font-semibold">Build This Atom</span>
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{ color: style.text, background: style.bg, border: `1px solid ${style.border}` }}
          >
            {challenge.category}
          </span>
          <span className="text-white font-bold text-2xl">{challenge.displayName}</span>
        </div>
      </div>

      {/* Right: hint + tutorial button */}
      <div className="shrink-0 flex items-center gap-3">
        <span className="text-slate-500 text-xs italic max-w-[220px] text-right">{challenge.hint}</span>
        <button
          onClick={onStartTutorial}
          title="Start tutorial"
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                     bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors shrink-0"
        >
          ?
        </button>
      </div>
    </div>
  );
}
