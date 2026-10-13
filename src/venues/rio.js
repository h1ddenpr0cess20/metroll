import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, barred, branch, flat, frontHeading, wallTile, wash } from './helpers.js';

/**
 * Stop 8: Rio. Carnival, and the whole city out in the street for it.
 * Down from the top of the favela, the steps between the painted houses,
 * the wires strung over them loose and live; into the samba school's hall
 * where the drums are rehearsing, a snow globe in the costume store behind
 * the curtain; along the Sambadrome's avenue, the crowd surging out toward
 * the edge of it, the macaws over it all; through the fireworks off the
 * floats; into the shed where the floats are built, the drums swinging down
 * off the hoists, the first-aid post off it (the passport is in lost
 * property) and a globe across the pit on a plank; on a carnival float over
 * the gap; down the lift to the beach, and along Copacabana's waves to the
 * stage, the last globe behind the beach bar's painted sign. A samba
 * school: the surdos, a cavaquinho, the whistle.
 */

export const RIO = {
  tiles: ['#f0e0b8', '#e0cc9c', '#2a9a4a', '#d8c08c'],
  walls: ['#e8a040', '#d84a6a', '#2a9a4a', '#3a8ad8'],
  ambient: [1.05, 1.0, 0.95], lamp: '#ffe0a0', trap: '#2a2a2e', lift: '#2a9a4a', exit: '#ffd23a', zap: '#fff4a0', zapHue: 1.6, vary: 0.08,
};

/** Carnival: Brazil's green and gold, a samba school's pink, the sea's blue. */
const CARNIVAL = ['#2adf6a', '#ffd23a', '#ff3a8a', '#3ab0ff'];

