import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, flat, wallTile, wash } from './helpers.js';

/**
 * Stop 5: Spain. A fiesta, and a boulder at it. Down off the hill of the
 * old town through the orange trees; along the street where they run the
 * bulls in the morning and throw the tomatoes in the afternoon (it is red,
 * and it sticks), a snow globe in a bodega behind its barrels; into the
 * tablao, where the flamenco goes on all night and the mirror at the end of
 * the bar comes away; out through the courtyard of tiles, the tourist office
 * with the passport off it, and the stables with a bull who should not be
 * in them; through the bull pen's gate, down into the old cellars under the
 * church, the bells coming down on the beat and the fireworks of the fiesta
 * going up; on a raft across the river at the foot of the gorge at Ronda;
 * and into the bullring itself, the last globe out along a plank over the
 * pit. A rumba, rasgueado and palmas, and the trumpet calling.
 */

export const SPAIN = {
  tiles: ['#d8a878', '#c4946a', '#c8202a', '#b88a60'],
  walls: ['#f2e6cc', '#e2d4b4', '#c8202a', '#d6c6a4'],
  ambient: [1.05, 0.95, 0.85], lamp: '#ffc070', trap: '#3a2018', lift: '#7a5a38', exit: '#ffd23a', sticky: '#b82020', zapHue: 0.3, vary: 0.07,
};

/** A fiesta's night: lanterns, the flag's red and gold, a sunset's orange. */
const FIESTA = ['#ffc070', '#e8202a', '#ffd23a', '#ff8a3a'];

