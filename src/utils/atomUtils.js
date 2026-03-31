import { getElement } from '../data/elements.js';

// Aufbau filling order (building up — 4s fills before 3d)
export const AUFBAU_ORDER = [
  { shell: 1, orbital: 's', capacity: 2 },
  { shell: 2, orbital: 's', capacity: 2 },
  { shell: 2, orbital: 'p', capacity: 6 },
  { shell: 3, orbital: 's', capacity: 2 },
  { shell: 3, orbital: 'p', capacity: 6 },
  { shell: 4, orbital: 's', capacity: 2 },  // 4s fills before 3d
  { shell: 3, orbital: 'd', capacity: 10 }, // 3d after 4s
  { shell: 4, orbital: 'p', capacity: 6 },
  { shell: 4, orbital: 'd', capacity: 10 },
  { shell: 4, orbital: 'f', capacity: 14 },
];

// Electron removal order for cations: highest principal quantum number first.
// This correctly models 4s being removed before 3d for transition metal cations
// because 4s (n=4) > 3d (n=3). Within the same n, highest l first.
const REMOVAL_ORDER = [
  { shell: 4, orbital: 'f', capacity: 14 },
  { shell: 4, orbital: 'd', capacity: 10 },
  { shell: 4, orbital: 'p', capacity: 6 },
  { shell: 4, orbital: 's', capacity: 2 },  // 4s removed before 3d
  { shell: 3, orbital: 'd', capacity: 10 },
  { shell: 3, orbital: 'p', capacity: 6 },
  { shell: 3, orbital: 's', capacity: 2 },
  { shell: 2, orbital: 'p', capacity: 6 },
  { shell: 2, orbital: 's', capacity: 2 },
  { shell: 1, orbital: 's', capacity: 2 },
];

// Neutral-atom exception configurations (by proton number).
// d4 → d5 s1 (half-filled d is extra stable): Cr=24
// d9 → d10 s1 (full d is extra stable): Cu=29
function buildFromSpec(spec) {
  const filled = new Set();
  for (const [shell, orbital, n] of spec) {
    for (let i = 0; i < n; i++) filled.add(`${shell}-${orbital}-${i}`);
  }
  return filled;
}

const NEUTRAL_EXCEPTIONS = new Map([
  // Cr: [Ar] 3d⁵ 4s¹  (not 3d⁴ 4s²)
  [24, buildFromSpec([[1,'s',2],[2,'s',2],[2,'p',6],[3,'s',2],[3,'p',6],[3,'d',5],[4,'s',1]])],
  // Cu: [Ar] 3d¹⁰ 4s¹  (not 3d⁹ 4s²)
  [29, buildFromSpec([[1,'s',2],[2,'s',2],[2,'p',6],[3,'s',2],[3,'p',6],[3,'d',10],[4,'s',1]])],
]);

function buildAufbauFill(numElectrons) {
  const filled = new Set();
  let rem = numElectrons;
  for (const { shell, orbital, capacity } of AUFBAU_ORDER) {
    if (rem <= 0) break;
    const n = Math.min(rem, capacity);
    for (let i = 0; i < n; i++) filled.add(`${shell}-${orbital}-${i}`);
    rem -= n;
  }
  return filled;
}

function removeCationElectrons(filled, charge) {
  const result = new Set(filled);
  let toRemove = charge;
  for (const { shell, orbital, capacity } of REMOVAL_ORDER) {
    if (toRemove <= 0) break;
    // Collect filled indices for this orbital (in order)
    const present = [];
    for (let i = 0; i < capacity; i++) {
      if (result.has(`${shell}-${orbital}-${i}`)) present.push(i);
    }
    const removeN = Math.min(present.length, toRemove);
    // Remove from the highest-index filled slots first
    for (let k = present.length - 1; k >= present.length - removeN; k--) {
      result.delete(`${shell}-${orbital}-${present[k]}`);
    }
    toRemove -= removeN;
  }
  return result;
}

