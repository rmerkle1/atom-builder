import { ORBITAL_COLORS } from '../data/shellConfig.js';

const NUM_BOXES = { s: 1, p: 3, d: 5, f: 7 };

// Energy level display ordering when 3d is NOT yet occupied (building up):
// 4s sits above 3p but below 3d  →  Aufbau sequence
const AUFBAU_LEVELS = [
  { shell: 1, orbital: 's' },
  { shell: 2, orbital: 's' },
  { shell: 2, orbital: 'p' },
  { shell: 3, orbital: 's' },
  { shell: 3, orbital: 'p' },
  { shell: 4, orbital: 's' },  // 4s lower than 3d while d is empty
  { shell: 3, orbital: 'd' },
  { shell: 4, orbital: 'p' },
];

// Once 3d starts filling the energy ordering flips:
// 3d drops below 4s, explaining why cations lose 4s electrons first
const POST_D_LEVELS = [
  { shell: 1, orbital: 's' },
  { shell: 2, orbital: 's' },
  { shell: 2, orbital: 'p' },
  { shell: 3, orbital: 's' },
  { shell: 3, orbital: 'p' },
  { shell: 3, orbital: 'd' },  // 3d now below 4s
  { shell: 4, orbital: 's' },  // 4s now higher (removed first in cations)
  { shell: 4, orbital: 'p' },
];

function getBoxArrows(count, numBoxes) {
  const boxes = Array(numBoxes).fill(0);
  for (let i = 0; i < Math.min(count, numBoxes); i++) boxes[i]++;
  for (let i = 0; i < count - numBoxes; i++) boxes[i]++;
  return boxes;
}

function OrbitalBox({ electrons, color }) {
  return (
    <div
      className="w-8 h-10 border-2 flex flex-col items-center justify-center gap-0 rounded-sm"
      style={{ borderColor: color }}
    >
      {electrons >= 2 && <span className="text-xs font-bold leading-none" style={{ color }}>↓</span>}
      {electrons >= 1 && <span className="text-xs font-bold leading-none" style={{ color }}>↑</span>}
    </div>
  );
}

function EnergyLevel({ shell, orbital, filledCount }) {
  const { color } = ORBITAL_COLORS[orbital];
  const numBoxes = NUM_BOXES[orbital];
  const boxes = getBoxArrows(filledCount, numBoxes);
  const capacity = numBoxes * 2;
  const isFull = filledCount === capacity;
  const isEmpty = filledCount === 0;

  return (
    <div className="flex items-center gap-3 py-1">
      <div className="w-8 text-right">
        <span className="font-mono text-sm font-bold" style={{ color }}>{shell}{orbital}</span>
      </div>
      <div className="w-1 h-6 rounded-full" style={{ background: color, opacity: 0.3 }} />
      <div className="flex gap-1">
        {boxes.map((e, i) => <OrbitalBox key={i} electrons={e} color={color} />)}
      </div>
      <div className="ml-1 text-xs tabular-nums w-12"
        style={{ color: isEmpty ? '#475569' : isFull ? '#85c441' : color }}>
        {filledCount}/{capacity}{isFull && ' ✓'}
      </div>
    </div>
  );
}

export default function EnergyDiagram({ filledSlots, onClose }) {
  const counts = {};
  for (const id of filledSlots) {
    const [shell, orbital] = id.split('-');
    const key = `${shell}-${orbital}`;
    counts[key] = (counts[key] || 0) + 1;
  }

  // Switch energy ordering once any 3d electron is present
  const has3d = (counts['3-d'] || 0) > 0;
  const levelDefs = has3d ? POST_D_LEVELS : AUFBAU_LEVELS;

  const levels = levelDefs.map(({ shell, orbital }) => ({
    shell, orbital,
    filledCount: counts[`${shell}-${orbital}`] || 0,
  }));

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 w-[420px] max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-white font-bold text-lg">Energy Level Diagram</h2>
            <p className="text-slate-500 text-xs mt-0.5">↑ spin up &nbsp;·&nbsp; ↓ spin down (Hund's rule)</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300
                       flex items-center justify-center text-lg transition-colors">×</button>
        </div>

        {/* Energy ordering note */}
        {has3d && (
          <div className="mt-2 mb-3 px-3 py-2 rounded-lg text-xs"
            style={{ background: 'rgba(253,183,20,0.08)', border: '1px solid rgba(253,183,20,0.3)', color: '#fdb714' }}>
            3d electrons are present — energy ordering has flipped: 3d is now
            lower than 4s. This is why cations lose 4s electrons first.
          </div>
        )}

        <div className="border-t border-slate-700 mb-3 mt-3" />

        {/* Levels displayed bottom-to-top via flex-col-reverse */}
        <div className="flex flex-col-reverse gap-0.5">
          {levels.map(({ shell, orbital, filledCount }) => (
            <EnergyLevel key={`${shell}-${orbital}`}
              shell={shell} orbital={orbital} filledCount={filledCount} />
          ))}
        </div>

        {/* Higher energy arrow */}
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <div className="flex flex-col items-center gap-0.5">
            <span>▲</span><span>▲</span>
          </div>
          <span>higher energy (top of diagram)</span>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-700 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-400">
          {Object.entries(ORBITAL_COLORS).map(([type, { color }]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
              <span>{type} orbital</span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-slate-500 text-xs text-center italic">
          Double-click the arc outline of any orbital group on the atom to fill it instantly
        </p>
      </div>
    </div>
  );
}
