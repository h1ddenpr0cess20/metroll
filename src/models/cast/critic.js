import { cloth, person } from './person.js';

/**
 * The Music Critic: a cardigan, a tote bag, round glasses, a very small
 * beard and a notebook with a pen that is already writing something unkind.
 * Has not heard it. Does not need to. Two stars. About 0.95 tiles tall.
 */

const knit = cloth('#6a7a4a', '#44502e');

export default person({
  name: 'critic',
  scale: 1.45,
  b: 1.0,
  shape: { legs: 1.12, girth: 0.82, head: 1.1, torso: 1.06 },
  skin: '#e0b090',
  look: { torso: knit, sleeve: knit, cuff: knit, legs: cloth('#1c1c24'), boot: '#e8e4d8', sole: '#d8d4c8' },
  mats: { torso: 'cloth', sleeve: 'cloth', cuff: 'cloth', legs: 'denim', boot: 'cloth' },
  face: { eyeColor: '#3a4a5a', brow: '#4a4a4a', mood: 1 },
  hair: { color: cloth('#3a2a1e', '#22160e'), locks: [[[0.06, 0.74, -0.02], [0.1, 0.7, -0.05], 0.03], [[-0.06, 0.74, -0.02], [-0.1, 0.7, -0.05], 0.03], [[0.0, 0.78, 0.06], [0.06, 0.72, 0.1], 0.04]] },
  style: {
    attack: 'thrust', twist: 0,
    after(k, { clip, time, seed }) {
      if (clip === 'ko' || clip === 'hit' || clip === 'attack') return;
      const T = time + seed;
      // Writing it down.
      k.turn('armL', -0.9, 0, 0.3);
      k.turn('foreL', -1.5, 0, 0);
      k.turn('armR', -0.8, 0, -0.25);
      k.turn('foreR', -1.6 + Math.sin(T * 6) * 0.1, 0, 0);
      k.turn('head', 0.18, Math.sin(T * 0.5) * 0.2, 0);
    },
  },
  extras(s, J) {
    s.part('kit', () => {
      // Round glasses, the beard (small), a tote bag on the shoulder with its strap across.
      for (const m of [1, -1]) s.torus([m * 0.042, 0.668, 0.1], 0.022, 0.004, { color: '#16161a', mat: 'metal', bone: 'head', k: 0.002, rot: [Math.PI / 2, 0, 0] });
      s.limb([-0.02, 0.672, 0.106], [0.02, 0.672, 0.106], 0.003, 0.003, { color: '#16161a', mat: 'metal', bone: 'head', k: 0.001 });
      s.ellipsoid([0, 0.598, 0.09], [0.026, 0.026, 0.02], { color: '#3a2a1e', mat: 'hair', bone: 'head', k: 0.006 });
      s.limb([0.09, 0.5, 0.0], [-0.07, 0.38, 0.07], 0.007, 0.007, { color: '#e8e4d8', mat: 'cloth', bone: 'chest', k: 0.002 });
      s.box([-0.1, 0.34, 0.0], [0.05, 0.06, 0.018], 0.01, { color: '#e8e4d8', mat: 'cloth', bone: 'hips', k: 0.004 });
      s.paint((p) => Math.max(Math.abs(p[0] + 0.1) - 0.025, Math.abs(p[1] - 0.34) - 0.014, p[2] - 0.016), '#d81c2a', 0.002);
      // The notebook in one hand and the pen in the other.
      const l = J.handL, r = J.handR;
      s.box([l[0], l[1] + 0.03, l[2] + 0.03], [0.04, 0.05, 0.008], 0.004, { color: '#f2f0ec', mat: 'paper', bone: 'handL', k: 0.003, rot: [-0.3, 0, 0] });
      s.limb([r[0], r[1] - 0.01, r[2]], [r[0], r[1] + 0.04, r[2] + 0.06], 0.005, 0.003, { color: '#c8a030', mat: 'metal', bone: 'handR', k: 0.002 });
    });
  },
});
