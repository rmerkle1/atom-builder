import { getAtomDisplayName, getElectronConfig, getNuclearNotation, countElectrons, getCharge, formatCharge } from '../utils/atomUtils.js';

function NuclearNotation({ protons, neutrons, filledSlots }) {
  const n = getNuclearNotation(protons, neutrons, countElectrons(filledSlots));
  if (!n) return <span className="text-slate-500 italic">—</span>;
  const chargeColor = n.charge === 0 ? 'text-slate-400' : n.charge > 0 ? 'text-red-400' : 'text-blue-400';
  return (
    <span className="font-mono text-lg">
      <sup className="text-sm">{n.massNumber}</sup>
      <span className="text-white">{n.symbol}</span>
      {n.chargeStr && <sup className={`text-sm ${chargeColor}`}>{n.chargeStr}</sup>}
    </span>
  );
}

export default function InfoPanel({ protons, neutrons, filledSlots }) {
  const totalElectrons = countElectrons(filledSlots);
  const charge = getCharge(protons, totalElectrons);
  const config = getElectronConfig(filledSlots);
  const atomName = getAtomDisplayName(protons, neutrons, totalElectrons);

  return (
    <div className="flex items-center gap-8 px-6 py-3 bg-slate-900 border-t border-slate-700/60
                    shrink-0 min-h-[80px]">
      {/* Atom name + notation */}
      <div className="flex flex-col gap-0.5 min-w-[200px]">
        <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Current Atom</span>
        <span className="text-white font-semibold text-sm">{atomName}</span>
        <NuclearNotation protons={protons} neutrons={neutrons} filledSlots={filledSlots} />
      </div>

      {/* Separator */}
      <div className="w-px h-10 bg-slate-700" />

      {/* Particle counts */}
      <div className="flex gap-6 text-sm">
        <div className="flex flex-col items-center">
          <span className="text-slate-500 text-xs uppercase tracking-wider">Protons</span>
          <span className="text-red-400 font-bold text-xl tabular-nums">{protons}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-slate-500 text-xs uppercase tracking-wider">Neutrons</span>
          <span className="text-slate-300 font-bold text-xl tabular-nums">{neutrons}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-slate-500 text-xs uppercase tracking-wider">Electrons</span>
          <span className="text-blue-400 font-bold text-xl tabular-nums">{totalElectrons}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-slate-500 text-xs uppercase tracking-wider">Charge</span>
          <span className={`font-bold text-xl tabular-nums ${charge === 0 ? 'text-slate-400' : charge > 0 ? 'text-red-400' : 'text-blue-400'}`}>
            {charge === 0 ? '0' : formatCharge(charge)}
          </span>
        </div>
      </div>

      {/* Separator */}
      <div className="w-px h-10 bg-slate-700" />

      {/* Electron configuration */}
      <div className="flex flex-col gap-0.5 flex-1">
        <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Electron Configuration</span>
        <span className="text-cyan-300 font-mono text-base tracking-wide">{config}</span>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-1 text-xs ml-auto">
        {[
          { label: 's orbital', color: '#60a5fa' },
          { label: 'p orbital', color: '#34d399' },
          { label: 'd orbital', color: '#fb923c' },
          { label: 'f orbital', color: '#c084fc' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            <span className="text-slate-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
