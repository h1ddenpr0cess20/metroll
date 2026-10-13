/**
 * Rock's integrity: how much of him is still in one piece. Every knock
 * takes some, gaffer tape puts some back, and at nothing he is shattered —
 * unless he picked up a lighter, and the crowd calls him back for an encore.
 */

export const MAX_INTEGRITY = 100;

/** What each way of coming to grief costs him. */
export const HARM = Object.freeze({
  fell: 8,
  zapped: 14,
  crushed: 16,
  burnt: 10,
  thud: 4,
});

export function createIntegrity() {
  return { hp: MAX_INTEGRITY, max: MAX_INTEGRITY, encores: 0 };
}

export const shattered = (troll) => troll.hp <= 0;

/** Takes `amount` off. Returns what it took. */
export function hurt(troll, amount) {
  const took = Math.min(Math.max(0, troll.hp), Math.max(0, amount));
  troll.hp -= amount;
  return took;
}

/** Tape: up to the best, no more. Returns what it put back. */
export function heal(troll, amount) {
  if (troll.hp <= 0) return 0;
  const gain = Math.min(amount, troll.max - troll.hp);
  troll.hp += gain;
  return gain;
}

/** An encore, if he has a lighter and he is done for: back up on half his integrity. Returns whether it was used. */
export function encore(troll) {
  if (troll.hp > 0 || troll.encores < 1) return false;
  troll.encores -= 1;
  troll.hp = Math.ceil(troll.max / 2);
  return true;
}

/** How cracked he looks, 0 (whole) to 1 (about to go). */
export const cracked = (troll) => Math.max(0, Math.min(1, 1 - troll.hp / troll.max));
