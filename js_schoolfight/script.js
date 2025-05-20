document.addEventListener('DOMContentLoaded', () => {
    /**
     *
     * UI variables
     *
     */

    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    const strengthIcon = "<i class='fas fa-hand-rock'></i>"
    const assholinessIcon = "<i class='fas fa-hand-middle-finger'></i>"
    const intelligenceIcon = "<i class='fas fa-glasses'></i>"
    const shieldIcon = "<i class='fas fa-shield-alt'></i>"
    const bombIcon = "<i class='fas fa-bomb'></i>"
    const snackIcon = "<i class='fas fa-hamburger'></i>"

    const title = document.getElementById('title')
    const titleButton = document.getElementById('title-button')
    const howToPlayButton = document.getElementById('how-to-play-button')
    const vendettaButton = document.getElementById('vendetta-button')
    const battleTicker = document.getElementById('battle-ticker')
    const bombButton = document.getElementById('bomb-button')
    const bombButtonWrapper = document.getElementById('bomb-button-wrapper')
    const bombContainer = document.getElementById('bomb-container')
    const bombContainerWrapper = document.getElementById('bomb-container-wrapper')
    const itemBox = document.getElementById('item-box')
    const itemButtonWrapper = document.getElementById('item-button-wrapper')
    const itemButton = document.getElementById('item-button')
    const enemyRunning = document.getElementById('enemy-running')
    const characterRunning = document.getElementById('character-running')
    const titleSelect = document.getElementById('title-select')
    const runningBackgroundText = document.querySelector('#running-background h2')
    const selectScreen = document.getElementById('select-screen')
    const selectScreen2 = document.getElementById('select-screen2')
    const selectScreen3 = document.getElementById('select-screen3')
    const dialogueBoxWrapper = document.getElementById("dialogue-box-wrapper")
    const dialogueBox = document.getElementById("dialogue-box")
    const box = document.getElementById('box')
    const tutorialScreen = document.getElementById('tutorial-screen')
    const overlay = document.getElementById('overlay')
    const clickOverlay = document.getElementById('click-overlay')
    const backgroundElement = document.getElementById("background")
    const runningBackground = document.getElementById('running-background')
    const backButton = document.getElementById('back-button')
    const char1 = document.getElementById('char1')
    const char2 = document.getElementById('char2')
    const char3 = document.getElementById('char3')
    const runningSprite = document.getElementById('running-sprite')
    const displayTrophiesButton = document.getElementById('trophies-button')
    const trophiesScreen = document.getElementById('trophies')
    const soundControlButton = document.getElementById('sound-control-button')

    /**
     *
     * HTML Templates
     *
     */

    const nextRoundTemplate = `You won! <br><br><button id="next-button">Next round</button><div id="money-placeholder" class="animated-text"></div><button id="open-shop-button">Go to Shop</button>`
    const victoryTemplate = `Congratulations! <br> You are king of school!<br><br><br><br> <button id="refresh-button" onclick="location.reload()">Play again</button>`
    const victoryTemplateTeacher = `Congratulations! <br> You got your revenge!<br><br><br><br> <button id="refresh-button" onclick="location.reload()">Play again</button>`
    const gameOverTemplate = `You lost...!? <br><br><br><br> <button id="refresh-button" onclick="location.reload()">Try again</button>`
    const bombMessageTemplate = "<span style='color:limegreen'>Stink bomb</span>!<br>Enemies take 30% <span style='color:red'>damage</span>!"
    const additionalBombMessageTemplate = `${bombIcon}<span style='color:limegreen'>+1</span>`
    const snackMessageTemplate = `You had a <span style='color: orange'>snack</span>!<br>30% <span style='color:lightblue'>health</span> recovered`
    const additionalSnackMessageTemplate = `${snackIcon}<span style='color:limegreen'>+1</span>`

    const tutorialPage1template = `<h2>How to play</h2>
            <p>
                Every kid has three stats: ${strengthIcon} strength, ${intelligenceIcon}
                intelligence and ${assholinessIcon} assholiness.
            </p>
            <p>
                ${strengthIcon} Strength:
                <br> 
                good against type ${intelligenceIcon}, weak against high ${assholinessIcon} stat. 
            </p>
            <p>
                ${intelligenceIcon} Intelligence: 
                good against type ${assholinessIcon}, weak against high ${strengthIcon} stat.
            </p>
            <p>
                ${assholinessIcon} Assholiness:
                <br>
                strong against type ${strengthIcon}, weak against high ${intelligenceIcon} stat.
            </p>
            <p>
                ${shieldIcon} Defend: 
                <br>
                this character only takes half damage that turn, but won't attack.
            </p>
            <button id="back-button">Back</button>
            <button id="toggle-tutorial-button">More</button>`

    const tutorialPage2template = `<img src="./images_schoolfight/tutorial.png" alt="tutorial" style="width: 100%">
            <div class="tutorial-info" style="top: 138px; left: 90px;"><div>1. Click your character</div></div>
            <div class="tutorial-info" style="top: 25px; left: 130px; animation-delay: 4s"><div>2. Choose attack type</div></div>
            <div class="tutorial-info" style="top: 135px; left: 328px;animation-delay: 8s"><div>3. Choose target</div></div>
            <button id="back-button">Back</button>
            <button id="toggle-tutorial-button">More</button>`

    /**
     *
     * Sounds
     *
    */

    const sounds = {
        confirm: new Audio('sounds_schoolfight/confirm.wav'),
        schoolBell: new Audio('sounds_schoolfight/schoolbell.wav'),
        music: new Audio('sounds_schoolfight/music.mp3'),
        fail: new Audio('sounds_schoolfight/wrong.wav'),
        steps: new Audio('sounds_schoolfight/steps.wav'),
        fight: new Audio('sounds_schoolfight/fight.mp3'),
        fade: new Audio('sounds_schoolfight/fade.wav'),
        punch: new Audio('sounds_schoolfight/punches.wav'),
        deathCry: new Audio('sounds_schoolfight/deathcry.wav'),
        deathCry2: new Audio('sounds_schoolfight/deathcry2.wav'),
        click: new Audio('sounds_schoolfight/clicksound.wav'),
        girl: new Audio('sounds_schoolfight/girlcry.mp3'),
        evilLaugh: new Audio('sounds_schoolfight/evil-laugh.wav'),
        victory: new Audio('sounds_schoolfight/victory.mp3'),
        bossMusic: new Audio('sounds_schoolfight/bossmusic.wav'),
        jump: new Audio('sounds_schoolfight/jump.wav'),
        stink: new Audio('sounds_schoolfight/stinksound.wav'),
        eating: new Audio('sounds_schoolfight/eating.wav'),
        cheer: new Audio('sounds_schoolfight/cheer.wav'),
        clap: new Audio('sounds_schoolfight/clap.wav'),
        scream: new Audio('sounds_schoolfight/scream.mp3'),
        laugh: new Audio('sounds_schoolfight/laugh.wav'),
        trophy: new Audio('sounds_schoolfight/trophy unlocked.mp3'),
        powerUp: new Audio('sounds_schoolfight/powerup.mp3'),
    }

    const allAudio = Object.values(sounds)

    function toggleMute() {
        game.soundMuted = !game.soundMuted
        allAudio.forEach(audio => {
            audio.muted = game.soundMuted
        })
        soundControlButton.innerHTML = game.soundMuted ? "<i class='fas fa-volume-mute'></i>" : "<i class='fas fa-volume-up'></i>"
    }

    soundControlButton.addEventListener('click', toggleMute)

     /**
     * 
     * Basic variables and functions
     * 
     **/

    if (!localStorage.getItem('trophies')) localStorage.setItem('trophies', JSON.stringify({}))
    const trophiesFromStorage = localStorage.getItem('trophies')
    const parsedTrophies = trophiesFromStorage ? JSON.parse(trophiesFromStorage) : undefined

    function adjustGameSize() { 
        const gameWrapper = document.getElementById("game-wrapper")
        const aspectRatio = 550 / 280
        if (window.innerWidth >= window.innerHeight * aspectRatio) { 
            gameWrapper.style.transform = `scale(${window.innerHeight * aspectRatio / 660})`
        } else { gameWrapper.style.transform = `scale(${window.innerWidth / 660})` 
    }}

    adjustGameSize()

    window.addEventListener("resize", adjustGameSize)
    window.addEventListener('fullscreenchange', adjustGameSize)

    const attackTypes = {
        strength: 'strength',
        intelligence: 'intelligence',
        assholiness: 'assholiness',
        allrounder: 'allrounder',
        teacher: 'teacher'
    }

    const prices = {
        item: 3,
        upgrade: 2,
    }

    const gameStates = {
        title: 'display title screen',
        characterSelect: 'display character select screen',
        dialogue: 'display dialogues',
        selectTargets: 'select targets',
        battleAnimation: 'battle animation is running',
        bombAnimation: 'bomb animation running',
        snackAnimation: 'snack animation running',
        levelComplete: 'fade away to next level',
        ropeSkip: 'rope skip minigame',
        lockerRoom: 'locker room minigame',
        gameOver: 'player lost',
        victory: 'player won the game',
    }

    function updateGameState(newState) {
        game.state = newState // currently not used
    }

    const game = {
        state: gameStates.title,
        round: 0,
        player: {
            party: [],
            moves: [],
            selectedChar: '',
            selectedCharId: null,
            selectedAttackType: '',
        },
        enemy: {
            party: [],
        },
        items: {
            bombs: 1,
            snacks: 1,
            received: 0,
            money: 0,
            moneyEarnedLastRound: 0,
            moneyEarnedTotal: 0,
        },
        battleMessages: [],
        messageIndex: 0,
        itemUsed: false,
        itemsUsed: 0,
        isTeacherMode: false,
        lastVictoryTeam: JSON.parse(localStorage.getItem('lastVictoryTeam')),
        soundMuted: false,
        showTutorial: false,
        displayedSelectScreenIndex: 0,
        lastMoveTeacher: 'intelligence',
        miniGames: {
            ropeSkip: {
                moveRopeDownwards: false,
                ropeY: 270,
                skips: 0,
                speed: 100,
                characterJumps: false,
                points: 0,
                interval: null,
            },
            running: {
                bg1Left: 0,
                bg2Left: 313,
                bg3Left: 616,
                characterLeft: 100,
                enemyLeft: 350,
                moveBackgroundInterval: null,
            }
        },
        trophies: {
            beatenGame: {
                unlocked: parsedTrophies && 'beatenGame' in parsedTrophies,
                element: document.getElementById('trophy-beaten'),
                message: 'Beaten the game',
            },
            allAssholes: {
                unlocked: parsedTrophies && 'allAssholes' in parsedTrophies,
                element: document.getElementById('all-assholes'),
                message: 'All Assholes',
            },
            allStrength: {
                unlocked: parsedTrophies && 'allStrength' in parsedTrophies,
                element: document.getElementById('all-strength'),
                message: 'All Strength',
            },
            allIntelligence: {
                unlocked: parsedTrophies && 'allIntelligence' in parsedTrophies,
                element: document.getElementById('all-intelligence'),
                message: 'All Intelligence',
            },
            sixItems: {
                unlocked: parsedTrophies && 'hasSixItems' in parsedTrophies,
                element: document.getElementById('six-items'),
                message: 'Use six items',
            },
            noItems: {
                unlocked: parsedTrophies && 'hasNoItems' in parsedTrophies,
                element: document.getElementById('itemless'),
                message: 'Beat game without items',
            },
        }
    }

    let fightAnimationRunning = false
    let bombAnimationRunning = false

    /**
     * 
     * Sprite positions
     * 
     */

    const spritePositions = {
        Bully: {
            front: { top: "-425px", left: "-340px" },
            side: { top: "-425px", left: "-410px" },
        },
        Squealer: {
            front: { top: "-320px", left: "-42px" },
            side: { top: "-320px", left: "-108px" },
        },
        Nerd: {
            front: { top: "-425px", left: "-42px" },
            side: { top: "-425px", left: "-108px" },
        },
        Wally: {
            front: { top: "-105px", left: "-340px" },
            side: { top: "-105px", left: "-410px" },
        },
        Dummy: {
            front: { top: "10000px", left: "10000px" },
            side: { top: "10000px", left: "10000px" }
        },
        Sportskid: {
            front: { top: "-320px", left: "-340px" },
            side: { top: "-320px", left: "-410px" },
        },
        Richkid: {
            front: { top: "-215px", left: "-340px" },
            side: { top: "-215px", left: "-410px" },
        },
        Teacher: {
            front: { top: "-215px", left: "-42px" },
            side: { top: "-215px", left: "-108px" },
        },
        Weirdo: {
            front: { top: "-105px", left: "-42px" },
            side: { top: "-105px", left: "-108px" },
        },
        Wolfkid: {
            front: { top: "-532px", left: "-340px" },
            side: undefined,
        },
        Normie: {
            front: { top: "0px", left: "-42px" },
            side: { top: "0px", left: "-108px" },
        }
    }

    /*
    * 
    * Characters
    * 
    */

    class Character {
        constructor(type) {
            this.id = undefined
            this.class = type.class
            this.type = type.type
            this.energy = type.energy
            this.strength = type.strength
            this.intelligence = type.intelligence
            this.assholiness = type.assholiness
            this.defends = false
        }
        takeDamage(damage) {
            this.energy -= this.defends ? damage : damage * 2
            if (this.energy < 0) this.energy = 0
        }
        eatSnack() {
            if (this.energy <= 0) return
            this.energy += 30
            if (this.energy > 100) this.energy = 100
        }
        takeBombDamage() {
            this.energy -= 30
            if (this.energy < 0) this.energy = 0
        }
    }

    const characters = {
        bully: {
            class: "Bully",
            type: attackTypes.assholiness,
            energy: 100,
            strength: 12,
            intelligence: 0,
            assholiness: 14,
        },
        squealer: {
            class: "Squealer",
            energy: 100,
            type: attackTypes.assholiness,
            strength: 0,
            intelligence: 0,
            assholiness: 20,
        },
        nerd: {
            class: "Nerd",
            type: attackTypes.intelligence,
            energy: 100,
            strength: 0,
            intelligence: 20,
            assholiness: 0,
        },
        wally: {
            class: "Wally",
            type: attackTypes.strength,
            energy: 100,
            strength: 20,
            intelligence: 0,
            assholiness: 0,
        },
        richkid: {
            class: "Richkid",
            type: attackTypes.intelligence,
            energy: 100,
            strength: 0,
            intelligence: 14,
            assholiness: 12,
        },
        sportskid: {
            class: "Sportskid",
            type: attackTypes.strength,
            energy: 100,
            strength: 14,
            intelligence: 12,
            assholiness: 0,
        },
        normie: {
            class: "Normie",
            type: attackTypes.allrounder,
            energy: 100,
            strength: 8,
            intelligence: 8,
            assholiness: 8,
        },
        weirdo: {
            class: "Weirdo",
            type: attackTypes.intelligence,
            energy: 100,
            strength: 6,
            intelligence: 14,
            assholiness: 6,
        },
        wolf: {
            class: "Wolfkid",
            type: attackTypes.strength,
            energy: 100,
            strength: 16,
            intelligence: 0,
            assholiness: 10,
        },
        dummy: {
            class: "Dummy",
            type: attackTypes.strength,
            energy: 0,
            strength: 0,
            intelligence: 0,
            assholiness: 0,
        },
        teacher: {
            class: "Teacher",
            type: attackTypes.teacher,
            energy: 100,
            strength: 34,
            intelligence: 34,
            assholiness: 34,
        }
    }

    const setTeams = [
        [new Character(characters.bully), new Character(characters.nerd), new Character(characters.normie)], //1
        [new Character(characters.squealer), new Character(characters.wally), new Character(characters.richkid)], //2
        [new Character(characters.sportskid), new Character(characters.sportskid), new Character(characters.sportskid)], //3
        [new Character(characters.dummy), new Character(characters.dummy), new Character(characters.dummy)], //4 (rope skipping)
        [new Character(characters.richkid), new Character(characters.nerd), new Character(characters.bully)], //5
        [new Character(characters.dummy), new Character(characters.dummy), new Character(characters.dummy)], //6 (running)
        [new Character(characters.richkid), new Character(characters.richkid), new Character(characters.richkid)],  //6
        [new Character(characters.nerd), new Character(characters.nerd), new Character(characters.nerd)], //7
        [new Character(characters.dummy), new Character(characters.teacher), new Character(characters.dummy)], //8
    ]

    const setTeamsTeacher = () => [
        [new Character(characters.bully), new Character(characters.nerd), new Character(characters.normie)], //1
        [new Character(characters.squealer), new Character(characters.wally), new Character(characters.richkid)], //2
        [new Character(characters.sportskid), new Character(characters.sportskid), new Character(characters.sportskid)], //3
        [new Character(characters.dummy), new Character(characters.dummy), new Character(characters.dummy)], //4 (rope skipping)
        [new Character(characters.richkid), new Character(characters.nerd), new Character(characters.bully)], //5
        [new Character(characters.dummy), new Character(characters.dummy), new Character(characters.dummy)], //6 (running)
        [new Character(characters.richkid), new Character(characters.richkid), new Character(characters.richkid)],  //6
        [new Character(characters.nerd), new Character(characters.nerd), new Character(characters.nerd)], //7
        [
            new Character(characters[game.lastVictoryTeam[0].toLowerCase()]),
            new Character(characters[game.lastVictoryTeam[1].toLowerCase()]),
            new Character(characters[game.lastVictoryTeam[2].toLowerCase()])], //8
    ]

    const teacherTeam = [
        Object.assign(new Character(characters.dummy), { id: 1 }),
        Object.assign(new Character(characters.teacher), { id: 2 }),
        Object.assign(new Character(characters.dummy), { id: 3 })
    ]

    /**
     * 
     * Dialogues
     * 
     */

    const dialogues = [
        ["YOU think you can become the kings of school?", "We will flush your heads in the toilet after beating you up."],
        ["Our friend in the middle may not be the smartest.", "But he is the strongest kid around. Ready for a beating?"],
        ["Hey, we are just training here.", "If you don't leave we gotta teach you a lesson!"],
        ["Hi boooooys. We don't fight with our fists...", "So get ready for a ROPE SKIP FIGHT!"],
        ["We dont like sports...", "And we don't like YOU!"],
        ["Greetings, little fellas. What´s up?", "How about a... wrestling match...?"],
        ["What are you doing here?! This is a private school!", "You are not wealthy and classy enough to be here."],
        ["If our calculations are correct we have a 99% chance to beat you up.", "Go Go Power Rangers!"],
        ["You were beating up a lot of other kids recently to become king of school.", "You almost made it, but first you gotta beat ME!"]
    ]

    const dialoguesTeacher = [
        ["What are YOU doing here?!", "The new kings of school kicked you out of this place!"],
        ["Noooo... not you again...", "Give up, old man!"],
        ["Perfect timing of yours!", "We were just looking for a good old sandbag."],
        ["You think you still got what it takes?", "Show us your moves. ROPE SKIP FIGHT!"],
        ["We still dont like sports...", "And we don't like old farts like YOU!"],
        ["If police sees the two of us...", "you might get ARRESTED! 😈"],
        ["What are you doing here?! This is a private school!", "You are way too old and poor to be here."],
        ["Last time our calculations were incorrect.", "But this time we used quantum computing!"],
        ["How dare you coming back here?!", "Whatever, we will beat you up once again!"]
    ]

    let showDialogue = false
    let disableAttackButtons = false

      /**
     * 
     * Trophies
     * 
     */

    const allTrophies = Object.values(game.trophies)

    allTrophies.forEach(trophy => displayAlreadyUnlockedTrophy(trophy))

    function handleTrophies() {
        const trophiesToUnlock = []
        if (!game.trophies.beatenGame.unlocked) {
            trophiesToUnlock.push(game.trophies.beatenGame)
        }
        parsedTrophies.beatenGame = true

        if (allOneType(attackTypes.strength)) {
            if(!game.trophies.allStrength.unlocked) {
                trophiesToUnlock.push(game.trophies.allStrength)
            }
            parsedTrophies.allStrength = true
        }
        if (allOneType(attackTypes.assholiness)) {
            if(!game.trophies.allAssholes.unlocked) {
                trophiesToUnlock.push(game.trophies.allAssholes)
            }
            parsedTrophies.allAssholes = true
        }
        if (allOneType(attackTypes.intelligence)) {
            if(!game.trophies.allIntelligence.unlocked) {
                trophiesToUnlock.push(game.trophies.allIntelligence)
            }
            parsedTrophies.allIntelligence = true
        }
        if (!game.itemUsed) {
            if(!game.trophies.noItems.unlocked) {
                trophiesToUnlock.push(game.trophies.noItems)
            }
            parsedTrophies.hasNoItems = true
        }
        if (game.itemsUsed >= 6) {
            if(!game.trophies.sixItems.unlocked) {
                trophiesToUnlock.push(game.trophies.sixItems)
            }
            parsedTrophies.hasSixItems = true
        }
        trophiesToUnlock.forEach((trophy, index) => {
            setTimeout(() => {
                playSound(sounds.trophy)
                displayTrophyToast(trophy)
            }, index * 500)
        })
        setTimeout(() => hideAll('trophy'), 5000)
        localStorage.setItem('trophies', JSON.stringify(parsedTrophies))
    }

    function displayTrophyToast(trophy) {
        const trophyMessageDiv = document.createElement('div');
        trophyMessageDiv.innerHTML = `
            <div class="trophy-icon-wrapper">
                <i class='fas fa-trophy'></i>
            </div>
            <div>${trophy.message}</div>
        `
        trophyMessageDiv.classList.add('trophy', 'trophy-message')
        document.getElementById('trophy-messages-container').appendChild(trophyMessageDiv)
    }

    function allOneType(type) {
        return game.player.party.every(char => char.type === type)
    }

    /**
     * 
     * Helper functions
     * 
     */

    function playSound(sound) {
        sound.pause()
        sound.currentTime = 0
        sound.play().catch()
    }

    function playMusic() {
        sounds.music.volume = 0.3
        sounds.music.loop = true
        sounds.music.play().catch()
    }

    function hide(element) {
        element.style.display = 'none'
    }

    function show(element, displayStyle) {
        element.style.display = displayStyle || 'block'
    }

    function hideAll(className) {
        Array.from(document.getElementsByClassName(className)).forEach(element => {
            element.style.display = 'none'
        })
    }

    function showAll(className) {
        Array.from(document.getElementsByClassName(className)).forEach(element => {
            element.style.display = 'block'
        })
    }

    function hideMoveSelectButtons() {
        const openButtons = document.querySelectorAll(`.open`)
        openButtons.forEach(element => {
            element.classList.add("hidden-buttons")
            element.classList.remove("open")
        })
    }


    /**
     * 
     * Running Minigame
     * 
     */

    function moveBackground() {
        const gameData = game.miniGames.running

        gameData.bg1Left += 1
        gameData.bg2Left += 1
        gameData.bg3Left += 1

        if (gameData.bg1Left >= 616) gameData.bg1Left = -313
        if (gameData.bg2Left >= 616) gameData.bg2Left = -313
        if (gameData.bg3Left >= 616) gameData.bg3Left = -313

        gameData.characterLeft += 0.1
        gameData.enemyLeft -= 0.2
        const distance = gameData.enemyLeft - gameData.characterLeft

        if (distance < 160 && !runningBackgroundText.classList.contains('animated-text')) {
            runningBackgroundText.innerHTML = 'Run faster!!! He almost got you!'
            runningBackgroundText.classList.add('animated-text')
            playSound(sounds.evilLaugh)
        } 
        if (gameData.enemyLeft < gameData.characterLeft + 20) {
            gameOverRunningGame() 
            return 
        } 
        if (gameData.characterLeft < -60) {
            nextRoundRunningGame() 
            return 
        } 
        document.getElementById('running-bg-1').style.left = gameData.bg1Left + 'px'
        document.getElementById('running-bg-2').style.left = gameData.bg2Left + 'px'
        document.getElementById('running-bg-3').style.left = gameData.bg3Left + 'px'
        document.getElementById('character-running').style.left = gameData.characterLeft + 'px'
        document.getElementById('enemy-running').style.left = gameData.enemyLeft + 'px'
    }

    function gameOverRunningGame() { 
        clearInterval(game.miniGames.running.moveBackgroundInterval)
        playSound(sounds.evilLaugh)
        sounds.steps.pause()
        titleSelect.style.display = 'block' 
        titleSelect.innerHTML = gameOverTemplate 
        characterRunning.classList.remove('running') 
        enemyRunning.classList.remove('running') 
        hide(runningBackgroundText) 
        activateFadeGameover() 
    }

    function nextRoundRunningGame() {
        clearInterval(game.miniGames.running.moveBackgroundInterval)
        characterRunning.classList.remove('running')
        enemyRunning.classList.remove('running')
        hide(runningBackgroundText) 
        playSound(sounds.deathCry)
        game.round += 1
        enemyRunning.classList.add('defeated')
        sounds.steps.pause()
        titleSelect.style.display = 'block'
        titleSelect.innerHTML =
            nextRoundTemplate
        if (game.items.moneyEarnedLastRound > 0) document.getElementById('money-placeholder').innerHTML = `Earned $${game.items.moneyEarnedLastRound}`
        document.getElementById('open-shop-button').style.display = 'none'
    }

    document.getElementById('overlay-running').addEventListener('click', () => game.miniGames.running.characterLeft -= 4)

    /**
     * 
     * Rope Skip Minigame
     * 
     */

    document.getElementById('click-overlay').addEventListener('click', jump)

    function moveRope() {
        const ropeSkip = game.miniGames.ropeSkip
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.beginPath()
        ctx.moveTo(150, 200)
        ctx.bezierCurveTo(150, ropeSkip.ropeY, 400, ropeSkip.ropeY, 400, 200)
        ctx.lineWidth = ropeSkip.moveRopeDownwards ? 2 : 4
        ctx.stroke()

        if (ropeSkip.moveRopeDownwards && ropeSkip.ropeY < 280) {
            ropeSkip.ropeY += 2
        }

        if (!ropeSkip.moveRopeDownwards && ropeSkip.ropeY > 20) {
            ropeSkip.ropeY -= 2
        }

        if (ropeSkip.ropeY >= 280 || ropeSkip.ropeY <= 80) {
            ropeSkip.moveRopeDownwards = !ropeSkip.moveRopeDownwards
            ropeSkip.skips += .5
            canvas.style.zIndex = ropeSkip.moveRopeDownwards ? '1' : '3'

            if (ropeSkip.skips % 3 === 0) {
                clearInterval(ropeSkip.interval)
                ropeSkip.speed *= 1.1
                ropeSkip.interval = setInterval(moveRope, 1000 / ropeSkip.speed)
            }

            if (ropeSkip.ropeY >= 240) {
                ropeSkip.characterJumps && game.player.party[1].energy > 0 ? getPointRope() : getHitRope()
            }
        }
    }

    function nextRoundRope() {
        game.round += 1
        document.getElementById('girl-left').classList.add('defeated')
        document.getElementById('girl-right').classList.add('defeated')
        clearInterval(game.miniGames.ropeSkip.interval)
        playSound(sounds.girl)
        document.getElementById('rope-skips').innerHTML = ''
        titleSelect.style.display = 'block'
        titleSelect.innerHTML = nextRoundTemplate
        if (game.items.moneyEarnedLastRound > 0) document.getElementById('money-placeholder').innerHTML = `Earned $${game.items.moneyEarnedLastRound}`
        document.getElementById('open-shop-button').style.display = 'none'
        hide(canvas)
        hide(clickOverlay)
    }

    function gameOverRope() {
        clearInterval(game.miniGames.ropeSkip.interval)
        playSound(sounds.deathCry)
        hide(canvas)
        hide(clickOverlay)
        show(titleSelect)
        titleSelect.innerHTML = gameOverTemplate
    }

    function getPointRope() {
        game.miniGames.ropeSkip.points += 1
        playSound(sounds.confirm)
        const ropeSkips = document.getElementById('rope-skips')
        ropeSkips.innerHTML = `Skips: ${game.miniGames.ropeSkip.points}/20`
        if (game.miniGames.ropeSkip.points === 20) {
            nextRoundRope()
        }
    }

    function getHitRope() {
        game.player.party[1].energy -= 30
        playSound(sounds.fail)
        const energyBars = Array.from(document.getElementsByClassName('energybar'))
        energyBars[1].querySelector('#energy-char2').style.width = game.player.party[1].energy + "%"
        energyBars[1].querySelector('#energy-char2').style.background = game.player.party[1].energy < 30 ? "red" : "green"
        if (game.player.party[1].energy <= 0) {
            box.classList.add('defeated')
            setTimeout(() => {
                gameOverRope()
            }, 200)
        }
    }

    function jump() {
        if (!game.miniGames.ropeSkip.characterJumps) {
            game.miniGames.ropeSkip.characterJumps = true
            playSound(sounds.jump)
            box.style.top = '140px'
            setTimeout(() => {
                game.miniGames.ropeSkip.characterJumps = false
                box.style.top = '170px'
            }, 300)
        }
    }

/*
*
* General Game
*
*/

    function startGame(isTeacherMode) {
        game.isTeacherMode = isTeacherMode
        hide(title)
        hide(titleButton)
        hide(howToPlayButton)
        hide(displayTrophiesButton)
        hide(vendettaButton)
        playSound(sounds.schoolBell)
        playMusic()
        if (isTeacherMode) {
            game.enemy.party = setTeamsTeacher()[game.round]
            initializeGameTeacher()
            return
        }
        updateGameState(gameStates.characterSelect)
        selectScreen.style.display = 'grid'
        show(titleSelect)
        game.enemy.party = setTeams[game.round]
    }

    dialogueBoxWrapper.addEventListener('click', nextDialogue)

    function nextDialogue() {
        if (showDialogue && game.messageIndex === 0) {
            game.messageIndex = 1
            setDialogue()
            return
        }

        game.messageIndex = 0
        hide(dialogueBoxWrapper)
        show(itemBox, 'flex')
        showDialogue = false
        startNextRound()

    }

    function startNextRound() {
        updateGameState(gameStates.selectTargets)
        bombButton.removeAttribute('disabled')
        itemButton.removeAttribute('disabled')

        if (game.round === 3) {
            startRopeGame()
        }

        if (game.round === 5) {
            startRunningGame()
        }

        if (game.round === 8) {
            startBossRound()
        }
    }

    function startRopeGame() {
        updateGameState(gameStates.ropeSkip)
        game.miniGames.ropeSkip.interval = setInterval(moveRope, 1000 / game.miniGames.ropeSkip.speed)
        hide(itemBox)
    }

    function startRunningGame() {
        updateGameState(gameStates.lockerRoom)
        game.miniGames.running.moveBackgroundInterval = setInterval(moveBackground, 1000 / 120)
        sounds.steps.playbackRate = 2
        sounds.steps.loop = true
        sounds.steps.play().catch()
        const spritePosition = spritePositions[game.player.party[1].class].side
        runningSprite.style.top = spritePosition.top
        runningSprite.style.left = spritePosition.left
        characterRunning.classList.add('running')
        enemyRunning.classList.add('running')
        hide(itemBox)
    }

    function startBossRound() {
        sounds.bossMusic.volume = 0.6
        sounds.bossMusic.loop = true
        sounds.bossMusic.play().catch()
    }

    function addCharacter(event) {
        const character = event.currentTarget.dataset.character
        const obj = new Character(characters[character])

        if (game.player.party.length < 3) {
            playSound(sounds.confirm)
            obj.id = game.player.party.length + 1
            game.player.party.push(obj)
            titleSelect.innerHTML = `Add characters to your party ${game.player.party.length}/3`
            document.getElementById(`energy-char${obj.id}-text`).innerHTML = obj.class
        }

        if (game.player.party.length === 3) {
            showDialogue = true
            activateFade()
            setTimeout(() => {
                initializeGame()
            }, 1000)
        }
    }

    function initializeGame() {
        updateGameState(gameStates.dialogue)
        hide(selectScreen)
        hide(selectScreen2)
        hide(selectScreen3)
        hide(titleSelect)
        setDialogue()
        const energyBars = Array.from(document.getElementsByClassName('energybar'))
        energyBars.forEach(bar => show(bar))
        const spriteContainers = Array.from(document.getElementsByClassName('sprite-container'))
        spriteContainers.forEach(sprite => show(sprite))
        showPlayerSprites()
        showEnemySprites()
        drawItembox()
    }

    function initializeGameTeacher() {
        document.getElementById('energy-char2-text').innerHTML = characters.teacher.class
        teacherTeam.forEach(member => game.player.party.push(member))
        setDialogue()
        const energyBars = Array.from(document.getElementsByClassName('energybar'))
        energyBars.forEach(bar => show(bar))
        hide(energyBars[0])
        hide(energyBars[2])
        const spriteContainers = Array.from(document.getElementsByClassName('sprite-container'))
        spriteContainers.forEach(sprite => show(sprite))
        showPlayerSpritesTeacher()
        showEnemySprites()
        showDialogue = true
        drawItembox()
    }

    function setDialogue() {
        showDialogue = true
        disableAttackButtons = false
        show(dialogueBoxWrapper)
        const selectedDialogue = game.isTeacherMode ? dialoguesTeacher : dialogues
        dialogueBox.innerHTML = selectedDialogue[game.round][game.messageIndex]
    }

    function showButtons(event) {
        if (showDialogue || fightAnimationRunning || disableAttackButtons || bombAnimationRunning) return
        
        const element = event.currentTarget
        if (game.isTeacherMode && (element.id === 'char1' || element.id === 'char3')) return
        hide(battleTicker)
        Array.from(document.getElementsByClassName('left-party')).forEach(element => {
            element.classList.remove('open')
        })
        element.classList.toggle('open')
    }

    function selectChar(event) {
        const target = event.currentTarget
        hide(bombContainerWrapper)
        playSound(sounds.confirm)
        const index = event.currentTarget.dataset.partymember
        game.player.selectedChar = game.player.party[index]
        game.player.selectedCharId = target.dataset.char
        game.player.selectedAttackType = target.dataset.type
        const indexAttr = target.dataset.index

        if (game.player.selectedAttackType === "") {
            selectDefend(game.player.selectedChar, game.player.selectedCharId, indexAttr)
        }

        Array.from(document.getElementsByClassName('open')).forEach(openedElement => {
            openedElement.classList.remove('open')
            openedElement.classList.add('hidden')
        })
    }

    function selectTarget(event) {
        if (game.player.selectedChar.class === 'Dummy') return
        document.querySelector(`#char${game.player.selectedChar.id} .overflow-wrapper`).classList.add('selected')
        const enemyWrapper = event.target.closest('.right-party')
        const id = enemyWrapper.dataset.enemy
        const enemy = game.enemy.party[parseInt(id)]
        const possibleMoves = getPossibleMoves()

        if (game.player.selectedAttackType !== "") {
            Array.from(document.getElementsByClassName('open')).forEach(element => {
                element.classList.add('hidden-buttons')
                element.classList.remove('open')
            })
        }

        if (game.player.moves.length < possibleMoves && game.player.selectedChar !== "" && enemy.energy > 0) {
            game.player.moves.push({ attacker: game.player.selectedChar, target: enemy, type: game.player.selectedAttackType })
            game.player.selectedChar = ""
            game.player.selectedCharId = ""
            game.player.selectedAttackType = ""
            playSound(sounds.confirm)
        }

        if (game.player.moves.length === possibleMoves) {
            fight()
        }
    }

    function selectDefend(player, int, index) {
        hideMoveSelectButtons()
        game.player.party[index].defends = true
        game.player.moves.push({ attacker: player, target: "", type: "" })
        playSound(sounds.confirm)

        if (game.player.moves.length === getPossibleMoves()) {
            fight()
        }
    }

    function fight() {
        document.querySelectorAll('.hidden-buttons').forEach(element => {
            element.classList.remove('hidden-buttons')
        })
        calculateDamage()
        runFightAnimation()
    }

    function setCharactersDefeated() {
        game.enemy.party.forEach(element => {
            if (element.energy <= 0) {
                const defeated = document.getElementById(`enemy${element.id}`)
                defeated.classList.add('defeated')
            }
        })
        game.player.party.forEach(element => {
            if (element.energy <= 0) {
                const defeated = document.getElementById(`char${element.id}`)
                defeated.classList.add('defeated')
            }
        })
    }

    function setEnemiesDefending() {
        const remainingEnemyParty = getRemainingEnemies()
        remainingEnemyParty.forEach(enemy => {
            const randomDefending = Math.floor(Math.random() * (10))
            enemy.defends = false

            if (randomDefending <= 8 || enemy.energy <= 0) return

            enemy.defends = true
            game.battleMessages.push("<span class='text-enemy'>Enemy " + enemy.class + " <i class='fas fa-shield-alt'></i>" + "</span><br>")
        })
    }

    function handlePlayerMoves() {
        game.player.moves.forEach(element => {
            if (element.attacker.defends) {
                game.battleMessages.push("<span class='text-player'>" + element.attacker.class + " <i class='fas fa-shield-alt'></i>" + "</span><br>")
                return
            }

            game.battleMessages.push("<span class='text-player'>" + element.attacker.class + '  ' + setBattletickerIcon(element.type) + '  ' + "<span class='text-enemy'>Enemy " + element.target.class + "</span><br>")
            const selector = element.type
            const attack = element.attacker[selector]
            const defense = getDefenseType(selector, "target")
            const typeBonus = getEffectiveness(selector, element.target.type)

            let damage = attack * typeBonus * (100 / (100 + element.target[defense] * 10))
            element.target.takeDamage(damage)

            if (element.target.energy <= 0) {
                element.target.energy = 0
                setTimeout(() => playSound(sounds.deathCry2), 2500)
            }
        })
    }

    function randomAttackType() {
        let selector
        switch (game.lastMoveTeacher) {
            case attackTypes.strength: {
                selector = attackTypes.assholiness
                game.lastMoveTeacher = attackTypes.assholiness
                break
            }
            case attackTypes.assholiness: {
                selector = attackTypes.intelligence
                game.lastMoveTeacher = attackTypes.intelligence
                break
            }
            case attackTypes.intelligence: {
                selector = attackTypes.strength
                game.lastMoveTeacher = attackTypes.strength
                break
            }
        }

        return selector
    }

    function selectTargetForEnemy() {
        const possibleTargets = getRemainingParty()

        const randomNumber = Math.floor(Math.random() * (possibleTargets.length))
        let energy = 100
        let target = possibleTargets[0]

        possibleTargets.forEach(element => {
            if (element.energy <= energy) {
                energy = element.energy
                target = element
            }
        })

        if (Math.floor(Math.random() * (10)) > 4) {
            target = possibleTargets[randomNumber]
        }

        if (target === undefined) target = possibleTargets[0]

        return target
    }

    function selectEnemyMoves() {
        const remainingEnemyParty = getRemainingEnemies()
        remainingEnemyParty.forEach(enemy => {
            if (!enemy.defends) {
                const selector = (enemy.type === attackTypes.teacher || enemy.type === attackTypes.allrounder)
                    ? randomAttackType() : enemy.type
                const attack = enemy[selector]
                const target = selectTargetForEnemy()
                const defense = getDefenseType(selector, target)
                const typeBonus = getEffectiveness(selector, target.type)

                game.battleMessages.push("<span class='text-enemy'> Enemy " + enemy.class + "</span>" + setBattletickerIcon(selector) + "<span class='text-player'>" + target.class + "</span><br>")
                const damage = attack * typeBonus * (100 / (100 + target[defense] * 10))
                target.takeDamage(damage)

                if (target.energy <= 0) {
                    setTimeout(() => playSound(sounds.deathCry), 2500)
                }
            }
        })
    }

    function calculateDamage() {
        const remainingEnemyParty = getRemainingEnemies()
        document.getElementById('battle-ticker') .style.display = 'block'
        game.battleMessages = []
        setEnemiesDefending()
        handlePlayerMoves()
        selectEnemyMoves()
        drawEnergyBars()
        resetDefending()

        if (remainingEnemyParty.length > 0 && game.round <= 8){
            setTimeout(() => show(itemBox, 'flex'), 2500)
        }

        checkGameOver()

        battleTicker.innerHTML = game.battleMessages.join(" ")
        checkRemainingEnemies()
    }

    function checkGameOver() {
        const gameOver = getPossibleMoves() === 0

        if (gameOver) {
            setTimeout(() => {
                hide(battleTicker)
                show(titleSelect)
                titleSelect.innerHTML = gameOverTemplate
                hide(itemBox)
                sounds.bossMusic.pause()
            }, 2500)
        }
    }

    function getPossibleMoves() {
        const remainingChars = game.player.party.filter(char => char.energy > 0 && char.class !== 'Dummy')
        return remainingChars.length
    }

    function resetDefending() {
        game.enemy.party.forEach(enemy => {
            enemy.defends = false
        })
        game.player.party.forEach(char => {
            char.defends = false
        })
    }

    function getEffectiveness(attackType, defenderType) {
        const isEffective = (attackType === attackTypes.strength && defenderType === attackTypes.intelligence) || 
        (attackType === attackTypes.intelligence && defenderType === attackTypes.assholiness) || 
        (attackType === attackTypes.assholiness && defenderType === attackTypes.strength)

        return isEffective ? 1.5 : 1
    }

    function getDefenseType(attackType, target) {
        if (target === undefined) {
            return
        }

        let defense

        switch (attackType) {
            case attackTypes.strength:
                defense = attackTypes.assholiness
                break
            case attackTypes.assholiness:
                defense = attackTypes.intelligence
                break
            case attackTypes.intelligence:
                defense = attackTypes.strength
                break
            default:
                defense = null
        }

        return defense
    }

    function setBattletickerIcon(selector) {
        let icon = " <i class='fas fa-hand-rock'></i> "

        if (selector === attackTypes.intelligence) {
            icon = " <i class='fas fa-glasses'></i> "
        }

        if (selector === attackTypes.assholiness) {
            icon = " <i class='fas fa-hand-middle-finger'></i> "
        }

        return icon
    }

    function checkRemainingEnemies() {
        const remainingEnemies = getRemainingEnemies()

        if (remainingEnemies.length > 0) {
            setTimeout(() => updateGameState(gameStates.selectTargets), 5000)
            return
        }
        checkSurvivors()
        game.round += 1
        disableAttackButtons = true
        setTimeout(() => {
            hide(battleTicker)
            hide(itemBox)
            show(titleSelect)

            if (game.round < 9) {
                titleSelect.innerHTML = nextRoundTemplate
                if (game.items.moneyEarnedLastRound > 0) document.getElementById('money-placeholder').innerHTML = `Earned $${game.items.moneyEarnedLastRound}`
                return
            }

            if (!game.isTeacherMode) localStorage.setItem('lastVictoryTeam', JSON.stringify(game.player.party.map(entry => entry.class)))
            handleTrophies()
            updateGameState(gameStates.victory)
            sounds.bossMusic.pause()
            runVictoryAnimation()
            setTimeout(() => {
                playSound(sounds.victory)
                playSound(sounds.cheer)
            }, 500)
            runConfettiAnimation()
            titleSelect.innerHTML = game.isTeacherMode ? victoryTemplateTeacher : victoryTemplate
        }, 2600)
    }

    function checkSurvivors() {
        hide(itemBox)
        game.items.moneyEarnedLastRound = 0
        game.player.party.forEach(char => {
            if (char.energy > 0 && char.class !== 'Dummy') {
                game.items.moneyEarnedLastRound += 1
            }
        })
        game.items.money += game.items.moneyEarnedLastRound
        game.items.moneyEarnedTotal += game.items.moneyEarnedLastRound

        if (game.items.moneyEarnedLastRound > 0) runReceivedItemAnimation('money')
    }
    
    function changeBackground() {
        switch (game.round) {
            case 0: {
                backgroundElement.style.backgroundImage = "url('images_schoolfight/background1.jpg')"
                break
            }
            case 2: {
                backgroundElement.style.backgroundImage = "url('images_schoolfight/background2.jpg')"
                break
            }
            case 5: {
                runningBackground.style.display = 'block'
                const spritePosition = spritePositions[game.player.party[1].class].front
                runningSprite.style.top = spritePosition.top
                runningSprite.style.left = spritePosition.left
                break
            }
            case 6: {
                backgroundElement.style.backgroundImage = "url('images_schoolfight/background3.jpg')"
                hide(runningBackground)
                break
            }
            case 8: {
                backgroundElement.style.backgroundImage = "url('images_schoolfight/background4.jpg')"
                break
            }
            default: return
        }
    }

    function setUpNextRound() {
        activateFade()
        hide(itemBox)
        hide(bombContainerWrapper) 
        setTimeout(() => changeBackground(), 1000)
        setTimeout(() => {
            setDialogue()
            document.querySelectorAll(".sprite-container").forEach(sprite => { 
                sprite.classList.remove("hidden-buttons") 
            }) 
            playSound(sounds.schoolBell)
            game.player.party.forEach(element => element.energy = 100)
            game.enemy.party = game.isTeacherMode ? setTeamsTeacher()[game.round] : setTeams[game.round]
            drawEnergyBars()
            document.querySelectorAll(".defeated").forEach(element => { 
                element.classList.remove("defeated") 
            }) 
            showPlayerSprites()
            showEnemySprites()
            hide(document.getElementById("next-button")) 
            titleSelect.innerHTML = ""

            if (game.round === 3) {
                setupForRopeGame()
            }

            if (game.round === 5) {
                setupRunningGame()
            }

            if (game.round !== 3 && game.round !== 5) {
                setupRegularRound()
            } 
            
            if (game.round === 8) {
                setupBossRound()
            } 
        }, 1000) 
    }

    function setupForRopeGame() {
        hideAll('energybar')
        const energyBars = Array.from(document.getElementsByClassName('energybar'))
        show(energyBars[1])
        show(document.getElementById("rope-skipping-game"))
        hideAll('left-party')
        const ropeSprite = document.getElementById("rope-sprite")
        const spritePosition = game.isTeacherMode ? spritePositions.Teacher.front : spritePositions[game.player.party[1].class].front
        ropeSprite.style.top = spritePosition.top
        ropeSprite.style.left = spritePosition.left
    }

    function setupRunningGame() {
        hideAll('energybar')
        hideAll('left-party')
    }

    function setupRegularRound() {
        hide(document.getElementById("rope-skipping-game"))
        showAll('left-party')
        showAll('energybar')
        const energyBars = Array.from(document.getElementsByClassName('energybar'))
        energyBars.forEach(bar => show(bar))

        if (game.isTeacherMode) {
            hide(energyBars[0])
            hide(energyBars[2])
        }
    }

    function setupBossRound() {
        sounds.music.pause()
        if (!game.isTeacherMode) {
            hide(document.getElementById("energybar-enemy1"))
            hide(document.getElementById("energybar-enemy3"))
        }
    }

    function drawEnergyBars() {
        for (let i = 0; i <= 2; i++) { 
            const charEnergyBar = document.getElementById(`energy-char${i + 1}`)
            charEnergyBar.style.width = game.player.party[i].energy + "%"
            charEnergyBar.style.background = game.player.party[i].energy < 30 ? "red" : "green"
            if (game.player.party[i].class !== 'Dummy')show(charEnergyBar)
            const enemyEnergyBar = document.getElementById(`energy-enemy${i + 1}`)
            enemyEnergyBar.style.width = game.enemy.party[i].energy + "%"
            enemyEnergyBar.style.background = game.enemy.party[i].energy < 30 ? "red" : "green"
            show(enemyEnergyBar)
        }
        if (!game.isTeacherMode) return
        const energyBars = Array.from(document.getElementsByClassName('energybar'))
        hide(energyBars[0])
        hide(energyBars[2])
    }

    const body = document.querySelector('body')
    const actions = {
        '#char1.victory': () => playSound(sounds.clap),
        '#char2.victory': () => playSound(sounds.laugh),
        '#char3.victory': () => playSound(sounds.scream),
        '#next-button': setUpNextRound,
        '#open-shop-button': openShop,
    }
    body.addEventListener('click', (event) => {
        for (const selector in actions) { 
            if (event.target.matches(selector)) { 
                actions[selector](event)
                break 
            } 
        } 
    })

    const buttonsCharElements = document.querySelectorAll('.buttons-char') 
    buttonsCharElements.forEach(element => { 
        element.addEventListener('click', selectChar) 
    })

    const leftPartyElements = document.querySelectorAll('.left-party') 
    leftPartyElements.forEach(element => { 
        element.addEventListener('click', showButtons) 
    })

    const addButtons = document.querySelectorAll('.add-button')
    addButtons.forEach(element => {
        element.addEventListener('click', addCharacter)
    })

    const enemySprites = document.querySelectorAll('.enemy-sprite')
    enemySprites.forEach(element => {
        element.addEventListener('click', selectTarget)
    })

    const switchSelectScreenButtons = document.querySelectorAll('.selectscreen-button')
    switchSelectScreenButtons.forEach(element => {
        element.addEventListener('click', switchSelectScreen)
    })

    function getRemainingEnemies() {
        return game.enemy.party.filter(enemy => enemy.energy > 0)
    }

    function getRemainingParty() {
        return game.player.party.filter(char => char.energy > 0 && char.class !== 'Dummy')
    }

    document.getElementById('fullscreen-button').addEventListener('click', setFullscreen)
    function setFullscreen() {
        if (!document.fullscreenElement) document.body.requestFullscreen().catch()
        else document.exitFullscreen().catch()
    }

    if (game.lastVictoryTeam && game.lastVictoryTeam.length >=1) vendettaButton.style.display = 'block'

    /*
    DRAW SPRITES
     */

    function showPlayerSprites() {
        game.player.party.forEach((element, index) => {
            const charSprite = document.getElementById(`char${index + 1}-sprite`)
            const spritePosition = spritePositions[element.class].front
            Object.keys(spritePosition).forEach(key => {
                charSprite.style[key] = spritePosition[key]
            })
            document.querySelector(`.buttons-char${index + 1}[data-type='strength'] i span`).innerHTML = element.strength
            document.querySelector(`.buttons-char${index + 1}[data-type='intelligence'] i span`).innerHTML = element.intelligence
            document.querySelector(`.buttons-char${index + 1}[data-type='assholiness'] i span`).innerHTML = element.assholiness
        })
    }

    function showPlayerSpritesTeacher() {

        const charSprite = document.getElementById('char2-sprite')
        const spritePosition = spritePositions.Teacher.front
        Object.keys(spritePosition).forEach(key => {
            charSprite.style[key] = spritePosition[key]
        })
        document.querySelector(`.buttons-char2[data-type='strength'] i span`).innerHTML = characters.teacher.strength
        document.querySelector(`.buttons-char2[data-type='intelligence'] i span`).innerHTML = characters.teacher.intelligence
        document.querySelector(`.buttons-char2[data-type='assholiness'] i span`).innerHTML = characters.teacher.assholiness

        document.getElementById('char1-sprite').style.display = 'none'
        document.getElementById('char3-sprite').style.display = 'none'
    }

    function showEnemySprites() {
        game.enemy.party.forEach((element, index) => {
            element.id = index + 1
            const enemySprite = document.getElementById(`enemy${index + 1}-sprite`)
            const spritePosition = spritePositions[element.class].front
            Object.keys(spritePosition).forEach(key => {
                enemySprite.style[key] = spritePosition[key]
            })
            document.getElementById(`energy-enemy${index + 1}-text`).innerHTML = element.class
        })
    }

    /*
    SCREEN HANDLING
     */

    titleButton.addEventListener('click', () => startGame(false))
    vendettaButton.addEventListener('click', () => startGame(true))

    const selectScreens = [selectScreen, selectScreen2, selectScreen3]

    function displayUnlockableCharacters() {
        const screen3 = document.getElementById('select-screen3')
        const sprites = screen3.getElementsByClassName('select-sprite')
        const descBoxes = screen3.getElementsByClassName('desc-box')

        const amountTrophies = Object.values(game.trophies).filter(trophy => trophy.unlocked).length

        if (amountTrophies >= 2) hide(document.getElementById('unlockables-message'))
        if (amountTrophies < 2) {
            hide(sprites[0])
            hide(descBoxes[0])
        }
        if (amountTrophies < 4) {
            hide(sprites[1])
            hide(descBoxes[1])
        }
        if (amountTrophies < 6) {
            hide(sprites[2])
            hide(descBoxes[2])
        }
    }

    function switchSelectScreen(event) {
        const maximumIndex = selectScreens.length - 1

        displayUnlockableCharacters()

        if (event.currentTarget.classList.contains('right-button')) {
            game.displayedSelectScreenIndex += 1
        }

        if (event.currentTarget.classList.contains('left-button')) {
            game.displayedSelectScreenIndex -= 1
        }

        if (game.displayedSelectScreenIndex < 0) game.displayedSelectScreenIndex = maximumIndex
        if (game.displayedSelectScreenIndex > maximumIndex) game.displayedSelectScreenIndex = 0

        selectScreens.forEach((screen, index) => {
            screen.style.display = index === game.displayedSelectScreenIndex ? 'grid' : 'none'
        })

        playSound(sounds.click)
    }

    function showTrophiesScreen () {
        playSound(sounds.confirm)
        show(trophiesScreen)
        hide(titleButton)
        hide(howToPlayButton)
        hide(displayTrophiesButton)
        hide(vendettaButton)
        hide(title)
    }

    function displayAlreadyUnlockedTrophy(trophy) {
        if (trophy.unlocked) trophy.element.classList.remove('not-received')
    }

    displayTrophiesButton.addEventListener('click', showTrophiesScreen)

    document.getElementById('how-to-play-button').addEventListener('click', toggleTutorial)

    document.getElementById('tutorial-screen').addEventListener('click', function(event) {
        if (event.target && event.target.id === 'back-button') {
            toggleTutorial()
        }

        if (event.target && event.target.id === 'toggle-tutorial-button') {
            switchTutorialPage()
        }
    })

    function toggleTutorial() {
        playSound(sounds.confirm)
        game.showTutorial = !game.showTutorial

        if (game.showTutorial) {
            hide(title)
            hide(titleButton)
            hide(vendettaButton)
            show(tutorialScreen)
            show(backButton)
            hide(howToPlayButton)
            hide(displayTrophiesButton)
            return
        }

        location.reload()
    }

    let showFirstPageTutorial = true

    function switchTutorialPage() {
        showFirstPageTutorial = !showFirstPageTutorial
        tutorialScreen.innerHTML = showFirstPageTutorial ? tutorialPage1template : tutorialPage2template
    }

    /*
    USE ITEMS
     */

    document.getElementById('item-button').addEventListener('click', eatSnack)
    document.getElementById('bomb-button').addEventListener('click', throwBomb)

    function eatSnack() {
        if (game.player.party.length === 0 || game.items.snacks === 0) return
        game.itemsUsed += 1
        game.itemUsed = true
        runSnackAnimation()
        game.items.snacks -= 1
        game.player.party.forEach(char => {
            char.eatSnack()
        })
        drawEnergyBars()
        drawItembox()
    }

    function throwBomb() {
        if (game.items.bombs <= 0 || game.enemy.party.length === 0) return
        hideMoveSelectButtons()
        game.itemsUsed += 1
        game.itemUsed = true
        battleTicker.innerHTML = bombMessageTemplate
        show(battleTicker)

        runBombAnimation()
        hide(itemBox)

        game.items.bombs -= 1
        drawItembox()

        game.enemy.party.forEach(enemy => {
            enemy.takeBombDamage()
        })

        drawEnergyBars()
        checkRemainingEnemies()

        setTimeout(() => {
            setCharactersDefeated()
            updateGameState(gameStates.selectTargets)
        }, 5000)
    }

    function drawItembox() {
        bombButton.innerHTML = `<i class="fas fa-bomb"></i>x${game.items.bombs}`
        itemButton.innerHTML = `${snackIcon}x${game.items.snacks}`
        document.getElementById('money').innerHTML = `$${game.items.money}`
    }

/*
    ANIMATIONS
 */

    const fadeOutElement = document.getElementById('fade-out')

    function activateFade() {
        playSound(sounds.fade)
        fadeOutElement.classList.remove('hidden', 'fade-out')
        fadeOutElement.classList.add('fade-out')
        setTimeout(() => fadeOutElement.classList.add('hidden'), 2000)
    }

    function activateFadeGameover() {
        playSound(sounds.fade)
        fadeOutElement.classList.remove('hidden', 'fade-out')
        fadeOutElement.classList.add('fade-out-red')
    }

    function runSnackAnimation() {
        const aliveLeftParty = document.querySelectorAll('.left-party:not(.defeated)')
        aliveLeftParty.forEach(element => element.classList.add('eating-snack'))
        setTimeout(()=>{
            aliveLeftParty.forEach(element => element.classList.remove('eating-snack'))
        },1000)

        battleTicker.innerHTML = snackMessageTemplate
        battleTicker.style.display = 'block'
        playSound(sounds.eating)
        hide(itemBox)
    }

    function runVictoryAnimation() {
        const chars = [char1,char2,char3]
        hideAll('energybar')
        hideMoveSelectButtons()
        chars.forEach((char, index) => {
            char.style.top = '200px'
            char.style.left = `${150 + 100 * index}px`
            char.classList.add('victory')
        })

        setTimeout(function () {
            chars.forEach(char => char.classList.remove('defeated'))
        }, 100)
    }

    function runFightAnimation() {
        updateGameState(gameStates.battleAnimation)
        playSound(sounds.fight)
        const allSelected = document.querySelectorAll('.selected')
        allSelected.forEach(selected => selected.classList.remove('selected'))
        overlay.style.zIndex = '999'
        fightAnimationRunning = true
        sounds.punch.playbackRate = 3
        hide(itemBox)
        setTimeout(() => playSound(sounds.punch), 500)
        document.querySelectorAll(".left-party, .right-party").forEach(element =>
            element.style.animationDelay = `${Math.floor(Math.random() * 250)}ms`
        )


        document.querySelectorAll(".sprite-container.alive").forEach(element => {
            if (element.classList.contains("left-party")) {
                element.classList.add("animated-character1")
            } else {
                element.classList.add("animated-character2")
            }
        })

        setTimeout(() => {
            overlay.style.zIndex = '-1'
            Array.from(document.getElementsByClassName('animated-character1')).forEach(element => {
                element.classList.remove('animated-character1')
            })
            Array.from(document.getElementsByClassName('animated-character2')).forEach(element => {
                element.classList.remove('animated-character2')
            })
            Array.from(document.getElementsByClassName('buttons-char')).forEach(element => {
                element.classList.remove('hidden')
            })
            setCharactersDefeated()
        }, 2600)
        setTimeout(() => {
            updateGameState(gameStates.selectTargets)
            fightAnimationRunning = false
        }, 3000)
        setTimeout(() => {
            hide(battleTicker)
        }, 4000)
        game.player.moves = []
    }

    function runConfettiAnimation() {
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div')
            confetti.className = 'confetti'
            const colorNumber = Math.floor(Math.random() * 360)
            const color = `hsl(${colorNumber}, 50%, 50%)`
            const animationDelay = Math.random() * 20 + 's'
            const xPosition = Math.random() * 100
            confetti.style.animationDelay = animationDelay
            confetti.style.backgroundColor = color
            confetti.style.left = xPosition + '%'
            backgroundElement.append(confetti)
        }
    }

    function runBombAnimation(){
        bombAnimationRunning = true
        bombContainerWrapper.style.display = 'block'
        for (let i = 0; i < 100; i++) {
            const cloud = document.createElement('div')
            cloud.className = 'bombcloud'
            const animationDelay = Math.random() * 5 + 's'
            const xPosition = Math.random() * 100
            cloud.style.animationDelay = animationDelay
            cloud.style.top = '-150px'
            cloud.style.left = (xPosition - 50) + 'px'
            bombContainer.append(cloud)
        }
        setTimeout(()=>{
            document.querySelectorAll('.right-party:not(.defeated)').forEach(element => {
                element.classList.add('bombed-enemy')
            })
            playSound(sounds.stink)
        },2000)
        setTimeout(()=>{
            document.querySelectorAll('.right-party:not(.defeated)').forEach(element => {
                element.classList.remove('bombed-enemy')
            })
        },3500)
        setTimeout(()=>{
            bombAnimationRunning = false
            hide(bombContainerWrapper)
        },7000)
    }

    function runReceivedItemAnimation(item) {
        show(itemBox, 'flex')
        Array.from(document.getElementsByClassName('shop-button')).forEach(button => button.setAttribute('disabled', 'true'))
        if (item === 'bomb') {
            bombButton.innerHTML = additionalBombMessageTemplate
            bombButtonWrapper.classList.add('animated-text')
        }

        if (item === 'snack') {
            itemButton.innerHTML = additionalSnackMessageTemplate
            itemButtonWrapper.classList.add('animated-text')
        }

        if (item === 'money') {
            document.getElementById('money').innerHTML = `$${game.items.money}`
            document.getElementById('money').classList.add('animated-text')
        }

        setTimeout(()=>{
            drawItembox()
            bombButtonWrapper.classList.remove('animated-text')
            itemButtonWrapper.classList.remove('animated-text')
            document.getElementById('money').classList.remove('animated-text')
        },1500)
        setTimeout(() => {
            checkForAffordableItems()
            hide(itemBox)
        }, 2500)
    }

    /*
    *
    * SHOP
    *
     */

    function openShop() {
        updateMoneyAmountInShop()
        activateFade()
        hide(titleSelect)
        hideAll('energybar')
        hideAll('left-party')
        setTimeout(() => {
            document.getElementById('shop').style.display = 'block'
            document.getElementById('shop-dialogue-box-wrapper').style.display = 'block'
        }, 1000)
    }

    function updateMoneyAmountInShop() {
        const moneyAmountElement = document.getElementById('current-amount-money')
        moneyAmountElement.innerHTML = `You have $${game.items.money}`
    }

    document.getElementById('leave-shop-button').addEventListener('click', leaveShop)
    function leaveShop() {
        activateFade()
        setTimeout(() => {
            show(titleSelect)
            showAll('energybar')
            showAll('left-party')
            document.getElementById('shop').style.display = 'none'
        }, 1000)
    }
    document.getElementById('upgrade-intelligence-button').addEventListener('click', () => upgrade(attackTypes.intelligence))
    document.getElementById('upgrade-strength-button').addEventListener('click', () => upgrade(attackTypes.strength))
    document.getElementById('upgrade-assholiness-button').addEventListener('click', () => upgrade(attackTypes.assholiness))
    document.getElementById('buy-snack-button').addEventListener('click', () => updateItemBox('snack'))
    document.getElementById('buy-bomb-button').addEventListener('click', () => updateItemBox('bomb'))

    function upgrade(attackType) {
        playSound(sounds.powerUp)
        document.getElementById('upgrade-message-wrapper').innerHTML = ''
        game.items.money -= prices.upgrade
        updateMoneyAmountInShop()
        Array.from(document.getElementsByClassName('shop-button')).forEach(button => button.setAttribute('disabled', 'true'))
        document.getElementById('shop-dialogue-box-wrapper').style.display = 'none'
        game.player.party.forEach(member => member[attackType] += 1)
        const message = document.createElement('div')
        message.classList.add('upgrade-message')
        const icon = () => {
            if (attackType === attackTypes.strength) return strengthIcon
            if (attackType === attackTypes.intelligence) return intelligenceIcon
            if (attackType === attackTypes.assholiness) return assholinessIcon
        }
        message.innerHTML = `<div class="animated-text">${icon()} +1</div>`
        drawItembox()
        document.getElementById('upgrade-message-wrapper').appendChild(message)
        setTimeout(() => {
            checkForAffordableItems()
            document.getElementById('upgrade-message-wrapper').innerHTML = ''
        }, 2000)
    }

    function checkForAffordableItems() {
        Array.from(document.getElementsByClassName('shop-button')).forEach(element => element.removeAttribute('disabled'))
        if (game.items.money < prices.item) {
            Array.from(document.getElementsByClassName('item-button')).forEach(element => element.setAttribute('disabled', true))
        }
        if (game.items.money < prices.upgrade) {
            Array.from(document.getElementsByClassName('upgrade-button')).forEach(element => element.setAttribute('disabled', true))
        }
    }

    function updateItemBox(item){
        if (item !== 'money') game.items.money -= prices.item
        playSound(sounds.eating)
        updateMoneyAmountInShop()
        document.getElementById('shop-dialogue-box-wrapper').style.display = 'none'
        if (item !== 'money') game.items.received += 1
        if (item === 'bomb') game.items.bombs += 1
        if (item === 'snack') game.items.snacks += 1
        runReceivedItemAnimation(item)
    }
})
