const { test } = require('node:test')
const assert = require('node:assert/strict')
const { Character, characters } = require('../js_schoolfight/characters.js')
const { resolveBattleRound } = require('../js_schoolfight/combat.js')

function setup(playerType = 'wally', enemyType = 'nerd') {
    const player = new Character(characters[playerType], 1)
    const enemy = new Character(characters[enemyType], 0)
    return { player, enemy, input: {
        playerParty: [player], enemyParty: [enemy],
        moves: [{ attacker: player, target: enemy, type: player.type }],
        lastAttackType: 'intelligence',
    } }
}

test('a complete round resolves enemy attacks before queued player attacks', () => {
    const { player, enemy, input } = setup()
    const result = resolveBattleRound(input, () => 0)
    assert.deepEqual(result.events.map(event => [event.side, event.kind, event.damage]), [
        ['enemy', 'attack', 12], ['player', 'attack', 60],
    ])
    assert.equal(player.energy, 88)
    assert.equal(enemy.energy, 40)
    assert.equal(result.outcome, 'continue')
    assert.equal(result.survivingPlayers, 1)
    assert.equal(result.survivingEnemies, 1)
})

test('queued attacks still execute when their attacker falls; a double knockout is a defeat', () => {
    const { player, enemy, input } = setup()
    player.energy = 1
    enemy.energy = 1
    const result = resolveBattleRound(input, () => 0)
    assert.equal(result.events.length, 2)
    assert.ok(result.events.every(event => event.defeated))
    assert.equal(player.energy, 0)
    assert.equal(enemy.energy, 0)
    assert.equal(result.outcome, 'defeat')
})

test('remaining enemies skip attacks once the last player falls', () => {
    const { player, input } = setup()
    player.energy = 1
    input.enemyParty.push(new Character(characters.nerd, 1))
    const result = resolveBattleRound(input, () => 0)
    assert.equal(result.events.filter(event => event.side === 'enemy').length, 1)
    assert.equal(result.outcome, 'defeat')
})

test('enemy defense has its original ten percent threshold and is cleared after resolution', () => {
    for (const [randomValue, defends, damage] of [[0.899, false, 60], [0.9, true, 30]]) {
        const { enemy, input } = setup()
        const result = resolveBattleRound(input, () => randomValue)
        assert.equal(result.events[0].kind, defends ? 'defend' : 'attack')
        assert.equal(result.events.at(-1).damage, damage)
        assert.equal(enemy.defends, false)
    }
})

test('player defense reduces damage, emits a defense event and resets for the next turn', () => {
    const { player, enemy, input } = setup()
    player.defends = true
    input.moves = [{ attacker: player, target: '', type: '' }]
    const result = resolveBattleRound(input, () => 0)
    assert.equal(player.energy, 94)
    assert.equal(enemy.energy, 100)
    assert.equal(result.events[1].kind, 'defend')
    assert.equal(result.events[1].side, 'player')
    assert.equal(player.defends, false)
})

test('rotation is shared by teachers and allrounders and returned for the next round', () => {
    const { input } = setup('teacher', 'normie')
    input.enemyParty.push(new Character(characters.teacher, 1))
    const result = resolveBattleRound(input, () => 0)
    assert.deepEqual(result.events.filter(event => event.side === 'enemy').map(event => event.type), ['strength', 'assholiness'])
    assert.equal(result.lastAttackType, 'assholiness')
})

test('victory counts surviving characters and reports an enemy defeat only once', () => {
    const { player, enemy, input } = setup()
    enemy.energy = 1
    input.moves.push({ attacker: player, target: enemy, type: 'strength' })
    input.playerParty.push(new Character(characters.dummy, 2))
    input.enemyParty.push(new Character(characters.dummy, 2))
    const result = resolveBattleRound(input, () => 0)
    assert.equal(result.outcome, 'victory')
    assert.equal(result.survivingPlayers, 1)
    assert.equal(result.survivingEnemies, 0)
    assert.equal(result.events.filter(event => event.defeated).length, 1)
})
