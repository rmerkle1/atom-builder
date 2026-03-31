const CX = 350;
const CY = 350;
const GAP_DEGREES = 14;

export const SHELL_DEFS = [
  {
    shell: 1,
    radius: 90,
    orbitals: [
      { type: 's', capacity: 2, color: '#60a5fa', arcColor: '#1e3a5f' },
    ],
  },
  {
    shell: 2,
    radius: 155,
    orbitals: [
      { type: 's', capacity: 2,  color: '#60a5fa', arcColor: '#1e3a5f' },
      { type: 'p', capacity: 6,  color: '#34d399', arcColor: '#064e3b' },
    ],
  },
  {
    shell: 3,
    radius: 225,
    orbitals: [
      { type: 's', capacity: 2,  color: '#60a5fa', arcColor: '#1e3a5f' },
      { type: 'p', capacity: 6,  color: '#34d399', arcColor: '#064e3b' },
      { type: 'd', capacity: 10, color: '#fb923c', arcColor: '#431407' },
    ],
  },
  {
    shell: 4,
    radius: 300,
    orbitals: [
      { type: 's', capacity: 2,  color: '#60a5fa', arcColor: '#1e3a5f' },
      { type: 'p', capacity: 6,  color: '#34d399', arcColor: '#064e3b' },
      { type: 'd', capacity: 10, color: '#fb923c', arcColor: '#431407' },
      { type: 'f', capacity: 14, color: '#c084fc', arcColor: '#3b0764' },
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
    const totalSlots = orbitals.reduce((s, o) => s + o.capacity, 0);
    const numGaps = orbitals.length;
    const totalGapDeg = GAP_DEGREES * numGaps;
    const available = 360 - totalGapDeg;
    const degPerSlot = available / totalSlots;
    const halfSlot = degPerSlot / 2;

    const slots = [];
    const groups = [];
    let angle = -90; // start at 12 o'clock

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
        path: arcPath(radius, groupStart - halfSlot * 0.5, groupEnd + halfSlot * 0.5),
      });

      angle += GAP_DEGREES;
    }

    return { shell, radius, slots, groups };
  });
}

export const COMPUTED_SHELLS = buildShells();
export const ALL_SLOTS = COMPUTED_SHELLS.flatMap(s => s.slots);
