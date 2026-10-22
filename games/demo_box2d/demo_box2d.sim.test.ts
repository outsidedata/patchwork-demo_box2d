// demo_box2d: the manager booted as its page boots it and main loaded, and a seat joined. The seat
// holds the car, drives it right and back left into the sensor zone, which then names it among its
// visitors; a click spawns the definition's `spawns` in turn where it was made; an explosion throws
// the pile; and the piston runs up to its upper limit and back down to its lower.
import { expect, test } from 'vitest'
import { boot, type Row, type Scene } from '#engine/engine.ts'
import { connection, load, manager, type Down } from '#addons/scenemanager/scenemanager.addon.ts'
import { sim } from './demo_box2d.sim.ts'
import file from './demo_box2d.scene.json' with { type: 'json' }
import main from './main.scene.json' with { type: 'json' }
import defs from './assets/demo_box2d.json' with { type: 'json' }

const DT = file.prefabs.engine.dt

async function seated() {
  const truth = boot(structuredClone(file) as Scene, sim)
  const room = (await load(truth, import.meta.url)).get('main')!
  const heard: Down[] = []
  const seat = connection(manager(truth), d => heard.push(d))
  truth.step(DT)
  let seq = 0
  const press = (action: string, ...args: number[]) => {
    const last = heard[heard.length - 1]
    const me = last.packet.rows.find(r => r.kind === 'player' && r.data.mine)!
    seat.take({ scene: last.scene, seat: last.seat, msg: { seq: ++seq, n: last.packet.n, id: me.id, action, args } })
  }
  const run = (k: number) => { for (let i = 0; i < k; i++) truth.step(DT) }
  const of = (kind: string) => room.rows.filter((r: Row) => r.kind === kind)
  return { press, run, of }
}

test('the seat drives the car right, then back left into the zone, which names it', async () => {
  const { press, run, of } = await seated()
  const [car] = of('car')
  const x0 = car.data.pos[0]
  press('drive', 1)
  run(90)
  expect(car.data.pos[0]).toBeGreaterThan(x0 + 2)
  press('drive', -1)
  const [zone] = of('zone')
  for (let i = 0; i < 600 && car.data.pos[0] > zone.data.pos[0]; i++) run(1)
  expect(car.data.pos[0]).toBeLessThanOrEqual(zone.data.pos[0])
  expect(zone.data.visitors).toContain(car.id)
})

test('a click spawns the definition\'s spawns in turn, each where it was made', async () => {
  const { press, run, of } = await seated()
  const before = Object.fromEntries(defs.player.spawns.map(k => [k, of(k).length]))
  defs.player.spawns.forEach((_, i) => press('spawn', 20 + 2 * i, 20))
  run(1)
  defs.player.spawns.forEach((k, i) => {
    const made = of(k)
    expect(made).toHaveLength(before[k] + 1)
    expect(made[made.length - 1].data.pos[0]).toBeCloseTo(20 + 2 * i, 5)
  })
})

test('an explosion at the pile throws it', async () => {
  const { press, run, of } = await seated()
  run(240)
  const pile = of('crate')
  const speed = () => Math.max(...pile.map(r => Math.hypot(...(r.data.vel as [number, number]))))
  expect(speed()).toBeLessThan(1)
  const [x, y] = pile[0].data.pos
  press('explode', x, y - 0.5)
  run(2)
  expect(speed()).toBeGreaterThan(3)
})

test('the piston runs up to its upper limit and back down to its lower', async () => {
  const { run, of } = await seated()
  const [slide] = of('slide')
  const { lowerTranslation, upperTranslation } = main.world.box2d.joints.slide
  let top = -Infinity
  for (let i = 0; i < 300 && slide.data.motorSpeed >= 0; i++) { run(1); top = Math.max(top, slide.data.measured?.translation ?? top) }
  expect(top).toBeGreaterThan(upperTranslation - 2 * defs.slide.margin)
  let bottom = Infinity
  for (let i = 0; i < 300 && slide.data.motorSpeed < 0; i++) { run(1); bottom = Math.min(bottom, slide.data.measured.translation) }
  expect(bottom).toBeLessThan(lowerTranslation + 2 * defs.slide.margin)
})
