import { createExit as exit } from 'madness-engine/venue/scenery';

export { createVenueMeshes } from 'madness-engine/venue/scenery';


/** The way out of a track: the engine's frame with a lit sign, with this game's words on it. */
export const createExit = (GFX, venue, options = {}) => exit(GFX, venue, { signs: { exit: 'CUT', last: 'THE END' }, ...options });
