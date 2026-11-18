const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const SchoolFightBombDodge = require('../js_schoolfight/bomb-dodge.js')

class Element extends EventTarget {
    constructor() {
        super()
        this.style = {}
        this.children = []
        this.classes = new Set()
        this.capture = new Set()
        this.classList = { add: value => this.classes.add(value), remove: value => this.classes.delete(value),
            toggle: (value, active) => active ? this.classes.add(value) : this.classes.delete(value) }
    }
    append(...nodes) { for (const node of nodes) { node.parentElement = this; this.children.push(node) } }
    replaceChildren() { this.children = [] }
    remove() { if (this.parentElement) this.parentElement.children = this.parentElement.children.filter(child => child !== this) }
    setPointerCapture(id) { this.capture.add(id) }
    hasPointerCapture(id) { return this.capture.has(id) }
    releasePointerCapture(id) { this.capture.delete(id) }
    getBoundingClientRect() { return { left: 20, width: 1100 } }
}

function setup() {
    const element = new Element()
    const parts = Object.fromEntries(['player', 'sprite', 'time', 'bombs', 'clouds'].map(key => [key, new Element()]))
    parts.sprite.parentElement = new Element()
    element.querySelector = selector => parts[selector.slice(12, -1)]
    const window = new EventTarget()
    const document = new EventTarget()
    document.hidden = false
    document.createElement = () => new Element()
    const hits = [], finishes = []
    const browser = vm.createContext({ SchoolFightBombDodge, window, document, AbortController,
        requestAnimationFrame: () => 1, cancelAnimationFrame() {} })
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../js_schoolfight/bomb-dodge-view.js'), 'utf8'), browser)
    const view = new browser.SchoolFightBombDodgeView.BombDodgeMinigame({ element,
        onHit: health => hits.push(health), onFinish: outcome => finishes.push(outcome) })
    view.start({ energy: 100, frontSprite: 'nerd-front', sideSprite: 'nerd-side' })
    return { view, element, parts, window, document, hits, finishes }
}

function send(target, type, properties = {}) {
    const event = new Event(type, { cancelable: true })
    for (const [key, value] of Object.entries(properties)) Object.defineProperty(event, key, { value })
    target.dispatchEvent(event)
    return event
}

test('held arrow keys move continuously, prevent scrolling and reset on blur', () => {
    const { view, window } = setup()
    assert.equal(send(window, 'keydown', { key: 'ArrowLeft' }).defaultPrevented, true)
    view.frame(0)
    view.frame(500)
    assert.ok(Math.abs(view.model.x - 165) < 0.00001)
    send(window, 'blur')
    assert.equal(view.input.direction, 0)
    view.frame(5000)
    assert.ok(Math.abs(view.model.x - 165) < 0.00001)
    view.stop()
    send(window, 'keydown', { key: 'ArrowRight' })
    assert.equal(view.input.direction, 0)
})

test('touch uses the scaled screen halves and releasing or cancelling stops movement', () => {
    const { view, element } = setup()
    send(element, 'pointerdown', { button: 0, pointerId: 7, clientX: 100 })
    assert.equal(view.input.direction, -1)
    assert.equal(element.hasPointerCapture(7), true)
    send(element, 'pointermove', { pointerId: 7, clientX: 1000 })
    assert.equal(view.input.direction, 1)
    send(element, 'pointercancel', { pointerId: 7 })
    assert.equal(view.input.direction, 0)
    send(element, 'pointerdown', { button: 0, pointerId: 8, clientX: 1000 })
    send(element, 'pointerup', { pointerId: 8 })
    assert.equal(view.input.direction, 0)
    view.stop()
})

