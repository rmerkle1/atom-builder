import { useState, useCallback } from 'react';
import AtomCanvas from './components/AtomCanvas.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import InfoPanel from './components/InfoPanel.jsx';
import TargetPanel from './components/TargetPanel.jsx';
import ResultModal from './components/ResultModal.jsx';
import { CHALLENGES, getRandomChallenge } from './data/challenges.js';
import { validateAtom } from './utils/atomUtils.js';

function getInitialChallenge() {
  return CHALLENGES[0];
}

export default function App() {
  const [challenge, setChallenge] = useState(getInitialChallenge);
  const [protons, setProtons] = useState(0);
  const [neutrons, setNeutrons] = useState(0);
  const [filledSlots, setFilledSlots] = useState(() => new Set());
  const [result, setResult] = useState(null);   // null | 'correct' | 'incorrect'
  const [errors, setErrors] = useState([]);

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
    if (c) {
      setChallenge(c);
      handleReset();
    }
  }

  function handleNextChallenge() {
    const next = getRandomChallenge(challenge.id);
    setChallenge(next);
    handleReset();
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950">
      {/* Top: target panel */}
      <TargetPanel challenge={challenge} onSelectChallenge={handleSelectChallenge} />

      {/* Middle: control + canvas + action buttons */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: nucleus sliders */}
        <ControlPanel
          protons={protons}
          neutrons={neutrons}
          onProtonsChange={setProtons}
          onNeutronsChange={setNeutrons}
        />

        {/* Center: atom canvas */}
        <div className="flex-1 flex items-center justify-center bg-slate-950 overflow-hidden p-2">
          <AtomCanvas
            protons={protons}
            neutrons={neutrons}
            filledSlots={filledSlots}
            onToggleSlot={handleToggleSlot}
          />
        </div>

        {/* Right: action buttons */}
        <div className="flex flex-col items-center justify-center gap-4 px-4 py-6
                        bg-slate-900 border-l border-slate-700/60 w-[110px] shrink-0">
          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500
                       text-white font-bold text-sm transition-colors shadow-lg
                       shadow-blue-900/50"
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
            Click slots to add / remove electrons
          </div>
          <div className="mt-2 text-center text-slate-600 text-xs leading-relaxed">
            Drag to fill multiple
          </div>
        </div>
      </div>

      {/* Bottom: info panel */}
      <InfoPanel protons={protons} neutrons={neutrons} filledSlots={filledSlots} />

      {/* Result modal */}
      {result && (
        <ResultModal
          result={result}
          errors={errors}
          onDismiss={() => setResult(null)}
          onNextChallenge={handleNextChallenge}
        />
      )}
    </div>
  );
}
