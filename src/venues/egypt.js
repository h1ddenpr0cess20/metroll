import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, centre, flat, loop, toBack, wallTile, wash } from './helpers.js';

/**
 * Stop 6: Egypt. The show is at the foot of the pyramids, and the sand is
 * blowing. In off the street into the bazaar, the stalls in rows and a
 * seller at every one of them (a snow globe in a jeweller's back room,
 * behind the cloth); down to the river, and across the Nile on a felucca;
 * along the road through the old quarry, the blocks coming down off the
 * cliff on the beat as they did for the builders; the archaeologists' tent,
 * the passport left on their table and a globe behind a wall of crates;
 * over the dunes, where the sand gives way and the Mummy is out; through
 * the gate into the pyramid, and down to the king's chamber, the traps
 * spouting sand on the beat, and across the pit to the treasury, where the
 * last globe is. The darbuka's maqsum, strings, an oud.
 */

export const EGYPT = {
  tiles: ['#e0c088', '#d0ae74', '#3a8ab0', '#c4a068'],
  walls: ['#d8b880', '#c8a46a', '#3a8ab0', '#b8925a'],
  ambient: [1.08, 0.98, 0.86], lamp: '#ffc070', trap: '#3a2a18', lift: '#e8dcc0', exit: '#ffd23a', sticky: '#c8a060', zapHue: 0.15, vary: 0.07,
};

/** Egypt at dusk: lamplight, the Nile's blue, the gold of the tombs, the desert's orange. */
const DESERT = ['#ffc070', '#3ab0d8', '#ffd23a', '#ff8a3a'];