export function rio() {
  const g = new Venue({
    name: 'Rio de Janeiro', act: 8, cols: 140, rows: 140, palette: RIO, tempo: 104,
    intro: 'Carnival. Two million people dancing in the street. Rock is rolling in it.',
    look: {
      country: 'Brazil', poster: '#1a9a4a', grade: 'tropical', theme: 'rio', floor: 'mosaic', wall: 'stucco', lamp: 'bulb', crusher: 'surdo', lift: 'float', pyro: 'fireworks', gate: 'border',
      hemi: ['#e8d8f0', '#3a2a30', 1.15], key: '#fff0e0', keyK: 1.1, lantern: '#ffe0c0',
      skyColors: ['#04081a', '#0a1430', '#1a2a50', '#3a3a6a', '#6a4a7a'], stars: true, skyline: '#0a0c18', horizon: 'sea',
      reflect: CARNIVAL, ceiling: '#1a1c30',
      rig: { colors: CARNIVAL, program: 'chase', every: 2 },
    },
  });
  const sign = (p, along, text, color = CARNIVAL[1], size = 0.55, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const STEPS = { floor: 'cobble', wall: 'stucco' };

  // The top of the favela: the whole city lit up below, the sea beyond.
  g.room(2, 4, 5, 5, 80, { lamps: 3, ...STEPS });
  g.start = { x: 4, z: 6 };
  const d = digger(g, { x: 7, z: 6, h: 80, heading: '+x' });
  // The steps down between the painted houses, the wires over them hanging loose, and live; a capoeirista practising.
  const steps = d.hall(14, { width: 5, ...STEPS });
  g.zap(...steps.rect(3, 9, steps.lo, 1), d.h);
  g.zap(...steps.rect(3, 9, steps.lo + 4, 1), d.h);
  g.foe('capoeira', ...steps.tile(8, 0), { range: 4, path: [steps.tile(5, 0), steps.tile(11, 0)] });
  g.pick(...steps.tile(1, 0), 5).pick(...steps.tile(4, 0), 5).pick(...steps.tile(7, 1), 5).pick(...steps.tile(13, 0), 10);
  sign(steps, 2, 'MORRO', CARNIVAL[0], 0.5);
  sign(steps, 12, 'SAMBA', CARNIVAL[2], 0.5);
  d.turn('+z', STEPS);
  d.hall(2, STEPS);

  // The samba school's hall: the drum section rehearsing along the back, the dancers, the flags.
  const quadra = d.room(15, 13, { floor: 'panels', wall: 'stucco' });
  g.block(...quadra.rect(3, 9, quadra.back * 6, 1), 0.85, { prop: 'surdo' });
  g.pillar(...quadra.tile(8, -1), 0.9, { prop: 'chair' });
  for (const [a, b] of [[4, 3], [11, 3]]) g.block(...quadra.rect(a, 2, b, 1), 0.85, { prop: 'surdo' });
  g.foe('sambista', ...quadra.tile(5, -3), { range: 6 }).foe('sambista', ...quadra.tile(11, -2), { range: 6 });
  g.foe('capoeira', ...quadra.tile(13, 4), { range: 5 });
  g.pick(...quadra.tile(2, 0), 10).pick(...quadra.tile(7, -4), 10).pick(...quadra.tile(13, -4), 10);
  g.suitcase(...quadra.tile(2, 5), 50);
  sign(quadra, 7.5, 'ESCOLA DE SAMBA', CARNIVAL[1], 0.42, 1.8);
  for (const k of [3, 12]) g.light('strobe', ...wallTile(quadra, k), { colors: [CARNIVAL[2]], reach: 8, height: 1.4, cycle: 16, on: 4, shift: k });
  wash(g, quadra, [CARNIVAL[0], CARNIVAL[1]], { cans: 2, program: 'pulse', every: 2 });
  // The costume store, behind a curtain of sequins: the first snow globe.
  const store = branch(d, quadra, 11, 'front', 7);
  const curtain = store.hall(5, STEPS);
  flat(g, curtain, 3, { look: 'curtain' });
  const costumes = store.room(5, 5, { floor: 'carpet', wall: 'stucco' });
  g.globe(...costumes.tile(3, 0));
  g.pick(...costumes.tile(1, -1), 10).pick(...costumes.tile(1, 1), 10);
  d.hall(2, STEPS);
  d.turn('+x', { floor: 'concrete', wall: 'block' });

  // The Sambadrome: the avenue along the stands, the crowd surging out toward the edge of it, the macaws overhead.
  const avenue = d.ledge(20, { width: 4, floor: 'concrete', wallTex: 'block' });
  const edge = frontHeading(avenue);
  g.belt(...avenue.rect(4, 3, avenue.lo, 4), edge);
  g.belt(...avenue.rect(12, 3, avenue.lo, 4), edge);
  g.foe('macaw', ...avenue.tile(9, 0), { path: [avenue.tile(5, -1), avenue.tile(16, -1)] });
  g.pick(...avenue.tile(2, avenue.back), 5).pick(...avenue.tile(8, avenue.back), 5).pick(...avenue.tile(16, avenue.back), 10);
  sign(avenue, 9, 'SAMBÓDROMO', CARNIVAL[1], 0.42);
  d.turn('+z', { floor: 'concrete', wall: 'block' });
  d.hall(2, { floor: 'concrete', wall: 'block' });

  // The floats' fireworks: going up across the way on the beat.
  const fireworks = d.hall(12, { width: 5, floor: 'concrete', wall: 'block' });
  g.pyro(...across(fireworks, 3, { beats: 4 }));
  g.pyro(...across(fireworks, 7, { beats: 4, offset: 0.5 }));
  g.foe('footballer', ...fireworks.tile(10, 0), { range: 3 });
  g.pick(...fireworks.tile(5, 0), 5).pick(...fireworks.tile(5, 1), 5).pick(...fireworks.tile(9, -1), 10);
  g.tape(...fireworks.tile(11, 1));
  d.turn('+x', { floor: 'concrete', wall: 'corrugated' });
  d.hall(2, { floor: 'concrete', wall: 'corrugated' });

  // The shed where the floats are built: the drums swinging down off the hoists, a beach vendor, a footballer.
  const shed = d.room(17, 13, { floor: 'concrete', wall: 'corrugated' });
  for (const [along, b, offset] of [[4, -4, 0], [8, 2, 0.33], [12, -4, 0.66]]) g.drop(...shed.rect(along, 2, b, 3).slice(0, 2), { w: shed.dir[0] ? 2 : 3, d: shed.dir[0] ? 3 : 2, beats: 4, offset });
  g.block(...shed.rect(7, 3, -6, 2), 1.3, { prop: 'racking' });
  g.foe('vendor', ...shed.tile(6, 3), { range: 5 }).foe('footballer', ...shed.tile(14, 1), { range: 5 });
  g.pick(...shed.tile(2, 0), 10).pick(...shed.tile(10, 5), 10).pick(...shed.tile(15, -3), 10);
  g.lighter(...shed.tile(16, 5));
  wash(g, shed, [CARNIVAL[2], CARNIVAL[1]], { cans: 3, program: 'chase', every: 2 });
  g.light('laser', ...wallTile(shed, 6), { color: CARNIVAL[0], radius: 4, height: 2.2 });
  // Across the pit on a plank, up on top of a float: the second globe.
  const top = branch(d, shed, 15, 'back', 7);
  const plank = top.bridge(7, { floor: 'planks' });
  g.zap(...plank.rect(0, 7, plank.lo - 2, 5), top.h - 1.8, { fill: true });
  g.foe('macaw', ...plank.tile(3, 0), { path: [plank.tile(1, 0), plank.tile(5, 0)] });
  const crown = top.room(5, 5, { floor: 'panels', wall: 'fence' });
  g.globe(...crown.tile(2, 0));
  // The first-aid post off the front of the shed: the passport, handed in to lost property.
  const aid = branch(d, shed, 5, 'front', 7);
  aid.hall(3, { floor: 'concrete', wall: 'block' });
  const post = aid.room(7, 7, { floor: 'panels', wall: 'block' });
  g.pass(...post.tile(4, 0));
  g.pillar(...post.tile(2, 2), 0.8, { prop: 'cooler' });
  g.foe('sambista', ...post.tile(5, 2), { range: 4 });
  g.tape(...post.tile(6, -2));
  const lock = d.hall(5, { floor: 'concrete', wall: 'block' });
  barred(g, lock, 2);
  d.turn('+z', { floor: 'concrete', wall: 'block' });
  d.hall(2, { floor: 'concrete', wall: 'block' });

  // On a float over the gap in the avenue.
  const deck = d.hall(4, { width: 5, floor: 'concrete', wall: 'block' });
  g.foe('sambista', ...deck.tile(2, 0), { range: 3 });
  d.ferry(12, { size: 3, period: 7 });
  const pad = d.hall(3, { floor: 'concrete', wall: 'block' });
  g.pick(...pad.tile(1, 0), 10);
  // Down in the lift, to the beach.
  d.shaft(4, { size: 3, period: 7, style: 'riser' });
  d.hall(2, { floor: 'sand', wall: 'fence' });
  d.turn('+x', { floor: 'mosaic', wall: 'fence' });

  // Copacabana: the waves in the pavement, the sand, the palms, the footballers and the vendors, the stage at the end.
  const beach = d.room(17, 13, { floor: 'mosaic', wall: 'fence' });
  g.bowl(...beach.rect(3, 5, 1, 5), d.h, 0.5, { tex: 'sand' });
  for (const [a, b] of [[3, -4], [13, 4], [14, -4]]) g.bumper(...beach.tile(a, b), { radius: 0.45, look: 'palm' });
  g.foe('footballer', ...beach.tile(6, -3), { range: 6 }).foe('vendor', ...beach.tile(12, -2), { range: 6 }).foe('sambista', ...beach.tile(15, 2), { range: 5 });
  g.pick(...beach.tile(5, 3), 10).pick(...beach.tile(11, 0), 10).pick(...beach.tile(16, -3), 10);
  g.suitcase(...beach.tile(16, 5), 70);
  wash(g, beach, [CARNIVAL[3], CARNIVAL[2]], { cans: 3, program: 'static' });
  sign(beach, 4, 'COPACABANA', CARNIVAL[3], 0.45, 1.7);
  // Behind the beach bar's painted sign at the back of the beach: the last globe.
  const bar = branch(d, beach, 9, 'back', 7);
  const signHall = bar.hall(5, { wall: 'flats' });
  flat(g, signHall, 3, { look: 'backdrop' });
  const nook = bar.room(5, 5, { floor: 'sand', wall: 'flats' });
  g.globe(...nook.tile(3, 0));
  d.hall(3, { floor: 'mosaic', wall: 'fence' });
  d.exit(3);
  return g;
}
