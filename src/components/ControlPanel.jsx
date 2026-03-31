const MAX_PROTONS = 36;
const MAX_NEUTRONS = 50;

function ParticleSlider({ label, value, max, color, onChange }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>
        {label}
      </span>
      <div className="flex flex-col items-center gap-1">
        <button
          className="w-8 h-8 rounded-full text-lg font-bold flex items-center justify-center
                     bg-slate-700 hover:bg-slate-600 transition-colors select-none"
          onClick={() => onChange(Math.min(max, value + 1))}
        >+</button>
        <div className="relative flex items-center justify-center">
          <input
            type="range"
            min={0}
            max={max}
            value={value}
            onChange={e => onChange(+e.target.value)}
            style={{
              writingMode: 'vertical-lr',
              direction: 'rtl',
              WebkitAppearance: 'slider-vertical',
              appearance: 'slider-vertical',
              width: 32,
              height: 160,
              accentColor: color,
            }}
          />
        </div>
        <button
          className="w-8 h-8 rounded-full text-lg font-bold flex items-center justify-center
                     bg-slate-700 hover:bg-slate-600 transition-colors select-none"
          onClick={() => onChange(Math.max(0, value - 1))}
        >−</button>
      </div>
      <div
        className="text-2xl font-bold tabular-nums"
        style={{ color }}
      >
        {value}
      </div>
    </div>
  );
}

export default function ControlPanel({ protons, neutrons, onProtonsChange, onNeutronsChange }) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 h-full px-4 py-6
                    bg-slate-900 border-r border-slate-700/60 w-[130px] shrink-0">
      <div className="text-slate-400 text-xs text-center font-semibold uppercase tracking-wider">
        Nucleus
      </div>
      <ParticleSlider
        label="Protons"
        value={protons}
        max={MAX_PROTONS}
        color="#f87171"
        onChange={onProtonsChange}
      />
      <ParticleSlider
        label="Neutrons"
        value={neutrons}
        max={MAX_NEUTRONS}
        color="#94a3b8"
        onChange={onNeutronsChange}
      />
    </div>
  );
}
