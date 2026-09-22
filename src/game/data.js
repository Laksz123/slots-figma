// Symbol set and reel definitions — ported verbatim from the original static build.
// `desktop`/`mobile` are the CSS size classes for each layout; `src` is the sprite path
// (served from /public/assets, referenced relatively as it was in the static site).

export const symbols = {
  cherry: { src: 'assets/cherry.png', desktop: 'w-cherry', mobile: 'f-cherry' },
  plum: { src: 'assets/plum.png', desktop: 'w-plum', mobile: 'f-plum' },
  banana: { src: 'assets/banana.png', desktop: 'w-banana', mobile: 'f-banana' },
  melon: { src: 'assets/watermelon.png', desktop: 'w-melon', mobile: 'f-melon' },
  ice: { src: 'assets/ice.png', desktop: 'w-ice', mobile: 'f-ice' },
  orange: { src: 'assets/orange.png', desktop: 'w-orange', mobile: 'f-orange' },
};

// Starting visible symbols per reel (5 reels x 3 rows), [reel][row].
export const baseReels = [
  ['cherry', 'banana', 'melon'],
  ['plum', 'melon', 'ice'],
  ['cherry', 'plum', 'orange'],
  ['plum', 'banana', 'cherry'],
  ['melon', 'ice', 'orange'],
];

// Per-reel symbol pool used to fill the "junk" that scrolls past during a spin.
export const reelPool = [
  ['cherry', 'orange', 'melon', 'banana', 'plum', 'ice'],
  ['plum', 'melon', 'ice', 'cherry', 'banana', 'orange'],
  ['orange', 'cherry', 'plum', 'melon', 'ice', 'banana'],
  ['banana', 'plum', 'cherry', 'ice', 'orange', 'melon'],
  ['melon', 'ice', 'orange', 'banana', 'cherry', 'plum'],
];

// Canned result matrices, [reel][row]. The mock server cycles through these; a real
// backend (ТЗ §8) would return the same shape in its /spin payload.
export const results = [
  [
    ['cherry', 'banana', 'melon'],
    ['plum', 'melon', 'ice'],
    ['cherry', 'plum', 'orange'],
    ['plum', 'banana', 'cherry'],
    ['melon', 'ice', 'orange'],
  ],
  [
    ['orange', 'cherry', 'banana'],
    ['banana', 'plum', 'orange'],
    ['melon', 'ice', 'cherry'],
    ['ice', 'orange', 'plum'],
    ['cherry', 'melon', 'banana'],
  ],
  [
    ['melon', 'plum', 'ice'],
    ['orange', 'banana', 'cherry'],
    ['banana', 'melon', 'plum'],
    ['cherry', 'ice', 'orange'],
    ['plum', 'orange', 'melon'],
  ],
  [
    ['ice', 'melon', 'cherry'],
    ['cherry', 'orange', 'melon'],
    ['plum', 'banana', 'ice'],
    ['melon', 'cherry', 'banana'],
    ['orange', 'plum', 'ice'],
  ],
];
