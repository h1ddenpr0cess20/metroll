/**
 * How a stop went, in stars. Three, and each is its own thing to go for:
 *
 *   ★  Make the show: get to the stage door.
 *   ★  Crowd-pleaser: smash at least three in four of the people in the way.
 *   ★  Souvenir hunter: find all three snow globes.
 */

export const SMASH_SHARE = 0.75;
export const GLOBES = 3;

/** The goals, and whether `result` ({ smashed, foes, globes }) met each. */
export function goals({ smashed = 0, foes = 0, globes = 0 }) {
  return [
    { id: 'show', title: 'Make the show', text: 'Get to the stage door.', met: true },
    { id: 'crowd', title: 'Crowd-pleaser', text: `Smash ${Math.ceil(foes * SMASH_SHARE)} of the ${foes} people in the way.`, met: foes === 0 || smashed >= Math.ceil(foes * SMASH_SHARE), progress: [Math.min(smashed, foes), foes] },
    { id: 'globes', title: 'Souvenir hunter', text: 'Find all three snow globes.', met: globes >= GLOBES, progress: [Math.min(globes, GLOBES), GLOBES] },
  ];
}

/** Stars for a stop: 1 to 3. */
export const stars = (result) => goals(result).filter((g) => g.met).length;
