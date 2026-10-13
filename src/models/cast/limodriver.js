import { cloth, hold, person } from './person.js';
import { cap } from './wardrobe.js';

/**
 * The Limo Driver: a black suit and a peaked cap, white gloves, a bow tie,
 * and a sign held up in both hands that reads SMITH. You are not Mr. Smith.
 * He has decided that you are. About 0.95 tiles tall.
 */

const suit = cloth('#101014', '#08080a');

export default person({
  name: 'limodriver',
  scale: 1.5,
  b: 1.1,
  shape: { legs: 1.0, girth: 1.04, head: 0.98, torso: 1.04 },
  belly: 0.3,
  skin: '#c89070',
  look: { torso: suit, sleeve: suit, cuff: '#f4f2ee', legs: suit, boot: '#0a0a0c', sole: '#16161a' },
  mats: { torso: 'cloth', sleeve: 'cloth', cuff: 'cloth', legs: 'cloth', boot: 'leather' },
  face: { eyeColor: '#2a1a10', brow: '#2a2a2a', mood: 1 },
  style: {
    attack: 'shove', heavy: 0.4, twist: 0,
    after(k, { clip, time, seed }) {
      if (clip === 'ko' || clip === 'hit' || clip === 'attack') return;
      const T = time + seed;
      // The sign held up in both hands, steady, turning to look for Mr. Smith.
      hold(k, 'armR', -1.7, 0, -0.1); hold(k, 'foreR', -0.5, 0, 0);
      hold(k, 'armL', -1.7, 0, 0.1); hold(k, 'foreL', -0.5, 0, 0);
      k.turn('head', 0.05, Math.sin(T * 0.8) * 0.5, 0);
    },
  },
  extras(s) {
    cap(s, { color: '#16161a', peak: '#0a0a0c', badge: '#e8c040' });
    s.part('kit', () => {
      // The bow tie and the shirt front.
      s.box([0, 0.47, 0.067], [0.026, 0.06, 0.012], 0.006, { color: '#f4f2ee', mat: 'cloth', bone: 'chest', k: 0.003 });
      for (const m of [1, -1]) s.ellipsoid([m * 0.015, 0.528, 0.074], [0.016, 0.01, 0.008], { color: '#d81c2a', mat: 'cloth', bone: 'chest', k: 0.003 });
      // The sign: a white board with SMITH in block capitals.
      s.box([0, 0.37, 0.19], [0.1, 0.07, 0.006], 0.004, { color: '#f4f2ee', mat: 'paper', bone: 'chest', k: 0.002, rot: [-0.15, 0, 0] });
      for (let i = 0; i < 5; i++) s.paint((p) => Math.max(Math.abs(p[0] - (-0.07 + i * 0.035)) - 0.011, Math.abs(p[1] - 0.37) - 0.03, p[2] - 0.188, 0.19 - p[2] - 0.012), '#101014', 0.002);
    });
  },
});
