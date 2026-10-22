# demo_box2d

box2d's rigid bodies side-on in render2d: boxes, circles, capsules and polygons falling and stacking
on a chain floor; a one-way platform, a sensor zone that lights while something is in it, a ramp and
a seesaw on a revolute joint; a car on two wheel joints to drive; a ragdoll of revolute joints, a
pendulum, a rope of distance joints and a piston on a prismatic joint. The world is `world.box2d` in
`main.scene.json`, and the kinds' numbers are in `assets/demo_box2d.json`.

## Playing it

`yarn vite`, then `/games/demo_box2d/dev.html`, the demo: three's stats panel at the top left, and
box2d's panel at the right with the world's settings, the kinds, the joints, copy JSON, reset to the
file and a render2d folder. `/games/demo_box2d/index.html` is the game as it ships. Its server is
`node --experimental-strip-types games/demo_box2d/demo_box2d.server.ts`, then
`/games/demo_box2d/client.html`.

| Key | What it does |
| --- | --- |
| ← → | drive the car |
| click | spawn the next body under the pointer |
| Space | an explosion under the pointer |
| F | wind on and off |
| WASD, canvas edges | pan |
| wheel | zoom |

Every key is in `assets/demo_box2d.json` and `main.scene.json` (`world.pancamera`).

## The art

None: every body is drawn from its shapes, so there is nothing to bake.
