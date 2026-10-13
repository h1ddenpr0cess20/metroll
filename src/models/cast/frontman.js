import { cloth, hold, person } from './person.js';
import { bigHair, headband } from './metalwear.js';

/**
 * The Frontman: a cloud of hair he has been teasing since noon, a headband,
 * a mesh vest over a bare chest, leopard-print spandex, white boots to the
 * knee, and a microphone stand with a scarf on it that he swings like a
 * lasso. On his second can of hairspray. About 1.0 tiles tall, plus the hair.
 */

const LEOPARD = (p) => {
  const u = Math.sin(p[0] * 150 + Math.sin(p[1] * 90) * 2) * Math.sin(p[1] * 130 + p[2] * 70);
  return u > 0.5 ? [0.04, 0.02, 0.01] : [0.8, 0.5, 0.12];
};

export default person({
  name: 'frontman',
  scale: 1.5,
  b: 0.98,
  shape: { legs: 1.14, girth: 0.84, head: 1.0 },
  skin: '#e8b08c',
  look: { torso: cloth('#f4f0e8', '#c8c0b0'), sleeve: '#e8b08c', cuff: '#e8b08c', legs: LEOPARD, boot: '#f4f2ee', sole: '#d8d4cc', belt: '#101014', buckle: '#e8c040' },
  mats: { torso: 'cloth', sleeve: 'skin', cuff: 'skin', legs: 'cloth', boot: 'leather' },
  face: { eyeColor: '#4a8ac8', brow: '#d8b050', mood: 0, blush: 0.5 },
  style: {
    attack: 'flail', twist: 0,
    after(k, { clip, time, seed }) {
      if (clip === 'ko' || clip === 'hit' || clip === 'attack') return;
      const T = time + seed;
      // Strutting: the hips going, one arm up, the mic stand swung with the other.
      k.turn('hips', 0, Math.sin(T * 3) * 0.25, Math.sin(T * 3) * 0.08);
      k.turn('chest', 0, -Math.sin(T * 3) * 0.2, 0);
      hold(k, 'armL', -2.6, 0, 0.4); hold(k, 'foreL', -0.2, 0, 0);
      hold(k, 'armR', -1.2, 0, -0.5 + Math.sin(T * 4) * 0.2); hold(k, 'foreR', -0.5, 0, 0);
      k.turn('head', -0.15, Math.sin(T * 1.5) * 0.3, 0.1);
    },
  },
  extras(s, J) {
    bigHair(s, '#e8c868', { size: 1.7, drop: 0.12 });
    headband(s, { color: '#ff2d95' });
    s.part('kit', () => {
      // The mesh vest: a few cross-hatched bars over the chest, and gold chains.
      for (let i = 0; i < 5; i++) s.limb([-0.09, 0.43 + i * 0.025, 0.07], [0.09, 0.43 + i * 0.025, 0.07], 0.003, 0.003, { color: '#101014', mat: 'cloth', bone: 'chest', k: 0.001 });
      s.torus([0, 0.505, 0.04], 0.052, 0.005, { color: '#e8c040', mat: 'metal', bone: 'neck', k: 0.002, rot: [0.4, 0, 0] });
      // Boots up over the knee, flared at the top.
      for (const m of [1, -1]) s.cone([m * 0.06, 0.22, 0.0], 0.046, 0.08, { color: '#f4f2ee', mat: 'leather', bone: m > 0 ? 'shinL' : 'shinR', k: 0.01, rot: [0, 0, Math.PI] });
      // The mic stand in the right hand, a scarf knotted on it, and the mic on top.
      const h = J.handR;
      s.limb([h[0], h[1] - 0.12, h[2]], [h[0], h[1] + 0.2, h[2] + 0.03], 0.006, 0.006, { color: '#c8ccd4', mat: 'metal', bone: 'handR', k: 0.002 });
      s.sphere([h[0], h[1] + 0.22, h[2] + 0.03], 0.017, { color: '#2a2a30', mat: 'metal', bone: 'handR', k: 0.003 });
      s.flake([h[0], h[1] + 0.12, h[2] + 0.03], [h[0] + 0.1, h[1] + 0.02, h[2] + 0.08], [0, 1, 0], 0.012, 0.03, 0.2, { color: '#ff2d95', mat: 'cloth', bone: 'handR', k: 0.004 });
    });
  },
});
