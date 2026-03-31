import { useEffect, useRef } from 'react';
import { COMPUTED_SHELLS } from '../data/shellConfig.js';

const CX = 350;
const CY = 350;
const SLOT_R = 8;
// Width of the invisible hit-area overlay drawn on each orbital arc
// (wider = easier to double-click the space between electron slots)
const HIT_WIDTH = 32;

function NucleusLabel({ protons, neutrons }) {
  const r = Math.max(28, Math.min(52, 20 + (protons + neutrons) * 0.8));
  return (
    <>
      <circle cx={CX} cy={CY} r={r}
        fill="url(#nucleusGrad)" stroke="#e9177a" strokeWidth="2"
        className="glow-nucleus" />
      <text x={CX} y={CY - 7} textAnchor="middle" dominantBaseline="middle"
        fill="#f9a8d4" fontSize="11" fontWeight="bold">P: {protons}</text>
      <text x={CX} y={CY + 8} textAnchor="middle" dominantBaseline="middle"
        fill="#94a3b8" fontSize="11">N: {neutrons}</text>
    </>
  );
}

export default function AtomCanvas({ protons, neutrons, filledSlots, onToggleSlot, onFillOrbital }) {
  const dragMode = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const up = () => { isDragging.current = false; dragMode.current = null; };
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    return () => { window.removeEventListener('mouseup', up); window.removeEventListener('touchend', up); };
  }, []);

  function handleSlotDown(e, slot) {
    e.preventDefault();   // prevents text selection during drag
    const filled = filledSlots.has(slot.id);
    const mode = filled ? 'remove' : 'add';
    isDragging.current = true;
    dragMode.current = mode;
    onToggleSlot(slot.id, mode);
  }

  function handleSlotEnter(slot) {
    if (!isDragging.current || !dragMode.current) return;
    onToggleSlot(slot.id, dragMode.current);
  }

  function handleOrbitalDblClick(e, shell, orbital) {
    e.preventDefault();
    e.stopPropagation();
    isDragging.current = false;
    dragMode.current = null;
    onFillOrbital(shell, orbital);
  }

  return (
    <svg
      viewBox="0 0 700 700"
      style={{
        width: '100%', height: '100%', maxHeight: '100%',
        userSelect: 'none', WebkitUserSelect: 'none',
      }}
      onMouseLeave={() => { isDragging.current = false; dragMode.current = null; }}
    >
      <defs>
        <radialGradient id="nucleusGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#9d174d" />
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

      {/* Orbital group arcs, labels, and invisible double-click hit areas */}
      {COMPUTED_SHELLS.map(({ shell, groups }) =>
        groups.map(g => (
          <g key={`${shell}-${g.orbital}`}>
            {/* Visible arc / full circle */}
            {g.isFullCircle ? (
              <>
                <circle cx={CX} cy={CY} r={g.radius}
                  fill="none" stroke={g.arcColor} strokeWidth="14" opacity="0.9" />
                <circle cx={CX} cy={CY} r={g.radius}
                  fill="none" stroke={g.color} strokeWidth="1.5" opacity="0.4" />
              </>
            ) : (
              <>
                <path d={g.path} fill="none" stroke={g.arcColor}
                  strokeWidth="14" strokeLinecap="round" opacity="0.85" />
                <path d={g.path} fill="none" stroke={g.color}
                  strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
              </>
            )}

            {/* Invisible wide hit area for double-click — covers the arc + gaps between slots */}
            {g.isFullCircle ? (
              <circle
                cx={CX} cy={CY} r={g.radius}
                fill="none"
                stroke="rgba(255,255,255,0.001)"
                strokeWidth={HIT_WIDTH}
                style={{ cursor: 'pointer' }}
                onDoubleClick={e => handleOrbitalDblClick(e, shell, g.orbital)}
              />
            ) : (
              <path
                d={g.path}
                fill="none"
                stroke="rgba(255,255,255,0.001)"
                strokeWidth={HIT_WIDTH}
                strokeLinecap="round"
                style={{ cursor: 'pointer' }}
                onDoubleClick={e => handleOrbitalDblClick(e, shell, g.orbital)}
              />
            )}

            <text
              x={g.labelX} y={g.labelY}
              textAnchor="middle" dominantBaseline="middle"
              fill={g.color} fontSize="9" fontWeight="bold" opacity="0.85"
              style={{ pointerEvents: 'none' }}
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
              style={{ cursor: 'pointer' }}
              onMouseDown={e => handleSlotDown(e, slot)}
              onMouseEnter={() => handleSlotEnter(slot)}
              onTouchStart={e => handleSlotDown(e, slot)}
              onDoubleClick={e => handleOrbitalDblClick(e, slot.shell, slot.orbital)}
            >
              <circle
                cx={slot.x} cy={slot.y} r={SLOT_R}
                fill={filled ? slot.color : '#0f172a'}
                stroke={slot.color}
                strokeWidth={filled ? 0 : 1.5}
                opacity={filled ? 1 : 0.5}
                filter={filled ? 'url(#glow)' : undefined}
              />
              {filled && (
                <circle cx={slot.x} cy={slot.y} r={SLOT_R * 0.55}
                  fill="white" opacity="0.3" />
              )}
            </g>
          );
        })
      )}

      <NucleusLabel protons={protons} neutrons={neutrons} />
    </svg>
  );
}
