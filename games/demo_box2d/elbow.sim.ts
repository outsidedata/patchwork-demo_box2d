// elbow: a revolute joint of the ragdoll, lower arm to upper arm. A row of a kind `world.box2d.joints` lists, which box2d makes and
// moves; it has no rule of its own. Its numbers are box2d's table in `main.scene.json`.
import type { Kind } from '#engine/engine.ts'

export const elbow: Kind = {}
