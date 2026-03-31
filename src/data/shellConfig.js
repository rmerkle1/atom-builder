const CX = 350;
const CY = 350;
const GAP_DEGREES = 14;

// New color scheme
export const ORBITAL_COLORS = {
  s: { color: '#17b29e', arcColor: '#063d37' },
  p: { color: '#748ac5', arcColor: '#1e2545' },
  d: { color: '#fdb714', arcColor: '#4a3300' },
  f: { color: '#00addb', arcColor: '#003347' },
};

export const SHELL_DEFS = [
  {
    shell: 1,
    radius: 90,
    orbitals: [
      { type: 's', capacity: 2, ...ORBITAL_COLORS.s },
    ],
  },
  {
    shell: 2,
    radius: 155,
    orbitals: [
      { type: 's', capacity: 2,  ...ORBITAL_COLORS.s },
      { type: 'p', capacity: 6,  ...ORBITAL_COLORS.p },
    ],
  },
  {
    shell: 3,
    radius: 225,
    orbitals: [
      { type: 's', capacity: 2,  ...ORBITAL_COLORS.s },
      { type: 'p', capacity: 6,  ...ORBITAL_COLORS.p },
      { type: 'd', capacity: 10, ...ORBITAL_COLORS.d },
    ],
  },
  {
    shell: 4,
    radius: 300,
    orbitals: [
      { type: 's', capacity: 2,  ...ORBITAL_COLORS.s },
      { type: 'p', capacity: 6,  ...ORBITAL_COLORS.p },
      { type: 'd', capacity: 10, ...ORBITAL_COLORS.d },
      { type: 'f', capacity: 14, ...ORBITAL_COLORS.f },
    ],
  },
];

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function pointOnCircle(r, angleDeg) {
  const a = toRad(angleDeg);
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

function arcPath(r, startDeg, endDeg) {
  const start = pointOnCircle(r, startDeg);
  const end = pointOnCircle(r, endDeg);
  const diff = endDeg - startDeg;
  const large = diff > 180 ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

export function buildShells() {
  return SHELL_DEFS.map(def => {
    const { shell, radius, orbitals } = def;
    const isShell1 = shell === 1;

    // Shell 1 has only 1s — slots at top and bottom, arc fills full circle
    const totalSlots = orbitals.reduce((s, o) => s + o.capacity, 0);
    const numGaps = isShell1 ? 0 : orbitals.length;
    const totalGapDeg = GAP_DEGREES * numGaps;
    const available = 360 - totalGapDeg;
    const degPerSlot = available / totalSlots;
    const halfSlot = degPerSlot / 2;

    const slots = [];
    const groups = [];
    let angle = -90;

    for (const orb of orbitals) {
      const groupStart = angle;

      for (let i = 0; i < orb.capacity; i++) {
        const pt = pointOnCircle(radius, angle);
        slots.push({
          id: `${shell}-${orb.type}-${i}`,
          shell,
          orbital: orb.type,
          index: i,
          angle,
          x: pt.x,
          y: pt.y,
          color: orb.color,
        });
        angle += degPerSlot;
      }

      const groupEnd = angle - degPerSlot;
      const midAngle = (groupStart + groupEnd) / 2;
      // Push label outside the ring
      const labelPt = pointOnCircle(radius + 22, midAngle);

      groups.push({
        orbital: orb.type,
        color: orb.color,
        arcColor: orb.arcColor,
        startAngle: groupStart - halfSlot * 0.5,
        endAngle: groupEnd + halfSlot * 0.5,
        midAngle,
        labelX: labelPt.x,
        labelY: labelPt.y,
        // Shell 1 draws a full circle via <circle> in AtomCanvas
        isFullCircle: isShell1,
        path: isShell1 ? null : arcPath(radius, groupStart - halfSlot * 0.5, groupEnd + halfSlot * 0.5),
        radius,
      });

      angle += isShell1 ? 0 : GAP_DEGREES;
    }

    return { shell, radius, slots, groups };
  });
}

export const COMPUTED_SHELLS = buildShells();
export const ALL_SLOTS = COMPUTED_SHELLS.flatMap(s => s.slots);
