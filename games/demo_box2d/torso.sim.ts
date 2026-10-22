// torso: the ragdoll's torso, which its neck, shoulders and hips hang from. A row of a kind `world.box2d.kinds` lists, which box2d makes and
// moves; it has no rule of its own. Its numbers are box2d's table in `main.scene.json`.
import type { Kind } from '#engine/engine.ts'

export const torso: Kind = {}
