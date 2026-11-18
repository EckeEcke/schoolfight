(function (root) {
    'use strict'

    const { config, DodgeInput, BombDodgeGame } = root.SchoolFightBombDodge

    class BombDodgeMinigame {
        constructor({ element, onHit, onFinish }) {
            this.element = element
            this.player = element.querySelector('[data-dodge-player]')
            this.sprite = element.querySelector('[data-dodge-sprite]')
            this.hud = element.querySelector('[data-dodge-time]')
            this.bombLayer = element.querySelector('[data-dodge-bombs]')
            this.cloudLayer = element.querySelector('[data-dodge-clouds]')
            this.input = new DodgeInput()
            this.nodes = new Map()
            this.onHit = onHit
            this.onFinish = onFinish
            this.active = false
        }

        start(character) {
            this.stop()
            this.model = new BombDodgeGame({ health: character.energy })
            this.character = character
            this.active = true
            this.lastFrame = null
            this.finishAt = null
            this.element.classList.remove('hidden')
            this.listeners = new AbortController()
            const options = { signal: this.listeners.signal }
            const release = event => this.input.pointers.delete(event.pointerId)
            const pointer = event => {
                if (event.type === 'pointerdown' && event.button > 0) return
                if (event.type === 'pointermove' && !this.input.pointers.has(event.pointerId)) return
                event.preventDefault()
                const bounds = this.element.getBoundingClientRect()
                this.input.pointers.set(event.pointerId, event.clientX < bounds.left + bounds.width / 2 ? -1 : 1)
                if (event.type === 'pointerdown') this.element.setPointerCapture(event.pointerId)
            }
            this.element.addEventListener('pointerdown', pointer, options)
            this.element.addEventListener('pointermove', pointer, options)
            for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) {
                this.element.addEventListener(event, release, options)
            }
            const key = event => {
                if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
                event.preventDefault()
                const direction = event.key === 'ArrowLeft' ? -1 : 1
                if (event.type === 'keydown') this.input.keys.add(direction)
                else this.input.keys.delete(direction)
            }
            window.addEventListener('keydown', key, options)
            window.addEventListener('keyup', key, options)
            const reset = () => { this.input.reset(); this.lastFrame = null }
            window.addEventListener('blur', reset, options)
            document.addEventListener('visibilitychange', reset, options)
            this.render()
            this.frameId = requestAnimationFrame(time => this.frame(time))
        }

        frame(time) {
            if (!this.active) return
            if (this.finishAt !== null) {
                if (time >= this.finishAt) this.finish()
                else this.frameId = requestAnimationFrame(next => this.frame(next))
                return
            }
            if (document.hidden) {
                this.lastFrame = null
            } else {
                const delta = this.lastFrame === null ? 0 : time - this.lastFrame
                this.lastFrame = time
                const events = this.model.update(delta, this.input.direction)
                for (const event of events) {
                    if (event.type === 'hit') {
                        this.showCloud(event.x)
                        this.onHit(event.health)
                    } else if (event.type === 'groundImpact') {
                        this.showCloud(event.x, true)
                    }
                }
                this.render()
                if (this.model.outcome) {
                    this.detach()
                    this.model.bombs = []
                    this.render()
                    this.hud.textContent = ''
                    if (this.model.elapsedMs < this.model.invulnerableUntil) {
                        this.finishAt = time + 650
                        this.frameId = requestAnimationFrame(next => this.frame(next))
                    } else this.finish()
                    return
                }
            }
            this.frameId = requestAnimationFrame(next => this.frame(next))
        }

        render() {
            this.element.classList.toggle('dodge-controls-hidden', this.model.elapsedMs >= 2000)
            this.player.style.left = `${this.model.x}px`
            const direction = this.input.direction
            this.player.classList.toggle('dodge-invulnerable', this.model.elapsedMs < this.model.invulnerableUntil)
            this.player.classList.toggle('dodge-hit', this.model.elapsedMs < this.model.invulnerableUntil - 650)
            this.sprite.className = direction ? this.character.sideSprite : this.character.frontSprite
            this.sprite.parentElement.classList.toggle('running', Boolean(direction))
            this.sprite.parentElement.style.scale = direction > 0 ? '-1 1' : '1 1'
            const seconds = Math.floor(Math.max(0, config.durationMs - this.model.elapsedMs) / 1000)
            this.hud.textContent = `Time: ${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
            const live = new Set()
            for (const bomb of this.model.bombs) {
                live.add(bomb.id)
                let node = this.nodes.get(bomb.id)
                if (!node) {
                    node = document.createElement('div')
                    node.className = 'dodge-falling-bomb'
                    const shadow = document.createElement('div')
                    shadow.className = 'dodge-bomb-shadow'
                    this.bombLayer.append(node, shadow)
                    node.shadow = shadow
                    this.nodes.set(bomb.id, node)
                }
                node.style.transform = `translate(${bomb.x - 27}px, ${bomb.y}px) rotate(180deg)`
                node.style.visibility = this.model.elapsedMs < bomb.dropAt ? 'hidden' : 'visible'
                node.shadow.style.left = `${bomb.x}px`
                node.shadow.classList.toggle('dodge-warning', this.model.elapsedMs < bomb.dropAt)
            }
            for (const [id, node] of this.nodes) {
                if (live.has(id)) continue
                node.shadow.remove()
                node.remove()
                this.nodes.delete(id)
            }
        }

        showCloud(x, ground = false) {
            const burst = document.createElement('div')
            burst.className = `dodge-cloud-burst ${ground ? 'dodge-ground-impact' : 'dodge-player-impact'}`
            burst.style.left = `${x}px`
            for (let i = 0; i < 9; i++) {
                const cloud = document.createElement('div')
                cloud.className = 'bombcloud'
                cloud.style.left = `${(i % 3) * 18 - 28}px`
                cloud.style.animationDelay = `${Math.floor(i / 3) * 25}ms`
                burst.append(cloud)
            }
            burst.addEventListener('animationend', event => {
                if (event.target.className === 'bombcloud') burst.remove()
            })
            this.cloudLayer.append(burst)
        }

        finish() {
            this.active = false
            this.player.classList.remove('dodge-hit')
            this.player.classList.remove('dodge-invulnerable')
            this.onFinish(this.model.outcome, this.model.health)
        }

        detach() {
            this.listeners?.abort()
            for (const id of this.input.pointers.keys()) {
                if (this.element.hasPointerCapture(id)) this.element.releasePointerCapture(id)
            }
            this.input.reset()
        }

        stop() {
            this.active = false
            cancelAnimationFrame(this.frameId)
            this.detach()
            this.nodes.clear()
            this.bombLayer.replaceChildren()
            this.cloudLayer.replaceChildren()
            this.element.classList.add('hidden')
        }
    }

    root.SchoolFightBombDodgeView = { BombDodgeMinigame }
})(globalThis)
