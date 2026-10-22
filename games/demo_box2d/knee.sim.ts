// knee: a revolute joint of the ragdoll, lower leg to upper leg. A row of a kind `world.box2d.joints` lists, which box2d makes and
// moves; it has no rule of its own. Its numbers are box2d's table in `main.scene.json`.
import type { Kind } from '#engine/engine.ts'

export const knee: Kind = {}
