import { cloth, hold, person } from './person.js';
import { longHair } from './metalwear.js';

/**
 * The Poet: a white shirt open to the navel and a ruffle at each wrist, black
 * breeches, buckled shoes, a cloak thrown over one shoulder, dark curls to the
 * shoulder, a scroll in one hand and a quill in the other. About to read. At
 * length. About 0.9 tiles tall.
 */

export default person({
  name: 'poet',
  scale: 1.44,
  b: 0.98,
  shape: { legs: 1.06, girth: 0.88, head: 1.02 },
  skin: '#ece0d8',
  look: { torso: cloth('#f4f0e8', '#c8c0b0'), sleeve: cloth('#f4f0e8', '#c8c0b0'), cuff: cloth('#f4f0e8'), legs: cloth('#16121a'), boot: '#16121a', sole: '#2a2630' },
  mats: { torso: 'cloth', sleeve: 'cloth', cuff: 'cloth', legs: 'cloth', boot: 'leather' },
  face: { eyeColor: '#3a3a5a', brow: '#14101a', mood: 0, blush: 0.15 },
  hair: longHair(cloth('#1a1418', '#0e0a0e'), { length: 0.85, fringe: true }),
  style: {
    attack: 'thrust', twist: 0,
    after(k, { clip, time, seed }) {
      if (clip === 'ko' || clip === 'hit' || clip === 'attack') return;
      const T = time + seed;
      // Declaiming: one arm out, flung, the scroll held in the other; the head thrown back at the sky.
      hold(k, 'armR', -1.8 + Math.sin(T * 1.4) * 0.2, 0, -0.9); hold(k, 'foreR', -0.3, 0, 0);
      hold(k, 'armL', -1.2, 0, 0.3); hold(k, 'foreL', -0.9, 0, 0);
      k.turn('head', -0.35, Math.sin(T * 0.6) * 0.3, 0.1);
      k.turn('chest', -0.1, 0, 0);
    },
  },
  extras(s, J) {
    s.part('kit', () => {
      // The open shirt: a V of bare chest. Ruffles at the wrists. A cloak on one shoulder.
      s.box([0, 0.46, 0.074], [0.018, 0.07, 0.006], 0.003, { color: '#ece0d8', mat: 'skin', bone: 'chest', k: 0.002 });
      for (const m of [1, -1]) {
        const S = m > 0 ? 'L' : 'R';
        const w = J[`wrist${S}`];
        s.torus([w[0], w[1] + 0.006, w[2]], 0.026, 0.01, { color: '#f4f0e8', mat: 'cloth', bone: `fore${S}`, k: 0.004, rot: [0, 0, Math.PI / 2] });
        s.box([m * 0.06, 0.012, 0.046], [0.03, 0.016, 0.058], 0.006, { color: '#16121a', mat: 'leather', bone: m > 0 ? 'footL' : 'footR', k: 0.003 });
        s.sphere([m * 0.06, 0.03, 0.09], 0.008, { color: '#c8ccd4', mat: 'metal', bone: m > 0 ? 'footL' : 'footR', k: 0.001 });
      }
      s.flake([-0.09, 0.53, -0.02], [-0.14, 0.18, -0.1], [0, 0, -1], 0.04, 0.07, 0.16, { color: '#2a1a36', mat: 'cloth', bone: 'chest', k: 0.01 });
      // The scroll and the quill.
      const l = J.handL, r = J.handR;
      s.cylinder([l[0], l[1] + 0.04, l[2] + 0.03], 0.012, 0.045, { color: '#e8dcb8', mat: 'paper', bone: 'handL', k: 0.003, rot: [0, 0, Math.PI / 2 + 0.3] });
      s.limb([r[0], r[1] - 0.01, r[2]], [r[0] + 0.04, r[1] + 0.12, r[2] + 0.02], 0.003, 0.001, { color: '#f4f0e8', mat: 'cloth', bone: 'handR', k: 0.001 });
    });
  },
});
