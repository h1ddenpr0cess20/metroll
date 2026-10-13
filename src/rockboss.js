import { createRock } from './boulder.js';

/**
 * Rock, the final boss at Wacken. Not sculpted, not re-drawn, not dressed:
 * the boulder from the first game (`boulder.js`, the same file, untouched),
 * at the size the boss is, rolling when it goes, hopping when somebody is in
 * reach and tipping over when it is beaten. It stands on (0, 0, 0), as every
 * foe does, with its middle one radius up, which is where the games always
 * kept it.
 */

/** The radius the boulder's own scene rolls it at (`SOURCE_RADIUS` in the first game's rock.js): what the stone is scaled from. */
const SOURCE_RADIUS = 0.95;

/** How fast it turns over when it is moving, in radians a second. */
const ROLL = 2.4;

export function createRockMesh(GFX, radius) {
  const asset = createRock(GFX);
  const group = new GFX.Group();
  group.name = 'rock';
  const body = new GFX.Group();
  group.add(body);
  // The pivot it rolls and tips about, one radius up.
  const pivot = new GFX.Group();
  pivot.position.y = radius;
  body.add(pivot);
  const stone = asset.mesh;
  stone.castShadow = true;
  stone.receiveShadow = true;
  stone.scale.setScalar(radius / SOURCE_RADIUS);
  pivot.add(stone);

  let roll = 0, last = null, tip = 0;
  return {
    group,
    body,
    animate(t, moving, { striking = false, down = false } = {}) {
      const dt = last === null ? 0 : Math.max(0, Math.min(0.1, t - last));
      last = t;
      if (moving && !down) roll += ROLL * dt;
      tip += ((down ? 1 : 0) - tip) * Math.min(1, dt * 4);
      stone.rotation.x = roll;
      pivot.rotation.z = tip * 1.2;
      pivot.position.y = radius * (1 - 0.18 * tip);
      // The landing squash the player's Rock has, kicked while somebody is in reach.
      const squash = striking && !down ? Math.sin(t * 9) * 0.06 : 0;
      pivot.scale.set(1 + squash * 0.5, 1 - squash, 1 + squash * 0.5);
    },
  };
}
