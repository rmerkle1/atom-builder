import { useState, useCallback, useEffect } from 'react';
import AtomCanvas from './components/AtomCanvas.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import InfoPanel from './components/InfoPanel.jsx';
import TargetPanel from './components/TargetPanel.jsx';
import ResultModal from './components/ResultModal.jsx';
import EnergyDiagram from './components/EnergyDiagram.jsx';
import Tutorial from './components/Tutorial.jsx';
import { CHALLENGES, getRandomChallenge } from './data/challenges.js';
import { validateAtom } from './utils/atomUtils.js';
import { ALL_SLOTS } from './data/shellConfig.js';

const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Atom Builder!',
    body: "Let's build Helium-4 step by step — a simple, complete atom. We've reset the workspace and selected the challenge for you.",
    target: null,
    position: 'center',
    waitFor: null,
    buttonLabel: "Let's go!",
  },
  {
    id: 'nucleus',
    title: 'Set the Nucleus',
    body: 'Use the P (proton) and N (neutron) sliders to build the nucleus. Helium-4 needs 2 protons and 2 neutrons for an atomic mass of 4.',
    target: 'control-panel',
    position: 'right',
    waitFor: (s) => s.protons === 2 && s.neutrons === 2,
  },
  {
    id: 'dashboard',
    title: 'The Dashboard',
    body: "The bottom panel tracks your atom in real time. Notice the charge is +2 — very positive! With 2 protons but zero electrons, the nucleus is completely unbalanced.",
    target: 'info-panel',
    position: 'top',
    waitFor: null,
  },
  {
    id: 'electrons',
    title: 'Add Electrons',
    body: "Now fill the 1s orbital with electrons to neutralize the atom. Click individual slots one at a time, or double-click anywhere on the orbital ring to fill it all at once.",
    target: 'atom-canvas',
    position: 'left-side',
    waitFor: (s) => s.filledSlots.size >= 2,
  },
  {
    id: 'electron-config',
    title: 'Electron Configuration',
    body: "The bottom right updates live. It now reads 1s² — two electrons in the first orbital. The charge is neutral and Helium's shell is perfectly complete!",
    target: 'electron-config',
    position: 'top',
    waitFor: null,
  },
  {
    id: 'submit',
    title: 'Submit Your Atom',
    body: "You've built a complete Helium-4 atom! Click the green Submit button to verify your work. You can replay this tutorial any time with the ? button in the top right.",
    target: 'submit-button',
    position: 'left',
    waitFor: null,
  },
];

export default function App() {
  const [challenge, setChallenge] = useState(() => CHALLENGES[0]);
  const [protons, setProtons] = useState(0);
  const [neutrons, setNeutrons] = useState(0);
  const [filledSlots, setFilledSlots] = useState(() => new Set());
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);
  const [showEnergyDiagram, setShowEnergyDiagram] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(null);

  const startTutorial = useCallback(() => {
    const heChallenge = CHALLENGES.find(c => c.id === 'He-4');
    setChallenge(heChallenge);
    setProtons(0);
    setNeutrons(0);
    setFilledSlots(new Set());
    setResult(null);
    setErrors([]);
    setShowEnergyDiagram(false);
    setTutorialStep(0);
  }, []);

  // Auto-start tutorial on first visit
  useEffect(() => {
    if (!localStorage.getItem('atombuilder-tutorial-seen')) {
      localStorage.setItem('atombuilder-tutorial-seen', '1');
      startTutorial();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTutorialNext = useCallback(() => {
    if (tutorialStep !== null && tutorialStep < TUTORIAL_STEPS.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setTutorialStep(null);
      const h1 = CHALLENGES.find(c => c.id === 'H-1');
      setChallenge(h1);
      setProtons(0);
      setNeutrons(0);
      setFilledSlots(new Set());
      setResult(null);
      setErrors([]);
    }
  }, [tutorialStep]);

  const handleTutorialClose = useCallback(() => {
    setTutorialStep(null);
  }, []);

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
    setTutorialStep(null);
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
      <TargetPanel challenge={challenge} onSelectChallenge={handleSelectChallenge} onStartTutorial={startTutorial} />

      <div className="flex flex-1 overflow-hidden">
        <ControlPanel
          protons={protons}
          neutrons={neutrons}
          onProtonsChange={setProtons}
          onNeutronsChange={setNeutrons}
          onShowEnergyDiagram={() => setShowEnergyDiagram(true)}
        />

        <div data-tutorial-id="atom-canvas" className="flex-1 flex items-center justify-center bg-slate-950 overflow-hidden p-2">
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
            data-tutorial-id="submit-button"
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

      {tutorialStep !== null && (
        <Tutorial
          steps={TUTORIAL_STEPS}
          currentStep={tutorialStep}
          state={{ protons, neutrons, filledSlots }}
          onNext={handleTutorialNext}
          onClose={handleTutorialClose}
        />
      )}
    </div>
  );
}
