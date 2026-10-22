// The car: a body of `world.box2d.kinds.car`, its two wheels held to it by `axle` wheel joints whose
// spring is its suspension and whose motor is its drive. The seat that holds it (`player.sim.ts`)
// drives it with `drive`, relayed from its own row.
//
//   drive   the way it is driven, -1 (left) to 1 (right), 0 at rest.
//
// Each step, before box2d steps, every axle whose `a` is this car is given the motor speed
// `-drive · spin` radians a second (its definition's `spin`, `assets/demo_box2d.json`), negative
// turning the wheels clockwise, which rolls the car right; at 0 the motor holds the wheels, a brake
// of the axle's `maxMotorTorque`. A car no seat holds is at rest: its `drive` is 0 from the step it
// is let go.
//
// `drive(v)` is not open: a seat reaches it only through the `player` row that holds the car. It
// refuses anything but a number from -1 to 1.
import type { Kind } from '#engine/engine.ts'
import { def } from '#plugins/loader/loader.sim.ts'
import { holderOf } from '#plugins/player/player.sim.ts'

const way = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && Math.abs(v) <= 1

export const car: Kind = {
  before(me, _dt, w) {
    if (!holderOf(w, me)) me.data.drive = 0
    const { spin } = def(w, me.kind)
    for (const axle of w.all('axle')) if (axle.data.a === me.id) axle.data.motorSpeed = -me.data.drive * spin
  },
  acts: {
    drive(me, _w, _seat, v: unknown) {
      if (way(v)) me.data.drive = v
    },
  },
}
