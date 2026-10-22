// The piston's slide: a prismatic joint of `world.box2d.joints.slide`, the static base to the
// `piston` head, along the base's up. Its motor runs the head up and down between the joint's limits
// for ever.
//
//   motorSpeed   the motor's speed, metres a second along the slide, which box2d pushes into the
//                joint; 0 until the first step, which sets it to the definition's `speed` upward.
//
// Each step, before box2d steps, once box2d has `measured` the joint: within `margin` metres of its
// `upperTranslation` the motor runs down at `speed`, and within `margin` of its `lowerTranslation`
// up (the row's own limit where it carries one, else its kind's). `speed` and `margin` are its
// definition in `assets/demo_box2d.json`.
import type { Kind } from '#engine/engine.ts'
import { def } from '#plugins/loader/loader.sim.ts'

export const slide: Kind = {
  before(me, _dt, w) {
    const { speed, margin } = def(w, me.kind)
    if (me.data.motorSpeed === 0) me.data.motorSpeed = speed
    const t = me.data.measured?.translation
    if (t === undefined) return
    const kind = w.world.box2d.joints[me.kind]
    const upper = me.data.upperTranslation ?? kind.upperTranslation, lower = me.data.lowerTranslation ?? kind.lowerTranslation
    if (t >= upper - margin) me.data.motorSpeed = -speed
    else if (t <= lower + margin) me.data.motorSpeed = speed
  },
}
