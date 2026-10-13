import { cloth, hold, person } from './person.js';
import { glasses } from './wardrobe.js';

/**
 * The Zine Kid: a mop of hair, huge round glasses, a band shirt of a band
 * nobody has heard of, jeans rolled to show the boots, a messenger bag
 * of badges, and a stack of stapled photocopies held out: ISSUE #4, with
 * his opinion of you in it. Has copies. About 0.85 tiles tall.
 */

export default person({
  name: 'zinekid',
  scale: 1.38,
  b: 0.96,
  shape: { legs: 1.0, girth: 0.88, head: 1.08 },
  skin: '#e8c0a0',
  look: { torso: cloth('#3a5a4a', '#24382e'), sleeve: cloth('#3a5a4a', '#24382e'), cuff: '#e8c0a0', legs: cloth('#26304a', '#181e30'), boot: '#2a1a10', sole: '#16161a' },
  mats: { torso: 'cloth', sleeve: 'cloth', cuff: 'skin', legs: 'denim', boot: 'leather' },
  face: { eyeColor: '#4a3a2a', brow: '#3a2a1a', mood: 0, blush: 0.5 },
  hair: { color: cloth('#3a2a1a', '#22160c'), locks: [[[0, 0.78, 0.04], [0.04, 0.7, 0.1], 0.05, 0.5], [[0.07, 0.77, 0.0], [0.11, 0.66, -0.03], 0.04, 0.5], [[-0.07, 0.77, 0.0], [-0.11, 0.66, -0.03], 0.04, 0.5], [[0, 0.77, -0.06], [0, 0.66, -0.14], 0.04, 0.5]], cap: [0.114, 0.104, 0.114] },
  style: {
    attack: 'shove', twist: 0,
    after(k, { clip, time, seed }) {
      if (clip === 'ko' || clip === 'hit' || clip === 'attack') return;
      const T = time + seed;
      // The stack of copies held out, offered with both hands, and a little hopeful bob: take one.
      hold(k, 'armR', -1.3, 0, -0.1); hold(k, 'foreR', -0.8, 0, 0);
      hold(k, 'armL', -1.3, 0, 0.1); hold(k, 'foreL', -0.8, 0, 0);
      k.turn('head', 0.1, Math.sin(T * 0.8) * 0.25, 0);
      k.move('hips', 0, Math.abs(Math.sin(T * 3)) * 0.004, 0);
    },
  },
  extras(s) {
    glasses(s, { rim: '#16161a', round: true, size: 0.034 });
    s.part('kit', () => {
      // The stack, stapled in the corner, and a cover with a black block on it.
      for (let i = 0; i < 6; i++) s.box([0, 0.34 + i * 0.008, 0.14], [0.06, 0.004, 0.08], 0.001, { color: '#f4f0e8', mat: 'paper', bone: 'chest', k: 0.001 });
      s.box([0, 0.39, 0.14], [0.05, 0.002, 0.07], 0.001, { color: '#d8d4c8', mat: 'paper', bone: 'chest', k: 0.001 });
      s.paint((p) => Math.max(Math.abs(p[0]) - 0.03, Math.abs(p[2] - 0.14) - 0.02, 0.386 - p[1]), '#16161a', 0.002);
      // The messenger bag across the body, badges on the strap.
      s.limb([0.09, 0.52, 0.0], [-0.07, 0.34, 0.0], 0.008, 0.008, { color: '#8a7a5a', mat: 'cloth', bone: 'chest', k: 0.003 });
      s.box([-0.1, 0.32, 0.0], [0.05, 0.05, 0.03], 0.01, { color: '#8a7a5a', mat: 'cloth', bone: 'hips', k: 0.004 });
      for (const [x, y, c] of [[0.05, 0.47, '#d81c2a'], [0.02, 0.43, '#f0c040'], [-0.02, 0.4, '#2a8ae8']]) s.cylinder([x, y, 0.06], 0.007, 0.002, { color: c, mat: 'plastic', bone: 'chest', k: 0.001, rot: [Math.PI / 2, 0, 0] });
    });
  },
});
