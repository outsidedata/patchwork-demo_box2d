// The row one seat possesses: the driver. `addons/player` spawns it and writes the slot it gave the
// connection into `seat`, and every seat is sent it. It has no body of its own: it holds the `car`
// (`plugins/player/player.sim.ts`), which stands in the scene's actors, and what the seat does to the
// rest of the world it does from here. Every number is the player's definition in
// `assets/demo_box2d.json`.
//
// The row: `seat`, `held` (core's: the car it holds), and its own:
//   next   which of the definition's `spawns` the next click makes.
//
// `before` hands the seat the first car no other seat holds, the step it arrives.
//
// The acts are the page's keys and clicks:
//   drive(v)        relayed to the car it holds (`car.sim.ts`).
//   spawn(x, y)     a body of the kind `spawns[next]` made at the world point [x, y], metres, and
//                   `next` moved on to the following one, round again after the last.
//   explode(x, y)   box2d's explosion at the world point [x, y], of the definition's `blast`:
//                   `radius`, `falloff` and `impulsePerLength` (b2World_Explode), on the next step.
//   wind()          the wind turned on, or off (`wind.sim.ts`).
// A seat's message arrives from outside the program, so each act refuses a point that is not two
// finite numbers and writes nothing.
import type { Kind } from '#engine/engine.ts'
import { def } from '#plugins/loader/loader.sim.ts'
import { holderOf, holding, relay, take } from '#plugins/player/player.sim.ts'

const finite = (...v: unknown[]) => v.every(x => typeof x === 'number' && Number.isFinite(x))

export const player: Kind = {
  before(me, _dt, w) {
    if (holding(w, me)) return
    const car = w.all('car').find(c => !holderOf(w, c))
    if (car) take(me, w, car)
  },
  acts: {
    ...relay({ car: ['drive'] }),
    spawn(me, w, _seat, x: unknown, y: unknown) {
      if (!finite(x, y)) return
      const { spawns } = def(w, me.kind)
      w.spawn(spawns[me.data.next], { pos: [x, y] })
      me.data.next = (me.data.next + 1) % spawns.length
    },
    explode(me, w, seat, x: unknown, y: unknown) {
      if (!finite(x, y)) return
      const { radius, falloff, impulsePerLength } = def(w, me.kind).blast
      w.call(w.find('box2d'), 'explode', seat, x as number, y as number, radius, falloff, impulsePerLength)
    },
    wind(_me, w, seat) {
      w.call(w.find('wind'), 'toggle', seat)
    },
  },
}
