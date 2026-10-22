// The ground's look: every static body of `world.box2d.static`, drawn by the game's shapes plugin in
// the ground's definition's paint (`assets/demo_box2d.json`): the chain floor as a band `depth`
// metres thick under its line, the one-way platform in the `oneWay` paint, the rest filled.
import type { Row } from '#engine/engine.ts'
import type { Plugins } from '#engine/browser.ts'
import { gone, place, statics } from './plugins/shapes/shapes.plugin.ts'

let drawn: ReturnType<typeof statics>
let id: number

export function setup(row: Row, plugins: Plugins) {
  drawn = statics(row, plugins)
  id = row.id
}

export function tick(_row: Row, plugins: Plugins) {
  place(drawn, plugins)
}

export function remove(plugins: Plugins) {
  gone(drawn, id, plugins)
}
