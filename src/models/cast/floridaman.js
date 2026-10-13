import { cloth, hold, person } from './person.js';
import { longHair, shades } from './metalwear.js';

/**
 * Florida Man: a sunburn that is mostly a rumour on the front and a fact on the
 * back, a Hawaiian shirt open to show it, a mullet, wraparound shades,
 * cargo shorts, flip-flops, and a beer held up to the sky. Has a story. It
 * is not a good story. It is about you. About 0.95 tiles tall.
 */

const HAWAII = (p) => {
  const f = Math.sin(p[0] * 110 + Math.sin(p[1] * 80) * 2) * Math.sin(p[1] * 100 + p[2] * 60);
  return f > 0.45 ? [0.9, 0.2, 0.3] : f < -0.55 ? [0.95, 0.75, 0.1] : [0.05, 0.4, 0.45];
};

export default person({
  name: 'floridaman',
  scale: 1.48,
  b: 1.1,
  shape: { legs: 0.96, girth: 1.1, head: 1.0 },
  belly: 1.0,
  skin: '#e88a6a',
  look: { torso: '#e88a6a', sleeve: HAWAII, cuff: '#e88a6a', legs: cloth('#8a8660', '#5c5a40'), boot: '#e88a6a', sole: '#2a6ab8' },
  mats: { torso: 'skin', sleeve: 'cloth', cuff: 'skin', legs: 'cloth', boot: 'skin' },
  face: { eyeColor: '#3a5a8a', brow: '#d8b050', mood: 0, blush: 1.0 },
  hair: { ...longHair(cloth('#d8b050', '#a88020'), { length: 1.0 }), cap: [0.106, 0.07, 0.106] },
  style: {
    attack: 'smite', twist: 0,
    after(k, { clip, time, seed }) {
      if (clip === 'ko' || clip === 'hit' || clip === 'attack') return;
      const T = time + seed;
      // The beer up in the air, a toast to nobody, a sway, the other arm waving: hold my beer.
      hold(k, 'armR', -2.6 + Math.sin(T * 2.1) * 0.15, 0, -0.3); hold(k, 'foreR', -0.3, 0, 0);
      hold(k, 'armL', -0.6, 0, 0.6 + Math.sin(T * 3) * 0.3); hold(k, 'foreL', -0.4, 0, 0);
      k.turn('hips', 0, 0, Math.sin(T * 1.3) * 0.05);
      k.turn('head', -0.2, Math.sin(T * 0.7) * 0.4, 0.1);
    },
  },
  extras(s, J) {
    shades(s, { color: '#101014' });
    s.part('kit', () => {
      // The shirt's front hanging open either side, and the can in the hand.
      for (const m of [1, -1]) s.box([m * 0.075, 0.45, 0.07], [0.03, 0.07, 0.01], 0.006, { color: HAWAII, mat: 'cloth', bone: 'chest', k: 0.004 });
      const h = J.handR;
      s.cylinder([h[0], h[1] + 0.05, h[2] + 0.01], 0.016, 0.035, { color: '#d8d8dc', mat: 'metal', bone: 'handR', k: 0.003, round: 0.004 });
      s.paint((p) => Math.max(Math.abs(p[1] - h[1] - 0.05) - 0.012, Math.hypot(p[0] - h[0], p[2] - h[2] - 0.01) - 0.02), '#d81c2a', 0.002);
    });
  },
});
