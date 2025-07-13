document.addEventListener('DOMContentLoaded', () => {
    /**
     *
     * UI variables
     *
     */

    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    const body = document.getElementById('body')
    const trophiesScreen = document.getElementById('trophies')
    const selectScreen = document.getElementById('select-screen')
    const selectScreen2 = document.getElementById('select-screen2')
    const selectScreen3 = document.getElementById('select-screen3')
    const shop = document.getElementById('shop')
    const titleSelect = document.getElementById('title-select')

    const vendettaButton = document.getElementById('vendetta-button')
    const battleTicker = document.getElementById('battle-ticker')
    const bombButton = document.getElementById('bomb-button')
    const bombButtonWrapper = document.getElementById('bomb-button-wrapper')
    const bombContainer = document.getElementById('bomb-container')
    const bombContainerWrapper = document.getElementById('bomb-container-wrapper')
    const itemBox = document.getElementById('item-box')
    const snackButtonWrapper = document.getElementById('snack-button-wrapper')
    const snackButton = document.getElementById('snack-button')
    const dialogueBoxWrapper = document.getElementById('dialogue-box-wrapper')
    const dialogueBox = document.getElementById('dialogue-box')
    const jumpBox = document.getElementById('jump-box')
    const tutorialScreen = document.getElementById('tutorial-screen')
    const overlay = document.getElementById('overlay')
    const overlayJumping = document.getElementById('overlay-jumping')
    const backgroundElement = document.getElementById('background')
    const runningBackgroundWrapper = document.getElementById('running-background-wrapper')
    const char1 = document.getElementById('char1')
    const char2 = document.getElementById('char2')
    const char3 = document.getElementById('char3')
    const runningSprite = document.getElementById('running-sprite')
    const leftPartyElements = document.querySelectorAll('.left-party')
    const enemySprites = document.querySelectorAll('.enemy-sprite')
    const switchSelectScreenButtons = document.querySelectorAll('.select-screen-button')
    const energyBarMiniGame = document.getElementById('energy-char2')
    const openShopButton = document.getElementById('open-shop-button')

    let fontSizeScaling = 0.5

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
        danceMusic: new Audio('sounds_schoolfight/117bpm.mp3'),
    }

    const allAudio = Object.values(sounds)

    function toggleMute() {
        allAudio.forEach(audio => {
            audio.muted = !audio.muted
        })
        document.getElementById('sound-control-button').classList.toggle('muted')
    }

     /**
     * 
     * Basic variables and functions
     * 
     **/

    if (!localStorage.getItem('trophies')) localStorage.setItem('trophies', JSON.stringify({}))
    const trophiesFromStorage = localStorage.getItem('trophies')
    const parsedTrophies = trophiesFromStorage ? JSON.parse(trophiesFromStorage) : undefined

    function adjustGameSize() { 
        const gameWrapper = document.getElementById('game-wrapper')
        const aspectRatio = 550 / 280
        if (window.innerWidth >= window.innerHeight * aspectRatio) {
            gameWrapper.style.transform = `scale(${window.innerHeight * aspectRatio / 660})`
            fontSizeScaling = (window.innerHeight * aspectRatio / 660)
        } else {
            gameWrapper.style.transform = `scale(${window.innerWidth / 660})`
            if (window.innerWidth > 1000) {
                fontSizeScaling = window.innerWidth / 660
            } else fontSizeScaling = 0.75
        }

        if (fontSizeScaling > 1.5) fontSizeScaling = 1.5
        if (fontSizeScaling < 0.75) fontSizeScaling = 0.75
    }

    adjustGameSize()

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

    class Trophy {
        constructor(name, message, elementId) {
            this.name = name
            this.message = message
            this.elementId = elementId
            this.unlocked = false
            this.element = document.getElementById(this.elementId)
            this.trophyMessagesContainer = document.getElementById('trophy-messages-container')
        }

        isUnlocked() {
            return this.unlocked
        }

        unlock() {
            if (!this.unlocked) {
                this.unlocked = true
                this.displayTrophyToast()
                this.updateElement()
                parsedTrophies[this.name] = true
                localStorage.setItem('trophies', JSON.stringify(parsedTrophies))
            }
        }

        displayTrophyToast() {
            const trophyMessageDiv = document.createElement('div')
            trophyMessageDiv.innerHTML =
                `<div class="trophy-icon-wrapper">
                    <i class='fas fa-trophy'></i>
                </div>
                <div>${this.message}</div>`

            trophyMessageDiv.classList.add('trophy', 'trophy-message')
            this.trophyMessagesContainer.appendChild(trophyMessageDiv)
        }

        updateElement() {
            if (this.element) {
                this.element.classList.remove('not-received')
            }
        }
    }

    const trophies = {
        beatenGame: new Trophy(
            'beatenGame',
            'Beat the game',
            'trophy-beaten',
        ),
        allAssholes: new Trophy(
            'allAssholes',
            'Beat game assholes only',
            'all-assholes',
        ),
        allStrength: new Trophy(
            'allStrength',
            'Beat game strength only',
            'all-strength',
        ),
        allIntelligence: new Trophy(
            'allIntelligence',
            'Beat game intel. only',
            'all-intelligence',
        ),
        sixItems: new Trophy(
            'hasSixItems',
            'Use six items in a run',
            'six-items',
        ),
        noItems: new Trophy(
            'hasNoItems',
            'Beat game without items',
            'itemless',
        ),
        ropeSkipNoMistakes: new Trophy(
            'ropeSkipNoMistakes',
            'Beat rope skip without mistakes',
            'rope-skip-no-mistakes',
        ),
        richKid: new Trophy(
            'richKid',
            'Own at least $12 in a run',
            'rich-kid',
        ),
        openShop: new Trophy(
            'openShop',
            'Open the shop for the first time',
            'open-shop',
        ),
    }

    const allTrophies = Object.values(trophies)

    if (parsedTrophies) {
        allTrophies.forEach(trophy => displayAlreadyUnlockedTrophy(trophy))
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
        battleMessages: [],
        itemsUsed: 0,
        isTeacherMode: false,
        lastVictoryTeam: JSON.parse(localStorage.getItem('lastVictoryTeam')),
        displayedSelectScreenIndex: 0,
        lastMoveTeacher: 'intelligence',
    }

    let fightAnimationRunning = false

    /*
    *
    * Item Manager
    *
    */

    class ItemManager {
        constructor() {
            this.bombs = 1
            this.snacks = 1
            this.money = 0
            this.moneyEarnedLastRound = 0
            this.moneyEarnedTotal = 0
            this.itemUsed = false
            this.itemsUsed = 0
            this.bombAnimationRunning = false
            this.unlocksTrophy = true
            this.alreadyHasTrophy = !!(parsedTrophies && parsedTrophies.richKid)
        }

        eatSnack() {
            if (game.player.party.length === 0 || this.snacks === 0) return
            this.itemsUsed += 1
            this.itemUsed = true
            this.runSnackAnimation()
            this.snacks -= 1
            if (this.snacks <= 0) snackButton.disabled = true
            game.player.party.forEach(char => {
                char.recoverPartially()
            })
            drawEnergyBars()
            this.drawItemBox()
        }

        throwBomb() {
            if (this.bombs <= 0 || game.enemy.party.length === 0) return
            this.bombAnimationRunning = true
            this.itemsUsed += 1
            this.itemUsed = true
            updateBattleTicker('bomb')
            hideAll('buttons-wrapper')

            this.runBombAnimation()
            addHidden(itemBox)

            this.bombs -= 1
            if (this.bombs <= 0) {
                bombButton.disabled = true
            }
            this.drawItemBox()

            game.enemy.party.forEach(enemy => {
                enemy.takeBombDamage()
            })

            drawEnergyBars()
            checkRemainingEnemies()

            setTimeout(() => {
                this.bombAnimationRunning = false
                setCharactersDefeated()
                updateGameState(gameStates.selectTargets)
            }, 5000)
        }

        drawItemBox() {
            document.getElementById('amount-snacks').innerHTML = this.snacks
            document.getElementById('amount-bombs').innerHTML = this.bombs
            document.getElementById('money').innerHTML = `$${this.money}`
        }

        runSnackAnimation() {
            const aliveLeftParty = Array.from(leftPartyElements).filter(
                element => !element.classList.contains('defeated')
            )
            aliveLeftParty.forEach(element => element.classList.add('eating-snack'))
            hideAll('buttons-wrapper')
            setTimeout(()=>{
                aliveLeftParty.forEach(element => element.classList.remove('eating-snack'))
            },1000)

            updateBattleTicker('snack')
            removeHidden(battleTicker)
            playSound(sounds.eating)
            addHidden(itemBox)
        }

        runBombAnimation(){
            removeHidden(bombContainerWrapper)
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
                addHidden(bombContainerWrapper)
            },7000)
        }

        runReceivedItemAnimation(item) {
            removeHidden(itemBox)
            Array.from(document.getElementsByClassName('shop-button')).forEach(button => button.setAttribute('disabled', 'true'))
            if (item === 'bomb') {
                bombButtonWrapper.classList.add('animated-text')
            }

            if (item === 'snack') {
                snackButtonWrapper.classList.add('animated-text')
            }

            setTimeout(()=>{
                this.drawItemBox()
                bombButtonWrapper.classList.remove('animated-text')
                snackButtonWrapper.classList.remove('animated-text')
            },1500)
            setTimeout(() => {
                this.checkForAffordableItems()
                addHidden(itemBox)
            }, 2500)
        }

        checkForAffordableItems() {
            Array.from(document.getElementsByClassName('shop-button')).forEach(element => element.removeAttribute('disabled'))
            if (this.money < prices.item) {
                Array.from(document.getElementsByClassName('buy-item-button')).forEach(element => element.setAttribute('disabled', true))
            }
            if (this.money < prices.upgrade) {
                Array.from(document.getElementsByClassName('upgrade-button')).forEach(element => element.setAttribute('disabled', true))
            }
        }

        buyItem(item){
            if (item !== 'money') this.money -= prices.item
            playSound(sounds.eating)
            updateMoneyAmountInShop()
            document.getElementById('shop-dialogue-box-wrapper').style.display = 'none'
            if (item === 'bomb') {
                this.bombs += 1
                bombButton.disabled = false
            }
            if (item === 'snack') {
                this.snacks += 1
                snackButton.disabled = false
            }
            this.runReceivedItemAnimation(item)
        }

        updateMoney(amount) {
            this.money += amount
            if (this.unlocksTrophy && !this.alreadyHasTrophy && this.money > 12) {
                trophies.richKid.unlock()
                setTimeout(() => document.getElementById('trophy-messages-container').innerHTML = '', 3000)
                this.unlocksTrophy = false
            }
            this.drawItemBox()
        }

        updateMoneyEarnedTotal(amount) {
            this.moneyEarnedTotal += amount
        }
    }

    const itemManager = new ItemManager()

    /*
    * 
    * Characters
    * 
    */

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

    const setTeams = [
        [new Character(characters.bully, 0), new Character(characters.nerd, 1), new Character(characters.normie, 2)], //1
        [new Character(characters.squealer, 0), new Character(characters.wally, 1), new Character(characters.richkid, 2)], //2
        [new Character(characters.dummy, 0), new Character(characters.dummy, 1), new Character(characters.dummy, 2)], //3 (rope skipping)
        [new Character(characters.sportskid, 0), new Character(characters.sportskid, 1), new Character(characters.sportskid, 2)], //4
        [new Character(characters.richkid, 0), new Character(characters.nerd, 1), new Character(characters.bully, 2)], //5
        [new Character(characters.dummy, 0), new Character(characters.dummy, 1), new Character(characters.dummy, 2)], //6 (running)
        [new Character(characters.richkid, 0), new Character(characters.richkid, 1), new Character(characters.richkid, 2)],  //7
        [new Character(characters.dummy, 0), new Character(characters.dummy, 1), new Character(characters.dummy, 2)], //8 (dancing)
        [new Character(characters.nerd, 0), new Character(characters.nerd, 1), new Character(characters.nerd, 2)], //9
        [new Character(characters.dummy, 0), new Character(characters.teacher, 1), new Character(characters.dummy, 2)], //10
    ]

    const setTeamsTeacher = () => [
        [new Character(characters.bully, 0), new Character(characters.nerd, 1), new Character(characters.normie, 2)], //1
        [new Character(characters.squealer, 0), new Character(characters.wally, 1), new Character(characters.richkid, 2)], //2
        [new Character(characters.dummy, 0), new Character(characters.dummy, 1), new Character(characters.dummy, 2)], //3 (rope skipping)
        [new Character(characters.sportskid, 0), new Character(characters.sportskid, 1), new Character(characters.sportskid, 2)], //4
        [new Character(characters.richkid, 0), new Character(characters.nerd, 1), new Character(characters.bully, 2)], //5
        [new Character(characters.dummy, 0), new Character(characters.dummy, 1), new Character(characters.dummy, 2)], //6 (running)
        [new Character(characters.richkid, 0), new Character(characters.richkid, 1), new Character(characters.richkid, 2)],  // 7
        [new Character(characters.dummy, 0), new Character(characters.dummy, 1), new Character(characters.dummy, 2)], //8 (dancing)
        [new Character(characters.nerd, 0), new Character(characters.nerd, 1), new Character(characters.nerd, 2)], //9
        [
            new Character(characters[game.lastVictoryTeam[0].toLowerCase()], 0),
            new Character(characters[game.lastVictoryTeam[1].toLowerCase()], 1),
            new Character(characters[game.lastVictoryTeam[2].toLowerCase()], 2)
        ], //10
    ]

    const teacherTeam = [
        Object.assign(new Character(characters.dummy, 1)),
        Object.assign(new Character(characters.teacher, 2)),
        Object.assign(new Character(characters.dummy, 3))
    ]


    /**
     *
     * Minigame Running
     *
     */

    class RunningMinigame {
        constructor() {
            this.bg1Left = 0
            this.bg2Left = 313
            this.bg3Left = 616
            this.characterLeft = 100
            this.enemyLeft = 350
            this.moveBackgroundInterval = null
            this.runningBackgroundText = document.querySelector('#running-background h2')
            this.characterRunning = document.getElementById('character-running')
            this.enemyRunning = document.getElementById('enemy-running')
        }

        start() {
            this.moveBackgroundInterval = setInterval(this.moveBackground.bind(this), 1000 / 120)
            sounds.steps.playbackRate = 2
            sounds.steps.loop = true
            sounds.steps.play().catch()
            runningSprite.className = game.player.party[1].sideSprite
            this.characterRunning.classList.add('running')
            this.enemyRunning.classList.add('running')
            addHidden(itemBox)
        }

        run() {
            this.characterLeft -= 4
        }

        moveBackground() {
            this.bg1Left += 1
            this.bg2Left += 1
            this.bg3Left += 1

            if (this.bg1Left >= 616) this.bg1Left = -313
            if (this.bg2Left >= 616) this.bg2Left = -313
            if (this.bg3Left >= 616) this.bg3Left = -313

            this.characterLeft += 0.1
            this.enemyLeft -= 0.2

            const distance = this.enemyLeft - this.characterLeft

            if (distance < 160 && !this.runningBackgroundText.classList.contains('animated-text')) {
                this.runningBackgroundText.innerHTML = 'Run faster!!! He almost got you!'
                this.runningBackgroundText.classList.add('animated-text')
                playSound(sounds.evilLaugh)
            }

            if (this.enemyLeft < this.characterLeft + 20) {
                this.gameOver()
                return
            }

            if (this.characterLeft < -60) {
                this.nextRound()
                return
            }

            document.getElementById('running-bg-1').style.left = this.bg1Left + 'px'
            document.getElementById('running-bg-2').style.left = this.bg2Left + 'px'
            document.getElementById('running-bg-3').style.left = this.bg3Left + 'px'
            this.characterRunning.style.left = this.characterLeft + 'px'
            this.enemyRunning.style.left = this.enemyLeft + 'px'
        }

        gameOver() {
            clearInterval(this.moveBackgroundInterval)
            playSound(sounds.evilLaugh)
            sounds.steps.pause()
            sounds.music.pause()
            showGameOverScreen()
            this.characterRunning.classList.remove('running')
            this.enemyRunning.classList.remove('running')
            hide(this.runningBackgroundText)
            runFadeGameOver()
        }

        nextRound() {
            clearInterval(this.moveBackgroundInterval)
            this.characterRunning.classList.remove('running')
            this.enemyRunning.classList.remove('running')
            hide(this.runningBackgroundText)
            playSound(sounds.deathCry)
            game.round += 1
            this.enemyRunning.classList.add('defeated')
            sounds.steps.pause()
            removeHidden(document.getElementById('communication-container'))
            if (itemManager.moneyEarnedLastRound > 0) {
                document.getElementById('money-placeholder').innerHTML = `Earned $${itemManager.moneyEarnedLastRound}`
            }
            addHidden(openShopButton)
        }
    }

    const runningMiniGame = new RunningMinigame()

    /**
     *
     * Minigame Ropeskip
     *
     */

    class RopeSkipMiniGame {
        constructor() {
            this.moveRopeDownwards = true
            this.ropeY = 80
            this.skips = 0
            this.speed = 100
            this.characterJumps = false
            this.points = 0
            this.interval = null
            this.alreadyHasTrophy = parsedTrophies && parsedTrophies.ropeSkipNoMistakes ? true : false
            this.unlocksTrophy = true
        }

        start() {
            this.interval = setInterval(() => this.moveRope(), 1000 / this.speed)
        }

        moveRope() {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.beginPath()
            ctx.moveTo(150, 200)
            ctx.bezierCurveTo(150, this.ropeY, 400, this.ropeY, 400, 200)
            ctx.lineWidth = this.moveRopeDownwards ? 4 : 2
            ctx.stroke()

            if (this.moveRopeDownwards && this.ropeY < 280) {
                this.ropeY += 2
            }

            if (!this.moveRopeDownwards && this.ropeY > 20) {
                this.ropeY -= 2
            }

            if (this.ropeY >= 280 || this.ropeY <= 80) {
                this.moveRopeDownwards = !this.moveRopeDownwards
                this.skips += .5
                canvas.style.zIndex = this.moveRopeDownwards ? '3' : '1'

                if (this.skips % 3 === 0) {
                    clearInterval(this.interval)
                    this.speed *= 1.1
                    this.interval = setInterval(() => this.moveRope(), 1000 / this.speed)
                }

                if (this.ropeY >= 240) {
                    this.characterJumps && game.player.party[1].energy > 0 ? this.getPointRope() : this.getHitRope()
                }
            }
        }

        nextRound() {
            if (this.unlocksTrophy && !this.alreadyHasTrophy) {
                trophies.ropeSkipNoMistakes.unlock()
                setTimeout(() => document.getElementById('trophy-messages-container').innerHTML = '', 3000)
            }
            game.round += 1
            itemManager.updateMoney(3)
            document.getElementById('money-placeholder').innerHTML = 'Earned $3'
            document.getElementById('girl-left').classList.add('defeated')
            document.getElementById('girl-right').classList.add('defeated')
            clearInterval(this.interval)
            playSound(sounds.girl)
            document.getElementById('rope-skips').innerHTML = ''
            removeHidden(document.getElementById('communication-container'))
            addHidden(openShopButton)
            hide(canvas)
            hide(overlayJumping)
        }

        gameOver() {
            clearInterval(this.interval)
            playSound(sounds.deathCry)
            hide(canvas)
            hide(overlayJumping)
            sounds.music.pause()
            showGameOverScreen()
        }

        getPointRope() {
            this.points += 1
            playSound(sounds.confirm)
            const ropeSkips = document.getElementById('rope-skips')
            ropeSkips.innerHTML = `Skips: ${this.points}/20`
            if (this.points === 20) {
                this.nextRound()
            }
        }

        getHitRope() {
            game.player.party[1].energy -= 30
            this.unlocksTrophy = false
            playSound(sounds.fail)
            energyBarMiniGame.style.width = game.player.party[1].energy + '%'
            energyBarMiniGame.style.background = game.player.party[1].energy < 30 ? 'red' : 'green'
            if (game.player.party[1].energy <= 0) {
                jumpBox.classList.add('defeated')
                setTimeout(() => {
                    this.gameOver()
                }, 200)
            }
        }

        jump() {
            if (!this.characterJumps) {
                this.characterJumps = true
                playSound(sounds.jump)
                jumpBox.style.top = '140px'
                setTimeout(() => {
                    this.characterJumps = false
                    jumpBox.style.top = '170px'
                }, 300)
            }
        }
    }

    const ropeSkipMiniGame = new RopeSkipMiniGame()

    /**
     * 
     * Dialogues
     * 
     */

    class DialogueManager {
        constructor(dialogues) {
            this.messageIndex = 0
            this.dialogues = dialogues
            this.showsDialogue = false
        }

        showDialogue() {
            this.showsDialogue = true
            disableAttackButtons = false
            removeHidden(dialogueBoxWrapper)
            dialogueBox.innerHTML = this.dialogues[game.round][this.messageIndex]
        }

        nextDialogue() {
            if (this.showsDialogue && this.messageIndex === 0) {
                this.messageIndex = 1
                this.showDialogue()
                return
            }
    
            this.messageIndex = 0
            addHidden(dialogueBoxWrapper)
            removeHidden(itemBox)
            this.showsDialogue = false
            startNextRound()
        }
    }

    const dialogues = [
        ["YOU think you can become the kings of school?", "We will flush your heads in the toilet after beating you up."],
        ["Our friend in the middle may not be the smartest.", "But he is the strongest kid around. Ready for a beating?"],
        ["Hi boooooys. We don't fight with our fists...", "So get ready for a ROPE SKIP FIGHT!"],
        ["Hey, we are just training here.", "If you don't leave we gotta teach you a lesson!"],
        ["We dont like sports...", "And we don't like YOU!"],
        ["Greetings, little fellas. What´s up?", "How about a... wrestling match...?"],
        ["What are you doing here?! This is a private school!", "You are not wealthy and classy enough to be here."],
        ["Show me your moves!", "Hit the note when its center is on the red line."],
        ["If our calculations are correct we have a 99% chance to beat you up.", "Go Go Power Rangers!"],
        ["You were beating up a lot of other kids recently to become king of school.", "You almost made it, but first you gotta beat ME!"]
    ]

    const dialoguesTeacher = [
        ["What are YOU doing here?!", "The new kings of school kicked you out of this place!"],
        ["Noooo... not you again...", "Give up, old man!"],
        ["You think you still got what it takes?", "Show us your moves. ROPE SKIP FIGHT!"],
        ["Perfect timing of yours!", "We were just looking for a good old sandbag."],
        ["We still dont like sports...", "And we don't like old farts like YOU!"],
        ["If police sees the two of us...", "you might get ARRESTED! 😈"],
        ["What are you doing here?! This is a private school!", "You are way too old and poor to be here."],
        ["To get past us, you need to feel the rhythm!", "You look way too old for this though.."],
        ["Last time our calculations were incorrect.", "But this time we used quantum computing!"],
        ["How dare you coming back here?!", "Whatever, we will beat you up once again!"]
    ]

    let disableAttackButtons = false

      /**
     * 
     * Trophies
     * 
     */

    function handleTrophies() {
        const trophiesToUnlock = []
        if (!trophies.beatenGame.isUnlocked()) {
            trophiesToUnlock.push(trophies.beatenGame)
        }
        parsedTrophies.beatenGame = true

        if (allOneType(attackTypes.strength)) {
            if(!trophies.allStrength.isUnlocked()) {
                trophiesToUnlock.push(trophies.allStrength)
            }
            parsedTrophies.allStrength = true
        }
        if (allOneType(attackTypes.assholiness)) {
            if(!trophies.allAssholes.isUnlocked()) {
                trophiesToUnlock.push(trophies.allAssholes)
            }
            parsedTrophies.allAssholes = true
        }
        if (allOneType(attackTypes.intelligence)) {
            if(!trophies.allIntelligence.isUnlocked()) {
                trophiesToUnlock.push(trophies.allIntelligence)
            }
            parsedTrophies.allIntelligence = true
        }
        if (!itemManager.itemUsed) {
            if(!trophies.noItems.isUnlocked()) {
                trophiesToUnlock.push(trophies.noItems)
            }
            parsedTrophies.hasNoItems = true
        }
        if (itemManager.itemsUsed >= 6) {
            if(!trophies.sixItems.isUnlocked()) {
                trophiesToUnlock.push(trophies.sixItems)
            }
            parsedTrophies.hasSixItems = true
        }
        trophiesToUnlock.forEach((trophy, index) => {
            setTimeout(() => {
                playSound(sounds.trophy)
                trophy.unlock()
            }, index * 500)
        })
        setTimeout(() => hideAll('trophy'), 5000)
    }

    function allOneType(type) {
        return game.player.party.every(char => char.type === type) && game.player.party.length === 3
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

    function removeHidden(element) {
        element.classList.remove('hidden')
    }

    function addHidden(element) {
        element.classList.add('hidden')
    }

    function hideAll(className) {
        Array.from(document.getElementsByClassName(className)).forEach(element => {
            element.classList.add('hidden')
        })
    }

    function showAll(className) {
        Array.from(document.getElementsByClassName(className)).forEach(element => {
            element.classList.remove('hidden')
        })
    }

/*
*
* General Game
*
*/
    let dialogueManager

    function startGame(isTeacherMode) {
        game.isTeacherMode = isTeacherMode
        hideAll('title-screen')
        playSound(sounds.schoolBell)
        playMusic()
        if (isTeacherMode) {
            game.enemy.party = setTeamsTeacher()[game.round]
            initializeGameTeacher()
            return
        }
        updateGameState(gameStates.characterSelect)
        selectScreen.classList.remove('hidden')
        removeHidden(titleSelect)
        game.enemy.party = setTeams[game.round]
    }

    function initializeGame() {
        dialogueManager = new DialogueManager(dialogues)
        updateGameState(gameStates.dialogue)
        hideAll('select-screen')
        dialogueManager.showDialogue()
        dialogueManager.showsDialogue = true
        const energyBars = Array.from(document.getElementsByClassName('energy-bar-wrapper'))
        energyBars.forEach(bar => removeHidden(bar))
        const spriteContainers = Array.from(document.getElementsByClassName('sprite-container'))
        spriteContainers.forEach(sprite => show(sprite))
        showPlayerSprites()
        showEnemySprites()
        itemManager.drawItemBox()
        document.getElementById('dance-sprite').classList.add(game.player.party[1].frontSprite)
    }

    function initializeGameTeacher() {
        dialogueManager = new DialogueManager(dialoguesTeacher)
        document.getElementById('energy-char2-text').innerHTML = characters.teacher.class
        teacherTeam.forEach(member => game.player.party.push(member))
        dialogueManager.showDialogue()
        dialogueManager.showsDialogue = true
        const energyBars = Array.from(document.getElementsByClassName('energy-bar-wrapper'))
        energyBars.forEach(bar => removeHidden(bar))
        addHidden(energyBars[0])
        addHidden(energyBars[2])
        const spriteContainers = Array.from(document.getElementsByClassName('sprite-container'))
        spriteContainers.forEach(sprite => show(sprite))
        showPlayerSpritesTeacher()
        showEnemySprites()
        itemManager.drawItemBox()
    }

    function startNextRound() {
        updateGameState(gameStates.selectTargets)
        if (itemManager.bombs > 0) bombButton.removeAttribute('disabled')
        if (itemManager.snacks > 0) snackButton.removeAttribute('disabled')
        removeHidden(openShopButton)

        if (game.round === 2) {
            startRopeGame()
        }

        if (game.round === 5) {
            runningMiniGame.start()
        }

        if (game.round === 7) {
            startDancingGame()
        }

        if (game.round === 9) {
            startBossRound()
        }
    }

    function startRopeGame() {
        updateGameState(gameStates.ropeSkip)
        ropeSkipMiniGame.start()
        addHidden(itemBox)
    }

    function startBossRound() {
        sounds.bossMusic.volume = 0.6
        sounds.bossMusic.loop = true
        sounds.bossMusic.play().catch()
    }

    function showGameOverScreen() {
        runFadeGameOver()
        addHidden(battleTicker)
        addHidden(document.getElementById('next-round-message'))
        removeHidden(document.getElementById('communication-container'))
        removeHidden(document.getElementById('game-over-message'))
        removeHidden(document.getElementById('refresh-button'))
        addHidden(itemBox)
    }

    function addCharacter(event) {
        const character = event.currentTarget.dataset.character
        const id = game.player.party.length + 1
        const obj = new Character(characters[character], id)

        if (game.player.party.length < 3) {
            playSound(sounds.confirm)
            game.player.party.push(obj)
            titleSelect.innerHTML = `Add characters to your party ${game.player.party.length}/3`
            document.getElementById(`energy-char${obj.id}-text`).innerHTML = obj.class
        }

        if (game.player.party.length === 3) {
            runFadeAnimation()
            setTimeout(() => {
                initializeGame()
            }, 1000)
        }
    }

    function updateBattleTicker(messageType) {
        addHidden(document.getElementById('bomb-message'))
        addHidden(document.getElementById('snack-message'))
        addHidden(document.getElementById('battle-messages'))
        removeHidden(battleTicker)

        if (messageType === 'bomb') removeHidden(document.getElementById('bomb-message'))
        if (messageType === 'snack') removeHidden(document.getElementById('snack-message'))
        if (messageType === 'battle') {
            removeHidden(document.getElementById('battle-messages'))
        }
    }

    function showButtons(event) {
        if (dialogueManager.showsDialogue || fightAnimationRunning || disableAttackButtons || itemManager.bombAnimationRunning) return

        const element = event.currentTarget
        if (element.classList.contains('selected')) return
        if (!element.querySelector('.buttons-wrapper').classList.contains('hidden')) return
        if (game.isTeacherMode && (element.id === 'char1' || element.id === 'char3')) return
        addHidden(battleTicker)

        document.querySelectorAll('.left-party .buttons-wrapper').forEach(wrapper => {
            wrapper.classList.add('hidden')
        })

        element.querySelector('.buttons-wrapper').classList.remove('hidden')
    }

    function selectChar(event) {
        const target = event.currentTarget
        addHidden(bombContainerWrapper)
        playSound(sounds.confirm)
        const index = event.currentTarget.dataset.partymember
        game.player.selectedChar = game.player.party[index]
        game.player.selectedCharId = target.dataset.char
        game.player.selectedAttackType = target.dataset.type

        if (game.player.selectedAttackType === '') {
            selectDefend(game.player.selectedChar)
        }

        Array.from(document.getElementsByClassName('buttons-wrapper')).forEach(element => {
            element.classList.add('hidden')
        })
    }

    function selectTarget(event) {
        if (game.player.selectedChar.class === 'Dummy' || game.player.selectedChar === '' ) return
        document.querySelector(`#char${game.player.selectedChar.id}`).classList.add('selected')
        const enemyWrapper = event.target.closest('.right-party')
        const id = enemyWrapper.dataset.enemy
        const enemy = game.enemy.party[parseInt(id)]
        const possibleMoves = getPossibleMoves()

        if (game.player.selectedAttackType !== '') {
            hideAll('buttons-wrapper')
        }

        if (game.player.moves.length < possibleMoves && game.player.selectedChar !== "" && enemy.energy > 0) {
            game.player.moves.push({ attacker: game.player.selectedChar, target: enemy, type: game.player.selectedAttackType })
            game.player.selectedChar = ''
            game.player.selectedCharId = ''
            game.player.selectedAttackType = ''
            playSound(sounds.confirm)
        }

        if (game.player.moves.length === possibleMoves) {
            fight()
        }
    }

    function selectDefend(player) {
        hideAll('buttons-wrapper')
        game.player.party.find(char => char.id === player.id).defends = true
        game.player.moves.push({ attacker: player, target: '', type: '' })
        document.querySelector(`#char${player.id}`).classList.add('selected')
        playSound(sounds.confirm)

        if (game.player.moves.length === getPossibleMoves()) {
            fight()
        }
    }

    function fight() {
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
        remainingEnemyParty.forEach((enemy) => {
            const randomDefending = Math.floor(Math.random() * (10))
            game.enemy.party.find(entry => entry.id === enemy.id).defends = false

            if (randomDefending <= 8 || enemy.energy <= 0) return

            game.enemy.party.find(entry => entry.id === enemy.id).defends = true
            buildBattleTickerText(enemy, enemy, '', 0, false)    
        })
    }

    function handlePlayerMoves() {
        game.player.moves.forEach(element => {
            if (element.attacker.defends) {
                buildBattleTickerText(element.attacker, element.target, 0, 0, true)                
                return
            }
            const selector = element.type
            const attack = element.attacker[selector]
            const defense = getDefenseType(selector, 'target')
            const typeBonus = getEffectiveness(selector, element.target.type)
            const damage = Math.floor(attack * typeBonus * (100 / (100 + element.target[defense] * 10)))
            const receivedDamage = element.target.takeDamage(damage)

            buildBattleTickerText(element.attacker, element.target, selector, receivedDamage, true)          
            if (element.target.energy <= 0) {
                element.target.energy = 0
                setTimeout(() => playSound(sounds.deathCry2), 2500)
            }
        })
    }

    function handleEnemyMoves() {
        const remainingEnemyParty = getRemainingEnemies()
        remainingEnemyParty.forEach(enemy => {
            if (!enemy.defends) {
                const selector = (enemy.type === attackTypes.teacher || enemy.type === attackTypes.allrounder)
                    ? randomAttackType() : enemy.type
                const attack = enemy[selector]
                const target = selectTargetForEnemy()
                const defense = getDefenseType(selector, target)
                const typeBonus = getEffectiveness(selector, target.type)
                const damage = Math.floor(attack * typeBonus * (100 / (100 + target[defense] * 10)))
                const receivedDamage = target.takeDamage(damage)
                buildBattleTickerText(enemy, target, selector, receivedDamage, false)

                if (target.energy <= 0) {
                    setTimeout(() => playSound(sounds.deathCry), 2500)
                }
            }
        })
    }

    function buildBattleTickerText(attacker, target, type, damage, isPlayer) {
        if (isPlayer) {
            if (attacker.defends) {
                game.battleMessages.push("<div><span class='text-player'>" + attacker.class + " <i class='fas fa-shield-alt'></i>" + "</span></div>")
            } else {
                game.battleMessages.push("<div><span class='text-player'>" + attacker.class + '  ' + setBattleTickerIcon(type) + '  ' + "<span class='text-enemy'>Enemy " + target.class + "</span>" + ` <span class="damage-text"> -${damage}%</span></div>`)
            }
        } else {
            if (attacker.defends) {
                game.battleMessages.push("<div><span class='text-enemy'>Enemy " + attacker.class + " <i class='fas fa-shield-alt'></i>" + "</span></div>")
            } else {
                game.battleMessages.push("<div><span class='text-enemy'>Enemy " + attacker.class + '  ' + setBattleTickerIcon(type) + '  ' + "<span class='text-player'> " + target.class + "</span>" + ` <span class="damage-text"> -${damage}%</span></div>`)
            }
        }
        
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

        if (possibleTargets.length === 0) return null

        const randomNumber = Math.floor(Math.random() * (possibleTargets.length))
        let energy = 100
        let target = possibleTargets[0]

        possibleTargets.forEach(element => {
            if (element.energy <= energy) {
                energy = element.energy
                target = element
            }
        })

        if (target === undefined && possibleTargets.length > 0) target = possibleTargets[0]
        target = possibleTargets[randomNumber]

        if (target === undefined) target = possibleTargets[0]

        return target
    }

    function calculateDamage() {
        const remainingEnemyParty = getRemainingEnemies()
        document.getElementById('battle-ticker') .style.display = 'block'
        game.battleMessages = []
        setEnemiesDefending()
        handleEnemyMoves()
        handlePlayerMoves()
        drawEnergyBars()
        resetDefending()

        if (remainingEnemyParty.length > 0 && game.round <= 9){
            setTimeout(() => removeHidden(itemBox), 2500)
        }

        checkGameOver()
        document.getElementById('battle-messages').innerHTML = ''
        document.getElementById('battle-messages').innerHTML = game.battleMessages.join(' ')
        checkRemainingEnemies()
    }

    function checkGameOver() {
        const gameOver = getPossibleMoves() === 0

        if (gameOver) {
            setTimeout(() => {
                showGameOverScreen()
                sounds.music.pause()
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

    function setBattleTickerIcon(selector) {
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
            addHidden(battleTicker)
            addHidden(itemBox)
            removeHidden(document.getElementById('communication-container'))

            if (game.round < 10) {
                if (itemManager.moneyEarnedLastRound > 0) document.getElementById('money-placeholder').innerHTML = `Earned $${itemManager.moneyEarnedLastRound}`
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
            addHidden(document.getElementById('next-round-message'))
            removeHidden(document.getElementById('communication-container'))
            removeHidden(document.getElementById('refresh-button'))
            if (game.isTeacherMode) removeHidden(document.getElementById('victory-teacher-message'))
            else removeHidden(document.getElementById('victory-message'))
        }, 2600)
    }

    function checkSurvivors() {
        addHidden(itemBox)
        let moneyEarnedLastRound = 0
        game.player.party.forEach(char => {
            if (char.energy > 0 && char.class !== 'Dummy') {
                moneyEarnedLastRound += 1
            }
        })
        itemManager.updateMoney(moneyEarnedLastRound)
        itemManager.updateMoneyEarnedTotal(moneyEarnedLastRound)
        itemManager.moneyEarnedLastRound = moneyEarnedLastRound
    }

    function preloadBackgrounds() {
        const backgrounds = [
            'images_schoolfight/background1.jpg',
            'images_schoolfight/background2.jpg',
            'images_schoolfight/background3.jpg',
            'images_schoolfight/background4.jpg',
            'images_schoolfight/backgroundShop.jpg'
        ]

        backgrounds.forEach(src => {
            const img = new Image()
            img.src = src
        })
    }

    preloadBackgrounds()
    
    function changeBackground() {
        switch (game.round) {
            case 0: {
                backgroundElement.classList.add('background-1')
                break
            }
            case 2: {
                backgroundElement.classList.add('background-2')
                break
            }
            case 5: {
                removeHidden(runningBackgroundWrapper)
                runningSprite.className = game.player.party[1].frontSprite
                break
            }
            case 6: {
                backgroundElement.classList.add('background-3')
                addHidden(runningBackgroundWrapper)
                break
            }
            case 9: {
                backgroundElement.classList.add('background-4')
                break
            }
            default: return
        }
    }

    function setUpNextRound() {
        runFadeAnimation()
        addHidden(itemBox)
        addHidden(bombContainerWrapper)
        addHidden(document.getElementById('communication-container'))
        setTimeout(() => changeBackground(), 1000)
        setTimeout(() => {
            dialogueManager.showDialogue()
            document.querySelectorAll('.sprite-container').forEach(sprite => {
                sprite.classList.remove('hidden-buttons')
            }) 
            playSound(sounds.schoolBell)
            game.player.party.forEach(element => element.recoverFull())
            game.enemy.party = game.isTeacherMode ? setTeamsTeacher()[game.round] : setTeams[game.round]
            drawEnergyBars()
            document.querySelectorAll('.defeated').forEach(element => {
                element.classList.remove('defeated')
            }) 
            showPlayerSprites()
            showEnemySprites()

            if (game.round === 2) {
                setupForRopeGame()
            }

            if (game.round === 5) {
                setupRunningGame()
            }

            if (game.round === 7) {
                setupDancingGame()
            }

            if (game.round !== 2 && game.round !== 5 && game.round !== 7) {
                setupRegularRound()
            } 
            
            if (game.round === 9) {
                setupBossRound()
            } 
        }, 1000) 
    }

    function setupForRopeGame() {
        const energyBars = Array.from(document.getElementsByClassName('energy-bar-wrapper'))
        energyBars.forEach(element => addHidden(element))
        removeHidden(energyBars[1])
        removeHidden(document.getElementById('rope-skipping-game'))
        hideAll('left-party')
        const ropeSprite = document.getElementById('rope-sprite')
        ropeSprite.classList.add(game.player.party[1].frontSprite)
    }

    function setupRunningGame() {
        hideAll('energy-bar-wrapper')
        hideAll('left-party')
    }

    function setupDancingGame() {
        const energyBars = Array.from(document.getElementsByClassName('energy-bar-wrapper'))
        energyBars.forEach(element => addHidden(element))
        removeHidden(energyBars[1])
        hideAll('left-party')
        document.getElementById('dance-sprites').classList.remove('hidden')
        sounds.music.pause()
    }

    function setupRegularRound() {
        addHidden(document.getElementById('rope-skipping-game'))
        addHidden(document.getElementById('dance-sprites'))
        showAll('left-party')
        showAll('energy-bar-wrapper')
        const energyBars = Array.from(document.getElementsByClassName('energy-bar-wrapper'))

        if (game.isTeacherMode) {
            addHidden(energyBars[0])
            addHidden(energyBars[2])
        }
    }

    function setupBossRound() {
        sounds.music.pause()
        if (!game.isTeacherMode) {
            hide(document.getElementById('energybar-enemy1'))
            hide(document.getElementById('energybar-enemy3'))
        }
    }

    function drawEnergyBars() {
        for (let i = 0; i <= 2; i++) { 
            const charEnergyBar = document.getElementById(`energy-char${i + 1}`)
            charEnergyBar.style.width = game.player.party[i].energy + '%'
            charEnergyBar.style.background = game.player.party[i].energy < 30 ? 'red' : 'green'
            if (game.player.party[i].class !== 'Dummy') show(charEnergyBar)
            const enemyEnergyBar = document.getElementById(`energy-enemy${i + 1}`)
            enemyEnergyBar.style.width = game.enemy.party[i].energy + '%'
            enemyEnergyBar.style.background = game.enemy.party[i].energy < 30 ? 'red' : 'green'
            show(enemyEnergyBar)
        }
        if (!game.isTeacherMode) return
        const energyBars = Array.from(document.getElementsByClassName('energy-bar-wrapper'))
        addHidden(energyBars[0])
        addHidden(energyBars[2])
    }

    function getRemainingEnemies() {
        return game.enemy.party.filter(enemy => enemy.energy > 0)
    }

    function getRemainingParty() {
        return game.player.party.filter(char => char.energy > 0 && char.class !== 'Dummy')
    }

    function setFullscreen() {
        if (!document.fullscreenElement) document.body.requestFullscreen().catch()
        else document.exitFullscreen().catch()
    }

    if (game.lastVictoryTeam && game.lastVictoryTeam.length >=1) vendettaButton.classList.remove('locked')

    /*
    DRAW SPRITES
     */

    function showPlayerSprites() {
        showAll('left-party')
        game.player.party.forEach((char, index) => {
            const charSprite = document.getElementById(`char${index + 1}-sprite`)
            charSprite.className = `player-sprite ${char.frontSprite}`
            document.querySelector(`.buttons-char${index + 1}[data-type='strength'] i span`).innerHTML = char.strength
            document.querySelector(`.buttons-char${index + 1}[data-type='intelligence'] i span`).innerHTML = char.intelligence
            document.querySelector(`.buttons-char${index + 1}[data-type='assholiness'] i span`).innerHTML = char.assholiness
        })
    }

    function showPlayerSpritesTeacher() {
        removeHidden(Array.from(document.getElementsByClassName('left-party'))[1])
        const charSprite = document.getElementById('char2-sprite')
        removeHidden(charSprite)
        charSprite.className = `player-sprite ${characters.teacher.frontSprite}`
        document.querySelector(`.buttons-char2[data-type='strength'] i span`).innerHTML = characters.teacher.strength
        document.querySelector(`.buttons-char2[data-type='intelligence'] i span`).innerHTML = characters.teacher.intelligence
        document.querySelector(`.buttons-char2[data-type='assholiness'] i span`).innerHTML = characters.teacher.assholiness

        document.getElementById('char1-sprite').style.display = 'none'
        document.getElementById('char3-sprite').style.display = 'none'
    }

    function showEnemySprites() {
        showAll('right-party')
        game.enemy.party.forEach((char, index) => {
            char.id = index + 1
            const enemySprite = document.getElementById(`enemy${char.id}-sprite`)
            removeHidden(enemySprite)
            enemySprite.className = `enemy-sprite ${char.frontSprite}`
            document.getElementById(`energy-enemy${index + 1}-text`).innerHTML = char.class
            document.getElementById(`info-enemy${index + 1}`).innerHTML = `
                Type: ${char.type} <br> 
                Strength: ${char.class === 'Teacher' ? '?' : char.strength} <br> 
                Intelligence: ${char.class === 'Teacher' ? '?' : char.intelligence} <br> 
                Assholiness: ${char.class === 'Teacher' ? '?' : char.assholiness}
            `
        })
    }

    /*
    SCREEN HANDLING
     */

    const selectScreens = [selectScreen, selectScreen2, selectScreen3]

    function displayUnlockableCharacters() {
        const screen3 = document.getElementById('select-screen3')
        const sprites = screen3.getElementsByClassName('select-sprite')
        const descBoxes = screen3.getElementsByClassName('desc-box')

        const amountTrophies = Object.values(trophies).filter(trophy => trophy.isUnlocked()).length

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
            screen.classList.add('hidden')
            if (index === game.displayedSelectScreenIndex) screen.classList.remove('hidden')
        })

        playSound(sounds.click)
    }

    function showTrophiesScreen () {
        playSound(sounds.confirm)
        show(trophiesScreen)
        hideAll('title-screen')
    }

    function displayAlreadyUnlockedTrophy(trophy) {
        if (trophy.name in parsedTrophies) {
            trophy.unlocked = true
            trophy.element.classList.remove('not-received')
        }
    }

    function showTutorialPage() {
        playSound(sounds.confirm)
        removeHidden(tutorialScreen)
        hideAll('title-screen')
    }

    function switchTutorialPage() {
        Array.from(document.getElementsByClassName('tutorial-page')).forEach(element => element.classList.toggle('hidden'))
    }


/*
    ANIMATIONS
 */

    const fadeOutElement = document.getElementById('fade-out')

    function runFadeAnimation() {
        playSound(sounds.fade)
        fadeOutElement.classList.remove('hidden', 'fade-out')
        fadeOutElement.classList.add('fade-out')
        setTimeout(() => fadeOutElement.classList.add('hidden'), 2000)
    }

    function runFadeGameOver() {
        playSound(sounds.fade)
        fadeOutElement.classList.remove('hidden', 'fade-out')
        fadeOutElement.classList.add('fade-out-red')
    }

    function runVictoryAnimation() {
        const chars = [char1,char2,char3]
        hideAll('energy-bar-wrapper')
        hideAll('buttons-wrapper')
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
        updateBattleTicker('battle')
        playSound(sounds.fight)
        hideAll('buttons-wrapper')
        const allSelected = document.querySelectorAll('.selected')
        allSelected.forEach(selected => selected.classList.remove('selected'))
        overlay.style.zIndex = '999'
        fightAnimationRunning = true
        sounds.punch.playbackRate = 3
        addHidden(itemBox)
        setTimeout(() => playSound(sounds.punch), 500)
        document.querySelectorAll('.left-party, .right-party').forEach(element =>
            element.style.animationDelay = `${Math.floor(Math.random() * 250)}ms`
        )


        document.querySelectorAll('.sprite-container.alive').forEach(element => {
            if (element.classList.contains('left-party')) {
                element.classList.add('animated-character1')
            } else {
                element.classList.add('animated-character2')
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
            showAll('buttons-char')
            setCharactersDefeated()
        }, 2600)
        setTimeout(() => {
            updateGameState(gameStates.selectTargets)
            fightAnimationRunning = false
        }, 3000)
        setTimeout(() => {
            addHidden(battleTicker)
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

    /*
    *
    * Shop
    *
     */

    let hasOpenShopTrophy = parsedTrophies && parsedTrophies.openShop ? true : false
    let hasOpenedShop = false

    function openShop() {
        if (!hasOpenedShop) {
            hasOpenedShop = true
            if(!hasOpenShopTrophy) {
                trophies.openShop.unlock()
                setTimeout(() => document.getElementById('trophy-messages-container').innerHTML = '', 3000)
            }
        }
        updateMoneyAmountInShop()
        itemManager.checkForAffordableItems()
        runFadeAnimation()
        addHidden(document.getElementById('communication-container'))
        hideAll('energy-bar-wrapper')
        hideAll('left-party')
        setTimeout(() => {
            removeHidden(shop)
            document.getElementById('shop-dialogue-box-wrapper').style.display = 'block'
        }, 1000)
    }

    function updateMoneyAmountInShop() {
        const moneyAmountElement = document.getElementById('current-amount-money')
        moneyAmountElement.innerHTML = `You have $${itemManager.money}`
    }

    function leaveShop() {
        runFadeAnimation()
        setTimeout(() => {
            removeHidden(document.getElementById('communication-container'))
            showAll('left-party')
            showAll('energy-bar-wrapper')
            addHidden(shop)
        }, 1000)
    }

    function buyUpgrade(attackType) {
        playSound(sounds.powerUp)
        document.getElementById('upgrade-message-wrapper').innerHTML = ''
        itemManager.money -= prices.upgrade
        updateMoneyAmountInShop()
        Array.from(document.getElementsByClassName('shop-button')).forEach(button => button.setAttribute('disabled', 'true'))
        document.getElementById('shop-dialogue-box-wrapper').style.display = 'none'
        game.player.party.forEach(member => member.upgradeStat(attackType))
        const message = document.createElement('div')
        message.classList.add('upgrade-message')
        const icon = () => {
            if (attackType === attackTypes.strength) return "<i class='fas fa-hand-rock'></i>"
            if (attackType === attackTypes.intelligence) return "<i class='fas fa-glasses'></i>"
            if (attackType === attackTypes.assholiness) return "<i class='fas fa-hand-middle-finger'></i>"
        }
        message.innerHTML = `<div class="animated-text">${icon()} +1</div>`
        document.getElementById('upgrade-message-wrapper').appendChild(message)
        setTimeout(() => {
            itemManager.checkForAffordableItems()
            document.getElementById('upgrade-message-wrapper').innerHTML = ''
        }, 2000)
    }

/*
*
* Event listeners
*
 */
    document.querySelectorAll('.buttons-char').forEach(element => {
        element.addEventListener('click', selectChar)
    })

    leftPartyElements.forEach(element => {
        element.addEventListener('click', (event) => {
            showButtons(event)
        })
    })

    document.querySelectorAll('.add-button').forEach(element => {
        element.addEventListener('click', addCharacter)
    })

    enemySprites.forEach(element => {
        element.addEventListener('click', selectTarget)
    })

    switchSelectScreenButtons.forEach(element => {
        element.addEventListener('click', switchSelectScreen)
    })

    const actions = {
        '#char1.victory': () => playSound(sounds.clap),
        '#char2.victory': () => playSound(sounds.laugh),
        '#char3.victory': () => playSound(sounds.scream),
        '#next-button': setUpNextRound,
        '#open-shop-button': openShop,
        '#snack-button': () => itemManager.eatSnack(),
        '#bomb-button': () => itemManager.throwBomb(),
        '#overlay-running': () => runningMiniGame.run(),
        '#overlay-jumping': () => ropeSkipMiniGame.jump(),
        '#upgrade-intelligence-button': () => buyUpgrade(attackTypes.intelligence),
        '#upgrade-strength-button': () => buyUpgrade(attackTypes.strength),
        '#upgrade-assholiness-button': () => buyUpgrade(attackTypes.assholiness),
        '#buy-snack-button': () => itemManager.buyItem('snack'),
        '#buy-bomb-button': () => itemManager.buyItem('bomb'),
        '#leave-shop-button': leaveShop,
        '#toggle-tutorial-button': switchTutorialPage,
        '#how-to-play-button': showTutorialPage,
        '#fullscreen-button': setFullscreen,
        '#sound-control-button': toggleMute,
        '#trophies-button': showTrophiesScreen,
        '#dialogue-box-wrapper': () => dialogueManager.nextDialogue(),
        '#start-button': () => startGame(false),
        '#vendetta-button': () => startGame(true)

    }

    body.addEventListener('click', (event) => {
        for (const selector in actions) {
            if (event.target.matches(selector)) {
                actions[selector](event)
                break
            }
        }
    })

    window.addEventListener('resize', adjustGameSize)
    window.addEventListener('fullscreenchange', adjustGameSize)

    /*
    *
    * Dancing minigame
    *
     */

    let CANVAS_WIDTH_LOGICAL = 500
    let CANVAS_HEIGHT_LOGICAL = 314
    const audio = sounds.danceMusic

    const NOTE_RADIUS = 25
    let HIT_LINE_Y = CANVAS_HEIGHT_LOGICAL - 50

    const START_Y = -NOTE_RADIUS * 2

    const APPROACH_TIME_MS = 1500
    const ACCURACY_THRESHOLD_PERFECT = 40
    const ACCURACY_THRESHOLD_GOOD = 60
    const ACCURACY_THRESHOLD_OKAY = 80
    const SONG_BPM = 117
    const FIRST_BEAT_OFFSET_MS = 500

    let totalSongDurationSec = 0
    const MS_PER_BEAT = 60000 / SONG_BPM

    let canvasDancingGame
    let ctx2
    let beatmap
    let activeNotes = []
    let nextNoteIndex = 0

    let score = 0
    let combo = 0
    let gameStarted = false
    let rainbowHueOffset = 0

    const note = new Image()
    note.src = 'images_schoolfight/note.svg'

    class Note {
        constructor(perfectHitTimeMs, beat) {
            this.perfectHitTimeMs = perfectHitTimeMs
            this.spawnTimeMs = perfectHitTimeMs - APPROACH_TIME_MS
            this.x = CANVAS_WIDTH_LOGICAL / 2
            this.y = START_Y
            this.radius = NOTE_RADIUS
            this.color = 'orange'
            this.hit = false
            this.missed = false
            this.judgment = ''
            this.judgmentColor = '#FFFFFF'
            this.judgmentAlpha = 0
            this.judgmentYOffset = 0
            this.judgmentDisplayStartTime = 0
            this.JUDGMENT_DISPLAY_DURATION = 600
            this.beat = beat
        }

        update(currentTimeMs) {
            if (!this.hit && !this.missed) {
                const timeElapsedSinceSpawn = currentTimeMs - this.spawnTimeMs
                let progress = timeElapsedSinceSpawn / APPROACH_TIME_MS
                progress = Math.max(0, Math.min(progress, 1.5))
                this.y = START_Y + (HIT_LINE_Y - START_Y) * progress
            } else if (this.judgmentDisplayStartTime > 0) {
                const timeSinceJudgment = currentTimeMs - this.judgmentDisplayStartTime
                this.judgmentAlpha = 1 - (timeSinceJudgment / this.JUDGMENT_DISPLAY_DURATION)
                this.judgmentAlpha = Math.max(0, this.judgmentAlpha)
                this.judgmentYOffset = - (timeSinceJudgment / this.JUDGMENT_DISPLAY_DURATION) * (NOTE_RADIUS * 1.5)
            }
        }

        draw() {
            ctx2.save()

            ctx2.font = `bold ${32*fontSizeScaling}px "Titan One"`
            ctx2.strokeStyle = '#000000'
            ctx2.lineWidth = 3

            if (!this.hit && !this.missed) {
                ctx2.beginPath()
                ctx2.arc(this.x, this.y, this.radius * fontSizeScaling, 0, Math.PI * 2)
                ctx2.fillStyle = this.color
                ctx2.fill()
                ctx2.strokeStyle = '#FFFFFF'
                ctx2.lineWidth = 2
                ctx2.stroke()
                ctx2.closePath()

                ctx2.fillStyle = '#FFFFFF'
                ctx2.textAlign = 'center'
                ctx2.textBaseline = 'middle'
                // ctx2.font = `bold ${32*fontSizeScaling} "Titan One"`
                // ctx2.fillText(this.beat, this.x, this.y)
                const imageSize = 24 * fontSizeScaling
                ctx2.drawImage(note, this.x - imageSize / 2, this.y - imageSize / 2, imageSize, imageSize)

            } else if (this.judgmentAlpha > 0) {
                ctx2.globalAlpha = this.judgmentAlpha

                if (this.judgment === "Perfect!") {
                    const textMetrics = ctx2.measureText(this.judgment)
                    const gradientX0 = this.x - textMetrics.width / 2
                    const gradientX1 = this.x + textMetrics.width / 2
                    const gradient = ctx2.createLinearGradient(gradientX0, 0, gradientX1, 0)
                    const hueStep = 360 / 7
                    for (let i = 0; i < 7; i++) {
                        const hue = (rainbowHueOffset + i * hueStep) % 360
                        gradient.addColorStop(i / 6, `hsl(${hue}, 100%, 60%)`)
                    }
                    ctx2.fillStyle = gradient
                } else {
                    ctx2.fillStyle = this.judgmentColor
                }

                ctx2.textAlign = 'center'
                ctx2.textBaseline = 'middle'
                ctx2.font = `bold ${32*fontSizeScaling}px "Titan One"`
                ctx2.strokeText(this.judgment, this.x, HIT_LINE_Y + this.judgmentYOffset)
                ctx2.fillText(this.judgment, this.x, HIT_LINE_Y + this.judgmentYOffset)
            }
            ctx2.restore()
        }

        isClicked(clickX, clickY) {
            const distance = Math.sqrt(
                Math.pow(clickX - this.x, 2) + Math.pow(clickY - this.y, 2)
            )
            return distance < this.radius * fontSizeScaling
        }
    }

    function initGame() {
        canvasDancingGame = document.getElementById('canvas-dancing')
        ctx2 = canvasDancingGame.getContext('2d')

        audio.volume = 0.6

        audio.addEventListener('loadedmetadata', () => {
            totalSongDurationSec = audio.duration
        })

        canvasDancingGame.addEventListener('mousedown', handleClick)
        canvasDancingGame.addEventListener('touchstart', (e) => {
            e.preventDefault()
            handleClick(e)
        }, { passive: false })
        canvasDancingGame.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false })

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.target === canvasDancingGame) {
                    const newWidth = entry.contentRect.width
                    const newHeight = entry.contentRect.height

                    CANVAS_WIDTH_LOGICAL = newWidth
                    CANVAS_HEIGHT_LOGICAL = newHeight

                    HIT_LINE_Y = CANVAS_HEIGHT_LOGICAL - 50

                    const devicePixelRatio = window.devicePixelRatio || 1
                    canvasDancingGame.width = CANVAS_WIDTH_LOGICAL * devicePixelRatio
                    canvasDancingGame.height = CANVAS_HEIGHT_LOGICAL * devicePixelRatio

                    ctx2.resetTransform()
                    ctx2.scale(devicePixelRatio, devicePixelRatio)

                    drawGame()
                }
            }
        })

        resizeObserver.observe(canvasDancingGame)
    }

    function loadBeatmap() {
        let rawBeatmap = {
            songTitle: "117 BPM Track",
            artist: "Your Artist",
            notes: [
                { beat: 7 }, { beat: 9 },
                { beat: 14 }, { beat: 15 }, { beat: 16 },
                { beat: 18.5 }, { beat: 19.5 }, { beat: 20.5 }, { beat: 22.5 },
                { beat: 28.5 }, { beat: 29.5 }, { beat: 30.5 }, { beat: 32.5 }, { beat: 34.5 },
                { beat: 38.5 }, { beat: 39.5 }, { beat: 40.5 }, { beat: 42.5 }, { beat: 43.5 }, { beat: 44.5 },
                { beat: 50 }, { beat: 51 }, { beat: 51.5 }, { beat: 52 }, { beat: 54 },
                { beat: 56 }, { beat: 58 }, { beat: 60 }, { beat: 62 }, { beat: 63 },
                { beat: 65 }, { beat: 65.5 }, { beat: 66 },
                { beat: 70.5 }, { beat: 71.5 }, { beat: 72.5 }, { beat: 73.5 },
                { beat: 76.5 }, { beat: 77 }, { beat: 77.5 },
                { beat: 81 }, { beat: 82 }, { beat: 83 }, { beat: 83.5 }, { beat: 84 },
                { beat: 85 }, { beat: 86 }, { beat: 87 }, { beat: 88 }, { beat: 88.5 }, { beat: 89 },
                { beat: 92 }, { beat: 93 }, { beat: 93.5 }, { beat: 94 },
                { beat: 98 }, { beat: 98.5 }, { beat: 99 },
                { beat: 100 }, { beat: 101 }, { beat: 102 }, { beat: 103 }, { beat: 104 },
                { beat: 105 }, { beat: 106 }, { beat: 107 }, { beat: 108 }, { beat: 108.5 }, { beat: 109 },
                { beat: 110 }, { beat: 111 }, { beat: 112 }, { beat: 113 }, { beat: 113.5 }, { beat: 114 },
                { beat: 115 }, { beat: 116 }, { beat: 117 },
                { beat: 120 }, { beat: 121 }, { beat: 121.5 }, { beat: 122 }, { beat: 123 },
                { beat: 125 }, { beat: 126 }, { beat: 127 }, { beat: 128 }, { beat: 128.5 }, { beat: 129 },
                { beat: 130 }, { beat: 131 }, { beat: 132 }, { beat: 133 }, { beat: 133.5 }, { beat: 134 },
                { beat: 135 }, { beat: 136 }, { beat: 137 }, { beat: 138 }, { beat: 139 },
                { beat: 140 }, { beat: 141 }, { beat: 142 }, { beat: 143 }, { beat: 143.5 }, { beat: 144 },
                { beat: 146 }, { beat: 147 }, { beat: 148 },
                { beat: 150 }, { beat: 151 }, { beat: 152 }, { beat: 153 },
                { beat: 155 }, { beat: 156 }, { beat: 157 }, { beat: 158 }, { beat: 158.5 }, { beat: 159 },
                { beat: 160 }, { beat: 161 }, { beat: 162 }, { beat: 163 }, { beat: 163.5 }, { beat: 164 },
                { beat: 165 }, { beat: 166 }, { beat: 167 }, { beat: 168 }, { beat: 169 },
                { beat: 170 }, { beat: 171 }, { beat: 172 }, { beat: 173 }, { beat: 173.5 }, { beat: 174 },
                { beat: 177 }, { beat: 178 }, { beat: 179 },
                { beat: 180 }, { beat: 181 }, { beat: 181.5 }, { beat: 182 }, { beat: 183 },
                { beat: 186 }, { beat: 187 }, { beat: 188 }, { beat: 188.5 }, { beat: 189 },
                { beat: 192 }, { beat: 193 }, { beat: 193.5 }, { beat: 194 },
                { beat: 196 }, { beat: 197 }, { beat: 198 }, { beat: 199 },
                { beat: 200 }, { beat: 201 }, { beat: 202 }, { beat: 203 }, { beat: 203.5 }, { beat: 204 },
                { beat: 206 }, { beat: 207 }, { beat: 208 }, { beat: 209 },
                { beat: 211 }, { beat: 211.5 }, { beat: 212 },
                { beat: 215 }, { beat: 216 }, { beat: 217 }, { beat: 218 }, { beat: 218.5 }, { beat: 219 },
                { beat: 220 }, { beat: 221 }, { beat: 222 }, { beat: 223 }, { beat: 223.5 }, { beat: 224 },
                { beat: 225 }, { beat: 227 },
            ]
        }

        beatmap = {
            songTitle: rawBeatmap.songTitle,
            artist: rawBeatmap.artist,
            notes: rawBeatmap.notes.map(note => ({
                timeMs: FIRST_BEAT_OFFSET_MS + (note.beat * MS_PER_BEAT),
                beat: note.beat
            }))
        }
        beatmap.notes.sort((a, b) => a.timeMs - b.timeMs)
    }

    function startDancingGame() {
        addHidden(itemBox)
        removeHidden(document.getElementById('disco-overlay'))
        document.getElementById('dancing-game').classList.remove('hidden')
        if (gameStarted) return

        document.getElementById('character-wrapper-dance').classList.add('dancing1')
        document.getElementById('dancer-right').classList.add('dancing2')

        gameStarted = true
        score = 0
        combo = 0
        activeNotes = []
        nextNoteIndex = 0

        audio.currentTime = 0
        audio.play().catch(e => console.error("Audio play failed:", e))

        requestAnimationFrame(gameLoop)
    }

    function gameLoop() {
        if (!gameStarted) return
        const currentTimeMs = audio.currentTime * 1000
        rainbowHueOffset = (rainbowHueOffset + 2) % 360

        updateNotes(currentTimeMs)
        drawGame()

        if (audio.ended || (totalSongDurationSec > 0 && audio.currentTime >= totalSongDurationSec - 0.1 && activeNotes.length === 0)) {
            endGame(true)
        } else {
            requestAnimationFrame(gameLoop)
        }
    }

    function updateNotes(currentTimeMs) {
        while (nextNoteIndex < beatmap.notes.length) {
            const noteData = beatmap.notes[nextNoteIndex]
            const spawnTimeForThisNote = noteData.timeMs - APPROACH_TIME_MS
            if (currentTimeMs >= spawnTimeForThisNote) {
                const newNote = new Note(noteData.timeMs, noteData.beat)
                activeNotes.push(newNote)
                nextNoteIndex++
            } else {
                break
            }
        }
        activeNotes = activeNotes.filter(note => {
            note.update(currentTimeMs)
            if (!note.hit && !note.missed) {
                if (note.y > HIT_LINE_Y + NOTE_RADIUS * 1.5) {
                    handleMiss(note)
                }
                return true
            } else {
                return note.judgmentAlpha > 0
            }
        })
    }

    function handleMiss(note) {
        if (note.missed || note.hit) return
        note.judgment = "Miss!"
        note.judgmentColor = '#FF0000'
        note.judgmentAlpha = 1
        note.judgmentYOffset = 0
        note.judgmentDisplayStartTime = audio.currentTime * 1000
        note.missed = true

        game.player.party[1].energy -= 10
        playSound(sounds.fail)
        energyBarMiniGame.style.width = game.player.party[1].energy + '%'
        energyBarMiniGame.style.background = game.player.party[1].energy < 30 ? 'red' : 'green'

        combo = 0
        if (game.player.party[1].energy <= 0) {
            endGame(false)
        }
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = Math.floor(seconds % 60)
        const formattedMinutes = String(minutes).padStart(2, '0')
        const formattedSeconds = String(remainingSeconds).padStart(2, '0')
        return `${formattedMinutes}:${formattedSeconds}`
    }

    function drawGame() {
        ctx2.clearRect(0, 0, CANVAS_WIDTH_LOGICAL, CANVAS_HEIGHT_LOGICAL)

        ctx2.strokeStyle = '#FF4500'
        ctx2.lineWidth = 4
        ctx2.beginPath()
        ctx2.moveTo(0, HIT_LINE_Y)
        ctx2.lineTo(CANVAS_WIDTH_LOGICAL, HIT_LINE_Y)
        ctx2.stroke()
        ctx2.closePath()

        activeNotes.forEach(note => note.draw())

        ctx2.font = `bold ${32*fontSizeScaling}px "Titan One"`
        ctx2.strokeStyle = '#000000'
        ctx2.lineWidth = 3

        // ctx.textAlign = 'left'
        //
        // ctx.strokeText(`Score: ${score}`, 10, 30)
        // ctx.fillText(`Score: ${score}`, 10, 30)

        // ctx.textAlign = 'center'
        // ctx.strokeText(`Combo: ${combo}`, CANVAS_WIDTH_LOGICAL / 2, 30)
        // ctx.fillText(`Combo: ${combo}`, CANVAS_WIDTH_LOGICAL / 2, 30)

        ctx2.fillStyle = '#FFFFFF'
        ctx2.textAlign = 'center'
        if (totalSongDurationSec > 0 && audio.currentTime !== null) {
            const remainingTimeSec = Math.max(0, totalSongDurationSec - audio.currentTime)
            ctx2.strokeText(`Time: ${formatTime(remainingTimeSec)}`, CANVAS_WIDTH_LOGICAL / 2, 48)
            ctx2.fillText(`Time: ${formatTime(remainingTimeSec)}`, CANVAS_WIDTH_LOGICAL / 2, 48)
        } else {
            ctx2.strokeText(`Time: --:--`, 16, 32)
            ctx2.fillText(`Time: --:--`, 16, 32)
        }
    }

    function handleClick(event) {
        if (!gameStarted || audio.paused) {
            return
        }
        const rect = canvasDancingGame.getBoundingClientRect()
        let clientX, clientY
        if (event.type === 'touchstart') {
            clientX = event.touches[0].clientX
            clientY = event.touches[0].clientY
        } else {
            clientX = event.clientX
            clientX = event.clientX
            clientX = event.clientX
            clientY = event.clientY
        }

        const clickX_css = clientX - rect.left
        const clickY_css = clientY - rect.top

        const clickX = clickX_css * (CANVAS_WIDTH_LOGICAL / rect.width)
        const clickY = clickY_css * (CANVAS_HEIGHT_LOGICAL / rect.height)

        const clickTimeMs = audio.currentTime * 1000
        let hitNote = null
        let minDiff = Infinity

        for (let i = activeNotes.length - 1; i >= 0; i--) {
            const note = activeNotes[i]
            if (!note.hit && !note.missed &&
                note.y > HIT_LINE_Y - NOTE_RADIUS * 3 &&
                note.y < HIT_LINE_Y + NOTE_RADIUS * 3 &&
                note.isClicked(clickX, clickY)) {
                const diff = Math.abs(clickTimeMs - note.perfectHitTimeMs)
                if (diff < minDiff) {
                    minDiff = diff
                    hitNote = note
                }
            }
        }

        if (hitNote) {
            hitNote.hit = true
            hitNote.judgmentAlpha = 1
            hitNote.judgmentYOffset = 0
            hitNote.judgmentDisplayStartTime = clickTimeMs

            let judgment = ""
            let scoreIncrease = 0
            let judgmentColor = '#FFFFFF'

            if (minDiff <= ACCURACY_THRESHOLD_PERFECT) {
                judgment = "Perfect!"
                scoreIncrease = 100
                judgmentColor = '#00FF00'
            } else if (minDiff <= ACCURACY_THRESHOLD_GOOD) {
                judgment = "Good!"
                scoreIncrease = 50
                judgmentColor = '#FFFF00'
            } else if (minDiff <= ACCURACY_THRESHOLD_OKAY) {
                judgment = "Okay."
                scoreIncrease = 20
                judgmentColor = '#FFA500'
            } else {
                judgment = "Poor!"
                scoreIncrease = 5
                judgmentColor = '#FF4500'
                game.player.party[1].energy -= 2
                energyBarMiniGame.style.width = game.player.party[1].energy + '%'
                energyBarMiniGame.style.background = game.player.party[1].energy < 30 ? 'red' : 'green'
            }

            hitNote.judgment = judgment
            hitNote.judgmentColor = judgmentColor

            score += scoreIncrease + (combo * 5)
            combo++
        } else {
            combo = 0
            game.player.party[1].energy -= 2
            playSound(sounds.fail)
            energyBarMiniGame.style.width = game.player.party[1].energy + '%'
            energyBarMiniGame.style.background = game.player.party[1].energy < 30 ? 'red' : 'green'
            if (game.player.party[1].energy <= 0) {
                endGame(false)
            }
        }
    }

    function endGame(win) {
        gameStarted = false
        audio.pause()
        document.getElementById('dancing-game').classList.add('hidden')
        sounds.music.play()
        game.round += 1
        addHidden(document.getElementById('disco-overlay'))

        if (win) {
            document.getElementById('dancer-right').classList.add('defeated')
            sounds.girl.play()
            startNextRound()
            addHidden(openShopButton)
        }

        if (!win) {
            document.getElementById('character-wrapper-dance').classList.add('defeated')
            showGameOverScreen()
            sounds.deathCry.play()
        }
        removeHidden(document.getElementById('communication-container'))
    }

    loadBeatmap()
    initGame()
})