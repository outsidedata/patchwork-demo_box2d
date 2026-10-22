// The ground: one row that stands for every static body of `world.box2d.static` (the chain floor and
// its walls, the one-way platform, the seesaw's fulcrum, the ramp, the piston's base and the
// pendulum's and the rope's anchors), which box2d makes and no row carries. It has no rule; its look
// draws them.
import type { Kind } from '#engine/engine.ts'

export const ground: Kind = {}
