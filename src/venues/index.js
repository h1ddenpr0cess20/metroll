import { alps } from './alps.js';
import { egypt } from './egypt.js';
import { london } from './london.js';
import { newyork } from './newyork.js';
import { paris } from './paris.js';
import { rio } from './rio.js';
import { spain } from './spain.js';
import { sydney } from './sydney.js';
import { tokyo } from './tokyo.js';
import { venice } from './venice.js';

/**
 * The stops of the tour, in order: each a city on the way to that night's
 * show, dug with `dig.js` a piece at a time, with the people, hazards and
 * souvenirs put into the pieces by where they are in them.
 */
export const VENUES = [london, paris, venice, alps, spain, egypt, tokyo, rio, sydney, newyork];

export function loadVenue(index) {
  return VENUES[index]();
}
