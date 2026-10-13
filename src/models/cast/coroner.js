import { grime } from '../skins.js';
import { cloth, hold, person } from './person.js';

/**
 * The Coroner: a long white coat that has seen better mornings (and worse
 * ones), green rubber gloves, a mask pulled down under the chin, goggles
 * pushed up into the hair, a clipboard, and a toe tag on a string. Has
 * pronounced you dead. Often prematurely. About 0.95 tiles tall.
 */

const COAT = grime(cloth('#f2f0ea', '#c8c4b8'), 0.1, 0.45, 0.55);

export default person({
  name: 'coroner',
  scale: 1.48,
  b: 1.06,
  shape: { legs: 1.0, girth: 1.02, head: 1.0 },
  skin: '#e0b898',
  look: { torso: COAT, sleeve: COAT, cuff: '#3aa05a', legs: cloth('#2a3a4a'), boot: '#f4f2ee', sole: '#2a2a30' },
  mats: { torso: 'cloth', sleeve: 'cloth', cuff: 'rubber', legs: 'cloth', boot: 'rubber' },
  face: { eyeColor: '#3a4a3a', brow: '#4a3a2a', mood: 1 },
  hair: { color: cloth('#6a5a4a', '#3a2e22'), locks: [[[0.09, 0.7, 0.0], [0.11, 0.63, -0.05], 0.028, 0.5], [[-0.09, 0.7, 0.0], [-0.11, 0.63, -0.05], 0.028, 0.5]], cap: [0.106, 0.088, 0.106] },
  style: {
    attack: 'thrust', twist: 0,
    after(k, { clip, time, seed }) {
      if (clip === 'ko' || clip === 'hit' || clip === 'attack') return;
      const T = time + seed;
      // The clipboard up, the other hand dangling the toe tag: tut, tut. Time of death.
      hold(k, 'armL', -1.1, 0, 0.3); hold(k, 'foreL', -1.2, 0, 0);
      hold(k, 'armR', -0.9, 0, -0.2); hold(k, 'foreR', -0.5, 0, 0);
      k.turn('head', 0.15, Math.sin(T * 0.6) * 0.3, 0);
    },
  },
  extras(s, J) {
    s.part('kit', () => {
      // The coat's skirts to the knee, the mask under the chin, the goggles up on the forehead.
      s.cone([0, 0.35, 0.0], 0.14, 0.2, { color: COAT, mat: 'cloth', bone: 'hips', k: 0.01, rot: [Math.PI, 0, 0] });
      s.box([0, 0.585, 0.09], [0.04, 0.02, 0.012], 0.006, { color: '#8ad8c8', mat: 'cloth', bone: 'head', k: 0.003 });
      s.torus([0, 0.74, 0.06], 0.1, 0.006, { color: '#16161a', mat: 'rubber', bone: 'head', k: 0.002, rot: [0.5, 0, 0] });
      for (const m of [1, -1]) s.ellipsoid([m * 0.04, 0.755, 0.1], [0.022, 0.018, 0.008], { color: '#c8e8e0', mat: 'glass', bone: 'head', k: 0.003 });
      // The clipboard, and the toe tag hung from the other hand on a loop of string.
      const l = J.handL, r = J.handR;
      s.box([l[0], l[1] + 0.03, l[2] + 0.04], [0.04, 0.055, 0.005], 0.003, { color: '#8a6a3a', mat: 'leather', bone: 'handL', k: 0.002, rot: [-0.25, 0, 0] });
      s.limb([r[0], r[1] - 0.01, r[2]], [r[0] + 0.01, r[1] - 0.09, r[2] + 0.01], 0.002, 0.002, { color: '#e8e4d8', mat: 'cloth', bone: 'handR', k: 0.001 });
      s.box([r[0] + 0.01, r[1] - 0.115, r[2] + 0.01], [0.012, 0.022, 0.003], 0.002, { color: '#f4e8b0', mat: 'paper', bone: 'handR', k: 0.001 });
    });
  },
});
