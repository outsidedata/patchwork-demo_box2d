// The sensor zone: a static body of `world.box2d.kinds.zone` whose one shape is a sensor with sensor
// events, so box2d writes `visitors` on its row, the bodies inside it, while any are (every body
// kind's shape has sensor events on, in `main.scene.json`). It has no rule; its look lights while
// `visitors` names any.
import type { Kind } from '#engine/engine.ts'

export const zone: Kind = {}
