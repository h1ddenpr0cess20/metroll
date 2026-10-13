import { birmingham } from './birmingham.js';
import { bay } from './bay.js';
import { strip } from './strip.js';
import { whitby } from './whitby.js';

/**
 * The tracks of the compilation, in order: each a place and a year in the
 * history of metal, dug with `dig.js` a piece at a time, with the people,
 * hazards and demo tapes put into the pieces by where they are in them.
 */
export const VENUES = [birmingham, strip, bay, whitby];

export function loadVenue(index) {
  return VENUES[index]();
}
