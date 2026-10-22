// knot's look: a length of the rope, a bar of its definition's `width` and `fill` (`assets/demo_box2d.json`)
// from the joint's anchor on body `a` to the centre of body `b`, laid each frame by the game's
// shapes plugin.
import type { Row } from '#engine/engine.ts'
import type { Plugins } from '#engine/browser.ts'
import { bar, gone, stretch } from './plugins/shapes/shapes.plugin.ts'

let drawn: ReturnType<typeof bar>
let id: number

export function setup(row: Row, plugins: Plugins) {
  drawn = bar(row, plugins)
  id = row.id
}

export function tick(row: Row, plugins: Plugins) {
  stretch(drawn, row, plugins)
}

export function remove(plugins: Plugins) {
  gone(drawn, id, plugins)
}
