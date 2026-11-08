import { Venue as Base } from 'madness-engine/venue/venue';

export * from 'madness-engine/venue/venue';

/** Metroll's venue: the engine's, with this game's names for what lies about on a track. */
export class Venue extends Base {
  /** A pile of guitar picks, to roll over: they are the hype. */
  pick(x, z, amount = 10) {
    return this.pickup('pick', x, z, amount);
  }

  /** A crate of vinyl, worth a good many picks. */
  vinyl(x, z, amount = 60) {
    return this.pickup('vinyl', x, z, amount);
  }

  /** A whetstone: sharpens the spikes back on. */
  whetstone(x, z, amount = 25) {
    return this.pickup('whetstone', x, z, amount);
  }

  /** A lighter, held up: when Metroll is done for, the crowd calls for an encore and it gets up again. */
  lighter(x, z) {
    return this.pickup('lighter', x, z, 1);
  }

  /** A backstage pass, for the security gates and the stage door. */
  pass(x, z) {
    return this.pickup('pass', x, z, 1);
  }

  /** A demo tape, the only copy: three are hidden on every track. */
  demo(x, z) {
    return this.pickup('demo', x, z, 100);
  }
}
