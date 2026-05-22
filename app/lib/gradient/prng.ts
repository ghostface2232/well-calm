/**
 * Deterministic pseudo-random number generation.
 *
 * Gradients must render identically on the server and the client (no
 * hydration mismatch) and stay stable across re-renders, so every "random"
 * choice is derived from a seed via a small fast PRNG — never `Math.random()`.
 */

/** FNV-1a hash → 32-bit unsigned seed. */
export function hashSeed(input: string | number): number {
  const str = String(input);
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Mulberry32 — compact, well-distributed 32-bit PRNG. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Rng {
  /** next float in [0, 1) */
  next(): number;
  /** float in [min, max) */
  range(min: number, max: number): number;
  /** integer in [min, max] */
  int(min: number, max: number): number;
  /** a random element of `arr` */
  pick<T>(arr: readonly T[]): T;
  /** `value` offset by up to ±`amount` */
  jitter(value: number, amount: number): number;
}

/** Create a seeded RNG. Same seed → same sequence, every time. */
export function createRng(seed: string | number): Rng {
  const next = mulberry32(hashSeed(seed));
  return {
    next,
    range: (min, max) => min + next() * (max - min),
    int: (min, max) => Math.floor(min + next() * (max - min + 1)),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    jitter: (value, amount) => value + (next() * 2 - 1) * amount,
  };
}
