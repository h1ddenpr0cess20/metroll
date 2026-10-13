import { cloth, hold, person } from './person.js';
import { baseballCap } from './metalwear.js';

/**
 * The Skater: a cap on backwards, a shirt two sizes too big, shorts, tube
 * socks and skate shoes worn through at the toes, a board under one arm
 * with a sticker on the bottom of it that says something about you. About
 * 0.9 tiles tall.
 */

export default person({
  name: 'skater',
  scale: 1.42,
  b: 1.0,
  shape: { legs: 1.0, girth: 1.06, head: 1.0 },
  skin: '#d8a888',
  look: { torso: cloth('#c8302a', '#8a1c18'), sleeve: cloth('#c8302a', '#8a1c18'), cuff: '#d8a888', legs: cloth('#3a4a3a', '#26322a'), boot: '#2a2a30', sole: '#e8e4d8' },
  mats: { torso: 'cloth', sleeve: 'cloth', cuff: 'skin', legs: 'cloth', boot: 'leather' },
  face: { eyeColor: '#3a2a1e', brow: '#3a2a1e', mood: 0, blush: 0.4 },
  hair: { color: cloth('#2a1c12', '#160e08'), locks: [[[0.09, 0.7, 0.0], [0.11, 0.62, -0.04], 0.03], [[-0.09, 0.7, 0.0], [-0.11, 0.62, -0.04], 0.03]], cap: [0.108, 0.098, 0.108] },
  style: {
    attack: 'smite', twist: 0,
    after(k, { clip, time, seed }) {
      if (clip === 'ko' || clip === 'hit' || clip === 'attack') return;
      const T = time + seed;
      // Bobbing, the board under one arm, the other hand out for balance; a look that says: whatever.
      k.turn('hips', 0.08, Math.sin(T * 1.3) * 0.1, 0);
      hold(k, 'armL', -0.2, 0, 0.9); hold(k, 'foreL', -0.2, 0, 0);
      hold(k, 'armR', 0.1, 0, -0.1);
      k.turn('head', 0.1, Math.sin(T * 0.8) * 0.25, 0.1);
    },
  },
  extras(s) {
    baseballCap(s, { color: '#1a1a1e', back: true });
    s.part('kit', () => {
      // The board: a long rounded deck with its wheels, held up under the left arm.
      s.box([0.17, 0.4, 0.02], [0.095, 0.014, 0.28], 0.012, { color: '#e8c030', mat: 'plastic', bone: 'armL', k: 0.004, rot: [0.2, 0, -0.3] });
      for (const z of [-0.18, 0.2]) for (const x of [0.13, 0.21]) s.cylinder([x, 0.375, z], 0.022, 0.014, { color: '#f4f2ee', mat: 'rubber', bone: 'armL', k: 0.002, rot: [0, 0, Math.PI / 2] });
    });
  },
});
