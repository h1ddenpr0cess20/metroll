import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, flat, loop, pick, toBack, wallTile } from './helpers.js';

/**
 * Stop 1: London. The first night of the tour, in the rain, of course. Off
 * the tour bus at the kerb, along a wet street of phone boxes and black
 * cabs, into a square where a guardsman is marching and the pigeons own
 * the place; down the steps into the Underground, along the platform (mind
 * the gap) where the phone boxes come down the escalator shaft on the beat;
 * up into a garden square, past the palace railings where the corgis are
 * out; along the Embankment to the river, the ferry across the Thames, and
 * into Camden, the market and its punks, where the club is and the door
 * won't open without the passport. Everything is taught here: rolling over
 * picks, running at somebody to smash them, something that drops on the
 * beat, passport control and its passport, a hoarding that someone ought to
 * run at with a snow globe behind it. Britpop, and Rock goes terribly
 * British about it all.
 */

export const LONDON = {
  tiles: ['#7a7e86', '#6a6e76', '#c8102e', '#8a8e96'],
  walls: ['#8a5a48', '#7a4e3e', '#c8102e', '#9a6a56'],
  ambient: [0.9, 0.92, 1.0], lamp: '#ffe6b0', trap: '#2a2a30', lift: '#1a3a6a', exit: '#ffd23a', sticky: '#6a4a2a', vary: 0.07,
};

/** London at night: sodium lamps, a bus's red, the Tube's blue, a pub's warm window. */
const SMOKE = ['#ffd890', '#e8303a', '#3a6ad8', '#ffb060'];