// Build ground-state filled slots for (protons, numElectrons).
// Handles: d4/d9 neutral exceptions (Cr, Cu), cation removal order (4s before 3d).
export function groundStateSlots(protons, numElectrons) {
  const charge = protons - numElectrons;

  if (charge === 0) {
    // Neutral atom — check d-block exceptions
    return NEUTRAL_EXCEPTIONS.has(protons)
      ? new Set(NEUTRAL_EXCEPTIONS.get(protons))
      : buildAufbauFill(numElectrons);
  } else if (charge < 0) {
    // Anion — just keep filling in Aufbau order
    return buildAufbauFill(numElectrons);
  } else {
    // Cation — fill neutral atom first, then strip electrons in removal order
    const neutral = NEUTRAL_EXCEPTIONS.has(protons)
      ? new Set(NEUTRAL_EXCEPTIONS.get(protons))
      : buildAufbauFill(protons);
    return removeCationElectrons(neutral, charge);
  }
}

// ── Display helpers ──────────────────────────────────────────────────────────

const SUP = ['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹'];
function toSup(n) {
  if (n === 0) return '';
  return String(n).split('').map(d => SUP[+d]).join('');
}

export function getElectronConfig(filledSlots) {
  const counts = {};
  for (const id of filledSlots) {
    const [shell, orbital] = id.split('-');
    counts[`${shell}-${orbital}`] = (counts[`${shell}-${orbital}`] || 0) + 1;
  }
  const parts = [];
  for (const { shell, orbital } of AUFBAU_ORDER) {
    const n = counts[`${shell}-${orbital}`];
    if (n) parts.push(`${shell}${orbital}${toSup(n)}`);
  }
  return parts.join(' ') || '—';
}

export function countElectrons(filledSlots) { return filledSlots.size; }

export function getCharge(protons, totalElectrons) { return protons - totalElectrons; }

export function formatCharge(charge) {
  if (charge === 0) return 'neutral';
  return charge > 0 ? `+${charge}` : `${charge}`;
}

export function getAtomDisplayName(protons, neutrons, totalElectrons) {
  if (protons === 0) return '—';
  const el = getElement(protons);
  if (!el) return 'Unknown';
  const mass = protons + neutrons;
  const charge = getCharge(protons, totalElectrons);
  let name = `${el.name}-${mass}`;
  if (charge !== 0) name += ` (charge: ${formatCharge(charge)})`;
  return name;
}

export function getNuclearNotation(protons, neutrons, totalElectrons) {
  if (protons === 0) return null;
  const el = getElement(protons);
  if (!el) return null;
  const mass = protons + neutrons;
  const charge = getCharge(protons, totalElectrons);
  return {
    massNumber: mass,
    symbol: el.symbol,
    charge,
    chargeStr: charge === 0 ? '' : formatCharge(charge),
  };
}

export function validateAtom(protons, neutrons, filledSlots, challenge) {
  const errors = [];

  if (protons !== challenge.protons)
    errors.push(`Protons: you have ${protons}, expected ${challenge.protons}`);

  if (neutrons !== challenge.neutrons)
    errors.push(`Neutrons: you have ${neutrons}, expected ${challenge.neutrons}`);

  const totalElectrons = filledSlots.size;
  if (totalElectrons !== challenge.electrons)
    errors.push(`Electrons: you have ${totalElectrons}, expected ${challenge.electrons}`);

  // Check correct orbital placement
  if (protons === challenge.protons && totalElectrons === challenge.electrons) {
    const expected = groundStateSlots(challenge.protons, challenge.electrons);
    const wrong =
      [...filledSlots].some(id => !expected.has(id)) ||
      [...expected].some(id => !filledSlots.has(id));
    if (wrong)
      errors.push('Electrons are not in the correct orbitals (check filling order)');
  }

  return errors;
}
