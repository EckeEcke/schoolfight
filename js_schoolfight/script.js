document.addEventListener('DOMContentLoaded', () => {
    const { playAudio } = SchoolFightAudio
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
        perfect: new Audio('sounds_schoolfight/perfect.wav'),
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

    const { attackTypes, Character, characters } = SchoolFightCharacters
    const { resolveBattleRound } = SchoolFightCombat
    const { levels, getLevel, createEnemyParty } = SchoolFightLevels

    const prices = {
        item: 3,
        upgrade: 2,
    }

    const { GameFlow, gameStates } = SchoolFightFlow
    const gameFlow = new GameFlow()

    function updateGameState(newState) {
        gameFlow.enter(newState)
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
        itemsUsed: 0,
        isTeacherMode: false,
        lastVictoryTeam: JSON.parse(localStorage.getItem('lastVictoryTeam')),
        displayedSelectScreenIndex: 0,
        lastMoveTeacher: 'intelligence',
    }


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
            this.unlocksTrophy = true
            this.alreadyHasTrophy = !!(parsedTrophies && parsedTrophies.richKid)
        }

        eatSnack() {
            if (!gameFlow.can('item')) return
            if (game.player.party.length === 0 || this.snacks === 0) return
            this.itemsUsed += 1
            this.itemUsed = true
            updateGameState(gameStates.snackAnimation)
            this.runSnackAnimation()
            gameFlow.after(() => {
                updateGameState(gameStates.selectTargets)
                removeHidden(itemBox)
            }, 1000)
            this.snacks -= 1
            if (this.snacks <= 0) snackButton.disabled = true
            game.player.party.forEach(char => {
                char.recoverPartially()
            })
            drawEnergyBars()
            this.drawItemBox()
        }

        throwBomb() {
            if (!gameFlow.can('item')) return
            if (this.bombs <= 0 || game.enemy.party.length === 0) return
            updateGameState(gameStates.bombAnimation)
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

            setCharactersDefeated()
            gameFlow.after(() => {
                updateGameState(gameStates.selectTargets)
                removeHidden(itemBox)
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

            gameFlow.after(()=>{
                this.drawItemBox()
                bombButtonWrapper.classList.remove('animated-text')
                snackButtonWrapper.classList.remove('animated-text')
            },1500)
            gameFlow.after(() => {
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
            if (!gameFlow.can('purchase')) return
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

    function currentLevel() {
        return getLevel(game.round)
    }

    function createCurrentEnemyParty() {
        return createEnemyParty(game.round, game)
    }

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
            playAudio(sounds.steps)
            runningSprite.className = game.player.party[1].sideSprite
            this.characterRunning.classList.add('running')
            this.enemyRunning.classList.add('running')
            addHidden(itemBox)
        }

        run() {
            if (!gameFlow.can('run')) return
            this.characterLeft -= 4
        }

        moveBackground() {
            if (!gameFlow.can('run')) return
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
            updateGameState(gameStates.levelComplete)
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
            if (!gameFlow.can('jump')) return
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
            updateGameState(gameStates.levelComplete)
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
                clearInterval(this.interval)
                gameFlow.after(() => {
                    this.gameOver()
                }, 200)
            }
        }

        jump() {
            if (!gameFlow.can('jump')) return
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

    const bombDodgeMinigame = new SchoolFightBombDodgeView.BombDodgeMinigame({
        element: document.getElementById('bomb-dodge-game'),
        onHit: health => {
            game.player.party[1].energy = health
            drawEnergyBars()
            playSound(sounds.stink)
        },
        onFinish: (outcome, health) => {
            if (!gameFlow.can('dodge')) return
            game.player.party[1].energy = health
            if (outcome === 'defeat') {
                updateGameState(gameStates.transition)
                gameFlow.after(() => {
                    playSound(sounds.deathCry)
                    sounds.music.pause()
                    showGameOverScreen()
                }, 650)
                return
            }
            updateGameState(gameStates.levelComplete)
            game.round += 1
            itemManager.updateMoney(3)
            itemManager.updateMoneyEarnedTotal(3)
            itemManager.moneyEarnedLastRound = 3
            document.getElementById('money-placeholder').textContent = 'Earned $3'
            document.getElementById('enemy2').classList.add('defeated')
            removeHidden(document.getElementById('communication-container'))
            addHidden(openShopButton)
        },
    })



    /**
     * 
     * Dialogues
     * 
     */

    class DialogueManager {
        constructor() {
            this.messageIndex = 0
        }

        showDialogue() {
            updateGameState(gameStates.dialogue)
            removeHidden(dialogueBoxWrapper)
            const mode = game.isTeacherMode ? 'teacher' : 'normal'
            dialogueBox.innerHTML = currentLevel().dialogue[mode][this.messageIndex]
        }

        nextDialogue() {
            if (!gameFlow.can('dialogue')) return
            if (this.messageIndex === 0) {
                this.messageIndex = 1
                this.showDialogue()
                return
            }
    
            this.messageIndex = 0
            addHidden(dialogueBoxWrapper)
            removeHidden(itemBox)
            startNextRound()
        }
    }

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
        playAudio(sound)
    }

    function playMusic() {
        sounds.music.volume = 0.3
        sounds.music.loop = true
        playAudio(sounds.music)
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

    function startMinigamePreview(type) {
        if (!gameFlow.can('start')) return
        game.round = levels.findIndex(level => level.type === type)
        game.player.party = [characters.bully, characters.nerd, characters.wally]
            .map((character, index) => new Character(character, index + 1))
        game.player.party.forEach(character => {
            document.getElementById(`energy-char${character.id}-text`).textContent = character.class
        })
        game.enemy.party = createCurrentEnemyParty()
        hideAll('title-screen')
        initializeGame()
        changeBackground()
        setupLevel()
    }

    function startGame(isTeacherMode) {
        if (!gameFlow.can('start')) return
        game.isTeacherMode = isTeacherMode
        hideAll('title-screen')
        playSound(sounds.schoolBell)
        playMusic()
        if (isTeacherMode) {
            game.enemy.party = createCurrentEnemyParty()
            initializeGameTeacher()
            return
        }
        updateGameState(gameStates.characterSelect)
        selectScreen.classList.remove('hidden')
        removeHidden(titleSelect)
        game.enemy.party = createCurrentEnemyParty()
    }

    function initializeGame() {
        dialogueManager = new DialogueManager()
        updateGameState(gameStates.dialogue)
        hideAll('select-screen')
        dialogueManager.showDialogue()
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
        dialogueManager = new DialogueManager()
        document.getElementById('energy-char2-text').innerHTML = characters.teacher.class
        teacherTeam.forEach(member => game.player.party.push(member))
        dialogueManager.showDialogue()
        const energyBars = Array.from(document.getElementsByClassName('energy-bar-wrapper'))
        energyBars.forEach(bar => removeHidden(bar))
        addHidden(energyBars[0])
        addHidden(energyBars[2])
        const spriteContainers = Array.from(document.getElementsByClassName('sprite-container'))
        spriteContainers.forEach(sprite => show(sprite))
        showPlayerSpritesTeacher()
        showEnemySprites()
        itemManager.drawItemBox()
        document.getElementById('dance-sprite').classList.add(game.player.party[1].frontSprite)
    }

    function startNextRound() {
        if (itemManager.bombs > 0) bombButton.removeAttribute('disabled')
        if (itemManager.snacks > 0) snackButton.removeAttribute('disabled')
        removeHidden(openShopButton)

        const starters = {
            battle: () => {
                updateGameState(gameStates.selectTargets)
                if (currentLevel().boss) startBossRound()
            },
            ropeSkip: startRopeGame,
            running: () => {
                updateGameState(gameStates.running)
                runningMiniGame.start()
            },
            dancing: startDancingGame,
            bombDodge: startBombDodge,
        }
        starters[currentLevel().type]()
    }

    function startRopeGame() {
        updateGameState(gameStates.ropeSkip)
        ropeSkipMiniGame.start()
        addHidden(itemBox)
    }

    function startBossRound() {
        sounds.bossMusic.volume = 0.6
        sounds.bossMusic.loop = true
        playAudio(sounds.bossMusic)
    }

    function showGameOverScreen() {
        updateGameState(gameStates.gameOver)
        runFadeGameOver()
        addHidden(battleTicker)
        addHidden(document.getElementById('next-round-message'))
        removeHidden(document.getElementById('communication-container'))
        removeHidden(document.getElementById('game-over-message'))
        removeHidden(document.getElementById('refresh-button'))
        addHidden(itemBox)
    }

    function addCharacter(event) {
        if (!gameFlow.can('selectCharacter')) return
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
            updateGameState(gameStates.transition)
            runFadeAnimation()
            gameFlow.after(() => {
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
        if (!gameFlow.can('battle')) return

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
        if (!gameFlow.can('battle')) return
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
        if (!gameFlow.can('battle')) return
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
        if (!gameFlow.can('battle')) return
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
        if (!gameFlow.can('battle')) return
        const result = resolveBattleRound({
            playerParty: game.player.party,
            enemyParty: game.enemy.party,
            moves: game.player.moves,
            lastAttackType: game.lastMoveTeacher,
        })
        game.lastMoveTeacher = result.lastAttackType
        game.player.moves = []
        updateGameState(gameStates.battleAnimation)
        runFightAnimation(result.outcome)
        presentBattleRound(result)
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

    function buildBattleTickerText(event) {
        const { attacker, target, type, damage, side, kind } = event
        const isPlayer = side === 'player'
        const attackerClass = isPlayer ? 'text-player' : 'text-enemy'
        const targetClass = isPlayer ? 'text-enemy' : 'text-player'
        const attackerName = isPlayer ? attacker.class : 'Enemy ' + attacker.class
        if (kind === 'defend') {
            return `<div><span class="${attackerClass}">${attackerName} <i class="fas fa-shield-alt"></i></span></div>`
        }
        const targetName = isPlayer ? 'Enemy ' + target.class : target.class
        return `<div><span class="${attackerClass}">${attackerName} ${setBattleTickerIcon(type)} <span class="${targetClass}">${targetName}</span> <span class="damage-text"> -${damage}%</span></div>`
    }

    function presentBattleRound(result) {
        battleTicker.style.display = 'block'
        document.getElementById('battle-messages').innerHTML = result.events.map(buildBattleTickerText).join(' ')
        drawEnergyBars()

        result.events.filter(event => event.defeated).forEach(event => {
            const sound = event.side === 'player' ? sounds.deathCry2 : sounds.deathCry
            setTimeout(() => playSound(sound), 2500)
        })

        if (result.outcome === 'defeat') {
            gameFlow.after(() => {
                showGameOverScreen()
                sounds.music.pause()
                sounds.bossMusic.pause()
            }, 2500)
        } else if (result.outcome === 'victory') {
            checkRemainingEnemies()
        }
    }

    function getPossibleMoves() {
        const remainingChars = game.player.party.filter(char => char.energy > 0 && char.class !== 'Dummy')
        return remainingChars.length
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
            return
        }
        checkSurvivors()
        game.round += 1
        updateGameState(gameStates.transition)
        gameFlow.after(() => {
            addHidden(battleTicker)
            addHidden(itemBox)
            removeHidden(document.getElementById('communication-container'))

            if (game.round < levels.length) {
                updateGameState(gameStates.levelComplete)
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
        const backgrounds = [...new Set([
            ...levels.map(level => level.background.image),
            ...levels.filter(level => level.runningBackground).map(level => level.runningBackground),
            'images_schoolfight/backgroundShop.jpg',
        ])]

        backgrounds.forEach(src => {
            const img = new Image()
            img.src = src
        })
    }

    preloadBackgrounds()
    
    function changeBackground() {
        const level = currentLevel()
        levels.forEach(entry => backgroundElement.classList.remove(entry.background.className))
        backgroundElement.classList.add(level.background.className)
        backgroundElement.style.backgroundImage = `url('${level.background.image}')`
        if (level.type === 'running') {
            removeHidden(runningBackgroundWrapper)
            runningSprite.className = game.player.party[1].frontSprite
            document.querySelectorAll('#running-background > img').forEach(image => {
                image.src = level.runningBackground
            })
        } else addHidden(runningBackgroundWrapper)
    }

    function setUpNextRound() {
        if (!gameFlow.can('nextRound')) return
        updateGameState(gameStates.transition)
        bombDodgeMinigame.stop()
        runFadeAnimation()
        addHidden(itemBox)
        addHidden(bombContainerWrapper)
        addHidden(document.getElementById('communication-container'))
        gameFlow.after(() => changeBackground(), 1000)
        gameFlow.after(() => {
            dialogueManager.showDialogue()
            document.querySelectorAll('.sprite-container').forEach(sprite => {
                sprite.classList.remove('hidden-buttons')
            }) 
            playSound(sounds.schoolBell)
            game.player.party.forEach(element => element.recoverFull())
            game.enemy.party = createCurrentEnemyParty()
            drawEnergyBars()
            document.querySelectorAll('.defeated').forEach(element => {
                element.classList.remove('defeated')
            }) 
            showPlayerSprites()
            showEnemySprites()

            setupLevel()
        }, 1000) 
    }

    function setupLevel() {
        const setups = {
            battle: setupRegularRound,
            ropeSkip: setupForRopeGame,
            running: setupRunningGame,
            dancing: setupDancingGame,
            bombDodge: setupBombDodge,
        }
        setups[currentLevel().type]()
        if (currentLevel().boss) setupBossRound()
    }

    function setupBombDodge() {
        hideAll('left-party')
        removeHidden(char2)
        hideAll('energy-bar-wrapper')
        addHidden(document.getElementById('rope-skipping-game'))
        addHidden(document.getElementById('dance-sprites'))
        removeHidden(document.getElementsByClassName('energy-bar-wrapper')[1])
        addHidden(document.getElementById('enemy1'))
        addHidden(document.getElementById('enemy3'))
    }

    function startBombDodge() {
        updateGameState(gameStates.bombDodge)
        hideAll('left-party')
        hideAll('right-party')
        addHidden(itemBox)
        addHidden(openShopButton)
        bombDodgeMinigame.start(game.player.party[1])
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
        if (!gameFlow.can('start')) return
        updateGameState(gameStates.trophies)
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
        if (!gameFlow.can('start')) return
        updateGameState(gameStates.tutorial)
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

    function runFightAnimation(outcome = 'continue') {
        updateBattleTicker('battle')
        playSound(sounds.fight)
        hideAll('buttons-wrapper')
        const allSelected = document.querySelectorAll('.selected')
        allSelected.forEach(selected => selected.classList.remove('selected'))
        overlay.style.zIndex = '999'
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
        if (outcome === 'continue') gameFlow.after(() => {
            updateGameState(gameStates.selectTargets)
            removeHidden(itemBox)
            gameFlow.after(() => addHidden(battleTicker), 1000)
        }, 3000)
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
        if (!gameFlow.can('openShop')) return
        updateGameState(gameStates.transition)
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
        gameFlow.after(() => {
            updateGameState(gameStates.shop)
            removeHidden(shop)
            document.getElementById('shop-dialogue-box-wrapper').style.display = 'block'
        }, 1000)
    }

    function updateMoneyAmountInShop() {
        const moneyAmountElement = document.getElementById('current-amount-money')
        moneyAmountElement.innerHTML = `You have $${itemManager.money}`
    }

    function leaveShop() {
        if (!gameFlow.can('leaveShop')) return
        updateGameState(gameStates.transition)
        runFadeAnimation()
        gameFlow.after(() => {
            updateGameState(gameStates.levelComplete)
            removeHidden(document.getElementById('communication-container'))
            showAll('left-party')
            showAll('energy-bar-wrapper')
            addHidden(shop)
        }, 1000)
    }

    function buyUpgrade(attackType) {
        if (!gameFlow.can('purchase')) return
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
        gameFlow.after(() => {
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
        '#start-button': () => {
            const previewType = new URLSearchParams(window.location.search).get('minigame')
            if (levels.some(level => level.type === previewType && level.type !== 'battle')) startMinigamePreview(previewType)
            else startGame(false)
        },
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

    const APPROACH_TIME_MS = SchoolFightRhythm.timing.approachMs
    const { timing, notePosition, inputSongTime, closestNote, judgeHit, isMissed } = SchoolFightRhythm
    const SONG_BPM = timing.bpm

    let danceDurationSec = SchoolFightDanceBeatmap.durationMs / 1000
    const MS_PER_BEAT = 60000 / SONG_BPM

    let canvasDancingGame
    let ctx2
    let beatmap
    let activeNotes = []
    let nextNoteIndex = 0

    let score = 0
    let combo = 0
    let rainbowHueOffset = 0
    let danceAnimationFrame = null

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
            this.soundPlayed = false
        }

        update(currentTimeMs) {
            if (!this.hit && !this.missed) {
                this.y = notePosition(this.perfectHitTimeMs, currentTimeMs, START_Y, HIT_LINE_Y)
            } else if (this.judgmentDisplayStartTime > 0) {
                const timeSinceJudgment = currentTimeMs - this.judgmentDisplayStartTime
                this.judgmentAlpha = 1 - (timeSinceJudgment / this.JUDGMENT_DISPLAY_DURATION)
                this.judgmentAlpha = Math.max(0, this.judgmentAlpha)
                this.judgmentYOffset = - (timeSinceJudgment / this.JUDGMENT_DISPLAY_DURATION) * (NOTE_RADIUS * 1.5)
            }
        }

        playSound() {
            if (this.soundPlayed) return

            if (this.judgment === 'Perfect!') {
                sounds.perfect.pause()
                sounds.perfect.currentTime = 0
                playAudio(sounds.perfect)
            } else {
                sounds.clap.pause()
                sounds.clap.currentTime = 0
                playAudio(sounds.clap)
            }
            this.soundPlayed = true
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


    }

    function initGame() {
        canvasDancingGame = document.getElementById('canvas-dancing')
        ctx2 = canvasDancingGame.getContext('2d')

        audio.volume = 0.6

        const updateDuration = () => {
            const audioDuration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : Infinity
            danceDurationSec = Math.min(SchoolFightDanceBeatmap.durationMs / 1000, audioDuration)
        }
        updateDuration()
        audio.addEventListener('loadedmetadata', updateDuration)

        canvasDancingGame.addEventListener('pointerdown', handleClick)

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.target === canvasDancingGame) {
                    const newWidth = entry.contentRect.width
                    const newHeight = entry.contentRect.height
                    if (newWidth <= 0 || newHeight <= 0) continue

                    CANVAS_WIDTH_LOGICAL = newWidth
                    CANVAS_HEIGHT_LOGICAL = newHeight

                    HIT_LINE_Y = CANVAS_HEIGHT_LOGICAL - 50
                    activeNotes.forEach(note => { note.x = CANVAS_WIDTH_LOGICAL / 2 })

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
        beatmap = {
            songTitle: SchoolFightDanceBeatmap.songTitle,
            fadeOutMs: SchoolFightDanceBeatmap.fadeOutMs,
            notes: SchoolFightDanceBeatmap.notes.map(note => ({ ...note })),
        }
    }

    function startDancingGame() {
        if (gameFlow.can('dance')) return
        updateGameState(gameStates.dancing)
        addHidden(itemBox)
        removeHidden(document.getElementById('disco-overlay'))
        document.getElementById('dancing-game').classList.remove('hidden')

        document.getElementById('dance-sprites').style.setProperty('--dance-beat-duration', `${MS_PER_BEAT}ms`)
        document.getElementById('character-wrapper-dance').classList.add('dancing1')
        document.getElementById('dancer-right').classList.add('dancing2')

        score = 0
        combo = 0
        activeNotes = []
        nextNoteIndex = 0

        audio.currentTime = 0
        audio.volume = 0.6
        playAudio(audio)

        danceAnimationFrame = requestAnimationFrame(gameLoop)
    }

    function gameLoop() {
        if (!gameFlow.can('dance')) return
        const currentTimeMs = audio.currentTime * 1000
        rainbowHueOffset = (rainbowHueOffset + 2) % 360

        updateNotes(currentTimeMs)
        if (!gameFlow.can('dance')) return
        const remainingMs = Math.max(0, danceDurationSec * 1000 - currentTimeMs)
        audio.volume = 0.6 * Math.min(1, remainingMs / beatmap.fadeOutMs)
        drawGame()

        if (audio.ended || remainingMs === 0) {
            endGame(true)
        } else {
            danceAnimationFrame = requestAnimationFrame(gameLoop)
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
        for (const note of activeNotes) {
            if (!gameFlow.can('dance')) break
            note.update(currentTimeMs)
            if (!note.hit && !note.missed && isMissed(note.perfectHitTimeMs, currentTimeMs)) handleMiss(note)
        }
        activeNotes = activeNotes.filter(note => (!note.hit && !note.missed) || note.judgmentAlpha > 0)
    }


    function handleMiss(note) {
        if (!gameFlow.can('dance') || note.missed || note.hit) return
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
        if (danceDurationSec > 0 && audio.currentTime !== null) {
            const remainingTimeSec = Math.max(0, danceDurationSec - audio.currentTime)
            ctx2.strokeText(`Time: ${formatTime(remainingTimeSec)}`, CANVAS_WIDTH_LOGICAL / 2, 48)
            ctx2.fillText(`Time: ${formatTime(remainingTimeSec)}`, CANVAS_WIDTH_LOGICAL / 2, 48)
        } else {
            ctx2.strokeText(`Time: --:--`, 16, 32)
            ctx2.fillText(`Time: --:--`, 16, 32)
        }
    }

    function handleClick(event) {
        if (!gameFlow.can('dance') || audio.paused || event.isPrimary === false || event.button > 0) return
        event.preventDefault()
        const clickTimeMs = inputSongTime({
            currentTimeSec: audio.currentTime,
            playbackRate: audio.playbackRate,
            eventTimestamp: event.timeStamp,
            now: performance.now(),
            timeOrigin: performance.timeOrigin,
        })
        const hitNote = closestNote(activeNotes, clickTimeMs)

        if (hitNote) {
            const judgment = judgeHit(clickTimeMs - hitNote.perfectHitTimeMs)
            hitNote.hit = true
            hitNote.judgmentAlpha = 1
            hitNote.judgmentYOffset = 0
            hitNote.judgmentDisplayStartTime = audio.currentTime * 1000
            hitNote.judgment = judgment.label
            hitNote.judgmentColor = judgment.color
            hitNote.playSound()
            score += judgment.score + combo * 5
            combo++
            game.player.party[1].energy -= judgment.damage
        } else {
            combo = 0
            game.player.party[1].energy -= 2
            playSound(sounds.fail)
        }
        energyBarMiniGame.style.width = Math.max(0, game.player.party[1].energy) + '%'
        energyBarMiniGame.style.background = game.player.party[1].energy < 30 ? 'red' : 'green'
        if (game.player.party[1].energy <= 0) endGame(false)
    }

    function endGame(win) {
        if (!gameFlow.can('dance')) return
        cancelAnimationFrame(danceAnimationFrame)
        danceAnimationFrame = null
        audio.pause()
        document.getElementById('dancing-game').classList.add('hidden')
        playAudio(sounds.music)
        game.round += 1
        addHidden(document.getElementById('disco-overlay'))

        if (win) {
            document.getElementById('dancer-right').classList.add('defeated')
            playAudio(sounds.girl)
            updateGameState(gameStates.levelComplete)
            addHidden(openShopButton)
        }

        if (!win) {
            document.getElementById('character-wrapper-dance').classList.add('defeated')
            showGameOverScreen()
            playAudio(sounds.deathCry)
        }
        removeHidden(document.getElementById('communication-container'))
    }

    loadBeatmap()
    initGame()
})