export function egypt() {
  const g = new Venue({
    name: 'Egypt', act: 6, cols: 120, rows: 130, palette: EGYPT, tempo: 108,
    intro: 'Four and a half thousand years old, and they still have not seen anything like Rock.',
    look: {
      country: 'Egypt', poster: '#d8a030', grade: 'warm', weather: 'sand', theme: 'egypt', floor: 'sand', wall: 'sandstone', lamp: 'bulb', crusher: 'block', lift: 'felucca', pyro: 'sand', gate: 'bars',
      hemi: ['#ffe8c8', '#6a4a28', 1.15], key: '#ffe8c8', keyK: 1.15, lantern: '#ffd8a8',
      skyColors: ['#1a1030', '#3a2040', '#8a4a3a', '#d8803a', '#f0c060'], stars: true, skyline: '#3a2414', horizon: 'dunes',
      reflect: DESERT, ceiling: '#3a2a18',
      rig: { colors: DESERT, program: 'static', every: 4 },
    },
  });
  const sign = (p, along, text, color = DESERT[2], size = 0.55, height = 1.6) => g.light('marquee', ...wallTile(p, along), { text, color, height, size });
  const torch = (p, along) => g.light('bulb', ...wallTile(p, along), { color: '#ffb070' });
  const TOMB = { floor: 'cobble', wall: 'sandstone' };

  // The street into the bazaar.
  g.room(2, 4, 5, 5, 84, { lamps: 3, floor: 'cobble', wall: 'stucco' });
  g.start = { x: 4, z: 6 };
  const d = digger(g, { x: 7, z: 6, h: 84, heading: '+x' });
  const lane = d.hall(6, { floor: 'cobble', wall: 'stucco' });
  g.pick(...lane.tile(1, 0), 5).pick(...lane.tile(3, 0), 5).pick(...lane.tile(5, 0), 5);
  d.turn('+z', { floor: 'cobble', wall: 'stucco' });
  d.hall(2, { floor: 'cobble', wall: 'stucco' });

  // The bazaar: stalls in rows, a seller at every one, lanterns strung over it all, and the scarabs underfoot.
  const bazaar = d.room(17, 13, { floor: 'cobble', wall: 'stucco' });
  for (const [a, b] of [[3, -4], [3, -1], [3, 2], [8, -3], [8, 1], [8, 4], [13, -4], [13, 0], [13, 3]]) g.pillar(...bazaar.tile(a, b), 0.9, { prop: 'stall' });
  g.foe('hawker', ...bazaar.tile(5, 2), { range: 6 }).foe('hawker', ...bazaar.tile(10, -2), { range: 6 }).foe('tourist', ...bazaar.tile(15, 4), { range: 5 });
  g.foe('scarab', ...bazaar.tile(9, 0), { path: loop(bazaar, 1) });
  g.pick(...bazaar.tile(1, 0), 10).pick(...bazaar.tile(6, -5), 10).pick(...bazaar.tile(11, 5), 10).pick(...bazaar.tile(16, -2), 10);
  g.light('festoon', ...bazaar.tile(0, -6), { to: [16 * bazaar.dir[0] + 12 * bazaar.across[0], 16 * bazaar.dir[1] + 12 * bazaar.across[1]], colors: DESERT, height: 2.6 });
  g.light('par', ...wallTile(bazaar, 8), { colors: [DESERT[0]], program: 'static', glow: 0.6, reach: 7, aim: toBack(bazaar).map((v) => -4 * v), height: 1.4 });
  sign(bazaar, 4, 'BAZAAR', DESERT[2], 0.5);
  // A jeweller's back room, off the side of the bazaar, behind a hanging cloth: the first snow globe.
  const jeweller = branch(d, bazaar, 10, 'front', 7);
  const cloth = jeweller.hall(5, { floor: 'carpet', wall: 'stucco' });
  flat(g, cloth, 3, { look: 'curtain' });
  const vault = jeweller.room(5, 5, { floor: 'carpet', wall: 'stucco' });
  g.demo(...vault.tile(3, 0));
  g.pillar(...vault.tile(3, 2), 0.7, { prop: 'chest' });
  g.pick(...vault.tile(1, -1), 10);
  d.hall(2, { floor: 'cobble', wall: 'stucco' });
  d.stairs(3, 1.5, { wall: 'stucco' });

  // The river bank: the landing stage, palms, and a felucca across the Nile.
  const bank = d.room(9, 13, { floor: 'planks', wall: 'fence' });
  for (const k of [2, 6]) torch(bank, k);
  g.bumper(...bank.tile(3, 3), { radius: 0.45, look: 'palm' });
  g.foe('camel', ...bank.tile(4, -2), { range: 5 });
  g.pick(...bank.tile(2, -3), 10).pick(...bank.tile(6, 4), 10);
  g.light('chandelier', ...centre(bank), { height: 3.2, radius: 4, color: '#ffc890' });
  d.hall(4, { floor: 'planks', wall: 'fence' });
  d.ferry(10, { size: 3, period: 8 });
  d.hall(3, { floor: 'sand', wall: 'sandstone' });
  d.turn('+x', { floor: 'sand', wall: 'sandstone' });

  // The old quarry: the road through it, and the blocks coming down off the cliff on the beat.
  const quarry = d.hall(18, { width: 7, floor: 'sand', wall: 'sandstone' });
  for (const [along, offset] of [[5, 0], [10, 0.33], [15, 0.66]]) {
    const [x, z, w, dd] = quarry.rect(along, 2, quarry.back > 0 ? quarry.lo : quarry.lo + 1, quarry.width - 1);
    g.drop(x, z, { w, d: dd, beats: 4, offset });
  }
  g.block(...quarry.rect(3, 12, quarry.back * 3, 1), 0.8, { prop: 'stones' });
  g.foe('camel', ...quarry.tile(12, -1), { range: 4 });
  g.pick(...quarry.tile(2, 0), 5).pick(...quarry.tile(8, -2), 5).pick(...quarry.tile(13, 2), 10);
  g.whetstone(...quarry.tile(17, -2));
  for (const k of [3, 8, 13]) torch(quarry, k);
  d.turn('+z', { floor: 'sand', wall: 'canvas' });
  d.hall(2, { floor: 'sand', wall: 'canvas' });

  // The archaeologists' tent: crates of finds, the passport on the table, and a wall of crates with something behind it.
  const tent = d.room(13, 11, { floor: 'carpet', wall: 'canvas' });
  for (const k of [1, 2, 3, 9, 10, 11]) g.pillar(...backTile(tent, k), 0.9, { prop: 'crate' });
  g.block(...tent.rect(6, 2, 2, 1), 0.8, { prop: 'desk' });
  g.pass(...tent.tile(8, 3));
  g.foe('archaeologist', ...tent.tile(5, -2), { range: 5 }).foe('hawker', ...tent.tile(10, 3), { range: 4 });
  g.pick(...tent.tile(2, 2), 10).pick(...tent.tile(11, -3), 10);
  torch(tent, 6);
  // Behind the crates: a dig, and the second snow globe.
  const dig = branch(d, tent, 6, 'back', 6);
  const crates = dig.hall(5, { floor: 'sand', wall: 'sandstone' });
  flat(g, crates, 3, { look: 'wood' });
  const trench = dig.room(5, 5, { floor: 'sand', wall: 'sandstone' });
  g.demo(...trench.tile(3, 0));
  g.vinyl(...trench.tile(1, 1), 60);
  d.hall(2, { floor: 'sand', wall: 'canvas' });

  // The dunes: the sand gives way underfoot (it is quicksand), and the Mummy is out for a walk.
  const dunes = d.hall(12, { width: 5, floor: 'sand', wall: 'sandstone' });
  g.sticky(...dunes.rect(3, 7, -2, 5));
  g.foe('mummy', ...dunes.tile(6, 0), { range: 4 });
  g.pick(...dunes.tile(1, 0), 5).pick(...dunes.tile(11, 0), 10);
  g.lighter(...dunes.tile(11, 1));
  sign(dunes, 6, 'GIZA', DESERT[3], 0.5);
  const gate = d.hall(4, TOMB);
  barred(g, gate, 2, 'bars');
  d.stairs(5, 2.5, { wall: 'sandstone' });
  d.turn('+x', TOMB);
  d.hall(2, TOMB);

  // The king's chamber: sarcophagi along the walls, the traps spouting sand across the way, the Mummy and an archaeologist.
  const chamber = d.room(17, 13, TOMB);
  for (const k of [2, 8, 14]) g.pillar(...backTile(chamber, k), 0.6, { prop: 'sarcophagus' });
  g.pyro(...across(chamber, 5, { beats: 4 }));
  g.pyro(...across(chamber, 11, { beats: 4, offset: 0.5 }));
  g.foe('scarab', ...chamber.tile(3, 3), { path: [chamber.tile(1, 4), chamber.tile(4, 4), chamber.tile(4, 2), chamber.tile(1, 2)] });
  g.foe('mummy', ...chamber.tile(8, -2), { range: 4 });
  g.foe('archaeologist', ...chamber.tile(14, 2), { range: 4 });
  g.pick(...chamber.tile(2, 0), 10).pick(...chamber.tile(8, 0), 10).pick(...chamber.tile(14, -3), 10);
  g.whetstone(...chamber.tile(9, 5));
  wash(g, chamber, [DESERT[2], DESERT[3]], { cans: 2, program: 'static' });
  // Across the pit on a plank, the treasury: the last globe.
  const pit = branch(d, chamber, 8, 'front', 7);
  const plank = pit.bridge(7, { floor: 'planks' });
  g.zap(...plank.rect(0, 7, plank.lo - 2, 5), pit.h - 1.8, { fill: true });
  g.foe('scarab', ...plank.tile(3, 0), { path: [plank.tile(1, 0), plank.tile(5, 0)] });
  const treasury = pit.room(5, 5, TOMB);
  g.demo(...treasury.tile(2, 0));
  g.light('chandelier', ...centre(treasury), { height: 2.8, radius: 2.5, color: '#ffd890' });
  d.hall(3, TOMB);
  d.exit(3);
  return g;
}
