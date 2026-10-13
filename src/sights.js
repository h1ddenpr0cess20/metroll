import { glow, kit, metal, seeded, std } from './dressing.js';

/**
 * The furniture of the places on the compilation (see decor.js, which these
 * join): the anvils, furnaces and oil drums of Birmingham's foundry.
 *
 * Each is built from plain shapes, standing on y = 0 over its footprint
 * (`w` by `d` tiles, centred on the origin) and, if it has a front, facing
 * +z. No canvas: they are built under node for the tests as well.
 */

/** Something for each tile of a footprint, along whichever way it is longer: f(group, i, n). */
function along(GFX, group, { w = 1, d = 1 }, f) {
  const n = Math.max(w, d);
  for (let i = 0; i < n; i++) {
    const g = new GFX.Group();
    const t = i - (n - 1) / 2;
    g.position.set(w >= d ? t : 0, 0, w >= d ? 0 : t);
    group.add(g);
    f(g, i, n);
  }
}

// ———————————————————————————————————————————————— Birmingham

/** An anvil on its stump: the block of oak, the iron on it, the horn, a hammer left on the face. */
function anvil(GFX, { rise = 0.9 }) {
  const group = new GFX.Group();
  const k = kit(GFX, group);
  const iron = metal(GFX, '#4a4e58', 0.45);
  const face = metal(GFX, '#9aa0aa', 0.25);
  const oak = std(GFX, '#6a4a2a', { roughness: 0.9 });
  const h = Math.min(rise, 0.9);
  k.cyl(0.3, 0.33, h * 0.5, oak, [0, h * 0.25, 0], { seg: 12 });
  k.box([0.3, 0.14, 0.24], iron, [0, h * 0.5 + 0.07, 0]);
  k.box([0.22, 0.12, 0.17], iron, [0, h * 0.5 + 0.2, 0]);
  k.box([0.5, 0.1, 0.26], face, [0, h * 0.5 + 0.31, 0]);
  k.cyl(0.0, 0.12, 0.26, face, [0.38, h * 0.5 + 0.31, 0], { rot: [0, 0, -Math.PI / 2], seg: 10 });
  k.box([0.2, 0.03, 0.04], std(GFX, '#3a2a1a', { roughness: 0.9 }), [-0.1, h * 0.5 + 0.375, 0.05], { rot: [0, 0.4, 0] });
  k.box([0.06, 0.06, 0.1], iron, [0.0, h * 0.5 + 0.385, 0.07], { rot: [0, 0.4, 0] });
  return { group };
}

/** A furnace: a brick block with a mouth in the front that glows, a chimney up the back, iron doors hanging open. */
function furnace(GFX, { w = 2, d = 2, rise = 1.3 }) {
  const group = new GFX.Group();
  const k = kit(GFX, group);
  const brick = std(GFX, '#7a3a28', { roughness: 0.95 });
  const iron = metal(GFX, '#2a2c32', 0.5);
  const fire = glow(GFX, '#ff7a1a');
  const W = Math.max(1.2, w * 0.92), D = Math.max(0.9, d * 0.8);
  k.box([W, rise, D], brick, [0, rise / 2, -0.06]);
  k.box([W * 0.52, rise * 0.5, 0.06], std(GFX, '#050404', { roughness: 1 }), [0, rise * 0.4, D / 2 - 0.05]);
  k.box([W * 0.46, rise * 0.34, 0.04], fire, [0, rise * 0.32, D / 2 - 0.02], { shadow: false });
  k.box([W * 0.6, 0.06, 0.1], iron, [0, rise * 0.68, D / 2 - 0.02]);
  for (const e of [-1, 1]) k.box([0.04, rise * 0.5, 0.2], iron, [e * W * 0.32, rise * 0.4, D / 2 + 0.06], { rot: [0, e * -0.9, 0] });
  k.box([0.4, 0.8, 0.4], brick, [0, rise + 0.4, -D / 2 + 0.2]);
  for (const y of [0.15, 0.4]) k.box([W + 0.04, 0.05, D + 0.04], iron, [0, y * rise, -0.06]);
  return { group };
}

/** A stack of oil drums, three on the floor and one on top, red and rusty, the odd one on its side. */
function oildrums(GFX, { w = 1, d = 1, ...spec }) {
  const group = new GFX.Group();
  const rnd = seeded(spec);
  const colours = ['#a8262a', '#2a5a8a', '#6a6a60', '#5a3a28'].map((c) => std(GFX, c, { roughness: 0.55, metalness: 0.4 }));
  const band = std(GFX, '#2a2a2e', { metalness: 0.7, roughness: 0.5 });
  along(GFX, group, { w, d }, (g, i) => {
    const bottom = [[-0.2, -0.18], [0.2, -0.12], [0.0, 0.2]];
    bottom.forEach(([x, z]) => {
      const m = colours[Math.floor(rnd() * colours.length)];
      const c = new GFX.Mesh(new GFX.CylinderGeometry(0.19, 0.19, 0.5, 14), m);
      c.position.set(x, 0.25, z);
      c.castShadow = c.receiveShadow = true;
      g.add(c);
      for (const y of [0.1, 0.4]) {
        const r = new GFX.Mesh(new GFX.TorusGeometry(0.19, 0.016, 5, 16), band);
        r.rotation.x = Math.PI / 2;
        r.position.set(x, y, z);
        g.add(r);
      }
    });
    if (i % 2 === 0) {
      const top = new GFX.Mesh(new GFX.CylinderGeometry(0.19, 0.19, 0.5, 14), colours[Math.floor(rnd() * colours.length)]);
      top.position.set(0.0, 0.75, -0.02);
      top.castShadow = true;
      g.add(top);
    }
  });
  return { group };
}

export const SIGHTS = { anvil, furnace, oildrums };

/** Of these, the ones with a front, which are turned to face the open floor beside them. */
export const SIGHTS_FACING = ['furnace'];
