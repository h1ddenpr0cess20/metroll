import { coat } from '../skins.js';

/**
 * Rock. The original: the boulder who rolled through ten venues of a
 * tour, then ten more on a Hollywood lot, then round the world, smashing the
 * annoying people at every one of them, and who is, it turns out, a little
 * put out to find somebody has made a spiked version and given it the
 * record. Faceted granite as ever, with the pale feldspar and the dark mica
 * in it; but it has taken to wearing wraparound shades, a red headband and
 * an expression that is not an expression, because it is a rock. Rolls
 * on the beat, then sits there. Has been here since 1971. A boss: about
 * 2.6 tiles across.
 */

const GRANITE = coat({ over: '#9a9288', under: '#5a544c', vary: 0.3, freq: 9, grain: 0.22, gfreq: 70 });
const DARK = coat({ over: '#5a544c', under: '#3a352f', vary: 0.3, freq: 12, grain: 0.2, gfreq: 70, seed: 3 });

export default {
  name: 'rock',
  scale: 2.6,
  cell: 0.0085,
  cells: { kit: 0.004, fine: 0.0025 },
  budget: 16000,
  bones: [
    ['root', null, [0, 0, 0]],
    ['body', 'root', [0, 0.36, 0]],
    ['face', 'root', [0, 0.42, 0.3]],
  ],
  materials: {
    stone: { roughness: 0.92, metalness: 0.05 },
    glass: { roughness: 0.04, clearcoat: 1, metalness: 0.2 },
    cloth: { roughness: 0.85 },
    metal: { roughness: 0.3, metalness: 1 },
  },
  sculpt(s) {
    const S = { color: GRANITE, mat: 'stone', bone: 'body', k: 0.06, bump: [0.014, 20] };
    // The boulder: a big lump, a handful of smaller lumps stuck onto it, and a flat-ish bottom.
    s.ellipsoid([0, 0.36, 0], [0.36, 0.33, 0.35], S);
    s.ellipsoid([0.2, 0.46, 0.08], [0.17, 0.15, 0.16], { ...S, color: DARK });
    s.ellipsoid([-0.22, 0.4, -0.06], [0.17, 0.18, 0.18], S);
    s.ellipsoid([0.04, 0.58, -0.1], [0.18, 0.12, 0.17], S);
    s.ellipsoid([-0.1, 0.2, 0.22], [0.16, 0.15, 0.14], { ...S, color: DARK });
    s.ellipsoid([0.14, 0.18, -0.2], [0.15, 0.15, 0.15], S);
    s.part('kit', () => {
      // The shades: a black bar of lens across the face, a bridge, and arms going back.
      const L = { color: '#08080c', mat: 'glass', bone: 'face', k: 0.006 };
      for (const m of [1, -1]) s.box([m * 0.095, 0.43, 0.322], [0.075, 0.042, 0.012], 0.014, L);
      s.box([0, 0.44, 0.328], [0.03, 0.008, 0.008], 0.003, { color: '#16161a', mat: 'metal', bone: 'face', k: 0.002 });
      for (const m of [1, -1]) s.limb([m * 0.17, 0.44, 0.31], [m * 0.32, 0.44, 0.17], 0.008, 0.008, { color: '#16161a', mat: 'metal', bone: 'face', k: 0.002 });
      // The headband round the top of it: red, a knot at the back.
      s.torus([0, 0.52, 0.0], 0.325, 0.024, { color: '#e8202a', mat: 'cloth', bone: 'face', k: 0.008, rot: [0.18, 0, 0] });
      s.flake([0, 0.5, -0.32], [0.09, 0.4, -0.44], [0, 0, 1], 0.025, 0.03, 0.3, { color: '#e8202a', mat: 'cloth', bone: 'face', k: 0.004 });
      s.flake([0, 0.5, -0.32], [-0.09, 0.4, -0.44], [0, 0, 1], 0.025, 0.03, 0.3, { color: '#e8202a', mat: 'cloth', bone: 'face', k: 0.004 });
    });
    s.part('fine', () => {
      // A glint on each lens.
      for (const m of [1, -1]) s.box([m * 0.095 + 0.03, 0.44, 0.335], [0.016, 0.008, 0.003], 0.001, { color: '#ffffff', mat: 'glass', bone: 'face', k: 0 });
    });
  },
  animate(k, { clip, t = 0, time, seed = 0 }) {
    const T = time + seed;
    if (clip === 'ko') {
      // Rolled over onto the side and sat there, shades on, not impressed.
      const f = Math.min(1, t / 0.6);
      k.turn('body', 0, 0, 1.3 * f);
      k.turn('root', 0, 0, 0.5 * f);
      k.move('root', 0, -0.03 * f, 0);
      return;
    }
    if (clip === 'attack') {
      // Winds up, squashed down and back, then springs up and forward.
      const u = Math.min(1, t / 0.7), wind = u < 0.5 ? u * 2 : 1 - (u - 0.5) * 2;
      k.scale('body', 1 + wind * 0.15, 1 - wind * 0.3, 1 + wind * 0.15);
      k.turn('body', -wind * 0.5, 0, 0);
      k.turn('face', -wind * 0.2, 0, 0);
      return;
    }
    if (clip === 'hit') {
      k.scale('body', 1.12, 0.82, 1.12);
      k.turn('face', 0.2, 0, 0);
      return;
    }
    if (clip === 'walk') {
      // Rolling: the stone turns over and over; the shades stay level; a bounce with every roll.
      const r = T * 4.5;
      k.turn('body', r, 0, 0);
      k.move('root', 0, Math.abs(Math.sin(r * 0.5)) * 0.04, 0);
      return;
    }
    // Sitting there: breathing in and out like a rock, and the shades slowly sliding down its nose.
    k.scale('body', 1, 1 + Math.sin(T * 1.2) * 0.012, 1);
    k.turn('face', 0.03 + Math.sin(T * 0.4) * 0.03, 0, 0);
  },
};
