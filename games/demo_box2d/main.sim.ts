// The kinds of main and the main.scene.json file next to this one: box2d's world, side on, under
// render2d's camera, which pancamera pans and zooms. box2d's row is the world; every body and joint
// kind is a row box2d moves, its numbers box2d's table `world.box2d`; the static bodies are drawn by
// the `ground` row. The seat's `player` row holds the `car` and drives it on its two `axle` wheel
// joints; it spawns the falling kinds, sets off explosions and toggles the `wind`. The `zone` is a
// sensor that lights while something is inside it, the `slide` runs the piston up and down. Every
// number of the kinds that never changes is its definition in `assets/demo_box2d.json`.
import type { Scene, Sim } from '#engine/engine.ts'
import { scenemanager } from '#plugins/scenemanager/scenemanager.sim.ts'
import { loader } from '#plugins/loader/loader.sim.ts'
import { box2d } from '#plugins/box2d/box2d.sim.ts'
import { player } from './player.sim.ts'
import { ground } from './ground.sim.ts'
import { wind } from './wind.sim.ts'
import { zone } from './zone.sim.ts'
import { car } from './car.sim.ts'
import { wheel } from './wheel.sim.ts'
import { axle } from './axle.sim.ts'
import { crate } from './crate.sim.ts'
import { ball } from './ball.sim.ts'
import { pill } from './pill.sim.ts'
import { gem } from './gem.sim.ts'
import { plank } from './plank.sim.ts'
import { pivot } from './pivot.sim.ts'
import { piston } from './piston.sim.ts'
import { slide } from './slide.sim.ts'
import { bob } from './bob.sim.ts'
import { swing } from './swing.sim.ts'
import { head } from './head.sim.ts'
import { torso } from './torso.sim.ts'
import { arm } from './arm.sim.ts'
import { leg } from './leg.sim.ts'
import { neck } from './neck.sim.ts'
import { shoulder } from './shoulder.sim.ts'
import { elbow } from './elbow.sim.ts'
import { hip } from './hip.sim.ts'
import { knee } from './knee.sim.ts'
import { link } from './link.sim.ts'
import { knot } from './knot.sim.ts'
import file from './main.scene.json' with { type: 'json' }

export const sim: Sim = {
  scenemanager, loader, box2d, player, ground, wind, zone,
  car, wheel, axle, crate, ball, pill, gem, plank, pivot, piston, slide, bob, swing,
  head, torso, arm, leg, neck, shoulder, elbow, hip, knee, link, knot,
}

export const scene = file as Scene
