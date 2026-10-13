/**
 * How a track went, in stars. Three, and each is its own thing to go for:
 *
 *   ★  Show up: get to the stage door.
 *   ★  Professional troll: smash at least three in four of the people in the way.
 *   ★  Tape trader: find all three demo tapes.
 */

export const SMASH_SHARE = 0.75;
export const DEMOS = 3;

/** The goals, and whether `result` ({ smashed, foes, demos }) met each. */
export function goals({ smashed = 0, foes = 0, demos = 0 }) {
  return [
    { id: 'show', title: 'Show up', text: 'Reach the stage door. Low bar.', met: true },
    { id: 'crowd', title: 'Professional troll', text: `Smash ${Math.ceil(foes * SMASH_SHARE)} of the ${foes} annoying people.`, met: foes === 0 || smashed >= Math.ceil(foes * SMASH_SHARE), progress: [Math.min(smashed, foes), foes] },
    { id: 'demos', title: 'Tape trader', text: 'Find all three snow demos.', met: demos >= DEMOS, progress: [Math.min(demos, DEMOS), DEMOS] },
  ];
}

/** Stars for a track: 1 to 3. */
export const stars = (result) => goals(result).filter((g) => g.met).length;
