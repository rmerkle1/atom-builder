import { useState, useCallback } from 'react';
import AtomCanvas from './components/AtomCanvas.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import InfoPanel from './components/InfoPanel.jsx';
import TargetPanel from './components/TargetPanel.jsx';
import ResultModal from './components/ResultModal.jsx';
import EnergyDiagram from './components/EnergyDiagram.jsx';
import { CHALLENGES, getRandomChallenge } from './data/challenges.js';
import { validateAtom } from './utils/atomUtils.js';
import { ALL_SLOTS } from './data/shellConfig.js';

export default function App() {
  const [challenge, setChallenge] = useState(() => CHALLENGES[0]);
  const [protons, setProtons] = useState(0);
  const [neutrons, setNeutrons] = useState(0);
  const [filledSlots, setFilledSlots] = useState(() => new Set());
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);
  const [showEnergyDiagram, setShowEnergyDiagram] = useState(false);

  const handleToggleSlot = useCallback((slotId, mode) => {
    setFilledSlots(prev => {
      const next = new Set(prev);
      if (mode === 'add') next.add(slotId);
      else if (mode === 'remove') next.delete(slotId);
      else {
        if (next.has(slotId)) next.delete(slotId);
        else next.add(slotId);
      }
      return next;
    });
  }, []);

  // Double-click: fill or clear entire orbital set (toggle)
  const handleFillOrbital = useCallback((shell, orbital) => {
    setFilledSlots(prev => {
      const next = new Set(prev);
      const slots = ALL_SLOTS.filter(s => s.shell === shell && s.orbital === orbital);
      const allFilled = slots.every(s => next.has(s.id));
      if (allFilled) {
        slots.forEach(s => next.delete(s.id));
      } else {
        slots.forEach(s => next.add(s.id));
      }
      return next;
    });
  }, []);

  function handleReset() {
    setProtons(0);
    setNeutrons(0);
    setFilledSlots(new Set());
    setResult(null);
    setErrors([]);
  }

  function handleSubmit() {
    const errs = validateAtom(protons, neutrons, filledSlots, challenge);
    if (errs.length === 0) {
      setResult('correct');
      setErrors([]);
    } else {
      setResult('incorrect');
      setErrors(errs);
    }
  }

  function handleSelectChallenge(id) {
    const c = CHALLENGES.find(ch => ch.id === id);
    if (c) { setChallenge(c); handleReset(); }
  }

  function handleNextChallenge() {
    const next = getRandomChallenge(challenge.id);
    setChallenge(next);
    handleReset();
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950">
      <TargetPanel challenge={challenge} onSelectChallenge={handleSelectChallenge} />

      <div className="flex flex-1 overflow-hidden">
        <ControlPanel
          protons={protons}
          neutrons={neutrons}
          onProtonsChange={setProtons}
          onNeutronsChange={setNeutrons}
          onShowEnergyDiagram={() => setShowEnergyDiagram(true)}
        />

        <div className="flex-1 flex items-center justify-center bg-slate-950 overflow-hidden p-2">
          <AtomCanvas
            protons={protons}
            neutrons={neutrons}
            filledSlots={filledSlots}
            onToggleSlot={handleToggleSlot}
            onFillOrbital={handleFillOrbital}
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-4 px-4 py-6
                        bg-slate-900 border-l border-slate-700/60 w-[110px] shrink-0">
          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl font-bold text-sm transition-colors shadow-lg text-white"
            style={{ background: '#85c441', boxShadow: '0 4px 24px rgba(133,196,65,0.25)' }}
          >
            Submit
          </button>
          <button
            onClick={handleReset}
            className="w-full py-2 rounded-xl bg-slate-700 hover:bg-slate-600
                       text-slate-300 font-semibold text-sm transition-colors"
          >
            Reset
          </button>
          <div className="mt-4 text-center text-slate-600 text-xs leading-relaxed">
            Click to add / remove electrons
          </div>
          <div className="mt-1 text-center text-slate-600 text-xs leading-relaxed">
            Double-click to fill orbital
          </div>
        </div>
      </div>

      <InfoPanel protons={protons} neutrons={neutrons} filledSlots={filledSlots} />

      {result && (
        <ResultModal
          result={result}
          errors={errors}
          onDismiss={() => setResult(null)}
          onNextChallenge={handleNextChallenge}
        />
      )}

      {showEnergyDiagram && (
        <EnergyDiagram
          filledSlots={filledSlots}
          onClose={() => setShowEnergyDiagram(false)}
        />
      )}
    </div>
  );
}
