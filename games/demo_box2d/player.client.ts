// One seat's driver, its `player` row. Nothing of it is drawn: the car it holds draws itself. For the
// seat's own row, the one that is `mine`, its keys and its mouse, every key the player's definition in
// `assets/demo_box2d.json` (`keys`), each naming the `player` row's act of the same name
// (`player.sim.ts`):
//   drive     two lists of keys, left and right, held, sent as `drive` -1, 0 or 1.
//   explode   a key that sends `explode` at the world point under the pointer.
//   wind      a key that sends `wind`.
// A click sends `spawn` at the world point under it. The pointer's world point is render2d's
// `unproject` of where `hover` last found it on the canvas, kept here, the page's own.
// The camera is pancamera's: its keys and the wheel are its part of the table (`world.pancamera`).
import type { Row } from '#engine/engine.ts'
import type { Plugins } from '#engine/browser.ts'
import type { Binds } from '#plugins/player/player.plugin.ts'
import { def } from '#plugins/loader/loader.sim.ts'

// Whether the row is this seat's, and where the pointer last was on the canvas.
let ours = false
let pointer: [number, number] | undefined

export function setup(row: Row, plugins: Plugins) {
  ours = row.data.mine === true
  if (!ours) return
  const { keys } = def(plugins.wire, row.kind)
  const at = (x: number, y: number) => plugins.render2d.unproject(x, y) as number[]
  const blow = () => {
    if (!pointer) return
    const [x, y] = at(...pointer)
    plugins.player.explode(x, y)
  }
  const cam = plugins.pancamera.binds(plugins)
  plugins.player.bind({
    ...cam,
    press: {
      ...cam.press,
      ...Object.fromEntries((keys.explode as string[]).map(k => [k, blow])),
      ...Object.fromEntries((keys.wind as string[]).map(k => [k, ['wind']])),
    },
    axis: [{ keys: keys.drive, send: v => ['drive', v] }],
    click: (x, y) => {
      const [wx, wy] = at(x, y)
      return ['spawn', wx, wy]
    },
    hover: p => {
      pointer = p ?? undefined
      return undefined
    },
  } satisfies Binds)
}

export function tick() {}

export function remove(plugins: Plugins) {
  if (ours) plugins.player.unbind()
}
