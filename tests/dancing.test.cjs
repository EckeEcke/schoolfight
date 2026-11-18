const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const SchoolFightRhythm = require('../js_schoolfight/rhythm.js')
const SchoolFightDanceBeatmap = require('../js_schoolfight/dance-beatmap.js')

function createDanceGame() {
    const source = fs.readFileSync(path.join(__dirname, '../js_schoolfight/script.js'), 'utf8')
    const danceSource = source.slice(source.indexOf('    let CANVAS_WIDTH_LOGICAL')).replace(/\}\)\s*$/, '')
    const listeners = {}
    const texts = []
    const drawing = new Proxy({}, { get: (_, name) => name === 'fillText'
        ? text => texts.push(text) : () => ({ addColorStop() {} }), set: () => true })
    const element = { classList: { add() {}, remove() {} }, style: { setProperty() {} }, getContext: () => drawing,
        addEventListener: (name, callback) => { listeners[name] = callback } }
    const audio = { currentTime: 0, duration: 120, paused: false, playbackRate: 1, pause() {}, addEventListener() {} }
    const sounds = new Proxy({ danceMusic: audio }, { get: (target, key) => target[key] ?? audio })
    const game = { round: 7, player: { party: [{}, { energy: 100 }, {}] } }
    const gameFlow = { state: 'selectTargets', can(action) { return action === 'dance' && this.state === 'dancing' } }
    let frame = 0
    const cancelledFrames = []
    const browser = vm.createContext({
        SchoolFightRhythm, SchoolFightDanceBeatmap, sounds, game, gameFlow, fontSizeScaling: 1,
        gameStates: { dancing: 'dancing', levelComplete: 'levelComplete' },
        updateGameState: state => { gameFlow.state = state },
        showGameOverScreen: () => { gameFlow.state = 'gameOver' },
        addHidden() {}, removeHidden() {}, playSound() {}, playAudio() {},
        itemBox: element, openShopButton: element, energyBarMiniGame: element,
        document: { getElementById: () => element }, window: { devicePixelRatio: 1 },
        Image: class {}, ResizeObserver: class { observe() {} },
        performance: { now: () => 1000, timeOrigin: 0 },
        requestAnimationFrame: () => ++frame,
        cancelAnimationFrame: id => cancelledFrames.push(id),
    })
    vm.runInContext(danceSource + `
        globalThis.dance = { startDancingGame, gameLoop, handleClick, Note,
            get hitLine() { return HIT_LINE_Y },
            get notes() { return activeNotes }, get score() { return score },
            get firstHitTime() { return beatmap.notes[0].timeMs },
            get lastHitTime() { return beatmap.notes.at(-1).timeMs } }
    `, browser)
    browser.dance.startDancingGame()
    return { dance: browser.dance, audio, game, gameFlow, listeners, cancelledFrames, texts }
}

test('an on-beat pointer press hits despite a stale frame and arbitrary pointer position', () => {
    const { dance, audio, game, listeners } = createDanceGame()
    assert.deepEqual(Object.keys(listeners), ['pointerdown'])
    audio.currentTime = (dance.firstHitTime - 200) / 1000
    dance.gameLoop()
    const previousY = dance.notes[0].y
    audio.currentTime = dance.firstHitTime / 1000
    listeners.pointerdown({ button: 0, isPrimary: true, timeStamp: 1000, clientX: -100, clientY: -100, preventDefault() {} })
    assert.equal(dance.notes[0].judgment, 'Perfect!')
    assert.equal(dance.notes[0].y, previousY)
    assert.equal(dance.score, 100)
    assert.equal(game.player.party[1].energy, 100)
})

test('a poor hit with the final health points ends the minigame immediately', () => {
    const { dance, audio, game, gameFlow, cancelledFrames } = createDanceGame()
    audio.currentTime = (dance.firstHitTime - 200) / 1000
    dance.gameLoop()
    audio.currentTime = (dance.firstHitTime + 100) / 1000
    game.player.party[1].energy = 2
    dance.handleClick({ button: 0, timeStamp: 1000, preventDefault() {} })
    assert.equal(dance.notes[0].judgment, 'Poor!')
    assert.equal(gameFlow.state, 'gameOver')
    assert.equal(cancelledFrames.length, 1)
})

