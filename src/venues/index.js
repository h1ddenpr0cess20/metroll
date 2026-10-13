import { birmingham } from './birmingham.js';
import { bay } from './bay.js';
import { berlin } from './berlin.js';
import { nola } from './nola.js';
import { norway } from './norway.js';
import { nyc } from './nyc.js';
import { strip } from './strip.js';
import { tampa } from './tampa.js';
import { whitby } from './whitby.js';

/**
 * The tracks of the compilation, in order: each a place and a year in the
 * history of metal, dug with `dig.js` a piece at a time, with the people,
 * hazards and demo tapes put into the pieces by where they are in them.
 */
export const VENUES = [birmingham, strip, bay, whitby, nyc, tampa, norway, nola, berlin];

export function loadVenue(index) {
  return VENUES[index]();
}
