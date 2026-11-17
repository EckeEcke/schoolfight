const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const path = require('node:path')
const { Character, characters, attackTypes } = require('../js_schoolfight/characters.js')
const { calculateAttackDamage, getEffectiveness, selectEnemyTarget, nextAttackType } = require('../js_schoolfight/combat.js')

test('all three type advantages give a 1.5 bonus; other matchups stay neutral', () => {
    const types = ['strength', 'intelligence', 'assholiness']
    const advantages = { strength: 'intelligence', intelligence: 'assholiness', assholiness: 'strength' }
    for (const attack of types) {
        for (const defense of [...types, 'allrounder', 'teacher']) {
            assert.equal(getEffectiveness(attack, defense), advantages[attack] === defense ? 1.5 : 1)
        }
    }
})

test('damage uses the corresponding defense stat, bonus and rounding without mutating characters', () => {
    const attacker = { strength: 13, intelligence: 13, assholiness: 13 }
    const target = { type: 'intelligence', strength: 5, intelligence: 10, assholiness: 20, energy: 100 }
    assert.equal(calculateAttackDamage(attacker, target, 'strength'), 6)
    assert.equal(calculateAttackDamage(attacker, target, 'intelligence'), 8)
    assert.equal(calculateAttackDamage(attacker, target, 'assholiness'), 6)
    assert.equal(target.energy, 100)
})

test('defending halves received damage and health never drops below zero', () => {
    const normal = new Character(characters.nerd, 1)
    const defending = new Character(characters.nerd, 2)
    defending.defends = true
    assert.equal(normal.takeDamage(12), 24)
    assert.equal(defending.takeDamage(12), 12)
    assert.equal(normal.energy, 76)
    assert.equal(defending.energy, 88)
    normal.takeDamage(100)
    assert.equal(normal.energy, 0)
})

test('character instances can heal and upgrade independently of their templates', () => {
    const first = new Character(characters.bully, 1)
    const second = new Character(characters.bully, 2)
    first.upgradeStat('strength')
    assert.equal(first.strength, 13)
    assert.equal(second.strength, 12)
    assert.equal(characters.bully.strength, 12)
    first.energy = 90
    first.recoverPartially()
    assert.equal(first.energy, 100)
    first.takeBombDamage()
    assert.equal(first.energy, 70)
    first.energy = 0
    first.recoverPartially()
    assert.equal(first.energy, 0)
    first.recoverFull()
    assert.equal(first.energy, 100)
})

test('target selection stays random among living non-dummy characters', () => {
    const dead = { class: 'Nerd', energy: 0 }
    const dummy = { class: 'Dummy', energy: 100 }
    const weak = { class: 'Bully', energy: 1 }
    const healthy = { class: 'Wally', energy: 100 }
    const party = [dead, weak, dummy, healthy]
    assert.equal(selectEnemyTarget(party, () => 0), weak)
    assert.equal(selectEnemyTarget(party, () => 0.99), healthy)
    weak.energy = 0
    assert.equal(selectEnemyTarget(party, () => 0), healthy)
    healthy.energy = 0
    assert.equal(selectEnemyTarget(party), null)
    assert.equal(selectEnemyTarget([]), null)
})

test('teacher and allrounder attack rotation preserves its original order', () => {
    assert.equal(nextAttackType(attackTypes.intelligence), attackTypes.strength)
    assert.equal(nextAttackType(attackTypes.strength), attackTypes.assholiness)
    assert.equal(nextAttackType(attackTypes.assholiness), attackTypes.intelligence)
})

test('every character matchup preserves the original damage formula', () => {
    const defenses = { strength: 'assholiness', intelligence: 'strength', assholiness: 'intelligence' }
    const advantages = { strength: 'intelligence', intelligence: 'assholiness', assholiness: 'strength' }
    for (const attacker of Object.values(characters)) {
        for (const target of Object.values(characters)) {
            for (const type of Object.keys(defenses)) {
                const bonus = advantages[type] === target.type ? 1.5 : 1
                const expected = Math.floor(attacker[type] * bonus * (100 / (100 + target[defenses[type]] * 10)))
                assert.equal(calculateAttackDamage(attacker, target, type), expected)
            }
        }
    }
})

test('classic browser scripts expose their dependencies without Node or a server', () => {
    const browser = vm.createContext({})
    for (const filename of ['characters.js', 'combat.js']) {
        const source = fs.readFileSync(path.join(__dirname, '../js_schoolfight', filename), 'utf8')
        vm.runInContext(source, browser, { filename })
    }
    assert.equal(vm.runInContext(`
        const { Character, characters } = SchoolFightCharacters
        SchoolFightCombat.calculateAttackDamage(new Character(characters.wally, 1), new Character(characters.nerd, 2), 'strength')
    `, browser), 30)
})
