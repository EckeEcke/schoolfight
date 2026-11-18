const { test } = require('node:test')
const assert = require('node:assert/strict')
const { config, DodgeInput, BombDodgeGame } = require('../js_schoolfight/bomb-dodge.js')

function hit(game, count = 1) {
    game.bombs = Array.from({ length: count }, (_, id) => ({ id, x: game.x, y: 245,
        dropAt: game.elapsedMs - 273 / 0.22, speed: 220 }))
    return game.update(16)
}

test('three separate hits remove 34 health each and end in defeat', () => {
    const game = new BombDodgeGame()
    game.nextWaveAt = Infinity
    for (const expected of [66, 32, 0]) {
        assert.equal(hit(game)[0].health, expected)
        if (expected > 0) game.update(config.invulnerabilityMs + 1)
    }
    assert.equal(game.outcome, 'defeat')
    assert.deepEqual(game.update(1000), [])
})

test('overlapping bombs and the invulnerability interval cannot charge multiple hits', () => {
    const game = new BombDodgeGame()
    game.nextWaveAt = Infinity
    assert.equal(hit(game, 3).filter(event => event.type === 'hit').length, 1)
    assert.equal(game.health, 66)
    assert.equal(hit(game).filter(event => event.type === 'hit').length, 0)
    assert.equal(game.health, 66)
})

test('movement is continuous, independent of update size and constrained to screen edges', () => {
    const game = new BombDodgeGame()
    game.nextWaveAt = Infinity
    game.update(500, -1)
    assert.ok(Math.abs(game.x - 165) < 0.00001)
    game.update(2000, -1)
    assert.equal(game.x, 30)
    game.update(4000, 1)
    assert.equal(game.x, 520)
    game.update(1000, 0)
    assert.equal(game.x, 520)
})

test('swept updates detect a falling bomb even if a frame skips its collision zone', () => {
    const game = new BombDodgeGame()
    game.nextWaveAt = Infinity
    game.bombs = [{ id: 0, x: game.x, y: -28, dropAt: 0, speed: 220 }]
    const events = game.update(2500)
    assert.equal(events.filter(event => event.type === 'hit').length, 1)
    assert.equal(game.health, 66)
})

test('waves leave a safe lane that moves by at most one lane and has enough travel time', () => {
    let seed = 11
    const random = () => { seed = seed * 16807 % 2147483647; return seed / 2147483647 }
    const game = new BombDodgeGame({ random })
    for (let time = 0; time < config.durationMs; time += 1000) {
        game.elapsedMs = time
        game.bombs = []
        const previous = game.safeLane
        game.spawnWave()
        assert.ok(Math.abs(game.safeLane - previous) <= 1)
        assert.ok(game.bombs.every(bomb => Math.abs(bomb.x - game.safeX) > config.playerHalfWidth + config.bombRadius))
        assert.ok(game.bombs.every(bomb => bomb.dropAt - time >= config.warningMs))
        const speed = game.bombs[0].speed
        const hazardTime = (config.ground - config.playerTop + 2 * config.bombRadius) / speed * 1000
        assert.ok(game.nextWaveAt - time > hazardTime + 110 / config.speed * 1000 + 150)
    }
})

test('shifted patterns cover every playable position including old gaps and edges', () => {
    let seed = 37
    const game = new BombDodgeGame({ random: () => {
        seed = seed * 16807 % 2147483647
        return seed / 2147483647
    } })
    const covered = new Set()
    const patterns = new Set()
    const positions = new Set()
    let previousPattern = -1
    for (let wave = 0; wave < 200; wave++) {
        game.elapsedMs = wave % 25 * 1000
        game.bombs = []
        game.spawnWave()
        assert.notEqual(game.pattern, previousPattern)
        previousPattern = game.pattern
        patterns.add(game.pattern)
        for (const bomb of game.bombs) {
            positions.add(Math.round(bomb.x))
            for (let x = 30; x <= 520; x++) {
                if (Math.abs(x - bomb.x) <= config.playerHalfWidth + config.bombRadius) covered.add(x)
            }
        }
    }
    assert.equal(covered.size, 491)
    assert.equal(patterns.size, 4)
    assert.ok(positions.size > 100)
})

test('surviving 25 seconds wins once and preserves remaining health', () => {
    const game = new BombDodgeGame({ health: 66 })
    game.nextWaveAt = Infinity
    game.update(24999)
    assert.equal(game.outcome, null)
    game.update(1)
    assert.equal(game.outcome, 'victory')
    assert.equal(game.health, 66)
    const x = game.x
    game.update(1000, 1)
    assert.equal(game.x, x)
})

test('seeded bomb waves allow a player following reachable gaps to survive a complete round', () => {
    for (let seed = 1; seed <= 20; seed++) {
        let state = seed
        const game = new BombDodgeGame({ random: () => {
            state = state * 16807 % 2147483647
            return state / 2147483647
        } })
        while (!game.outcome) {
            const first = game.bombs.reduce((best, bomb) => !best || bomb.dropAt < best.dropAt ? bomb : best, null)
            const target = first ? first.safeX : game.x
            game.update(25, Math.abs(target - game.x) < 6 ? 0 : Math.sign(target - game.x))
        }
        assert.equal(game.outcome, 'victory', `Seed ${seed}`)
        assert.equal(game.health, 100, `Seed ${seed}`)
    }
})

test('bombs hit the visible upper body before reaching the floor', () => {
    const game = new BombDodgeGame()
    game.nextWaveAt = Infinity
    game.bombs = [{ id: 0, x: game.x, y: -28, dropAt: 0, speed: 220 }]
    assert.deepEqual(game.update(700), [])
    assert.equal(game.health, 100)
    assert.equal(game.bombs.length, 1)
    assert.equal(game.update(200)[0].type, 'hit')
    assert.equal(game.health, 66)
    assert.equal(game.bombs.length, 0)
})

test('keyboard and touch combine without stuck keys or double speed', () => {
    const input = new DodgeInput()
    input.keys.add(-1)
    input.pointers.set(1, -1)
    assert.equal(input.direction, -1)
    input.keys.add(1)
    assert.equal(input.direction, 0)
    input.keys.clear()
    input.pointers.set(1, 1)
    assert.equal(input.direction, 1)
    input.reset()
    assert.equal(input.direction, 0)
})
