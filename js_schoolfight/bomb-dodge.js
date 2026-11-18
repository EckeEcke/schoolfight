(function (root) {
    'use strict'

    const config = Object.freeze({
        width: 550,
        height: 314,
        durationMs: 25000,
        speed: 220,
        damage: 34,
        invulnerabilityMs: 1000,
        warningMs: 450,
        playerHalfWidth: 22,
        playerTop: 186,
        ground: 280,
        bombRadius: 18,
        bombHeight: 64,
        lanes: Object.freeze([55, 165, 275, 385, 495]),
    })

    class DodgeInput {
        constructor() {
            this.keys = new Set()
            this.pointers = new Map()
        }

        get direction() {
            const directions = new Set([...this.keys, ...this.pointers.values()])
            return Number(directions.has(1)) - Number(directions.has(-1))
        }

        reset() {
            this.keys.clear()
            this.pointers.clear()
        }
    }

    class BombDodgeGame {
        constructor({ health = 100, random = Math.random } = {}) {
            this.health = health
            this.random = random
            this.x = config.width / 2
            this.elapsedMs = 0
            this.invulnerableUntil = 0
            this.nextWaveAt = 900
            this.safeLane = 2
            this.nextId = 0
            this.waveId = 0
            this.pattern = -1
            this.bombs = []
            this.outcome = null
        }

        spawnWave() {
            const difficulty = Math.min(1, this.elapsedMs / config.durationMs)
            const count = 4 + Math.min(1, Math.floor(difficulty * 3))
            this.safeLane = Math.max(0, Math.min(count, this.safeLane + Math.floor(this.random() * 3) - 1))
            const spacing = 490 / count
            const offset = (this.random() - .5) * spacing
            const positions = Array.from({ length: count + 1 }, (_, index) =>
                Math.max(30, Math.min(config.width - 30, 30 + index * spacing + offset)))
            this.safeX = positions[this.safeLane]
            this.pattern = (this.pattern + 1 + Math.floor(this.random() * 3)) % 4
            const waveId = this.waveId++
            const lanes = positions.map((x, index) => ({ x, index })).filter(lane => lane.index !== this.safeLane)
            for (let i = lanes.length - 1; i > 0; i--) {
                const index = Math.floor(this.random() * (i + 1))
                ;[lanes[i], lanes[index]] = [lanes[index], lanes[i]]
            }
            const selected = lanes.slice(0, count)
            if (this.pattern === 1) selected.sort((a, b) => a.x - b.x)
            if (this.pattern === 2) selected.sort((a, b) => b.x - a.x)
            if (this.pattern === 3) selected.sort((a, b) => Math.abs(a.x - 275) - Math.abs(b.x - 275))
            for (const [index, lane] of selected.entries()) {
                this.bombs.push({ id: this.nextId++, x: lane.x, y: -28,
                    waveId, safeX: this.safeX,
                    dropAt: this.elapsedMs + config.warningMs + (this.pattern ? index * 40 : 0),
                    speed: (165 + difficulty * 80) * 1.1 })
            }
            this.nextWaveAt = this.elapsedMs + 2000 - difficulty * 350
        }

        update(deltaMs, direction = 0) {
            const events = []
            if (this.outcome || !Number.isFinite(deltaMs) || deltaMs <= 0) return events
            let remaining = Math.min(deltaMs, config.durationMs - this.elapsedMs)
            while (remaining > 0 && !this.outcome) {
                const step = Math.min(remaining, 1000 / 120)
                remaining -= step
                this.elapsedMs = Math.min(config.durationMs, this.elapsedMs + step)
                this.x = Math.max(30, Math.min(config.width - 30, this.x + Math.sign(direction) * config.speed * step / 1000))
                if (this.elapsedMs >= this.nextWaveAt) this.spawnWave()

                this.bombs = this.bombs.filter(bomb => {
                    if (this.elapsedMs < bomb.dropAt) return true
                    const previousY = bomb.y
                    bomb.y = -28 + (this.elapsedMs - bomb.dropAt) * bomb.speed / 1000
                    const collision = Math.abs(bomb.x - this.x) <= config.playerHalfWidth + config.bombRadius
                        && bomb.y + config.bombHeight * .86 >= config.playerTop
                        && previousY + config.bombHeight * .14 <= config.ground
                    if (collision && this.elapsedMs >= this.invulnerableUntil && !this.outcome) {
                        this.health = Math.max(0, this.health - config.damage)
                        this.invulnerableUntil = this.elapsedMs + config.invulnerabilityMs
                        events.push({ type: 'hit', x: this.x, health: this.health })
                        if (this.health === 0) this.outcome = 'defeat'
                        return false
                    }
                    if (bomb.y + config.bombHeight * .86 >= config.ground) {
                        events.push({ type: 'groundImpact', x: bomb.x })
                        return false
                    }
                    return true
                })
                if (!this.outcome && this.elapsedMs >= config.durationMs - 0.000001) {
                    this.elapsedMs = config.durationMs
                    this.outcome = 'victory'
                }
            }
            return events
        }
    }

    const dodge = { config, DodgeInput, BombDodgeGame }
    if (typeof module !== 'undefined' && module.exports) module.exports = dodge
    else root.SchoolFightBombDodge = dodge
})(globalThis)
