// demo_box2d's shapes: how every body, joint and static body of the demo is drawn, for every look
// that draws one. Nothing here holds a number: a thing's geometry is box2d's own table, the scene's
// `world.box2d` (a kind's `shapes`, a joint kind's frames, the `static` bodies), and its paint is the
// drawing kind's definition in `assets/demo_box2d.json`: `layer` (the render2d layer it is drawn on),
// `fill`, `line`, `width` (the outline's width, metres) and, where it has one, `alpha`.
//
// Everything is drawn in metres, as box2d's tables give it, and scaled on to the stage by render2d's
// `ground()`, asked each frame (`fit`), so the panel's ground scale redraws nothing.
//
//   body(row, plugins)          a body row's shapes, one PIXI Graphics, on its kind's layer, handed to
//                               box2d's `follow`, so it stands at the row's `pos` and turns by its
//                               `rot`. A circle carries a spoke from its centre, so its turn shows.
//   repaint(drawn, row, plugins, alpha)  a body's shapes traced again, filled at `alpha`.
//   fit(drawn, plugins)         a body's Graphics scaled by the ground, each frame.
//   bar(row, plugins)           a joint row's bar, a Graphics one unit long and its kind's `width` thick.
//   stretch(drawn, row, plugins)  the bar laid from its joint's anchor on body `a`, the body's point
//                               at its local frame A's `pos` (the row's frame, else its kind's, else
//                               the body's centre), to the centre of body `b`: a pendulum's rod, a
//                               rope's length, a piston's rod. A static body is
//                               `world.box2d.static[-(a + 1)]`.
//   statics(row, plugins)       every static body of `world.box2d.static`, one Graphics in the world's
//                               metres: a chain as a band `depth` metres thick behind it, a
//                               polygon or a box from box2d's `outline`, a circle as a disc, a segment as
//                               a line; a shape with `oneWay` in the definition's `oneWay` paint.
//   place(drawn, plugins)       the statics' Graphics stood on the world's origin and scaled, each frame.
//   gone(drawn, id, plugins)    a drawing taken off its layer and destroyed, and box2d's follow dropped.
import type { Row } from '#engine/engine.ts'
import type { Plugins } from '#engine/browser.ts'
import { def, json } from '#plugins/loader/loader.sim.ts'
import { outline, type Joint, type Shape, type Vec2, type World } from '#plugins/box2d/box2d.sim.ts'

type Paint = { layer: string; fill: string; line?: string; width: number; alpha?: number }
type Graphics = any

const box2dOf = (plugins: Plugins): World => plugins.wire.scene.world!.box2d

// One shape's outline traced on `g`, then filled and stroked in `paint`.
function trace(g: Graphics, s: Shape, paint: Paint, plugins: Plugins) {
  const fill = { color: paint.fill, alpha: paint.alpha ?? 1 }
  const stroke = { width: paint.width, color: paint.line ?? paint.fill }
  if ('circle' in s) {
    const { center: [x, y], radius: r } = s.circle
    g.circle(x, y, r).fill(fill).stroke(stroke)
    g.moveTo(x, y).lineTo(x + r, y).stroke(stroke)
    return
  }
  if ('capsule' in s) {
    const { center1: [x1, y1], center2: [x2, y2], radius: r } = s.capsule
    const a = Math.atan2(y2 - y1, x2 - x1)
    g.moveTo(x1 + r * Math.cos(a - Math.PI / 2), y1 + r * Math.sin(a - Math.PI / 2))
    g.arc(x2, y2, r, a - Math.PI / 2, a + Math.PI / 2)
    g.arc(x1, y1, r, a + Math.PI / 2, a + (3 * Math.PI) / 2)
    g.closePath().fill(fill).stroke(stroke)
    return
  }
  if ('segment' in s) {
    g.moveTo(...s.segment.point1).lineTo(...s.segment.point2).stroke(stroke)
    return
  }
  if ('box' in s) {
    const [hx, hy] = s.box, [px, py] = s.pos ?? [0, 0], [c, n] = s.rot ?? [1, 0]
    const corners = [[-hx, -hy], [hx, -hy], [hx, hy], [-hx, hy]].flatMap(([x, y]) => [px + c * x - n * y, py + n * x + c * y])
    g.poly(corners).fill(fill).stroke(stroke)
    return
  }
  if ('polygon' in s) {
    g.poly(s.polygon.points).fill(fill).stroke(stroke)
    return
  }
  const chain = 'asset' in s.chain ? json(plugins.wire, s.chain.asset) : s.chain
  g.poly(chain.points, chain.isLoop).stroke(stroke)
}

export function body(row: Row, plugins: Plugins): Graphics {
  const paint: Paint = def(plugins.wire, row.kind)
  const g = new plugins.render2d.PIXI.Graphics()
  repaint(g, row, plugins, paint.alpha ?? 1)
  plugins.render2d.layer(paint.layer).addChild(g)
  plugins.box2d.follow(row.id, g)
  return g
}

