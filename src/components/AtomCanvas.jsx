import { useEffect, useRef, useState } from 'react';
import { COMPUTED_SHELLS } from '../data/shellConfig.js';

const CX = 350;
const CY = 350;
const SLOT_R = 8;

function NucleusLabel({ protons, neutrons }) {
  const nucleons = protons + neutrons;
  const r = Math.max(28, Math.min(52, 20 + nucleons * 0.8));
  return (
    <>
      <circle
        cx={CX} cy={CY} r={r}
        fill="url(#nucleusGrad)"
        stroke="#f97316"
        strokeWidth="2"
        className="glow-nucleus"
      />
      <text x={CX} y={CY - 7} textAnchor="middle" dominantBaseline="middle"
        fill="#fed7aa" fontSize="11" fontWeight="bold">
        P: {protons}
      </text>
      <text x={CX} y={CY + 8} textAnchor="middle" dominantBaseline="middle"
        fill="#d1d5db" fontSize="11">
        N: {neutrons}
      </text>
    </>
  );
}

export default function AtomCanvas({ protons, neutrons, filledSlots, onToggleSlot }) {
  const [dragMode, setDragMode] = useState(null); // 'add' | 'remove'
  const isDragging = useRef(false);

  useEffect(() => {
    const up = () => { isDragging.current = false; setDragMode(null); };
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    return () => { window.removeEventListener('mouseup', up); window.removeEventListener('touchend', up); };
  }, []);

  function handleSlotDown(slot) {
    const filled = filledSlots.has(slot.id);
    const mode = filled ? 'remove' : 'add';
    isDragging.current = true;
    setDragMode(mode);
    onToggleSlot(slot.id, mode);
  }

  function handleSlotEnter(slot) {
    if (!isDragging.current || !dragMode) return;
    onToggleSlot(slot.id, dragMode);
  }

  return (
    <svg
      viewBox="0 0 700 700"
      style={{ width: '100%', height: '100%', maxHeight: '100%' }}
      onMouseLeave={() => { isDragging.current = false; setDragMode(null); }}
    >
      <defs>
        <radialGradient id="nucleusGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="100%" stopColor="#c2410c" />
        </radialGradient>
        <radialGradient id="electronGrad" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Shell rings */}
      {COMPUTED_SHELLS.map(({ shell, radius }) => (
        <circle key={shell} cx={CX} cy={CY} r={radius}
          fill="none" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="4 3" />
      ))}

      {/* Orbital group arcs + labels */}
      {COMPUTED_SHELLS.map(({ shell, radius, groups }) =>
        groups.map(g => (
          <g key={`${shell}-${g.orbital}`}>
            <path
              d={g.path}
              fill="none"
              stroke={g.arcColor}
              strokeWidth="14"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d={g.path}
              fill="none"
              stroke={g.color}
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.4"
            />
            <text
              x={g.labelX} y={g.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={g.color}
              fontSize="9"
              fontWeight="bold"
              opacity="0.8"
            >
              {shell}{g.orbital}
            </text>
          </g>
        ))
      )}

      {/* Electron slots */}
      {COMPUTED_SHELLS.map(({ slots }) =>
        slots.map(slot => {
          const filled = filledSlots.has(slot.id);
          return (
            <g
              key={slot.id}
              className="electron-slot"
              onMouseDown={() => handleSlotDown(slot)}
              onMouseEnter={() => handleSlotEnter(slot)}
              onTouchStart={() => handleSlotDown(slot)}
            >
              {/* Slot background circle */}
              <circle
                cx={slot.x} cy={slot.y} r={SLOT_R}
                fill={filled ? slot.color : '#0f172a'}
                stroke={slot.color}
                strokeWidth={filled ? 0 : 1.5}
                opacity={filled ? 1 : 0.5}
                filter={filled ? 'url(#glow)' : undefined}
              />
              {/* Electron dot */}
              {filled && (
                <circle
                  cx={slot.x} cy={slot.y} r={SLOT_R * 0.55}
                  fill="white"
                  opacity="0.35"
                />
              )}
            </g>
          );
        })
      )}

      <NucleusLabel protons={protons} neutrons={neutrons} />
    </svg>
  );
}
