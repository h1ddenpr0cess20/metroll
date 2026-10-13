import { cloth, hold, person } from './person.js';
import { cape, fangs } from './metalwear.js';

/**
 * The Dracula Fan: a cape of shiny satin with a red lining that does not
 * stay on, plastic fangs, hair gelled straight back to a widow's peak, a
 * white shirt with a ruffle, a waistcoat, and a flag on a stick that says
 * DRACULA WALK. Has been to Whitby eleven times. Has not once been
 * to the Abbey on a night that was not cold. About 0.9 tiles tall.
 */

export default person({
  name: 'dracfan',
  scale: 1.42,
  b: 1.0,
  shape: { legs: 1.0, girth: 0.96, head: 1.0 },
  skin: '#ece4e0',
  look: { torso: cloth('#f4f0e8', '#c8c0b0'), sleeve: cloth('#f4f0e8', '#c8c0b0'), cuff: cloth('#f4f0e8'), legs: cloth('#16121a'), boot: '#16121a', sole: '#2a2630' },
  mats: { torso: 'cloth', sleeve: 'cloth', cuff: 'cloth', legs: 'cloth', boot: 'leather' },
  face: { eyeColor: '#6a1a1a', brow: '#101014', mood: 1, blush: 0.1 },
  hair: { color: cloth('#101014', '#08080a'), locks: [[[0, 0.78, 0.0], [0, 0.7, -0.14], 0.055, 0.5], [[0.07, 0.76, 0.0], [0.1, 0.68, -0.1], 0.035, 0.5], [[-0.07, 0.76, 0.0], [-0.1, 0.68, -0.1], 0.035, 0.5]], cap: [0.108, 0.1, 0.108], front: 0.0 },
  style: {
    attack: 'hug', twist: 0,
    after(k, { clip, time, seed }) {
      if (clip === 'ko' || clip === 'hit' || clip === 'attack') return;
      const T = time + seed;
      // The flag held up in one fist; the other arm swept across the face behind the cape's edge: I vant to...
      hold(k, 'armR', -2.5, 0, -0.1); hold(k, 'foreR', -0.3, 0, 0);
      hold(k, 'armL', -1.3, 0, 0.9); hold(k, 'foreL', -2.0, 0.3, 0);
      k.turn('head', -0.1, Math.sin(T * 0.8) * 0.3, 0);
    },
  },
  extras(s, J) {
    cape(s, { color: '#1a1420', lining: '#c8102e' });
    fangs(s);
    s.part('kit', () => {
      // The ruffle: bumps of white down the shirt front. The waistcoat: black either side of it.
      for (let i = 0; i < 4; i++) s.ellipsoid([0, 0.5 - i * 0.03, 0.076], [0.022, 0.012, 0.008], { color: '#f4f0e8', mat: 'cloth', bone: 'chest', k: 0.004 });
      for (const m of [1, -1]) s.box([m * 0.06, 0.43, 0.072], [0.03, 0.065, 0.008], 0.004, { color: '#16121a', mat: 'cloth', bone: 'chest', k: 0.002 });
      // The flag: a pole, a rectangle of cloth, a bat on it.
      const h = J.handR;
      s.limb([h[0], h[1] - 0.1, h[2]], [h[0], h[1] + 0.32, h[2]], 0.005, 0.005, { color: '#5a3a1e', mat: 'leather', bone: 'handR', k: 0.002 });
      s.box([h[0] + 0.06, h[1] + 0.26, h[2]], [0.06, 0.04, 0.004], 0.002, { color: '#c8102e', mat: 'cloth', bone: 'handR', k: 0.002 });
      s.paint((p) => Math.max(Math.hypot((p[0] - h[0] - 0.06) * 1.2, p[1] - h[1] - 0.26) - 0.018, Math.abs(p[2] - h[2]) - 0.01), '#101014', 0.002);
    });
  },
});
