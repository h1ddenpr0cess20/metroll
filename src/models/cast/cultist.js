import { cloth, hold, person } from './person.js';
import { hood, robe } from './metalwear.js';

/**
 * The Cultist: a long robe the colour of a bad bruise, a hood, a candle in
 * one hand and a book in the other that is mostly the same word over and
 * over. Chants. Does not say what. Has been here since before the venue,
 * and will be here after. A slow walker who is not at all in a hurry.
 * About 1.0 tiles tall.
 */

const ROBE = cloth('#3a1a3a', '#1e0c20');

export default person({
  name: 'cultist',
  scale: 1.5,
  b: 1.04,
  shape: { legs: 0.9, girth: 1.0 },
  skin: '#c8b8b0',
  look: { torso: ROBE, sleeve: ROBE, cuff: ROBE, legs: ROBE, boot: '#16101a', sole: '#2a2030' },
  mats: { torso: 'cloth', sleeve: 'cloth', cuff: 'cloth', legs: 'cloth', boot: 'leather' },
  face: { eyeColor: '#c8a040', brow: '#1a1218', mood: -1 },
  style: {
    attack: 'smite', twist: 0,
    after(k, { clip, time, seed }) {
      if (clip === 'ko' || clip === 'hit' || clip === 'attack') return;
      const T = time + seed;
      // A candle held up and a book held open, the head bowed and nodding, a slow sway: the chant.
      hold(k, 'armR', -1.3, 0.2, -0.3); hold(k, 'foreR', -1.2, 0, 0);
      hold(k, 'armL', -0.9, -0.2, 0.3); hold(k, 'foreL', -1.5, 0, 0);
      k.turn('head', 0.3 + Math.sin(T * 1.3) * 0.08, 0, 0);
      k.turn('hips', 0, Math.sin(T * 0.6) * 0.06, 0);
    },
  },
  extras(s, J) {
    robe(s, { color: '#3a1a3a', trim: '#c8a040', flare: 1.1 });
    hood(s, { color: '#3a1a3a', lining: '#12081a' });
    s.part('kit', () => {
      // The candle, and its flame.
      const r = J.handR;
      s.cylinder([r[0], r[1] + 0.04, r[2] + 0.01], 0.011, 0.045, { color: '#f0e8d0', mat: 'cloth', bone: 'handR', k: 0.003, round: 0.003 });
      s.sphere([r[0], r[1] + 0.1, r[2] + 0.01], 0.01, { color: '#ffb02a', mat: 'glow', bone: 'handR', k: 0.002 });
      // The book: a dark slab with a pentagram that is not quite right.
      const l = J.handL;
      s.box([l[0], l[1] + 0.03, l[2] + 0.04], [0.04, 0.005, 0.05], 0.003, { color: '#2a0e0e', mat: 'leather', bone: 'handL', k: 0.002 });
    });
  },
});
