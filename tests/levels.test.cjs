const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { levels, getLevel, createEnemyParty } = require('../js_schoolfight/levels.js')

test('the campaign preserves its ten stations, teams, backgrounds and minigame positions', () => {
    assert.deepEqual(levels.map(level => level.type), [
        'battle', 'battle', 'ropeSkip', 'battle', 'battle', 'running', 'battle', 'dancing', 'battle', 'battle',
    ])
    assert.deepEqual(levels.map(level => level.background.className), [
        'background-1', 'background-1', 'background-2', 'background-2', 'background-2',
        'background-2', 'background-3', 'background-3', 'background-3', 'background-4',
    ])
    assert.deepEqual(levels.map(level => level.enemies), [
        ['bully', 'nerd', 'normie'], ['squealer', 'wally', 'richkid'], ['dummy', 'dummy', 'dummy'],
        ['sportskid', 'sportskid', 'sportskid'], ['richkid', 'nerd', 'bully'], ['dummy', 'dummy', 'dummy'],
        ['richkid', 'richkid', 'richkid'], ['dummy', 'dummy', 'dummy'], ['nerd', 'nerd', 'nerd'],
        ['dummy', 'teacher', 'dummy'],
    ])
    assert.deepEqual(levels.filter(level => level.boss).map(level => level.id), [10])
})

test('every level defines both dialogues and existing background assets', () => {
    for (const [index, level] of levels.entries()) {
        assert.equal(level.id, index + 1)
        assert.equal(getLevel(index), level)
        for (const mode of ['normal', 'teacher']) {
            assert.equal(level.dialogue[mode].length, 2)
            assert.ok(level.dialogue[mode].every(message => typeof message === 'string' && message.length > 0))
        }
        for (const asset of [level.background.image, level.runningBackground].filter(Boolean)) {
            assert.ok(fs.existsSync(path.join(__dirname, '..', asset)), asset)
        }
        assert.equal(createEnemyParty(index).length, 3)
    }
})

test('each party contains independent characters with DOM slot IDs', () => {
    const first = createEnemyParty(0)
    const second = createEnemyParty(0)
    assert.deepEqual(first.map(character => character.id), [1, 2, 3])
    first[0].energy = 0
    first[0].upgradeStat('strength')
    assert.equal(second[0].energy, 100)
    assert.equal(second[0].strength, 12)
    const repeated = createEnemyParty(3)
    repeated[0].energy = 1
    assert.equal(repeated[1].energy, 100)
})

test('revenge uses the regular teams before the final boss and the saved victory team at the boss', () => {
    for (let index = 0; index < levels.length - 1; index++) {
        assert.deepEqual(createEnemyParty(index, { isTeacherMode: true }), createEnemyParty(index))
    }
    const party = createEnemyParty(9, { isTeacherMode: true, lastVictoryTeam: ['Wolfkid', 'Nerd', 'Bully'] })
    assert.deepEqual(party.map(character => character.class), ['Wolfkid', 'Nerd', 'Bully'])
    assert.deepEqual(createEnemyParty(9).map(character => character.class), ['Dummy', 'Teacher', 'Dummy'])
})

test('invalid campaign indexes and incomplete revenge teams fail explicitly', () => {
    for (const index of [-1, 10, 0.5, '0']) assert.throws(() => getLevel(index), RangeError)
    for (const team of [null, [], ['Bully'], ['Bully', 'Nerd', 'Unknown']]) {
        assert.throws(() => createEnemyParty(9, { isTeacherMode: true, lastVictoryTeam: team }), /three known characters/)
    }
})

test('level data loads as a classic browser script without a build step', () => {
    const browser = vm.createContext({})
    for (const filename of ['characters.js', 'levels.js']) {
        vm.runInContext(fs.readFileSync(path.join(__dirname, '../js_schoolfight', filename), 'utf8'), browser)
    }
    assert.equal(vm.runInContext('SchoolFightLevels.createEnemyParty(9)[1].class', browser), 'Teacher')
})
