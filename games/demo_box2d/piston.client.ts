// piston's look: the piston's head, slid up and down its `slide` over the static base, its shapes from `world.box2d.kinds.piston` drawn by the game's shapes
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
