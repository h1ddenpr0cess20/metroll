import { cloth, person } from './person.js';
import { bandana, beard } from './wardrobe.js';

/**
 * The Roadie: huge, bald under a bandana, a black T-shirt that has done
 * four hundred shows, shorts with a tool pouch, a keyring on the belt and
 * a flight case on his shoulder. Carries everything. Resents everything. About
 * 1.1 tiles tall.
 */

export default person({
  name: 'roadie',
  scale: 1.7,
  b: 1.5,
  shape: { legs: 0.94, girth: 1.28, hips: 1.1, head: 0.92, torso: 1.06 },
  belly: 1.3,
  skin: '#c89070',
  look: { torso: cloth('#16161a', '#0c0c10'), sleeve: '#c89070', cuff: '#c89070', legs: cloth('#3a3e34', '#262a22'), boot: '#2a1c12', sole: '#16161a', belt: '#101012', buckle: '#c8ccd4' },
  mats: { torso: 'cloth', sleeve: 'skin', cuff: 'skin', legs: 'cloth', boot: 'leather' },
  face: { eyeColor: '#2a1a10', brow: '#2a1c12', mood: 1, jaw: 1.2 },
  style: {
    attack: 'smite', heavy: 1, twist: 0,
    after(k, { clip, time, seed }) {
      if (clip !== 'idle' && clip !== 'walk') return;
      const T = time + seed;
      // One arm up, steadying the case on his shoulder; the other swinging free.
      k.turn('armR', -2.2, 0, -0.3); k.turn('foreR', -1.2, 0, 0);
      k.turn('head', 0.05, Math.sin(T * 0.5) * 0.2, -0.08);
    },
  },
  extras(s) {
    bandana(s, { color: '#d81c2a' });
    beard(s, { color: '#2a1c12', long: 0.3 });
    s.part('kit', () => {
      // The case on the right shoulder: black, steel-cornered, a butterfly latch.
      s.box([-0.17, 0.585, 0.0], [0.06, 0.055, 0.14], 0.01, { color: '#16161a', mat: 'plastic', bone: 'chest', k: 0.004, rot: [0, 0, 0.12] });
      for (const z of [-0.13, 0.13]) for (const x of [-0.225, -0.115]) s.sphere([x, 0.635, z], 0.014, { color: '#c8ccd4', mat: 'metal', bone: 'chest', k: 0.002 });
      s.box([-0.17, 0.585, 0.143], [0.016, 0.016, 0.006], 0.003, { color: '#c8ccd4', mat: 'metal', bone: 'chest', k: 0.001 });
      // The tool pouch and the keys.
      s.box([0.088, 0.3, 0.02], [0.022, 0.034, 0.03], 0.008, { color: '#3a2a18', mat: 'leather', bone: 'hips', k: 0.004 });
      s.torus([-0.085, 0.31, 0.03], 0.016, 0.003, { color: '#c8ccd4', mat: 'metal', bone: 'hips', k: 0.001, rot: [Math.PI / 2, 0, 0] });
    });
  },
});