// A body's Graphics cleared and its shapes traced again, filled at `alpha`.
export function repaint(g: Graphics, row: Row, plugins: Plugins, alpha: number) {
  const paint: Paint = { ...def(plugins.wire, row.kind), alpha }
  g.clear()
  for (const s of box2dOf(plugins).kinds[row.kind].shapes) trace(g, s, paint, plugins)
}

export function fit(g: Graphics, plugins: Plugins) {
  const [[gx], [, gy]] = plugins.render2d.ground()
  g.scale.set(gx, gy)
}

export function bar(row: Row, plugins: Plugins): Graphics {
  const paint: Paint = def(plugins.wire, row.kind)
  const g = new plugins.render2d.PIXI.Graphics().rect(0, -paint.width / 2, 1, paint.width).fill({ color: paint.fill, alpha: paint.alpha ?? 1 })
  plugins.render2d.layer(paint.layer).addChild(g)
  return g
}

// The world point of a joint's end: body `at`'s point at its local frame's `pos`.
function anchor(plugins: Plugins, at: number, frame: Vec2): Vec2 {
  const world = box2dOf(plugins)
  const { pos, rot } = at < 0 ? world.static[-at - 1] : plugins.wire.rows.find(r => r.id === at)!.data
  return [pos[0] + rot[0] * frame[0] - rot[1] * frame[1], pos[1] + rot[1] * frame[0] + rot[0] * frame[1]]
}

export function stretch(g: Graphics, row: Row, plugins: Plugins) {
  const kind = box2dOf(plugins).joints![row.kind] as Joint
  const frameA: Vec2 = (row.data.localFrameA ?? kind.localFrameA)?.pos ?? [0, 0]
  const render2d = plugins.render2d
  const [ax, ay] = render2d.place(anchor(plugins, row.data.a, frameA))
  const [bx, by] = render2d.place(anchor(plugins, row.data.b, [0, 0]))
  const [[gx], [, gy]] = render2d.ground()
  g.position.set(ax, ay)
  g.rotation = Math.atan2(by - ay, bx - ax)
  g.scale.set(Math.hypot(bx - ax, by - ay), Math.abs(gy) || Math.abs(gx))
}

export function statics(row: Row, plugins: Plugins): Graphics {
  const paint = def(plugins.wire, row.kind) as Paint & { depth: number; oneWay: Omit<Paint, 'layer' | 'width'> }
  const list = box2dOf(plugins).static
  const g = new plugins.render2d.PIXI.Graphics()
  list.forEach((b, i) => {
    for (const s of b.shapes) {
      const own: Paint = s.oneWay ? { ...paint, ...paint.oneWay } : paint
      const fill = { color: own.fill, alpha: own.alpha ?? 1 }
      const stroke = { width: own.width, color: own.line ?? own.fill }
      const groups = outline(list, i, s, plugins.wire)
      if ('chain' in s) {
        // The chain's points, and the same points `depth` metres out behind it, on the left of each
        // segment's direction (a chain collides on its right), mitred where two segments meet.
        const points = [groups[0][0], ...groups.map(([, q]) => q)]
        const normal = (p: Vec2, q: Vec2): Vec2 => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); return [-(q[1] - p[1]) / d, (q[0] - p[0]) / d] }
        const out = points.map((p, k) => {
          const n1 = normal(points[Math.max(0, k - 1)], points[Math.max(1, k)])
          const n2 = normal(points[Math.min(k, points.length - 2)], points[Math.min(k + 1, points.length - 1)])
          const m: Vec2 = [n1[0] + n2[0], n1[1] + n2[1]]
          const along = (m[0] * n1[0] + m[1] * n1[1]) || 1
          return [p[0] + (m[0] / along) * paint.depth, p[1] + (m[1] / along) * paint.depth]
        })
        g.poly([...points, ...out.reverse()].flat()).fill(fill)
        g.poly(points.flat(), false).stroke(stroke)
      } else if ('circle' in s) {
        const [c, edge] = groups[0]
        g.circle(c[0], c[1], Math.hypot(edge[0] - c[0], edge[1] - c[1])).fill(fill).stroke(stroke)
      } else if ('segment' in s) {
        g.moveTo(...groups[0][0]).lineTo(...groups[0][1]).stroke(stroke)
      } else {
        g.poly(groups[0].flat()).fill(fill).stroke(stroke)
      }
    }
  })
  plugins.render2d.layer(paint.layer).addChild(g)
  return g
}

export function place(g: Graphics, plugins: Plugins) {
  const [x, y] = plugins.render2d.place([0, 0])
  g.position.set(x, y)
  fit(g, plugins)
}

export function gone(g: Graphics, id: number, plugins: Plugins) {
  plugins.box2d.drop(id)
  g.parent?.removeChild(g)
  g.destroy()
}
