import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, flat, wallTile, wash } from './helpers.js';

/**
 * Stop 3: Venice. A city with no roads, and a boulder. Down from the top
 * of the bell tower by its long ramp, the pigeons going round; across the
 * square under the fireworks of the festival, which go up off the barges
 * on the beat; along the Grand Canal's quay under the balconies, where the
 * window boxes of geraniums keep coming down, mooring poles to bounce off
 * and a snow globe at the end of a jetty; down into a palazzo for the
 * masked ball, a mask shop off it with the passport and a glassworks behind
 * a pane of glass; out through the barred water gate onto the landing, a
 * gondola across the lagoon, and Murano, where the last globe is in a
 * furnace room behind a fall of stone. A tarantella, mandolins in tremolo.
 */

export const VENICE = {
  tiles: ['#c8a888', '#b4947a', '#5aa0a8', '#a48a70'],
  walls: ['#d89870', '#c48460', '#5aa0a8', '#b87a58'],
  ambient: [1.0, 0.95, 0.92], lamp: '#ffc890', trap: '#1a3a40', lift: '#101014', exit: '#ffd23a', sticky: '#3a7a88', zapHue: 3.6, vary: 0.07,
};

/** Venice at dusk: lantern light, the lagoon's green, festival gold and a carnival red. */
const LAGOON = ['#ffc890', '#5ac8b8', '#ffd23a', '#e8304a'];

