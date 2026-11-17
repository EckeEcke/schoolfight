// Classic scripts preserve support for opening index.html directly.
// CommonJS exposes the same model to Node's test runner.
(function (root) {
    'use strict'

    const attackTypes = {
        strength: 'strength',
        intelligence: 'intelligence',
        assholiness: 'assholiness',
        allrounder: 'allrounder',
        teacher: 'teacher'
    }

    class Character {
        constructor(type, id) {
            this.id = id
            this.class = type.class
            this.type = type.type
            this.energy = type.energy
            this.strength = type.strength
            this.intelligence = type.intelligence
            this.assholiness = type.assholiness
            this.defends = false
            this.frontSprite = type.frontSprite
            this.sideSprite = type.sideSprite
        }
        takeDamage(damage) {
            this.energy -= this.defends ? damage : damage * 2
            if (this.energy < 0) this.energy = 0
            return this.defends ? damage : damage * 2
        }
        recoverPartially() {
            if (this.energy <= 0) return
            this.energy += 30
            if (this.energy > 100) this.energy = 100
        }
        recoverFull() {
            this.energy = 100
        }
        takeBombDamage() {
            this.energy -= 30
            if (this.energy < 0) this.energy = 0
        }
        upgradeStat(stat) {
            this[stat] += 1
        }
    }

    const characters = {
        bully: {
            class: 'Bully',
            type: attackTypes.assholiness,
            energy: 100,
            strength: 12,
            intelligence: 0,
            assholiness: 14,
            frontSprite: 'bully-front',
            sideSprite: 'bully-side',
        },
        squealer: {
            class: 'Squealer',
            energy: 100,
            type: attackTypes.assholiness,
            strength: 0,
            intelligence: 0,
            assholiness: 20,
            frontSprite: 'squealer-front',
            sideSprite: 'squealer-side',
        },
        nerd: {
            class: 'Nerd',
            type: attackTypes.intelligence,
            energy: 100,
            strength: 0,
            intelligence: 20,
            assholiness: 0,
            frontSprite: 'nerd-front',
            sideSprite: 'nerd-side',
        },
        wally: {
            class: 'Wally',
            type: attackTypes.strength,
            energy: 100,
            strength: 20,
            intelligence: 0,
            assholiness: 0,
            frontSprite: 'wally-front',
            sideSprite: 'wally-side',
        },
        richkid: {
            class: 'Richkid',
            type: attackTypes.intelligence,
            energy: 100,
            strength: 0,
            intelligence: 14,
            assholiness: 12,
            frontSprite: 'richkid-front',
            sideSprite: 'richkid-side',
        },
        sportskid: {
            class: 'Sportskid',
            type: attackTypes.strength,
            energy: 100,
            strength: 14,
            intelligence: 12,
            assholiness: 0,
            frontSprite: 'sportskid-front',
            sideSprite: 'sportskid-side',
        },
        normie: {
            class: 'Normie',
            type: attackTypes.allrounder,
            energy: 100,
            strength: 8,
            intelligence: 8,
            assholiness: 8,
            frontSprite: 'normie-front',
            sideSprite: 'normie-side',
        },
        weirdo: {
            class: 'Weirdo',
            type: attackTypes.intelligence,
            energy: 100,
            strength: 6,
            intelligence: 14,
            assholiness: 6,
            frontSprite: 'weirdo-front',
            sideSprite: 'weirdo-side',
        },
        wolf: {
            class: 'Wolfkid',
            type: attackTypes.strength,
            energy: 100,
            strength: 16,
            intelligence: 0,
            assholiness: 10,
            frontSprite: 'wolfkid-front',
            sideSprite: 'wolfkid-side',
        },
        dummy: {
            class: 'Dummy',
            type: attackTypes.strength,
            energy: 0,
            strength: 0,
            intelligence: 0,
            assholiness: 0,
            frontSprite: 'dummy-front',
            sideSprite: 'dummy-side',
        },
        teacher: {
            class: 'Teacher',
            type: attackTypes.teacher,
            energy: 100,
            strength: 34,
            intelligence: 34,
            assholiness: 34,
            frontSprite: 'teacher-front',
            sideSprite: 'teacher-side',
        }
    }

    const model = { attackTypes, Character, characters }
    if (typeof module !== 'undefined' && module.exports) module.exports = model
    else root.SchoolFightCharacters = model
})(globalThis)
