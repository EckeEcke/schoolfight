# School Fight

## About

School Fight is a turn based fighting game. Choose your party and battle it out in 3vs3 fights to become king of school!
There are three types of characters: strength, intelligence and assholiness. The mechanics work by a rock paper scissors principle: 
strength is effective against intelligence, intelligence is effective against assholiness and assholiness is effective against strength
All characters (including the opponent party) attack at the same time. This gives the fights a unique dynamic.
Use items to deal damage or replenish your health. New items and stat upgrades can be purchased in the shop in between battles. You earn $1 per character who survived a level. Beat all ten levels including three mini games and a boss battle.

## How to play

Open index.html or go to https://eckeecke.github.io/schoolfight/ to start the game. Choose three characters for your party. Click on a character. Select a type of attack and an opponent to attack. Do this for all your party members. Alternatively set a character on defending to reduce taken damage next turn. To control minigames you need to click on the screen. To use an item simply click one of the icons on the bottom of the screen. The sandwich recovers health for your whole party. The bomb damages all opoonents. The more of your characters survive a fight, the more items you can obtain.

![alt text](./images_schoolfight/tutorial.png)

## Used Technologies

The game is written in Javascript using mainly regular HTML and CSS for displaying graphics.

## Code structure and tests

- [characters.js](./js_schoolfight/characters.js): character templates, attack types and character health/stat behavior.
- [combat.js](./js_schoolfight/combat.js): damage calculation, type advantages, enemy target selection, attack rotation and complete battle rounds. No DOM, audio or timer dependencies.
- [levels.js](./js_schoolfight/levels.js): level types, enemy teams, backgrounds and both dialogue variants. Creates fresh enemy characters for each level, including the revenge boss from the saved victory team.
- [audio.js](./js_schoolfight/audio.js): playback error handling, including interrupted sounds.
- [game-flow.js](./js_schoolfight/game-flow.js): active phase, input permissions and guards for delayed phase callbacks.
- [script.js](./js_schoolfight/script.js): UI, animations, shop, minigames and orchestration.

Scripts load in that order in [index.html](./index.html). The game still runs by opening that file directly; no build or installation is required.

`resolveBattleRound` updates the supplied character instances and returns attack/defense events, surviving character counts, the next attack rotation state and an outcome (`continue`, `victory` or `defeat`). Enemy actions resolve first; queued player actions still execute even if their attacker falls during that round. Losing all players takes priority in a double knockout. The UI presents these results and handles animations and level transitions separately.

`GameFlow` owns the current phase. Input handlers use `can(action)` instead of separate animation/dialogue lock flags. Phase-dependent timers use `after(callback, delay)`; their callbacks expire when the phase changes, including when the game later returns to the same phase. Cosmetic animation cleanup can use ordinary timers.

Run the core rule tests with Node.js 24 (the version used for validation):

```sh
node --test tests/*.test.cjs
```

## Campaign data

Each entry in [levels.js](./js_schoolfight/levels.js) defines a station. Its array index is the internal zero-based round number; its `id` is the displayed one-based level number. To change a station, edit its enemy keys, dialogue, background or `type` there. The final station has `boss: true`; victory is reached after the last entry rather than a hard-coded round count.

| Level | Type | Enemies |
| --- | --- | --- |
| 1 | Battle | Bully, Nerd, Normie |
| 2 | Battle | Squealer, Wally, Richkid |
| 3 | Rope skipping | — |
| 4 | Battle | Three Sportskids |
| 5 | Battle | Richkid, Nerd, Bully |
| 6 | Running | — |
| 7 | Battle | Three Richkids |
| 8 | Dancing | — |
| 9 | Battle | Three Nerds |
| 10 | Boss battle | Teacher; previous victory team in revenge mode |

Minigames retain three dummy enemy slots for the existing UI. Adding a new minigame type also requires a corresponding start/setup handler in [script.js](./js_schoolfight/script.js).

## Browser regression checks

After changes to the game flow, check both a normal run and revenge mode:

- Select characters, advance both dialogue messages and complete a battle with attacks and defense.
- Use a snack and bomb; verify that other combat actions stay blocked during their animations.
- Open the shop, buy an affordable item or upgrade, leave and advance to the next level.
- Complete rope skipping, running and dancing; also check their game-over screens.
- Finish the boss, check the victory screen and verify that revenge uses the saved winning team.

Automated browser flow checks used controlled combat stats, mocked audio and direct minigame completion calls to cover all ten stations in both modes, plus the battle/minigame loss paths. These checks validate transitions; real audio, pointer interaction and minigame timing still require a manual playthrough.
