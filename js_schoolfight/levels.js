(function (root) {
    'use strict'

    const { Character, characters } = typeof module !== 'undefined' && module.exports
        ? require('./characters.js')
        : root.SchoolFightCharacters

    const levels = [
        {
            "id": 1,
            "type": "battle",
            "boss": false,
            "background": {
                "className": "background-1",
                "image": "images_schoolfight/background1.jpg"
            },
            "enemies": [
                "bully",
                "nerd",
                "normie"
            ],
            "dialogue": {
                "normal": [
                    "YOU think you can become the kings of school?",
                    "We will flush your heads in the toilet after beating you up."
                ],
                "teacher": [
                    "What are YOU doing here?!",
                    "The new kings of school kicked you out of this place!"
                ]
            }
        },
        {
            "id": 2,
            "type": "battle",
            "boss": false,
            "background": {
                "className": "background-1",
                "image": "images_schoolfight/background1.jpg"
            },
            "enemies": [
                "squealer",
                "wally",
                "richkid"
            ],
            "dialogue": {
                "normal": [
                    "Our friend in the middle may not be the smartest.",
                    "But he is the strongest kid around. Ready for a beating?"
                ],
                "teacher": [
                    "Noooo... not you again...",
                    "Give up, old man!"
                ]
            }
        },
        {
            "id": 3,
            "type": "bombDodge",
            "boss": false,
            "background": {
                "className": "background-1",
                "image": "images_schoolfight/background1.jpg"
            },
            "enemies": [
                "dummy",
                "squealer",
                "dummy"
            ],
            "dialogue": {
                "normal": [
                    "Let's see if you can dodge my stink bombs! Three hits and you're out.",
                    "Hold the left/right half of the screen to move, or use the arrow keys."
                ],
                "teacher": [
                    "Dodge these stink bombs, old man! Three hits and you're out.",
                    "Hold the left/right half of the screen to move, or use the arrow keys."
                ]
            }
        },
        {
            "id": 4,
            "type": "battle",
            "boss": false,
            "background": {
                "className": "background-2",
                "image": "images_schoolfight/background2.jpg"
            },
            "enemies": [
                "sportskid",
                "sportskid",
                "sportskid"
            ],
            "dialogue": {
                "normal": [
                    "Hey, we are just training here.",
                    "If you don't leave we gotta teach you a lesson!"
                ],
                "teacher": [
                    "Perfect timing of yours!",
                    "We were just looking for a good old sandbag."
                ]
            }
        },
        {
            "id": 5,
            "type": "ropeSkip",
            "boss": false,
            "background": {
                "className": "background-2",
                "image": "images_schoolfight/background2.jpg"
            },
            "enemies": [
                "dummy",
                "dummy",
                "dummy"
            ],
            "dialogue": {
                "normal": [
                    "Hi boooooys. We don't fight with our fists...",
                    "So get ready for a ROPE SKIP FIGHT!"
                ],
                "teacher": [
                    "You think you still got what it takes?",
                    "Show us your moves. ROPE SKIP FIGHT!"
                ]
            }
        },
        {
            "id": 6,
            "type": "battle",
            "boss": false,
            "background": {
                "className": "background-2",
                "image": "images_schoolfight/background2.jpg"
            },
            "enemies": [
                "richkid",
                "nerd",
                "bully"
            ],
            "dialogue": {
                "normal": [
                    "We dont like sports...",
                    "And we don't like YOU!"
                ],
                "teacher": [
                    "We still dont like sports...",
                    "And we don't like old farts like YOU!"
                ]
            }
        },
        {
            "id": 7,
            "type": "running",
            "boss": false,
            "background": {
                "className": "background-2",
                "image": "images_schoolfight/background2.jpg"
            },
            "runningBackground": "images_schoolfight/background6.jpg",
            "enemies": [
                "dummy",
                "dummy",
                "dummy"
            ],
            "dialogue": {
                "normal": [
                    "Greetings, little fellas. What´s up?",
                    "How about a... wrestling match...?"
                ],
                "teacher": [
                    "If police sees the two of us...",
                    "you might get ARRESTED! 😈"
                ]
            }
        },
        {
            "id": 8,
            "type": "battle",
            "boss": false,
            "background": {
                "className": "background-3",
                "image": "images_schoolfight/background3.jpg"
            },
            "enemies": [
                "richkid",
                "richkid",
                "richkid"
            ],
            "dialogue": {
                "normal": [
                    "What are you doing here?! This is a private school!",
                    "You are not wealthy and classy enough to be here."
                ],
                "teacher": [
                    "What are you doing here?! This is a private school!",
                    "You are way too old and poor to be here."
                ]
            }
        },
        {
            "id": 9,
            "type": "dancing",
            "boss": false,
            "background": {
                "className": "background-3",
                "image": "images_schoolfight/background3.jpg"
            },
            "enemies": [
                "dummy",
                "dummy",
                "dummy"
            ],
            "dialogue": {
                "normal": [
                    "Show me your moves!",
                    "Hit the note when its center is on the red line."
                ],
                "teacher": [
                    "To get past us, you need to feel the rhythm!",
                    "You look way too old for this though.."
                ]
            }
        },
        {
            "id": 10,
            "type": "battle",
            "boss": false,
            "background": {
                "className": "background-3",
                "image": "images_schoolfight/background3.jpg"
            },
            "enemies": [
                "nerd",
                "nerd",
                "nerd"
            ],
            "dialogue": {
                "normal": [
                    "If our calculations are correct we have a 99% chance to beat you up.",
                    "Go Go Power Rangers!"
                ],
                "teacher": [
                    "Last time our calculations were incorrect.",
                    "But this time we used quantum computing!"
                ]
            }
        },
        {
            "id": 11,
            "type": "battle",
            "boss": true,
            "background": {
                "className": "background-4",
                "image": "images_schoolfight/background4.jpg"
            },
            "enemies": [
                "dummy",
                "teacher",
                "dummy"
            ],
            "dialogue": {
                "normal": [
                    "You were beating up a lot of other kids recently to become king of school.",
                    "You almost made it, but first you gotta beat ME!"
                ],
                "teacher": [
                    "How dare you coming back here?!",
                    "Whatever, we will beat you up once again!"
                ]
            }
        }
    ]

    function getLevel(index) {
        if (!Number.isInteger(index) || !levels[index]) throw new RangeError(`Unknown level index: ${index}`)
        return levels[index]
    }

    function createEnemyParty(index, { isTeacherMode = false, lastVictoryTeam = [] } = {}) {
        const level = getLevel(index)
        if (isTeacherMode && level.boss && !Array.isArray(lastVictoryTeam)) {
            throw new Error('The revenge boss requires three known characters from the last victory team')
        }
        const templates = isTeacherMode && level.boss
            ? lastVictoryTeam.map(name => Object.values(characters).find(character => character.class === name))
            : level.enemies.map(key => characters[key])
        if (templates.length !== 3 || templates.some(template => !template)) {
            throw new Error('The revenge boss requires three known characters from the last victory team')
        }
        return templates.map((template, index) => new Character(template, index + 1))
    }

    const levelData = { levels, getLevel, createEnemyParty }
    if (typeof module !== 'undefined' && module.exports) module.exports = levelData
    else root.SchoolFightLevels = levelData
})(globalThis)
