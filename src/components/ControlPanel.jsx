const MAX_PROTONS = 36;
const MAX_NEUTRONS = 50;

function ParticleSlider({ label, value, max, color, onChange }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>
        {label}
      </span>
      <button
        className="w-7 h-7 rounded-full text-base font-bold flex items-center justify-center
                   bg-slate-700 hover:bg-slate-600 transition-colors select-none"
        onClick={() => onChange(Math.min(max, value + 1))}
      >+</button>
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
          width: 28,
          height: 140,
          accentColor: color,
        }}
      />
      <button
        className="w-7 h-7 rounded-full text-base font-bold flex items-center justify-center
                   bg-slate-700 hover:bg-slate-600 transition-colors select-none"
        onClick={() => onChange(Math.max(0, value - 1))}
      >−</button>
      <div className="text-xl font-bold tabular-nums" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

export default function ControlPanel({ protons, neutrons, onProtonsChange, onNeutronsChange, onShowEnergyDiagram }) {
  return (
    <div data-tutorial-id="control-panel" className="flex flex-col items-center justify-center gap-5 h-full px-3 py-6
                    bg-slate-900 border-r border-slate-700/60 w-[170px] shrink-0">
      <div className="text-slate-400 text-xs text-center font-semibold uppercase tracking-wider">
        Nucleus
      </div>

      {/* Side-by-side sliders */}
      <div className="flex flex-row gap-4 items-start">
        <ParticleSlider
          label="P"
          value={protons}
          max={MAX_PROTONS}
          color="#e9177a"
          onChange={onProtonsChange}
        />
        <ParticleSlider
          label="N"
          value={neutrons}
          max={MAX_NEUTRONS}
          color="#4f5b6f"
          onChange={onNeutronsChange}
        />
      </div>

      {/* Energy diagram button */}
      <button
        onClick={onShowEnergyDiagram}
        className="w-full py-2 rounded-xl bg-slate-700 hover:bg-slate-600
                   text-slate-300 font-semibold text-sm transition-colors"
      >
        Energy Diagram
      </button>
    </div>
  );
}
