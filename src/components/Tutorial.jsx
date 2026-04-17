import { useEffect, useState, useCallback } from 'react';

const TOOLTIP_W = 300;
const SPOT_PAD = 14;

function getTooltipStyle(rect, position, ww, wh) {
  const pad = 16;
  const clampLeft = (x) => Math.min(Math.max(x, pad), ww - TOOLTIP_W - pad);

  if (!rect || position === 'center') {
    return { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: TOOLTIP_W };
  }

  const midY = rect.top + rect.height / 2;
  const midX = rect.left + rect.width / 2;

  switch (position) {
    case 'right':
      return { position: 'fixed', left: rect.right + pad, top: midY, transform: 'translateY(-50%)', width: TOOLTIP_W };
    case 'left':
      return { position: 'fixed', right: ww - rect.left + pad, top: midY, transform: 'translateY(-50%)', width: TOOLTIP_W };
    case 'top':
      return { position: 'fixed', bottom: wh - rect.top + pad, left: clampLeft(midX - TOOLTIP_W / 2), width: TOOLTIP_W };
    case 'top-center':
      return { position: 'fixed', top: 72, left: '50%', transform: 'translateX(-50%)', width: TOOLTIP_W };
    case 'left-side':
      return { position: 'fixed', left: 10, top: '50%', transform: 'translateY(-50%)', width: TOOLTIP_W };
    default:
      return { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: TOOLTIP_W };
  }
}

export default function Tutorial({ steps, currentStep, state, onNext, onClose }) {
  const [targetRect, setTargetRect] = useState(null);
  const [winSize, setWinSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  const step = steps[currentStep];

  const updateRect = useCallback(() => {
    setWinSize({ w: window.innerWidth, h: window.innerHeight });
    if (step?.target) {
      const el = document.querySelector(`[data-tutorial-id="${step.target}"]`);
      setTargetRect(el ? el.getBoundingClientRect() : null);
    } else {
      setTargetRect(null);
    }
  }, [step?.target, currentStep]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, [updateRect]);

  // Auto-advance when waitFor condition is met
  useEffect(() => {
    if (step?.waitFor && step.waitFor(state)) {
      const t = setTimeout(onNext, 700);
      return () => clearTimeout(t);
    }
  }, [step, state, onNext]);

  if (!step) return null;

  const { w, h } = winSize;
  const p = SPOT_PAD;
  const sx = targetRect ? targetRect.x - p : 0;
  const sy = targetRect ? targetRect.y - p : 0;
  const sw = targetRect ? targetRect.width + p * 2 : 0;
  const sh = targetRect ? targetRect.height + p * 2 : 0;

  const tooltipStyle = getTooltipStyle(targetRect, step.position, w, h);
  const isWaiting = !!step.waitFor;
  const isLast = currentStep === steps.length - 1;
  const stepLabel = isWaiting ? '● Your turn' : `Step ${currentStep + 1} of ${steps.length}`;

  return (
    <>
      {/* Dimmed overlay with spotlight cutout */}
      <svg
        style={{ position: 'fixed', inset: 0, width: w, height: h, zIndex: 40, pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <defs>
          <mask id="tut-mask">
            <rect x={0} y={0} width={w} height={h} fill="white" />
            {targetRect && (
              <rect x={sx} y={sy} width={sw} height={sh} rx={10} ry={10} fill="black" />
            )}
          </mask>
        </defs>
        <rect
          x={0} y={0} width={w} height={h}
          fill="rgba(0,0,0,0.72)"
          mask={targetRect ? 'url(#tut-mask)' : undefined}
        />
        {/* Highlight ring */}
        {targetRect && (
          <rect
            x={sx} y={sy} width={sw} height={sh} rx={10} ry={10}
            fill="none"
            stroke="#85c441"
            strokeWidth={2}
            strokeDasharray="7 4"
          />
        )}
      </svg>

      {/* Tooltip card */}
      <div
        style={{ ...tooltipStyle, zIndex: 50 }}
        className="bg-slate-800 border border-slate-600/80 rounded-2xl shadow-2xl p-5 select-none"
      >
        <div className="text-xs uppercase tracking-widest font-bold mb-1.5" style={{ color: '#85c441' }}>
          {stepLabel}
        </div>
        <div className="text-white font-bold text-base mb-2 leading-snug">{step.title}</div>
        <div className="text-slate-300 text-sm leading-relaxed mb-5">{step.body}</div>

        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-slate-500 text-xs hover:text-slate-300 transition-colors"
          >
            Skip tutorial
          </button>

          {isWaiting ? (
            <span className="flex items-center gap-2 text-slate-400 text-xs italic">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: '#85c441' }}
              />
              Waiting for you…
            </span>
          ) : (
            <button
              onClick={onNext}
              className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 active:opacity-75"
              style={{ background: '#85c441', boxShadow: '0 2px 12px rgba(133,196,65,0.3)' }}
            >
              {step.buttonLabel || (isLast ? 'Done!' : 'Next →')}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