export function venice() {
  const g = new Venue({
    name: 'Venice', act: 3, cols: 136, rows: 140, palette: VENICE, tempo: 152,
    intro: 'A city with no roads. Rock is mostly road.',
    look: {
      country: 'Italy', poster: '#1a7a6a', grade: 'dusk', theme: 'venice', floor: 'terracotta', wall: 'stucco', lamp: 'bulb', crusher: 'flowerpot', lift: 'gondola', pyro: 'fireworks', gate: 'bars',
      hemi: ['#e8c8c0', '#3a2a30', 1.1], key: '#ffe0c8', keyK: 1.1, lantern: '#ffe0b0',
      skyColors: ['#0a0c22', '#1c1a3a', '#3a2a4a', '#7a4a52', '#c8784a'], stars: true, skyline: '#1a1218', horizon: 'sea',
      reflect: LAGOON, ceiling: '#1a2030',
      rig: { colors: LAGOON.slice(0, 2), program: 'static', every: 4 },
    },
  });
  const lantern = (p, along) => g.light('bulb', ...wallTile(p, along), { color: '#ffc070' });
  const sign = (p, along, text, color = LAGOON[2], size = 0.5, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const QUAY = { floor: 'terracotta', wall: 'stucco' };

  // The top of the bell tower.
  g.room(2, 4, 5, 5, 90, { lamps: 3, floor: 'terracotta', wall: 'fence' });
  g.start = { x: 4, z: 6 };
  const d = digger(g, { x: 7, z: 6, h: 90, heading: '+x' });
  const loft = d.hall(5, { floor: 'planks', wall: 'fence' });
  g.pick(...loft.tile(1, 0), 5).pick(...loft.tile(3, 0), 5);
  // Down the tower's ramp: a long way, the pigeons going round.
  const tower = d.stairs(10, 5, { floor: 'terracotta', wall: 'fence' });
  g.foe('pigeon', ...tower.tile(5, 0), { path: [tower.tile(1, 0), tower.tile(9, 0)] });
  g.pick(...tower.tile(3, 0), 5).pick(...tower.tile(6, 0), 5).pick(...tower.tile(9, 0), 10);
  d.hall(2, QUAY);
  d.turn('+z', QUAY);
  d.hall(2, QUAY);

  // The square: café tables, a pizza chef, the festival's fireworks going up across it off the barges.
  const square = d.room(13, 11, { floor: 'marble', wall: 'stucco' });
  g.pillar(...square.tile(3, 0), 1.2, { prop: 'well' });
  for (const k of [2, 6, 10]) g.pillar(...backTile(square, k), 0.8, { prop: 'cafe' });
  g.pyro(...across(square, 7, { beats: 4 }));
  g.foe('pizzaiolo', ...square.tile(5, 2), { range: 5 }).foe('tourist', ...square.tile(10, -2), { range: 4 });
  g.pick(...square.tile(1, -3), 10).pick(...square.tile(5, -4), 10).pick(...square.tile(11, 3), 10);
  g.tape(...square.tile(11, -4));
  for (const k of [4, 9]) lantern(square, k);
  sign(square, 6.5, 'SAN MARCO', LAGOON[2], 0.5, 1.7);
  d.hall(2, QUAY);
  d.turn('+x', QUAY);
  d.hall(2, QUAY);

  // The Grand Canal's quay: mooring poles, geraniums coming down off the balconies, a gondolier and his song.
  const canal = d.hall(22, { width: 7, ...QUAY });
  for (const k of [2, 6, 10, 14, 18]) g.pillar(...backTile(canal, k), 0.8, { prop: 'planter' });
  g.drop(...across(canal, 8, { beats: 4 }));
  g.drop(...across(canal, 15, { beats: 4, offset: 0.5 }));
  for (const [a, b] of [[4, 1], [12, -1], [19, 2]]) g.bumper(...canal.tile(a, b), { radius: 0.42, look: 'pole' });
  g.foe('gondolier', ...canal.tile(5, -1), { range: 4 }).foe('nonna', ...canal.tile(17, 0), { range: 3 });
  g.foe('pigeon', ...canal.tile(11, 0), { path: [canal.tile(3, 2), canal.tile(20, 2)] });
  g.pick(...canal.tile(2, 0), 10).pick(...canal.tile(10, 1), 5).pick(...canal.tile(13, -2), 5).pick(...canal.tile(21, 0), 10);
  g.suitcase(...canal.tile(21, -2), 50);
  for (const k of [4, 12, 20]) lantern(canal, k);
  g.light('festoon', ...canal.tile(1, -3), { to: [20 * canal.dir[0] + 6 * canal.across[0], 20 * canal.dir[1] + 6 * canal.across[1]], colors: [LAGOON[0], LAGOON[3]], height: 2.6 });
  // Off the quay, along a jetty, out over the water: the first snow globe, at the very end.
  const jettyRoot = branch(d, canal, 6, 'front', 4);
  const jetty = jettyRoot.bridge(8, { floor: 'planks' });
  g.foe('pigeon', ...jetty.tile(4, 0), { path: [jetty.tile(1, 0), jetty.tile(6, 0)] });
  const end = jettyRoot.room(3, 3, { floor: 'planks', wall: 'fence' });
  g.globe(...end.tile(1, 0));
  d.hall(2, QUAY);
  d.turn('+z', QUAY);
  // Down the water steps into the palazzo.
  d.stairs(4, 2, { wall: 'stucco' });
  d.hall(2, { floor: 'marble', wall: 'damask' });

  // The masked ball: candelabra, a crowd in masks, and somebody's grandmother who has had enough of the lot of them.
  const ball = d.room(17, 13, { floor: 'marble', wall: 'damask' });
  for (const [a, b] of [[2, -5], [2, 5], [7, -5], [12, 5], [15, -5]]) g.pillar(...ball.tile(a, b), 0.8, { prop: 'candelabra' });
  for (const k of [4, 10]) g.pillar(...backTile(ball, k), 1.0, { prop: 'cafe' });
  g.foe('reveler', ...ball.tile(5, 1), { range: 5 }).foe('reveler', ...ball.tile(12, -2), { range: 5 });
  g.pick(...ball.tile(3, 0), 10).pick(...ball.tile(9, 3), 10).pick(...ball.tile(14, 0), 10);
  g.lighter(...ball.tile(16, 4));
  wash(g, ball, [LAGOON[3], LAGOON[2]], { cans: 2, program: 'static' });
  for (const [a, b] of [[5, 0], [11, 0]]) g.light('chandelier', ...ball.tile(a, b), { height: 3.0, radius: 3 });
  // The mask shop, off the ballroom: the passport on the counter.
  const aft = branch(d, ball, 4, 'front', 7);
  aft.hall(3, { floor: 'marble', wall: 'damask' });
  const shop = aft.room(7, 7, { floor: 'carpet', wall: 'wallpaper' });
  g.pass(...shop.tile(4, 0));
  g.block(...shop.rect(5, 1, 2, 2), 0.8, { prop: 'desk' });
  g.foe('reveler', ...shop.tile(2, -2), { range: 3 });
  g.tape(...shop.tile(6, -2));
  // Behind a pane of the glassworks' window, at the back of the ballroom: the second snow globe.
  const works = branch(d, ball, 13, 'back', 7);
  const pane = works.hall(5, { floor: 'marble', wall: 'stucco' });
  flat(g, pane, 3, { look: 'glass' });
  const store = works.room(5, 5, { floor: 'terracotta', wall: 'stucco' });
  g.globe(...store.tile(3, 0));
  g.pillar(...store.tile(3, 2), 0.7, { prop: 'amphora' });
  g.suitcase(...store.tile(1, -1), 60);
  const water = d.hall(4, { floor: 'marble', wall: 'stucco' });
  barred(g, water, 2, 'bars');
  d.turn('+x', { floor: 'planks', wall: 'fence' });

  // The landing, and a gondola across the lagoon.
  const landing = d.hall(4, { floor: 'planks', wall: 'fence' });
  g.foe('gondolier', ...landing.tile(2, 0), { range: 3 });
  d.ferry(12, { size: 3, period: 7 });

  // Murano: the glassmakers' island, a yard of amphorae to bounce off, and the last globe behind a fall of stone.
  const isle = d.room(15, 13, { floor: 'terracotta', wall: 'stucco' });
  for (const [a, b] of [[3, -4], [11, 4], [12, -4]]) g.bumper(...isle.tile(a, b), { radius: 0.45, look: 'amphora' });
  g.foe('pizzaiolo', ...isle.tile(6, 2), { range: 5 }).foe('pigeon', ...isle.tile(8, 0), { path: [isle.tile(3, -3), isle.tile(13, -3), isle.tile(13, 3), isle.tile(3, 3)] });
  g.pick(...isle.tile(2, 0), 10).pick(...isle.tile(8, -4), 10).pick(...isle.tile(14, 2), 10);
  wash(g, isle, [LAGOON[1], LAGOON[0]], { cans: 2, program: 'static' });
  sign(isle, 4, 'MURANO', LAGOON[1], 0.5, 1.7);
  const furnace = branch(d, isle, 9, 'back', 7);
  const fall = furnace.hall(5, { floor: 'terracotta', wall: 'stone' });
  flat(g, fall, 3, { look: 'stone' });
  const hoard = furnace.room(5, 5, { floor: 'terracotta', wall: 'stone' });
  g.globe(...hoard.tile(3, 0));
  g.pillar(...hoard.tile(3, 2), 0.7, { prop: 'amphora' });
  d.hall(3, { floor: 'terracotta', wall: 'stucco' });
  d.exit(3);
  return g;
}
