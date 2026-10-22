// link's look: a bead of the rope, tied to the next by a `knot`, its shapes from `world.box2d.kinds.link` drawn by the game's shapes
// plugin in its definition's paint (`assets/demo_box2d.json`), standing where its row is.
import type { Row } from '#engine/engine.ts'
import type { Plugins } from '#engine/browser.ts'
import { body, fit, gone } from './plugins/shapes/shapes.plugin.ts'

let drawn: ReturnType<typeof body>
let id: number

export function setup(row: Row, plugins: Plugins) {
  drawn = body(row, plugins)
  id = row.id
}

export function tick(_row: Row, plugins: Plugins) {
  fit(drawn, plugins)
}

export function remove(plugins: Plugins) {
  gone(drawn, id, plugins)
}