test('late frames stop processing missed notes once the player loses', () => {
    const { dance, audio, game, gameFlow } = createDanceGame()
    game.player.party[1].energy = 10
    audio.currentTime = 20
    dance.gameLoop()
    assert.equal(gameFlow.state, 'gameOver')
    assert.equal(game.player.party[1].energy, 0)
    assert.equal(dance.notes.filter(note => note.missed).length, 1)
})

test('secondary touches and right-clicks cannot consume a note', () => {
    const { dance, audio, game } = createDanceGame()
    audio.currentTime = dance.firstHitTime / 1000
    dance.gameLoop()
    dance.handleClick({ isPrimary: false, button: 0 })
    dance.handleClick({ isPrimary: true, button: 2 })
    assert.equal(dance.notes[0].hit, false)
    assert.equal(game.player.party[1].energy, 100)
})

test('the short chart preserves its first note and leaves the final hit window before the cut', () => {
    const { dance } = createDanceGame()
    assert.ok(Math.abs(dance.firstHitTime - 4173.913043478261) < 0.001)
    assert.equal(dance.lastHitTime, 57913.043)
    assert.ok(dance.lastHitTime + 150 < SchoolFightDanceBeatmap.durationMs)
})

test('the countdown uses the short level duration even when the audio lasts two minutes', () => {
    const { dance, audio, texts } = createDanceGame()
    audio.currentTime = 0
    dance.gameLoop()
    assert.ok(texts.includes('Time: 00:58'))
})

test('music fades at the end and victory happens at the configured musical boundary', () => {
    const { dance, audio, game, gameFlow, cancelledFrames } = createDanceGame()
    for (const note of SchoolFightDanceBeatmap.notes) {
        audio.currentTime = note.timeMs / 1000
        dance.gameLoop()
        dance.handleClick({ button: 0, timeStamp: 1000, preventDefault() {} })
    }
    assert.equal(game.player.party[1].energy, 100)
    const endMs = SchoolFightDanceBeatmap.durationMs
    audio.currentTime = (endMs - SchoolFightDanceBeatmap.fadeOutMs / 2) / 1000
    dance.gameLoop()
    assert.ok(Math.abs(audio.volume - 0.3) < 0.00001)
    audio.currentTime = (endMs - 1) / 1000
    dance.gameLoop()
    assert.equal(gameFlow.state, 'dancing')
    audio.currentTime = endMs / 1000
    dance.gameLoop()
    assert.equal(audio.volume, 0)
    assert.equal(gameFlow.state, 'levelComplete')
    assert.equal(game.round, 8)
    assert.equal(cancelledFrames.length, 1)
    dance.gameLoop()
    assert.equal(game.round, 8)
})

test('a missed final note can still cause defeat before the cut', () => {
    const { dance, audio, game, gameFlow } = createDanceGame()
    for (const note of SchoolFightDanceBeatmap.notes.slice(0, -1)) {
        audio.currentTime = note.timeMs / 1000
        dance.gameLoop()
        dance.handleClick({ button: 0, timeStamp: 1000, preventDefault() {} })
    }
    game.player.party[1].energy = 10
    audio.currentTime = (dance.lastHitTime + 151) / 1000
    dance.gameLoop()
    assert.equal(gameFlow.state, 'gameOver')
})

test('every concrete chart note reaches the rendered hit line at its timestamp', () => {
    const { dance } = createDanceGame()
    for (const data of SchoolFightDanceBeatmap.notes) {
        const note = new dance.Note(data.timeMs, data.beat)
        note.update(data.timeMs - 1)
        assert.ok(note.y < dance.hitLine)
        note.update(data.timeMs)
        assert.equal(note.y, dance.hitLine)
        note.update(data.timeMs + 1)
        assert.ok(note.y > dance.hitLine)
    }
})
