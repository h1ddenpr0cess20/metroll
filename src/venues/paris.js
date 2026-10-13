import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, flat, loop, wallTile, wash } from './helpers.js';

/**
 * Stop 2: Paris. The city of light, and of mimes. Off the top of the hill
 * at Montmartre, down a long street of cafés and the pavement artists'
 * square, the easels out and the paint wet; down into the Métro, across the
 * flooded line on the last train; along the quay of the Seine with the
 * booksellers' stalls, a bateau-mouche out to the island where a snow globe
 * waits; through the gardens of the palace, where the fountains go up on
 * the beat; down the long gallery under the pianos they are moving up to
 * the flats over it (they keep coming down); and into the cabaret, where
 * the stage door is shut until the passport is found in the café. A
 * musette, the accordion out front, swinging.
 */

export const PARIS = {
  tiles: ['#c8bca4', '#b4a88e', '#5a7a9a', '#a4987e'],
  walls: ['#e8dcc0', '#d4c8aa', '#5a7a9a', '#c8bc9e'],
  ambient: [1.0, 0.96, 0.94], lamp: '#ffd8a0', trap: '#2a2a2e', lift: '#1a3a6a', exit: '#ffd23a', sticky: '#4a6a8a', zapHue: 0.6, vary: 0.06,
};

/** Paris at night: lamplight, the Seine's blue, a café's red awning, the tower's gold. */
const LUMIERE = ['#ffd890', '#5a8ad8', '#e8303a', '#ffc84a'];

