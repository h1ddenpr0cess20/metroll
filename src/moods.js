import bay from 'madness-engine/moods/bay';
import berlin from 'madness-engine/moods/berlin';
import birmingham from 'madness-engine/moods/birmingham';
import nola from 'madness-engine/moods/nola';
import norway from 'madness-engine/moods/norway';
import nyc from 'madness-engine/moods/nyc';
import strip from 'madness-engine/moods/strip';
import tampa from 'madness-engine/moods/tampa';
import wacken from 'madness-engine/moods/wacken';
import warped from 'madness-engine/moods/warped';
import whitby from 'madness-engine/moods/whitby';
import woodstock from 'madness-engine/moods/woodstock';

/**
 * Each track's mood, in the order of the tour (`venues/index.js`): its
 * light, its sky and reflections, the film it is shot on, its weather and
 * its band. The moods are the engine's, made from the tracks' looks.
 */
export const MOODS = [birmingham, strip, bay, whitby, nyc, tampa, norway, nola, berlin, woodstock, warped, wacken];
