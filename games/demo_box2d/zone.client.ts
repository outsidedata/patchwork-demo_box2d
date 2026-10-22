// The zone's look: its sensor's shapes from `world.box2d.kinds.zone`, drawn by the game's shapes
// plugin in its definition's paint (`assets/demo_box2d.json`), filled at the definition's `lit`
// alpha while its row's `visitors` names any body and at its `idle` alpha while it names none.
import type { Row } from '#engine/engine.ts'
import type { Plugins } from '#engine/browser.ts'
import { def } from '#plugins/loader/loader.sim.ts'
import { body, fit, gone, repaint } from './plugins/shapes/shapes.plugin.ts'

let drawn: ReturnType<typeof body>
let id: number
let inside: boolean | undefined

export function setup(row: Row, plugins: Plugins) {
  drawn = body(row, plugins)
  id = row.id
  inside = undefined
}

export function tick(row: Row, plugins: Plugins) {
  fit(drawn, plugins)
  const now = (row.data.visitors?.length ?? 0) > 0
  if (now === inside) return
  inside = now
  const k = def(plugins.wire, row.kind)
  repaint(drawn, row, plugins, now ? k.lit : k.idle)
}

export function remove(plugins: Plugins) {
  gone(drawn, id, plugins)
}
