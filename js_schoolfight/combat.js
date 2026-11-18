(function (root) {
    'use strict'

    const { attackTypes } = typeof module !== 'undefined' && module.exports
        ? require('./characters.js')
        : root.SchoolFightCharacters

    const defenseTypes = {
        [attackTypes.strength]: attackTypes.assholiness,
        [attackTypes.assholiness]: attackTypes.intelligence,
        [attackTypes.intelligence]: attackTypes.strength,
    }

    const effectiveAgainst = {
        [attackTypes.strength]: attackTypes.intelligence,
        [attackTypes.intelligence]: attackTypes.assholiness,
        [attackTypes.assholiness]: attackTypes.strength,
    }

    function getEffectiveness(attackType, defenderType) {
        return effectiveAgainst[attackType] === defenderType ? 1.5 : 1
    }

    function calculateAttackDamage(attacker, target, attackType) {
        const attack = attacker[attackType]
        const defense = target[defenseTypes[attackType]]
        const bonus = getEffectiveness(attackType, target.type)
        return Math.floor(attack * bonus * (100 / (100 + defense * 10)))
    }

    function selectEnemyTarget(party, random = Math.random) {
        const targets = party.filter(character => character.energy > 0 && character.class !== 'Dummy')
        if (targets.length === 0) return null
        return targets[Math.floor(random() * targets.length)]
    }

    function nextAttackType(previousType) {
        return defenseTypes[previousType]
    }

    function resolveBattleRound({ playerParty, enemyParty, moves, lastAttackType }, random = Math.random) {
        const events = []
        const livingEnemies = enemyParty.filter(character => character.energy > 0)

        function defend(attacker, side) {
            events.push({ kind: 'defend', attacker, side })
        }

        function attack(attacker, target, type, side) {
            const wasAlive = target.energy > 0
            const damage = target.takeDamage(calculateAttackDamage(attacker, target, type))
            events.push({ kind: 'attack', attacker, target, type, damage, side,
                defeated: wasAlive && target.energy === 0 })
        }

        for (const enemy of livingEnemies) {
            enemy.defends = Math.floor(random() * 10) > 8
            if (enemy.defends) defend(enemy, 'enemy')
        }

        for (const enemy of livingEnemies) {
            if (enemy.defends) continue
            let type = enemy.type
            if (type === attackTypes.teacher || type === attackTypes.allrounder) {
                lastAttackType = nextAttackType(lastAttackType)
                type = lastAttackType
            }
            const target = selectEnemyTarget(playerParty, random)
            if (target) attack(enemy, target, type, 'enemy')
        }

        for (const move of moves) {
            if (move.attacker.defends) defend(move.attacker, 'player')
            else attack(move.attacker, move.target, move.type, 'player')
        }

        for (const character of [...playerParty, ...enemyParty]) character.defends = false

        const survivingPlayers = playerParty.filter(character => character.energy > 0 && character.class !== 'Dummy').length
        const survivingEnemies = enemyParty.filter(character => character.energy > 0).length
        const outcome = survivingPlayers === 0 ? 'defeat' : survivingEnemies === 0 ? 'victory' : 'continue'
        return { events, lastAttackType, survivingPlayers, survivingEnemies, outcome }
    }

    const combat = { calculateAttackDamage, getEffectiveness, selectEnemyTarget, nextAttackType, resolveBattleRound }
    if (typeof module !== 'undefined' && module.exports) module.exports = combat
    else root.SchoolFightCombat = combat
})(globalThis)
