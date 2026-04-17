import { getAtomDisplayName, getElectronConfig, getNuclearNotation, countElectrons, getCharge, formatCharge } from '../utils/atomUtils.js';
import { ORBITAL_COLORS } from '../data/shellConfig.js';

function NuclearNotation({ protons, neutrons, filledSlots }) {
  const n = getNuclearNotation(protons, neutrons, countElectrons(filledSlots));
  if (!n) return <span className="text-slate-600 italic text-xl">—</span>;
  const chargeColor = n.charge === 0 ? '#94a3b8' : n.charge > 0 ? '#e9177a' : '#00addb';
  return (
    <span className="font-mono text-2xl font-bold">
      <sup className="text-base">{n.massNumber}</sup>
      <span className="text-white">{n.symbol}</span>
      {n.chargeStr && <sup className="text-base" style={{ color: chargeColor }}>{n.chargeStr}</sup>}
    </span>
  );
}

export default function InfoPanel({ protons, neutrons, filledSlots }) {
  const totalElectrons = countElectrons(filledSlots);
  const charge = getCharge(protons, totalElectrons);
  const config = getElectronConfig(filledSlots);
  const atomName = getAtomDisplayName(protons, neutrons, totalElectrons);

  return (
    <div data-tutorial-id="info-panel" className="flex items-center gap-6 px-6 py-3 bg-slate-900 border-t border-slate-700/60
                    shrink-0 min-h-[90px]">
      {/* Left: particle counts */}
      <div data-tutorial-id="info-panel-left" className="flex gap-5 text-sm shrink-0">
        <div className="flex flex-col items-center">
          <span className="text-slate-500 text-xs uppercase tracking-wider">Protons</span>
          <span className="font-bold text-xl tabular-nums" style={{ color: '#e9177a' }}>{protons}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-slate-500 text-xs uppercase tracking-wider">Neutrons</span>
          <span className="font-bold text-xl tabular-nums" style={{ color: '#4f5b6f' }}>{neutrons}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-slate-500 text-xs uppercase tracking-wider">Electrons</span>
          <span className="font-bold text-xl tabular-nums" style={{ color: '#17b29e' }}>{totalElectrons}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-slate-500 text-xs uppercase tracking-wider">Charge</span>
          <span className="font-bold text-xl tabular-nums"
            style={{ color: charge === 0 ? '#94a3b8' : charge > 0 ? '#e9177a' : '#00addb' }}>
            {charge === 0 ? '0' : formatCharge(charge)}
          </span>
        </div>
      </div>

      <div className="w-px h-12 bg-slate-700 shrink-0" />

      {/* Center: big atom name */}
      <div className="flex-1 flex flex-col items-center gap-1">
        <span className="text-slate-500 text-xs uppercase tracking-widest font-semibold">Current Atom</span>
        <span className="text-white font-bold text-xl">{atomName}</span>
        <NuclearNotation protons={protons} neutrons={neutrons} filledSlots={filledSlots} />
      </div>

      <div className="w-px h-12 bg-slate-700 shrink-0" />

      {/* Right: electron config + legend */}
      <div data-tutorial-id="electron-config" className="flex flex-col gap-1 shrink-0">
        <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Electron Configuration</span>
        <span className="font-mono text-sm tracking-wide" style={{ color: '#00addb' }}>{config}</span>
        <div className="flex gap-3 mt-1">
          {Object.entries(ORBITAL_COLORS).map(([type, { color }]) => (
            <div key={type} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span className="text-slate-500 text-xs">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
