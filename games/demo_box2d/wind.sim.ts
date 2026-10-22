// The wind, one row: whether it blows, which the seat toggles (`player.sim.ts`'s `wind`).
//
//   on   whether it blows.
//
// Each step, before box2d steps, while it is on every body row of the kinds its definition lists
// (`kinds`, `assets/demo_box2d.json`) carries box2d's `wind`, `{ wind, drag, lift }` from the
// definition, which box2d applies to each of the body's shapes (b2Shape_ApplyWind); while it is off
// none carries it.
//
// `toggle()` is not open: the `player` row's `wind` calls it.
import type { Kind } from '#engine/engine.ts'
import { def } from '#plugins/loader/loader.sim.ts'

export const wind: Kind = {
  before(me, _dt, w) {
    const k = def(w, me.kind)
    for (const kind of k.kinds as string[]) for (const row of w.all(kind)) {
      if (me.data.on) row.data.wind = { wind: [...k.wind], drag: k.drag, lift: k.lift }
      else delete row.data.wind
    }
  },
  acts: {
    toggle(me) {
      me.data.on = !me.data.on
    },
  },
}