export function london() {
  const g = new Venue({
    name: 'London', act: 1, cols: 96, rows: 96, palette: LONDON, tempo: 128,
    intro: 'Raining. Naturally. The first show is in Camden. Rock is in Piccadilly.',
    look: {
      country: 'England', poster: '#c8302a', grade: 'fog', weather: 'rain', voice: 'british', theme: 'london',
      floor: 'asphalt', wall: 'brick', lamp: 'bulb', crusher: 'phonebox', lift: 'ferry', gate: 'border',
      hemi: ['#c8d0e0', '#3a3430', 1.05], key: '#e8ecff', keyK: 1.0, lantern: '#ffe2b0',
      skyColors: ['#05070c', '#0a0e18', '#121826', '#1c2232', '#2a2e3c'], stars: false, skyline: '#07080c', horizon: 'city',
      reflect: SMOKE, ceiling: '#1a1c24',
      rig: { colors: SMOKE.slice(0, 2), program: 'static', every: 4 },
    },
  });
  const sign = (p, along, text, color = SMOKE[0], size = 0.55, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const lamppost = (p, along) => g.light('streetlamp', ...wallTile(p, along), { height: 2.4 });

  // The bus stop, at the kerb.
  g.room(2, 4, 5, 5, 40, { lamps: 3, floor: 'asphalt', wall: 'brick' });
  g.start = { x: 4, z: 6 };
  const d = digger(g, { x: 7, z: 6, h: 40, heading: '+x' });
  // Down the wet street: picks somebody dropped to follow, a tourist with the map upside down.
  const street = d.hall(9, { wall: 'brick', floor: 'asphalt' });
  for (const a of [1, 2, 3]) g.pick(...street.tile(a, 0), 5);
  g.pick(...street.tile(6, 1), 5);
  g.foe('tourist', ...street.tile(4, 1), { range: 4 });
  g.pillar(...backTile(street, 7), 1.6, { prop: 'phonebox' });
  lamppost(street, 2);
  sign(street, 5, 'PICCADILLY', SMOKE[1], 0.5);
  d.turn('+z', { wall: 'brick', floor: 'asphalt' });
  d.hall(4, { wall: 'brick', floor: 'cobble' });
  d.stairs(4, 2, { floor: 'cobble' });

  // The square: a guardsman on parade, a gent with his paper, the pigeons; a red phone box on the corner.
  const square = d.room(15, 11, { floor: 'cobble', wall: 'stucco' });
  for (const k of [1, 2]) g.pillar(...backTile(square, k), 0.9, { prop: 'bench' });
  g.pillar(...backTile(square, 6), 1.6, { prop: 'phonebox' });
  g.block(...square.rect(11, 2, square.back * 5 - (square.back > 0 ? 1 : 0), 2), 1.2, { prop: 'fountain' });
  g.foe('gent', ...square.tile(5, -2), { range: 6 }).foe('tourist', ...square.tile(8, 2), { range: 6 });
  g.foe('guardsman', ...square.tile(10, -1), { range: 5, path: [square.tile(4, -1), square.tile(12, -1)] });
  g.foe('pigeon', ...square.tile(7, 0), { path: loop(square, 2) });
  g.pick(...square.tile(3, 3), 10).pick(...square.tile(12, -3), 10).pick(...square.tile(6, 0), 5);
  g.vinyl(...square.tile(13, -4), 50);
  sign(square, 6.5, 'UNDERGROUND', SMOKE[2], 0.5, 1.7);
  lamppost(square, 3);
  lamppost(square, 12);
  // Off the front of the square, behind a hoarding (the builders are in): the first snow globe. Run at it.
  const site = d.fork().jump(pick(square.tile(7, -square.back * 6), square.back > 0 ? '+x' : '-x'));
  const siteHall = site.hall(3, { width: 3, wall: 'brick' });
  flat(g, siteHall, 1, { look: 'flat' });
  const yard = site.room(5, 5, { wall: 'brick', floor: 'concrete' });
  g.demo(...yard.tile(3, 0));
  g.pick(...yard.tile(1, -1), 10).pick(...yard.tile(1, 1), 10);
  d.hall(5, { wall: 'stucco', floor: 'cobble' });
  d.turn('+x', { wall: 'block', floor: 'checker' });

  // The Underground: the tiled passage, a busker's guitar case of picks, a bobby keeping an eye.
  const passage = d.hall(11, { wall: 'block', floor: 'checker' });
  g.foe('bobby', ...passage.tile(5, 0), { range: 5, path: [passage.tile(2, 0), passage.tile(9, 0)] });
  g.pick(...passage.tile(9, 1), 10).pick(...passage.tile(3, -1), 5);
  sign(passage, 6, 'MIND THE GAP', '#ffd23a', 0.42, 1.5);
  // The escalator shaft: phone boxes coming down it on the beat (it's London; don't ask).
  const shaft = d.hall(11, { wall: 'block', floor: 'grate' });
  g.drop(...across(shaft, 4, { beats: 4 }));
  g.pick(...shaft.tile(5, 0), 5).pick(...shaft.tile(5, 1), 5).pick(...shaft.tile(5, -1), 5);
  g.drop(...across(shaft, 8, { beats: 4, offset: 0.5 }));
  g.pick(...shaft.tile(9, 0), 10);
  // Past the second phone box, the first roll of tape: for whatever the boxes took off him.
  g.whetstone(...shaft.tile(10, 0));
  d.turn('+z', { wall: 'block' });
  d.hall(3, { wall: 'block' });
  d.stairs(5, 2.5, { wall: 'block' });

  // The garden square by the palace: railings, hedges, the corgis out for their walk, and the gate to Camden shut.
  const park = d.room(13, 13, { floor: 'grass', wall: 'hedge' });
  for (const [a, b] of [[2, 3], [2, -3]]) g.pillar(...park.tile(a, b), 1.0, { prop: 'bench' });
  g.pillar(...park.tile(8, -4), 1.6, { prop: 'phonebox' });
  for (const [a, b] of [[4, 4], [9, 4]]) g.bumper(...park.tile(a, b), { radius: 0.4, look: 'bollard' });
  g.foe('guardsman', ...park.tile(5, 0), { range: 6 }).foe('gent', ...park.tile(9, 3), { range: 6 });
  g.foe('corgi', ...park.tile(7, -2), { path: loop(park, 2) });
  g.vinyl(...park.tile(11, 5), 60).pick(...park.tile(1, -5), 10).pick(...park.tile(6, 5), 10);
  g.lighter(...park.tile(11, -5));
  // On the way out, once the guards have had a go at him, a roll of tape.
  g.whetstone(...park.tile(12, 1));
  g.light('spot', ...wallTile(park, 6), { colors: ['#fff4e0'], radius: 3, aim: toBack(park).map((v) => -4 * v), height: 2.2 });
  sign(park, 3, 'KEEP OFF THE GRASS', '#f4f0e8', 0.36, 1.7);
  // The lodge off the garden: the passport, left at the lost property.
  const lodge = d.fork().jump(pick(park.tile(6, -7), '+x'));
  lodge.hall(3, { wall: 'stucco' });
  const office = lodge.room(6, 7, { wall: 'stucco', floor: 'carpet' });
  g.pass(...office.tile(3, 0));
  g.pillar(...office.tile(5, 3), 1.1, { prop: 'rail' });
  g.foe('bobby', ...office.tile(2, 2), { range: 4 });
  g.pick(...office.tile(4, -2), 10);
  // And out along the Embankment wall, on a plank over the river, a second snow globe.
  const pier = d.fork().jump(pick(park.tile(10, park.back * 7), park.back > 0 ? '-x' : '+x'));
  pier.hall(2, { wall: 'hedge' });
  const plank = pier.bridge(7, { floor: 'planks' });
  g.foe('pigeon', ...plank.tile(3, 0), { path: [plank.tile(1, 0), plank.tile(5, 0)] });
  const jetty = pier.room(5, 5, { wall: 'fence', floor: 'planks' });
  g.demo(...jetty.tile(2, 0));
  d.hall(4, { wall: 'hedge' });
  const gate = d.hall(6, { wall: 'stucco' });
  barred(g, gate, 3);
  sign(gate, 5, 'PASSPORTS', '#ff4a3a', 0.4, 1.7);
  d.turn('+x', { wall: 'brick' });
  d.ramp(7, 3, { wall: 'brick', floor: 'cobble' });

  // Camden: the market's last stretch, beer on the cobbles, the punks; a lock-up with the last globe behind its wall.
  const market = d.hall(9, { wall: 'brick', floor: 'cobble' });
  g.sticky(...market.rect(1, 2, -1, 3));
  const lockup = d.fork().jump(pick(market.tile(4, -2), '-z'));
  const luHall = lockup.hall(7, { wall: 'brick' });
  flat(g, luHall, 6, { breakAt: 6.5, look: 'drywall' });
  const store = lockup.room(5, 5, { wall: 'brick', floor: 'concrete' });
  g.demo(...store.tile(3, 0));
  g.vinyl(...store.tile(1, -1), 70).whetstone(...store.tile(1, 1));
  g.foe('punk', ...market.tile(6, 1), { range: 5 });
  g.drop(...across(market, 8, { beats: 4 }));
  // The club: the stage door at the back of it.
  const club = d.room(9, 9, { wall: 'posters', floor: 'planks' });
  g.foe('punk', ...club.tile(3, -2), { range: 5 }).foe('fan', ...club.tile(4, 2), { range: 5 });
  g.pick(...club.tile(6, 0), 10);
  sign(club, 4.5, 'CAMDEN', SMOKE[3], 0.55, 1.8);
  d.hall(3, { wall: 'posters' });
  d.stairs(3, 1.5, { wall: 'posters' });
  d.hall(2, { wall: 'posters' });
  d.exit(3);
  return g;
}
