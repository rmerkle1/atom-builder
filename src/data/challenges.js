// Each challenge: { id, category, displayName, hint, protons, neutrons, electrons }
// electrons = number of electrons (may differ from protons for ions)

export const CHALLENGES = [
  // === BASIC ELEMENTS ===
  {
    id: 'H-1',
    category: 'Element',
    displayName: 'Hydrogen-1',
    hint: 'The lightest element — just 1 proton and 1 electron.',
    protons: 1, neutrons: 0, electrons: 1,
  },
  {
    id: 'He-4',
    category: 'Element',
    displayName: 'Helium-4',
    hint: 'Noble gas with a full 1s shell.',
    protons: 2, neutrons: 2, electrons: 2,
  },
  {
    id: 'Li-7',
    category: 'Element',
    displayName: 'Lithium-7',
    hint: 'Alkali metal — 3 protons, 1 valence electron in 2s.',
    protons: 3, neutrons: 4, electrons: 3,
  },
  {
    id: 'C-12',
    category: 'Element',
    displayName: 'Carbon-12',
    hint: 'The backbone of organic chemistry. 6 protons.',
    protons: 6, neutrons: 6, electrons: 6,
  },
  {
    id: 'N-14',
    category: 'Element',
    displayName: 'Nitrogen-14',
    hint: 'Makes up 78% of the atmosphere.',
    protons: 7, neutrons: 7, electrons: 7,
  },
  {
    id: 'O-16',
    category: 'Element',
    displayName: 'Oxygen-16',
    hint: '8 protons, essential for life.',
    protons: 8, neutrons: 8, electrons: 8,
  },
  {
    id: 'Ne-20',
    category: 'Element',
    displayName: 'Neon-20',
    hint: 'Noble gas — fills all of shells 1 and 2.',
    protons: 10, neutrons: 10, electrons: 10,
  },
  {
    id: 'Na-23',
    category: 'Element',
    displayName: 'Sodium-23',
    hint: '11 protons — one lonely electron in 3s.',
    protons: 11, neutrons: 12, electrons: 11,
  },
  {
    id: 'Cl-35',
    category: 'Element',
    displayName: 'Chlorine-35',
    hint: '17 protons — one slot short of a full 3p.',
    protons: 17, neutrons: 18, electrons: 17,
  },
  {
    id: 'Ar-40',
    category: 'Element',
    displayName: 'Argon-40',
    hint: 'Noble gas — fills 1s, 2s, 2p, 3s, 3p completely.',
    protons: 18, neutrons: 22, electrons: 18,
  },
  {
    id: 'K-39',
    category: 'Element',
    displayName: 'Potassium-39',
    hint: 'Watch out! 4s fills before 3d.',
    protons: 19, neutrons: 20, electrons: 19,
  },
  {
    id: 'Ca-40',
    category: 'Element',
    displayName: 'Calcium-40',
    hint: '4s is full (2 electrons) before 3d starts.',
    protons: 20, neutrons: 20, electrons: 20,
  },
  {
    id: 'Fe-56',
    category: 'Element',
    displayName: 'Iron-56',
    hint: '26 protons — 6 electrons in 3d.',
    protons: 26, neutrons: 30, electrons: 26,
  },

  // === ISOTOPES ===
  {
    id: 'H-2',
    category: 'Isotope',
    displayName: 'Deuterium (²H)',
    hint: 'Hydrogen with 1 neutron — used in heavy water.',
    protons: 1, neutrons: 1, electrons: 1,
  },
  {
    id: 'H-3',
    category: 'Isotope',
    displayName: 'Tritium (³H)',
    hint: 'Radioactive hydrogen with 2 neutrons.',
    protons: 1, neutrons: 2, electrons: 1,
  },
  {
    id: 'C-13',
    category: 'Isotope',
    displayName: 'Carbon-13',
    hint: 'Stable carbon isotope used in NMR spectroscopy.',
    protons: 6, neutrons: 7, electrons: 6,
  },
  {
    id: 'C-14',
    category: 'Isotope',
    displayName: 'Carbon-14',
    hint: 'Radioactive carbon used in dating ancient materials.',
    protons: 6, neutrons: 8, electrons: 6,
  },
  {
    id: 'U-235',
    category: 'Isotope',
    displayName: 'Potassium-40',
    hint: 'Radioactive K isotope — extra neutron.',
    protons: 19, neutrons: 21, electrons: 19,
  },

  // === IONS ===
  {
    id: 'H+',
    category: 'Ion',
    displayName: 'Hydrogen ion (H⁺)',
    hint: 'A proton with no electrons.',
    protons: 1, neutrons: 0, electrons: 0,
  },
  {
    id: 'H-',
    category: 'Ion',
    displayName: 'Hydride ion (H⁻)',
    hint: '1 proton but 2 electrons — fills 1s completely.',
    protons: 1, neutrons: 0, electrons: 2,
  },
  {
    id: 'Na+',
    category: 'Ion',
    displayName: 'Sodium ion (Na⁺)',
    hint: 'Na loses its 3s electron to become +1.',
    protons: 11, neutrons: 12, electrons: 10,
  },
  {
    id: 'Mg2+',
    category: 'Ion',
    displayName: 'Magnesium ion (Mg²⁺)',
    hint: 'Mg loses both 3s electrons.',
    protons: 12, neutrons: 12, electrons: 10,
  },
  {
    id: 'O2-',
    category: 'Ion',
    displayName: 'Oxide ion (O²⁻)',
    hint: 'Oxygen gains 2 electrons to fill 2p.',
    protons: 8, neutrons: 8, electrons: 10,
  },
  {
    id: 'Cl-',
    category: 'Ion',
    displayName: 'Chloride ion (Cl⁻)',
    hint: 'Cl gains 1 electron to fill 3p completely.',
    protons: 17, neutrons: 18, electrons: 18,
  },
  {
    id: 'Fe2+',
    category: 'Ion',
    displayName: 'Iron(II) ion (Fe²⁺)',
    hint: 'Fe loses its 4s electrons first.',
    protons: 26, neutrons: 30, electrons: 24,
  },
  {
    id: 'Fe3+',
    category: 'Ion',
    displayName: 'Iron(III) ion (Fe³⁺)',
    hint: 'Fe loses 4s² and one 3d electron.',
    protons: 26, neutrons: 30, electrons: 23,
  },
  {
    id: 'Ca2+',
    category: 'Ion',
    displayName: 'Calcium ion (Ca²⁺)',
    hint: 'Ca loses both 4s electrons.',
    protons: 20, neutrons: 20, electrons: 18,
  },
];

export function getChallenge(id) {
  return CHALLENGES.find(c => c.id === id);
}

export function getRandomChallenge(excludeId) {
  const pool = excludeId ? CHALLENGES.filter(c => c.id !== excludeId) : CHALLENGES;
  return pool[Math.floor(Math.random() * pool.length)];
}