test('a hit updates health and creates the existing stink cloud animation', () => {
    const { view, parts, hits } = setup()
    view.model.nextWaveAt = Infinity
    view.model.bombs = [{ id: 0, x: 275, y: 245, dropAt: -1250, speed: 220 }]
    view.frame(0)
    view.frame(16)
    assert.deepEqual(hits, [66])
    assert.equal(parts.clouds.children.length, 1)
    const burst = parts.clouds.children[0]
    assert.equal(burst.children.length, 9)
    assert.ok(burst.children.every(cloud => cloud.className === 'bombcloud'))
    burst.dispatchEvent(new Event('animationend'))
    assert.equal(parts.clouds.children.length, 1)
    send(burst, 'animationend', { target: burst.children[0] })
    assert.equal(parts.clouds.children.length, 0)
    view.stop()
})

test('a hit at the time limit finishes its reaction once before showing the result', () => {
    for (const health of [100, 34]) {
        const { view, parts, finishes, window } = setup()
        view.model.health = health
        view.model.elapsedMs = 24990
        view.model.nextWaveAt = Infinity
        view.model.bombs = [{ id: 0, x: 275, y: 190, dropAt: 23990, speed: 220 }]
        send(window, 'keydown', { key: 'ArrowRight' })
        view.frame(0)
        view.frame(10)
        assert.deepEqual(finishes, [])
        assert.equal(view.input.direction, 0)
        assert.equal(parts.bombs.children.length, 0)
        assert.equal(parts.sprite.parentElement.classes.has('running'), false)
        view.frame(660)
        view.frame(1000)
        assert.deepEqual(finishes, [health === 34 ? 'defeat' : 'victory'])
        assert.equal(parts.player.classes.has('dodge-hit'), false)
        assert.equal(parts.player.classes.has('dodge-invulnerable'), false)
        view.stop()
    }
})

test('control hints fade after two game seconds and reset on restart', () => {
    const { view, element } = setup()
    view.model.nextWaveAt = Infinity
    view.frame(0)
    view.frame(1999)
    assert.equal(element.classes.has('dodge-controls-hidden'), false)
    view.frame(2000)
    assert.equal(element.classes.has('dodge-controls-hidden'), true)
    view.start({ energy: 100, frontSprite: 'nerd-front', sideSprite: 'nerd-side' })
    assert.equal(element.classes.has('dodge-controls-hidden'), false)
    view.stop()
})

test('ground impacts create a burst at the floor without damaging the player', () => {
    const { view, parts, hits } = setup()
    view.model.nextWaveAt = Infinity
    view.model.bombs = [{ id: 0, x: 55, y: 245, dropAt: -1250, speed: 220 }]
    view.frame(0)
    view.frame(16)
    assert.equal(view.model.bombs.length, 0)
    assert.equal(view.model.health, 100)
    assert.deepEqual(hits, [])
    assert.equal(parts.clouds.children.length, 1)
    assert.match(parts.clouds.children[0].className, /dodge-ground-impact/)
    assert.equal(parts.bombs.children.length, 0)
    view.stop()
})

test('the controller completes once and removes inputs, bomb elements and effects on cleanup', () => {
    const { view, parts, window, finishes } = setup()
    view.model.nextWaveAt = Infinity
    view.frame(0)
    view.frame(25000)
    view.frame(26000)
    assert.deepEqual(finishes, ['victory'])
    send(window, 'keydown', { key: 'ArrowRight' })
    assert.equal(view.input.direction, 0)
    view.stop()
    assert.equal(parts.bombs.children.length, 0)
    assert.equal(parts.clouds.children.length, 0)
})

test('background tabs pause the simulation instead of advancing into unseen bombs', () => {
    const { view, window, document } = setup()
    view.frame(0)
    send(window, 'keydown', { key: 'ArrowRight' })
    document.hidden = true
    send(document, 'visibilitychange')
    view.frame(20000)
    document.hidden = false
    send(document, 'visibilitychange')
    view.frame(40000)
    assert.equal(view.model.elapsedMs, 0)
    assert.equal(view.input.direction, 0)
    view.stop()
})