export function spain() {
  const g = new Venue({
    name: 'Spain', act: 5, cols: 130, rows: 130, palette: SPAIN, tempo: 112,
    intro: 'They run the bulls in the morning. In the evening, they run the boulder.',
    look: {
      country: 'Spain', poster: '#e8642a', grade: 'warm', theme: 'spain', floor: 'terracotta', wall: 'stucco', lamp: 'bulb', crusher: 'bell', lift: 'raft', pyro: 'fireworks', gate: 'bars',
      hemi: ['#ffd8b8', '#5a3028', 1.1], key: '#ffe8c8', keyK: 1.1, lantern: '#ffd8a8',
      skyColors: ['#0c0820', '#2a1438', '#6a2a3a', '#c8502a', '#f0a040'], stars: true, skyline: '#1a0c0c', horizon: 'hills',
      reflect: FIESTA, ceiling: '#3a2418',
      rig: { colors: FIESTA, program: 'static', every: 4 },
    },
  });
  const sign = (p, along, text, color = FIESTA[2], size = 0.55, height = 1.6) => g.light('marquee', ...wallTile(p, along), { text, color, height, size });
  const lantern = (p, along) => g.light('bulb', ...wallTile(p, along), { color: '#ffb860' });
  const TOWN = { floor: 'terracotta', wall: 'stucco' };

  // The top of the old town: orange trees in tubs, a fountain, the roofs below.
  g.room(2, 4, 5, 5, 76, { lamps: 3, floor: 'terracotta', wall: 'stucco' });
  g.start = { x: 4, z: 6 };
  const d = digger(g, { x: 7, z: 6, h: 76, heading: '+x' });
  const hill = d.hall(10, { width: 5, floor: 'terracotta', wall: 'stucco' });
  for (const k of [2, 5, 8]) g.pillar(...backTile(hill, k), 1.2, { prop: 'orange' });
  g.bumper(...hill.tile(4, 1), { radius: 0.45, look: 'amphora' });
  g.pick(...hill.tile(1, 0), 5).pick(...hill.tile(3, -1), 5).pick(...hill.tile(6, 0), 5).pick(...hill.tile(9, 1), 10);
  g.foe('runner', ...hill.tile(7, 1), { range: 4 });
  d.turn('+z', { width: 5, ...TOWN });
  d.ramp(6, 3, { width: 5, ...TOWN });

  // The street of the bull run: barricades, barrels, the tomatoes all over everything, the runners and a bull.
  const street = d.room(22, 11, { floor: 'cobble', wall: 'stucco' });
  g.sticky(...street.rect(6, 9, -2, 5));
  for (const k of [3, 11, 18]) g.pillar(...backTile(street, k), 0.7, { prop: 'planter' });
  for (const [a, b] of [[4, 2], [14, -3], [19, 3]]) g.bumper(...street.tile(a, b), { radius: 0.42, look: 'barrel' });
  g.foe('runner', ...street.tile(5, -3), { range: 6 }).foe('runner', ...street.tile(16, 3), { range: 6 });
  g.foe('bull', ...street.tile(10, 0), { range: 6 });
  g.pick(...street.tile(2, 0), 10).pick(...street.tile(8, 4), 10).pick(...street.tile(12, -4), 10).pick(...street.tile(20, 0), 10);
  for (const k of [6, 14]) lantern(street, k);
  g.light('festoon', ...street.tile(2, -5), { to: [17 * street.dir[0] + 10 * street.across[0], 17 * street.dir[1] + 10 * street.across[1]], colors: FIESTA, height: 2.4 });
  sign(street, 9, 'FIESTA', FIESTA[1], 0.5);
  sign(street, 17, 'BODEGA', FIESTA[2], 0.5);
  // Behind the bodega's wall of barrels: the first snow globe.
  const bodega = branch(d, street, 20, 'back', 6);
  const cellar = bodega.hall(5, { floor: 'planks', wall: 'stone' });
  flat(g, cellar, 1, { look: 'wood' });
  const vault = bodega.room(5, 5, { floor: 'planks', wall: 'stone' });
  g.demo(...vault.tile(3, 0));
  g.pick(...vault.tile(1, -1), 10).pick(...vault.tile(1, 1), 10);
  d.hall(5, TOWN);
  d.turn('+x', { floor: 'planks', wall: 'azulejo' });
  d.hall(3, { floor: 'planks', wall: 'azulejo' });

  // The tablao: the bar down the back, the little stage, the guitars, and the dancers who do not stop.
  const tablao = d.room(15, 11, { floor: 'planks', wall: 'azulejo' });
  g.block(...tablao.rect(3, 8, tablao.back * 5, 1), 0.9, { prop: 'bar' });
  g.block(...tablao.rect(2, 2, -tablao.back * 4, 1), 0.8, { prop: 'piano' });
  for (const [a, b] of [[5, 1], [8, 3], [10, -1]]) g.pillar(...tablao.tile(a, b), 0.62, { prop: 'table' });
  g.foe('flamenco', ...tablao.tile(5, -2), { range: 5 }).foe('flamenco', ...tablao.tile(10, 2), { range: 5 });
  g.foe('matador', ...tablao.tile(13, -1), { range: 5 });
  g.pick(...tablao.tile(2, -3), 10).pick(...tablao.tile(9, -3), 10).pick(...tablao.tile(13, 4), 10);
  g.whetstone(...tablao.tile(14, 3));
  sign(tablao, 7, 'TABLAO', '#ffd890', 0.6);
  wash(g, tablao, ['#ff8a3a', '#e8202a'], { cans: 2, program: 'static' });
  // Through the mirror at the end of the bar: the dressing room, and a snow globe.
  const back = branch(d, tablao, 12, 'back', 6);
  const mirror = back.hall(5, { floor: 'planks', wall: 'azulejo' });
  flat(g, mirror, 3, { look: 'glass', breakAt: 6 });
  const den = back.room(5, 5, { floor: 'planks', wall: 'stucco' });
  g.demo(...den.tile(3, 0));
  g.pick(...den.tile(1, -1), 10).pick(...den.tile(1, 1), 10);
  d.hall(3, { floor: 'planks', wall: 'azulejo' });
  d.turn('+z', TOWN);

  // The courtyard: tiles and a fountain; the tourist office off it (the passport), and the stables (a bull, who got out).
  const patio = d.hall(14, { width: 5, floor: 'terracotta', wall: 'azulejo' });
  g.foe('matador', ...patio.tile(10, 0), { range: 4 });
  g.pick(...patio.tile(3, 0), 5).pick(...patio.tile(6, 1), 5).pick(...patio.tile(12, -1), 10);
  const office = branch(d, patio, 4, 'front', 3);
  office.hall(3, TOWN);
  const tourism = office.room(7, 7, { floor: 'terracotta', wall: 'stucco' });
  g.pass(...tourism.tile(4, 0));
  g.block(...tourism.rect(5, 1, -2, 2), 0.8, { prop: 'desk' });
  g.foe('tourist', ...tourism.tile(2, 2), { range: 4 });
  g.lighter(...tourism.tile(5, 2));
  sign(tourism, 3.5, 'TURISMO', FIESTA[2], 0.45);
  const stables = branch(d, patio, 11, 'back', 3);
  stables.hall(2, { floor: 'dirt', wall: 'stucco' });
  const barn = stables.room(7, 7, { floor: 'dirt', wall: 'stucco' });
  g.sticky(...barn.rect(1, 5, -2, 5));
  for (const [a, b] of [[1, -3], [6, 3]]) g.pillar(...barn.tile(a, b), 0.7, { prop: 'bale' });
  g.foe('bull', ...barn.tile(4, 0), { range: 4 });
  g.vinyl(...barn.tile(6, -3), 60);
  const pen = d.hall(5, { floor: 'dirt', wall: 'stone' });
  barred(g, pen, 2);
  sign(pen, 4, 'TORIL', '#ff9a4a', 0.5);
  d.turn('+x', { floor: 'dirt', wall: 'stone' });
  d.chute(8, 3, { floor: 'dirt' });

  // Under the church: the cellars, the bells coming down through the floor above on the beat, and the fiesta's fireworks.
  const crypt = d.hall(16, { width: 5, floor: 'cobble', wall: 'stone' });
  g.drop(...across(crypt, 4, { beats: 6 }));
  g.pyro(...across(crypt, 9, { beats: 6, offset: 0.25 }));
  g.drop(...across(crypt, 13, { beats: 6, offset: 0.5 }));
  g.foe('runner', ...crypt.tile(7, 1), { range: 3 });
  g.pick(...crypt.tile(2, 0), 5).pick(...crypt.tile(6, -1), 5).pick(...crypt.tile(11, 1), 5).pick(...crypt.tile(15, 0), 10);
  for (const k of [2, 7, 11]) lantern(crypt, k);
  d.hall(2, { floor: 'cobble', wall: 'stone' });
  // The gorge at Ronda: the river at the bottom of it, a raft across, the old bridge high overhead.
  const gorge = d.ferry(10, { size: 3, period: 7 });
  g.zap(...gorge.rect(0, 10, gorge.lo - 2, 7), d.h - 1.8, { fill: true });
  const landing = d.hall(3, { floor: 'dirt', wall: 'stone' });
  g.whetstone(...landing.tile(1, 1));
  d.turn('+z', { floor: 'dirt', wall: 'stone' });
  d.stairs(3, 1.5, { wall: 'stone' });

  // The bullring: sand, the fireworks across it once more, a matador and a bull; out over the pit on a plank, the last globe.
  const ring = d.room(13, 11, { floor: 'sand', wall: 'stucco' });
  g.pyro(...across(ring, 9, { beats: 6 }));
  g.foe('bull', ...ring.tile(5, 2), { range: 5 }).foe('matador', ...ring.tile(11, -2), { range: 4 });
  g.pick(...ring.tile(3, -3), 10).pick(...ring.tile(6, 4), 10).pick(...ring.tile(12, 3), 10);
  wash(g, ring, ['#ffb860', '#e8202a'], { cans: 2, program: 'pulse', every: 2 });
  const pit = branch(d, ring, 4, 'front', 6);
  const plank = pit.bridge(7, { floor: 'planks' });
  g.zap(...plank.rect(0, 7, plank.lo - 2, 5), pit.h - 1.8, { fill: true });
  g.foe('runner', ...plank.tile(3, 0), { path: [plank.tile(1, 0), plank.tile(5, 0)] });
  const box = pit.room(5, 5, { floor: 'sand', wall: 'stucco' });
  g.demo(...box.tile(2, 0));
  g.vinyl(...box.tile(3, 1), 70);
  d.hall(3, { floor: 'sand', wall: 'stucco' });
  d.ramp(5, 2, { wall: 'stucco' });
  // Out into the plaza, where the stage is.
  const out = d.room(7, 7, { floor: 'terracotta', wall: 'stucco' });
  g.bumper(...out.tile(3, 2), { radius: 0.45, look: 'amphora' });
  g.light('festoon', ...out.tile(0, -3), { to: [6 * out.dir[0] + 6 * out.across[0], 6 * out.dir[1] + 6 * out.across[1]], colors: FIESTA, height: 2.2 });
  d.hall(2, TOWN);
  d.exit(3);
  return g;
}