export function paris() {
  const g = new Venue({
    name: 'Paris', act: 2, cols: 130, rows: 126, palette: PARIS, tempo: 132,
    intro: 'The city of light. And of mimes. Mostly of mimes.',
    look: {
      country: 'France', poster: '#1e4a9a', grade: 'dusk', theme: 'paris', floor: 'cobble', wall: 'haussmann', lamp: 'bulb', crusher: 'piano', lift: 'ferry', pyro: 'water', gate: 'border',
      hemi: ['#c8c4e8', '#3a3448', 1.1], key: '#ffe8d8', keyK: 1.05, lantern: '#ffe2b8',
      skyColors: ['#060818', '#0e1230', '#22244a', '#4a3a5a', '#7a5a62'], stars: true, skyline: '#0a0a14', horizon: 'city',
      reflect: LUMIERE, ceiling: '#1a1e30',
      rig: { colors: LUMIERE, program: 'static', every: 4 },
    },
  });
  const sign = (p, along, text, color = LUMIERE[3], size = 0.6, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const STREET = { floor: 'cobble', wall: 'haussmann' };

  // The top of the hill: the steps of the basilica, the whole city below.
  g.room(2, 4, 5, 5, 70, { lamps: 3, floor: 'cobble', wall: 'stucco' });
  g.start = { x: 4, z: 6 };
  g.light('klieg', 3, 8, { yaw: 0.9, sweep: 0.8, shift: 0 });
  const d = digger(g, { x: 7, z: 6, h: 70, heading: '+x' });
  const steps = d.hall(10, { floor: 'cobble', wall: 'stucco' });
  g.pick(...steps.tile(2, 0), 5).pick(...steps.tile(4, 0), 5).pick(...steps.tile(6, 1), 5);
  g.foe('tourist', ...steps.tile(7, -1), { range: 4 });
  sign(steps, 4, 'MONTMARTRE', LUMIERE[3], 0.45);
  d.turn('+z', { floor: 'cobble', wall: 'stucco' });
  d.hall(3, { floor: 'cobble', wall: 'stucco' });

  // The street of cafés: tables out on the pavement, the lamps lit, a waiter who will not serve you, and an artist.
  const street = d.room(20, 9, STREET);
  for (const k of [3, 9, 15]) g.light('streetlamp', ...street.tile(k, -street.back * 3), { height: 2.4 });
  g.bumper(...street.tile(6, -street.back * 3), { radius: 0.4, look: 'bollard' });
  g.bumper(...street.tile(13, -street.back * 3), { radius: 0.4, look: 'bollard' });
  for (const k of [2, 5, 12, 16]) g.pillar(...backTile(street, k), 0.8, { prop: 'cafe' });
  g.foe('waiter', ...street.tile(4, 0), { range: 6 }).foe('tourist', ...street.tile(10, 1), { range: 6 });
  g.foe('artist', ...street.tile(14, -1), { range: 6 }).foe('mime', ...street.tile(18, 1), { range: 5 });
  g.foe('poodle', ...street.tile(8, 0), { path: loop(street, 2, 2, 14) });
  g.pick(...street.tile(2, 2), 10).pick(...street.tile(8, -2), 10).pick(...street.tile(12, 3), 10).pick(...street.tile(16, 0), 10);
  sign(street, 5, 'CAFÉ', LUMIERE[2], 0.6);
  sign(street, 13, 'TABAC', '#ff5a3a', 0.55);
  // Through a painted shopfront (a film is being shot here, of course): an attic, and a snow globe on the sill.
  const fake = branch(d, street, 8, 'back', 5);
  const shop = fake.hall(5, { wall: 'flats', floor: 'planks' });
  flat(g, shop, 1, { look: 'brick' });
  const attic = fake.room(5, 5, { wall: 'wallpaper', floor: 'planks' });
  g.globe(...attic.tile(3, 0));
  g.pick(...attic.tile(1, -1), 10).pick(...attic.tile(1, 1), 10);
  d.turn('+x', STREET);

  // The Métro: down to the platform, and the flooded line, where the last train is the only way across.
  const platform = d.hall(5, { floor: 'checker', wall: 'block' });
  g.pick(...platform.tile(1, 0), 5).pick(...platform.tile(3, 0), 5);
  const flood = d.ferry(12, { size: 3, period: 8, style: 'bullet' });
  g.zap(...flood.rect(0, 12, flood.lo - 2, 7), d.h - 1.8, { fill: true });
  d.hall(2, { floor: 'checker', wall: 'block' });
  d.turn('+z', { floor: 'checker', wall: 'block' });
  d.stairs(3, 1.5, { wall: 'block' });

  // The quay: along the Seine, the booksellers' green boxes on the wall, a bateau-mouche out to the island.
  const quay = d.ledge(20, { width: 4, wallTex: 'stone', floor: 'cobble' });
  g.foe('cyclist', ...quay.tile(5, 0), { range: 4 }).foe('pigeon', ...quay.tile(12, 0), { path: [quay.tile(8, -1), quay.tile(17, -1)] });
  g.pick(...quay.tile(3, quay.back), 5).pick(...quay.tile(9, quay.back), 10).pick(...quay.tile(16, quay.back), 5);
  for (const k of [6, 13]) g.pillar(...backTile(quay, k), 0.9, { prop: 'bookstall' });
  sign(quay, 4, 'QUAI', '#7ad8ff', 0.5);
  g.light('marquee', ...wallTile(quay, 10.5), { text: 'BATEAUX', color: '#ffd890', size: 0.45, height: 1.6 });
  const isle = branch(d, quay, 11, 'front', 2);
  isle.ferry(9, { size: 3, period: 7, style: 'ferry' });
  const island = isle.room(5, 5, { floor: 'grass', wall: 'fence' });
  g.globe(...island.tile(2, 0));
  g.pick(...island.tile(3, -1), 10).pick(...island.tile(3, 1), 10);
  d.turn('+x', { wall: 'stone' });
  d.hall(3, { wall: 'stone', floor: 'cobble' });

  // The palace gardens: a terrace along the back, the fountains going up across the gravel on the beat.
  const garden = d.room(15, 11, { floor: 'dirt', wall: 'hedge' });
  g.block(...garden.rect(2, 11, garden.back * 5 - (garden.back > 0 ? 1 : 0), 2), 1.4, { prop: 'stands', sturdy: true });
  for (const [along, offset] of [[5, 0], [9, 0.5]]) {
    const [x, z, w, dd] = garden.rect(along, 1, garden.back > 0 ? garden.lo : garden.lo + 2, garden.width - 2);
    g.pyro(x, z, { w, d: dd, beats: 8, offset });
  }
  g.foe('mime', ...garden.tile(7, -2), { range: 3 });
  g.pick(...garden.tile(3, -2), 10).pick(...garden.tile(7, -3), 5).pick(...garden.tile(11, -2), 10);
  g.tape(...garden.tile(13, -3));
  wash(g, garden, ['#ffd890', '#5a8ad8'], { cans: 2, program: 'pulse', every: 2 });
  d.hall(3, { wall: 'haussmann', floor: 'cobble' });
  d.turn('+z', { wall: 'haussmann', floor: 'cobble' });

  // The long gallery: paintings down the walls, and the movers hauling pianos up to the flats over it. They slip.
  const gallery = d.hall(18, { width: 5, wall: 'damask', floor: 'marble' });
  g.drop(...across(gallery, 5, { beats: 8 }));
  g.drop(...across(gallery, 12, { beats: 8, offset: 0.5 }));
  g.block(...gallery.rect(8, 2, gallery.back * 2, 1), 0.8, { prop: 'easel' });
  g.foe('influencer', ...gallery.tile(16, -1), { range: 3 });
  g.pick(...gallery.tile(2, 0), 5).pick(...gallery.tile(7, -1), 5).pick(...gallery.tile(15, 1), 10);
  sign(gallery, 3, 'MUSÉE', LUMIERE[3], 0.6, 1.8);
  sign(gallery, 15, 'SORTIE', '#3ae88a', 0.5, 1.8);
  // The café off the gallery: the passport on a table, with a mime on his break.
  const lunch = branch(d, gallery, 9, 'front', 3);
  lunch.hall(3, { wall: 'haussmann' });
  const cafe = lunch.room(7, 9, { floor: 'checker', wall: 'wallpaper' });
  g.pass(...cafe.tile(4, 0));
  g.foe('mime', ...cafe.tile(2, 2), { range: 4 });
  g.block(...cafe.rect(5, 2, -3, 1), 0.85, { prop: 'craft' });
  g.pick(...cafe.tile(5, 3), 10).lighter(...cafe.tile(1, -3));
  g.light('festoon', ...cafe.tile(0, -4), { to: [6 * cafe.dir[0] + 8 * cafe.across[0], 6 * cafe.dir[1] + 8 * cafe.across[1]], colors: ['#ffd890', '#ff9a5a', '#fff4e0'], height: 2.2 });
  const door = d.hall(4, { wall: 'haussmann' });
  barred(g, door, 2);
  sign(door, 0.5, 'PASSEPORTS', '#ff5a3a', 0.4, 1.6);
  d.turn('+x', { wall: 'curtain' });
  d.hall(3, { wall: 'curtain', floor: 'planks' });

  // The cabaret: the red velvet, the little tables, the can-can over; the band's gear on stage.
  const cabaret = d.room(15, 13, { floor: 'planks', wall: 'curtain' });
  for (const b of [-4, 2]) g.block(...cabaret.rect(3, 4, b, 2), 0.7, { prop: 'cafe' });
  g.block(...cabaret.rect(9, 3, -4, 2), 1.0, { prop: 'piano' });
  g.foe('waiter', ...cabaret.tile(6, 0), { range: 5 }).foe('influencer', ...cabaret.tile(12, 3), { range: 5 });
  g.pick(...cabaret.tile(2, 0), 10).pick(...cabaret.tile(8, 5), 10).pick(...cabaret.tile(13, -1), 10);
  g.suitcase(...cabaret.tile(13, 5), 60);
  g.tape(...cabaret.tile(11, -5));
  wash(g, cabaret, ['#e8303a', '#ffd890'], { cans: 2, program: 'chase' });
  sign(cabaret, 7, 'CABARET', '#ff3a6a', 0.7, 1.9);
  // Behind the painted backdrop at the back of the stage: the last snow globe.
  const sky = branch(d, cabaret, 11, 'back', 6);
  const skyHall = sky.hall(6, { wall: 'flats' });
  flat(g, skyHall, 1, { breakAt: 6.5, look: 'backdrop' });
  const nook = sky.room(5, 5, { wall: 'flats' });
  g.globe(...nook.tile(3, 0));
  g.suitcase(...nook.tile(1, 1), 70);
  d.hall(3, { wall: 'curtain' });
  d.turn('+z', { wall: 'stucco' });
  d.ramp(6, 2.5, { wall: 'stucco' });
  const back = d.room(9, 9, STREET);
  g.foe('cyclist', ...back.tile(4, 0), { range: 4 });
  g.light('klieg', ...back.tile(7, back.back * 3), { yaw: 0.6, sweep: 0.9, shift: 2 });
  d.hall(2, STREET);
  d.exit(3);
  return g;
}
