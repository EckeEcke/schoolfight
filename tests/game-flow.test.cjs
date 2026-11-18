const { test } = require('node:test')
const assert = require('node:assert/strict')
const { GameFlow, gameStates } = require('../js_schoolfight/game-flow.js')

test('battle and item input is allowed only during target selection', () => {
    const flow = new GameFlow()
    for (const state of Object.values(gameStates)) {
        flow.enter(state)
        assert.equal(flow.can('battle'), state === 'selectTargets')
        assert.equal(flow.can('item'), state === 'selectTargets')
    }
})

test('dialogues, shop, minigames and level completion have separate permissions', () => {
    const flow = new GameFlow()
    for (const [state, action] of [['title', 'start'], ['dialogue', 'dialogue'],
        ['shop', 'purchase'], ['ropeSkip', 'jump'], ['running', 'run'],
        ['dancing', 'dance'], ['bombDodge', 'dodge'], ['levelComplete', 'nextRound']]) {
        flow.enter(state)
        assert.equal(flow.can(action), true)
        flow.enter('transition')
        assert.equal(flow.can(action), false)
    }
    assert.equal(flow.can('unknown'), false)
})

test('callbacks from an earlier phase cannot reopen input after victory or defeat', () => {
    const flow = new GameFlow()
    for (const terminal of ['victory', 'gameOver']) {
        flow.enter('battleAnimation')
        const finishAnimation = flow.guard(() => flow.enter('selectTargets'))
        flow.enter(terminal)
        finishAnimation()
        assert.equal(flow.state, terminal)
    }
})

test('returning to a phase does not revive its old callbacks', () => {
    const flow = new GameFlow()
    flow.enter('shop')
    let calls = 0
    const callback = flow.guard(() => calls++)
    flow.enter('transition')
    flow.enter('shop')
    callback()
    assert.equal(calls, 0)
    flow.guard(() => calls++)()
    assert.equal(calls, 1)
})

test('scheduled phase callbacks expire when the phase changes', t => {
    t.mock.timers.enable({ apis: ['setTimeout'] })
    const flow = new GameFlow()
    flow.enter('bombAnimation')
    flow.after(() => flow.enter('selectTargets'), 5000)
    flow.enter('levelComplete')
    t.mock.timers.tick(5000)
    assert.equal(flow.state, 'levelComplete')
    flow.after(() => flow.enter('transition'), 1000)
    t.mock.timers.tick(1000)
    assert.equal(flow.state, 'transition')
})

test('unknown phases fail without changing the active phase', () => {
    const flow = new GameFlow()
    assert.throws(() => flow.enter('typo'), /Unknown game state/)
    assert.equal(flow.state, 'title')
})
