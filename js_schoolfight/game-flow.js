(function (root) {
    'use strict'

    const gameStates = Object.freeze(Object.fromEntries([
        'title', 'tutorial', 'trophies', 'characterSelect', 'transition', 'dialogue',
        'selectTargets', 'battleAnimation', 'bombAnimation', 'snackAnimation',
        'levelComplete', 'shop', 'ropeSkip', 'running', 'dancing', 'bombDodge', 'gameOver', 'victory',
    ].map(state => [state, state])))

    const permissions = {
        start: ['title'], selectCharacter: ['characterSelect'], dialogue: ['dialogue'],
        battle: ['selectTargets'], item: ['selectTargets'],
        nextRound: ['levelComplete'], openShop: ['levelComplete'], purchase: ['shop'],
        leaveShop: ['shop'], jump: ['ropeSkip'], run: ['running'], dance: ['dancing'], dodge: ['bombDodge'],
    }

    class GameFlow {
        constructor() {
            this.state = gameStates.title
            this.revision = 0
        }

        enter(state) {
            if (!Object.hasOwn(gameStates, state)) throw new Error(`Unknown game state: ${state}`)
            this.state = state
            this.revision += 1
        }

        can(action) {
            return permissions[action]?.includes(this.state) ?? false
        }

        guard(callback) {
            const revision = this.revision
            return (...args) => {
                if (revision === this.revision) return callback(...args)
            }
        }

        after(callback, delay) {
            return setTimeout(this.guard(callback), delay)
        }
    }

    const flow = { GameFlow, gameStates }
    if (typeof module !== 'undefined' && module.exports) module.exports = flow
    else root.SchoolFightFlow = flow
})(globalThis)
