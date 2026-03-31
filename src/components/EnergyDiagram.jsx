import { ORBITAL_COLORS } from '../data/shellConfig.js';
import { AUFBAU_ORDER } from '../utils/atomUtils.js';

// Number of sub-orbital boxes per orbital type
const NUM_BOXES = { s: 1, p: 3, d: 5, f: 7 };

// Hund's rule: distribute count electrons into numBoxes boxes
// Returns array of 0|1|2 per box
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
      {electrons >= 2 && (
        <span className="text-xs font-bold leading-none" style={{ color }}>↓</span>
      )}
      {electrons >= 1 && (
        <span className="text-xs font-bold leading-none" style={{ color }}>↑</span>
      )}
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
      {/* Level label */}
      <div className="w-8 text-right">
        <span className="font-mono text-sm font-bold" style={{ color }}>
          {shell}{orbital}
        </span>
      </div>

      {/* Energy line */}
      <div className="w-1 h-6 rounded-full" style={{ background: color, opacity: 0.3 }} />

      {/* Orbital boxes */}
      <div className="flex gap-1">
        {boxes.map((e, i) => (
          <OrbitalBox key={i} electrons={e} color={color} />
        ))}
      </div>

      {/* Fill status */}
      <div className="ml-1 text-xs tabular-nums w-12" style={{ color: isEmpty ? '#475569' : isFull ? '#85c441' : color }}>
        {filledCount}/{capacity}
        {isFull && <span className="ml-1">✓</span>}
      </div>
    </div>
  );
}

export default function EnergyDiagram({ filledSlots, onClose }) {
  // Count electrons per shell-orbital
  const counts = {};
  for (const id of filledSlots) {
    const [shell, orbital] = id.split('-');
    const key = `${shell}-${orbital}`;
    counts[key] = (counts[key] || 0) + 1;
  }

  // Build levels in Aufbau order (display bottom to top via flex-col-reverse)
  const levels = AUFBAU_ORDER.map(({ shell, orbital }) => ({
    shell,
    orbital,
    filledCount: counts[`${shell}-${orbital}`] || 0,
  }));

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 w-[380px] max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white font-bold text-lg">Energy Level Diagram</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Aufbau order — ↑ spin up, ↓ spin down (Hund's rule)
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300
                       flex items-center justify-center text-lg transition-colors"
          >
            ×
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 mb-4" />

        {/* Levels — higher energy at top, so reverse the list */}
        <div className="flex flex-col-reverse gap-0.5">
          {levels.map(({ shell, orbital, filledCount }) => (
            <EnergyLevel
              key={`${shell}-${orbital}`}
              shell={shell}
              orbital={orbital}
              filledCount={filledCount}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-400">
          {Object.entries(ORBITAL_COLORS).map(([type, { color }]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
              <span>{type} orbital</span>
            </div>
          ))}
        </div>

        {/* Hint */}
        <p className="mt-3 text-slate-500 text-xs text-center italic">
          Double-click any electron slot on the atom to fill that entire orbital set
        </p>
      </div>
    </div>
  );
}
