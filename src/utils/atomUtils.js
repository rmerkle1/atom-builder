import { getElement } from '../data/elements.js';

// Aufbau filling order (visual shell n, orbital type)
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

const SUP = ['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹'];
function toSup(n) {
  if (n === 0) return '';
  return String(n).split('').map(d => SUP[+d]).join('');
}

// Build electron config string from a Set of filled slot IDs
export function getElectronConfig(filledSlots) {
  const counts = {};
  for (const id of filledSlots) {
    const [shell, orbital] = id.split('-');
    const key = `${shell}-${orbital}`;
    counts[key] = (counts[key] || 0) + 1;
  }
  const parts = [];
  for (const { shell, orbital } of AUFBAU_ORDER) {
    const n = counts[`${shell}-${orbital}`];
    if (n) parts.push(`${shell}${orbital}${toSup(n)}`);
  }
  return parts.join(' ') || '—';
}

// Count total electrons from filled slots
export function countElectrons(filledSlots) {
  return filledSlots.size;
}

// Charge = protons - electrons
export function getCharge(protons, totalElectrons) {
  return protons - totalElectrons;
}

// Format charge as string: +2, -1, 0 (neutral)
export function formatCharge(charge) {
  if (charge === 0) return 'neutral';
  if (charge > 0) return `+${charge}`;
  return `${charge}`;
}

// Atom display name: e.g. "Hydrogen-2 (charge: -1)"
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

// Nuclear notation parts for rendering
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

// Build ground-state filled slots Set for a given electron count
export function groundStateSlots(numElectrons) {
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

// Validate user's atom against a challenge
export function validateAtom(protons, neutrons, filledSlots, challenge) {
  const errors = [];

  if (protons !== challenge.protons)
    errors.push(`Protons: you have ${protons}, expected ${challenge.protons}`);

  if (neutrons !== challenge.neutrons)
    errors.push(`Neutrons: you have ${neutrons}, expected ${challenge.neutrons}`);

  const totalElectrons = filledSlots.size;
  if (totalElectrons !== challenge.electrons)
    errors.push(`Electrons: you have ${totalElectrons}, expected ${challenge.electrons}`);

  // Check ground state placement
  if (protons === challenge.protons && totalElectrons === challenge.electrons) {
    const expected = groundStateSlots(challenge.electrons);
    const wrongPlacement =
      [...filledSlots].some(id => !expected.has(id)) ||
      [...expected].some(id => !filledSlots.has(id));
    if (wrongPlacement)
      errors.push('Electrons are not in the correct orbitals (check Aufbau / filling order)');
  }

  return errors;
}
