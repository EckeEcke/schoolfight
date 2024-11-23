document.addEventListener('DOMContentLoaded', () => {
    function adjustGameSize() {
        const gameWrapper = document.getElementById("game-wrapper")
        window.innerWidth >= window.innerHeight * 550/314 
        ? gameWrapper.style.transform = `scale(${window.innerWidth/660})`
        : gameWrapper.style.transform = `scale(1)`
    }
    adjustGameSize()
    window.addEventListener("resize", adjustGameSize)

    let showTutorial = false
    let round = 0
    const party = []
    let moves = []
    let playerTurn = true
    let selectedChar = ""
    let intSelector
    let attackType
    let displaySelectScreen1 = true
    let lastMoveTeacher = "intelligence"
    const attackTypes = {
        strength: 'strength',
        intelligence: 'intelligence',
        assholiness: 'assholiness',
        allrounder: 'allrounder',
        teacher: 'teacher'
    }
    let bombs = 1
    let snacks = 1
    let itemsReceived = 0
    let survivalpoints = 0

    let fightanimationRunning = false

    /**
     * 
     * Spritepositions
     * 
     */

    const BullySpritePosition = { top: "-425px", left: "-340px" }
    const BullySidePosition = { top: "-425px", left: "-410px" }
    const SquealerSpritePosition = { top: "-320px", left: "-42px" }
    const SquealerSidePosition = { top: "-320px", left: "-108px" }
    const NerdSpritePosition = { top: "-425px", left: "-42px" }
    const NerdSidePosition = { top: "-425px", left: "-108px" }
    const WallySpritePosition = { top: "-105px", left: "-340px" }
    const WallySidePosition = { top: "-105px", left: "-410px" }
    const DummySpritePosition = { top: "10000px", left: "10000px" }
    const SportskidSpritePosition = { top: "-320px", left: "-340px" }
    const SportskidSidePosition = { top: "-320px", left: "-410px" }
    const RichkidSpritePosition = { top: "-215px", left: "-340px" }
    const RichkidSidePosition = { top: "-215px", left: "-410px" }
    const TeacherSpritePosition = { top: "-215px", left: "-42px" }
    const WeirdoSpritePosition = { top: "-105px", left: "-42px" }
    const WolfkidSpritePosition = { top: "-532px", left: "-340px" }
    const JoeSpritePosition = { top: "0px", left: "-42px" }
    let pervertSidePosition

    /**
     * 
     * UI variables
     * 
     */

    const strengthMessage = "</span><i class='fas fa-hand-rock'></i>"
    const intelligenceMessage = "</span><i class='fas fa-glasses'></i>"
    const assholinessMessage = "</span><i class='fas fa-hand-middle-finger'></i>"
    let battleMessages = []

    const energybarEnemy1 = document.getElementById("energy-enemy1")
    const energybarEnemy2 = document.getElementById("energy-enemy2")
    const energybarEnemy3 = document.getElementById("energy-enemy3")

    const strengthIcon = "<i class='fas fa-hand-rock'></i>"
    const assholinessIcon = "<i class='fas fa-hand-middle-finger'></i>"
    const intelligenceIcon = "<i class='fas fa-glasses'></i>"
    const shieldIcon = "<i class='fas fa-shield-alt'></i>"
    const bombIcon = "<i class='fas fa-bomb'></i>"
    const snackIcon = "<i class='fas fa-hamburger'></i>"

    const title = document.getElementById('title')
    const titleButton = document.getElementById('title-button')
    const howToPlayButton = document.getElementById('how-to-play-button')
    const battleTicker = document.getElementById('battle-ticker') 
    const bombButton = document.getElementById('bomb-button')
    const bombButtonWrapper = document.getElementById('bomb-button-wrapper') 
    const bombContainer = document.getElementById('bomb-container')
    const bombContainerWrapper = document.getElementById('bomb-container-wrapper') 
    const itemBox = document.getElementById('itembox')
    const itemButtonWrapper = document.getElementById('item-button-wrapper')
    const itemButton = document.getElementById('item-button')
    const enemyRunning = document.getElementById('enemy-running')
    const characterRunning = document.getElementById('character-running')
    const titleSelect = document.getElementById('title-select')
    const runningBackgroundText = document.querySelector('#running-background h2')
    const selectScreen = document.getElementById('select-screen')
    const selectScreen2 = document.getElementById('select-screen2')
    const dialogueBoxWrapper = document.getElementById("dialogue-box-wrapper")
    const dialogueBox = document.getElementById("dialogue-box")
    const box = document.getElementById('box')
    const energyChar3 = document.getElementById("energy-char3")
    const tutorialScreen = document.getElementById('tutorial-screen')
    const girlLeft = document.getElementById('girl-left')
    const girlRight = document.getElementById('girl-right')
    const overlay = document.getElementById('overlay')
    const clickOverlay = document.getElementById('click-overlay')
    const backgroundElement = document.getElementById("background")
    const runningBackground = document.getElementById('running-background')
    const backButton = document.getElementById('back-button')
    const char1 = document.getElementById('char1')
    const char2 = document.getElementById('char2')
    const char3 = document.getElementById('char3')
    const runningSprite = document.getElementById('running-sprite')
    const beatenGameTrophyElement = document.getElementById('trophy-beaten')
    const itemlessTrophyElement = document.getElementById('itemless')
    const sixItemsTrophyElement = document.getElementById('six-items')
    const allStrengthTrophyElement = document.getElementById('all-strength')
    const allIntelligenceTrophyElement = document.getElementById('all-intelligence')
    const allAssholesTrophyElement = document.getElementById('all-assholes')
    const displayTrophiesButton = document.getElementById('trophies-button')
    const trophiesScreen = document.getElementById('trophies')





    /*
     * 
     * Sounds
     * 
     */

    const confirmSound = new Audio("sounds_schoolfight/confirm.wav")
    const schoolbell = new Audio("sounds_schoolfight/schoolbell.wav")
    const music = new Audio("sounds_schoolfight/music.mp3")
    const failSound = new Audio("sounds_schoolfight/wrong.wav")
    const steps = new Audio("sounds_schoolfight/steps.wav")
    const fightSound = new Audio("sounds_schoolfight/fight.mp3")
    const fadeSound = new Audio("sounds_schoolfight/fade.wav")
    const punchSounds = new Audio("sounds_schoolfight/punches.wav")
    const deathcry = new Audio("sounds_schoolfight/deathcry.wav")
    const deathcry2 = new Audio("sounds_schoolfight/deathcry2.wav")
    const clicksound = new Audio("sounds_schoolfight/clicksound.wav")
    const girlcry = new Audio("sounds_schoolfight/girlcry.mp3")
    const evilLaugh = new Audio("sounds_schoolfight/evil-laugh.wav")
    const victorySound = new Audio("sounds_schoolfight/victory.mp3")
    const bossmusic = new Audio("sounds_schoolfight/bossmusic.wav")
    const jumpSound = new Audio("sounds_schoolfight/jump.wav")
    const stinkSound = new Audio("sounds_schoolfight/stinksound.wav")
    const eatingSound = new Audio("sounds_schoolfight/eating.wav")
    const cheerSound = new Audio("sounds_schoolfight/cheer.wav")
    const clapSound = new Audio("sounds_schoolfight/clap.wav")
    const screamSound = new Audio("sounds_schoolfight/scream.mp3")
    const laughSound = new Audio("sounds_schoolfight/laugh.wav")
    const trophySound = new Audio("sounds_schoolfight/trophy unlocked.mp3")


    /*
     * 
     * Running Minigame variables
     * 
     */

    let moveBackgroundInterval
    let bg1Left = 0
    let bg2Left = 313
    let bg3Left = 616
    const bgs = [bg1Left, bg2Left, bg3Left]
    let characterLeft = 100
    let enemyLeft = 350

    /*
     * 
     * Ropeskip Minigame variables
     * 
     */

    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    let moveRopeDownwards = false
    let ropeY = 270
    let skips = 0
    let gamespeed = 100
    let characterJumps = false
    let points = 0
    let ropeInterval

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
    }

    const bully = {
        class: "Bully",
        type: attackTypes.assholiness,
        energy: 100,
        strength: 12,
        intelligence: 0,
        assholiness: 14,
    }

    const squealer = {
        class: "Squealer",
        energy: 100,
        type: attackTypes.assholiness,
        strength: 0,
        intelligence: 0,
        assholiness: 20,
    }

    const nerd = {
        class: "Nerd",
        type: attackTypes.intelligence,
        energy: 100,
        strength: 0,
        intelligence: 20,
        assholiness: 0,
    }

    const wally = {
        class: "Wally",
        type: attackTypes.strength,
        energy: 100,
        strength: 20,
        intelligence: 0,
        assholiness: 0,
    }

    const richkid = {
        class: "Richkid",
        type: attackTypes.intelligence,
        energy: 100,
        strength: 0,
        intelligence: 14,
        assholiness: 12,
    }

    const sportskid = {
        class: "Sportskid",
        type: attackTypes.strength,
        energy: 100,
        strength: 14,
        intelligence: 12,
        assholiness: 0,
    }

    const joe = {
        class: "Joe",
        type: attackTypes.allrounder,
        energy: 100,
        strength: 8,
        intelligence: 8,
        assholiness: 8,
    }

    const weirdo = {
        class: "Weirdo",
        type: attackTypes.intelligence,
        energy: 100,
        strength: 2,
        intelligence: 14,
        assholiness: 10,
    }

    const wolf = {
        class: "Wolfkid",
        type: attackTypes.strength,
        energy: 100,
        strength: 16,
        intelligence: 0,
        assholiness: 10,
    }

    const dummy = {
        class: "Dummy",
        type: attackTypes.strength,
        energy: 0,
        strength: 0,
        intelligence: 0,
        assholiness: 0,
    }

    const teacher = {
        class: "Teacher",
        type: attackTypes.teacher,
        energy: 100,
        strength: 34,
        intelligence: 34,
        assholiness: 34,
    }

    let enemyParty = []

    const setTeams = [
        [new Character(bully), new Character(nerd), new Character(joe)], //1
        [new Character(squealer), new Character(wally), new Character(richkid)], //2
        [new Character(sportskid), new Character(sportskid), new Character(sportskid)], //3
        [new Character(dummy), new Character(dummy), new Character(dummy)], //4 (rope skipping)
        [new Character(richkid), new Character(nerd), new Character(bully)], //5
        [new Character(dummy), new Character(dummy), new Character(dummy)], //6 (running)
        [new Character(richkid), new Character(richkid), new Character(richkid)],  //6
        [new Character(nerd), new Character(nerd), new Character(nerd)], //7
        [new Character(dummy), new Character(teacher), new Character(dummy)], //8
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

    let showDialogue = false
    let indexOfMessage = 0
    let disableAttackButtons = false

    /**
     * 
     * HTML Templates
     * 
     */

    const nextRoundTemplate = `You won! <br><br><br><br> <button id="next-button">Next round</button>`
    const victoryTemplate = `Congratulations! <br> You are king of school!<br><br><br><br> <button id="refresh-button" onclick="location.reload()">Play again</button>`
    const gameOverTemplate = `You lost...!? <br><br><br><br> <button id="refresh-button" onclick="location.reload()">Try again</button>`

      /**
     * 
     * Trophies
     * 
     */

    function showTrophiesScreen () {
        playSound(confirmSound)
        show(trophiesScreen)
        hide(titleButton)
        hide(howToPlayButton)
        hide(displayTrophiesButton)
        hide(title)
    }

    displayTrophiesButton.addEventListener('click', showTrophiesScreen)

    if (!localStorage.getItem('trophies')) localStorage.setItem('trophies', JSON.stringify({}))
    const trophiesFromStorage = localStorage.getItem('trophies')
    const parsedTrophies = trophiesFromStorage ? JSON.parse(trophiesFromStorage) : undefined
    const hasBeatenGameTrophy = parsedTrophies && 'beatenGame' in parsedTrophies
    const hasAllAssholesTrophy = parsedTrophies && 'allAssholes' in parsedTrophies
    const hasAllStrengthTrophy = parsedTrophies && 'allStrength' in parsedTrophies
    const hasAllIntelligenceTrophy = parsedTrophies && 'allIntelligence' in parsedTrophies
    const hasSixItemsTrophy = parsedTrophies && 'hasSixItems' in parsedTrophies
    const hasNoItemsTrophy = parsedTrophies && 'hasNoItems' in parsedTrophies

    if (hasBeatenGameTrophy) beatenGameTrophyElement.classList.remove('not-received')
    if (hasNoItemsTrophy) itemlessTrophyElement.classList.remove('not-received')
    if (hasSixItemsTrophy) sixItemsTrophyElement.classList.remove('not-received')
    if (hasAllAssholesTrophy) allAssholesTrophyElement.classList.remove('not-received')
    if (hasAllStrengthTrophy) allStrengthTrophyElement.classList.remove('not-received')
    if (hasAllIntelligenceTrophy) allIntelligenceTrophyElement.classList.remove('not-received')

    let itemsUsed = 0
    let itemUsed = false

    function handleTrohies() {
        if (!hasBeatenGameTrophy) {
            setTimeout(() => {
                document.getElementById('beaten-game').style.display = 'flex'

                document.getElementById('beaten-game').style.marginRight = '0'
                playSound(trophySound)
            }, 1000)
        }
        parsedTrophies.beatenGame = true

        if (allStrength()) {
            if(!hasAllStrengthTrophy) {
                setTimeout(() => {
                    document.getElementById('all-strength-message').style.display = 'flex'

                    document.getElementById('all-strength-message').style.marginRight = '0'
                    playSound(trophySound)
                }, 1500)
            }
            parsedTrophies.allStrength = true
        }
        if (allAssholes()) {
            if(!hasAllAssholesTrophy) {
                setTimeout(() => {
                    document.getElementById('all-assholes-message').style.display = 'flex'

                    document.getElementById('all-assholes-message').style.marginRight = '0'
                    playSound(trophySound)
                }, 2000)
            }
            parsedTrophies.allAssholes = true
        }
        if (allIntelligence()) {
            if(!hasAllIntelligenceTrophy) {
                setTimeout(() => {
                    document.getElementById('all-intelligence-message').style.display = 'flex'

                    document.getElementById('all-intelligence-message').style.marginRight = '0'
                    playSound(trophySound)
                }, 2500)
            }
            parsedTrophies.allIntelligence = true
        }
        if (!itemUsed) {
            if(!hasNoItemsTrophy) {
                setTimeout(() => {
                    document.getElementById('no-items-message').style.display = 'flex'

                    document.getElementById('no-items-message').style.marginRight = '0'
                    playSound(trophySound)
                }, 3000)
            }
            parsedTrophies.hasNoItems = true
        }
        if (itemsUsed >= 6) {
            if(!hasSixItemsTrophy) {
                setTimeout(() => {
                    document.getElementById('six-items-message').style.display = 'flex'

                    document.getElementById('six-items-message').style.marginRight = '0'
                    playSound(trophySound) 
                }, 3500)
            }
            parsedTrophies.hasSixItems = true
        }
        setTimeout(() => hideAll('trophy'), 5000)
        localStorage.setItem('trophies', JSON.stringify(parsedTrophies))
    }
    function allStrength() {
        return party.every(item => item.type === attackTypes.strength)
    }

    function allIntelligence() {
        return party.every(item => item.type === attackTypes.intelligence)
    }

    function allAssholes() {
        return party.every(item => item.type === attackTypes.assholiness)
    }

    /**
     * 
     * Helper functions
     * 
     */

    function playSound(sound) {
        sound.pause()
        sound.currentTime = 0
        sound.play()
    }

    function hide(element) {
        element.style.display = 'none'
    }

    function show(element) {
        element.style.display = 'block'
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

    /**
     * 
     * Running Minigame
     * 
     */

    function moveBackground() { 
        bgs.forEach((_, index) => { 
            bgs[index] += 1 
            if (bgs[index] >= 616) bgs[index] = -313 
        }) 
        characterLeft += 0.1 
        enemyLeft -= 0.2 
        const distance = enemyLeft - characterLeft 

        if (distance < 160 && !runningBackgroundText.classList.contains("animated-text")) { 
            runningBackgroundText.innerHTML = "Run faster!!! He almost got you!" 
            runningBackgroundText.classList.add("animated-text") 
            evilLaugh.play() 
        } 
        if (enemyLeft < characterLeft + 20) { 
            gameOverRunningGame() 
            return 
        } 
        if (characterLeft < -60) { 
            nextRoundRunningGame() 
            return 
        } 
        document.getElementById("running-bg-1").style.left = bgs[0] + "px" 
        document.getElementById("running-bg-2").style.left = bgs[1] + "px" 
        document.getElementById("running-bg-3").style.left = bgs[2] + "px" 
        document.getElementById("character-running").style.left = characterLeft + "px" 
        document.getElementById("enemy-running").style.left = enemyLeft + "px" 
    }

    function gameOverRunningGame() { 
        clearInterval(moveBackgroundInterval) 
        evilLaugh.play() 
        steps.pause() 
        titleSelect.style.display = 'block' 
        titleSelect.innerHTML = gameOverTemplate 
        characterRunning.classList.remove('running') 
        enemyRunning.classList.remove('running') 
        hide(runningBackgroundText) 
        activateFadeGameover() 
    }

    function nextRoundRunningGame() {
        clearInterval(moveBackgroundInterval)
        characterRunning.classList.remove('running')
        enemyRunning.classList.remove('running')
        hide(runningBackgroundText) 
        deathcry.play()
        round += 1
        enemyRunning.classList.add('defeated')
        steps.pause()
        titleSelect.style.display = "block"
        titleSelect.innerHTML =
            nextRoundTemplate
    }

    document.getElementById('overlay-running').addEventListener('click', () => characterLeft -= 4)

    /**
     * 
     * Rope Skip Minigame
     * 
     */

    document.getElementById('click-overlay').addEventListener('click', jump)

    function moveRope() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.beginPath()
        ctx.moveTo(150, 200)
        ctx.bezierCurveTo(150, ropeY, 400, ropeY, 400, 200)
        ctx.lineWidth = moveRopeDownwards ? 2 : 4
        ctx.stroke()

        if (moveRopeDownwards && ropeY < 280) {
            ropeY += 2
        }

        if (!moveRopeDownwards && ropeY > 20) {
            ropeY -= 2
        }

        if (ropeY >= 280 || ropeY <= 80) {
            moveRopeDownwards = !moveRopeDownwards
            skips += .5
            canvas.style.zIndex = moveRopeDownwards ? '1' : '3'

            if (skips % 3 == 0) {
                clearInterval(ropeInterval) 
                gamespeed *= 1.1
                ropeInterval = setInterval(moveRope, 1000 / gamespeed)
            }

            if (ropeY >= 240) {
                characterJumps && party[2].energy > 0 ? getPointRope() : getHitRope()
            }
        }
    }

    function nextRoundRope() {
        round += 1
        girlLeft.classList.add('defeated')
        girlRight.classList.add('defeated')
        clearInterval(ropeInterval)
        girlcry.play()
        titleSelect.style.display = 'block'
        titleSelect.innerHTML = nextRoundTemplate
        hide(canvas)
        hide(clickOverlay)
    }

    function gameOverRope() {
        clearInterval(ropeInterval)
        deathcry.play()
        hide(canvas)
        hide(clickOverlay)
        show(titleSelect)
        titleSelect.innerHTML = gameOverTemplate
    }

    function getPointRope() {
        points += 1
        playSound(confirmSound)
        const ropeSkips = document.getElementById('rope-skips')
        ropeSkips.innerHTML = `Skips: ${points}/20`
        if (points == 20) {
            nextRoundRope()
        }
    }

    function getHitRope() {
        party[2].energy -= 30
        playSound(failSound)
        energyChar3.style.width = party[2].energy + "%" 
        energyChar3.style.background = party[2].energy < 30 ? "red" : "green"
        if (party[2].energy <= 0) {
            box.classList.add('defeated')
            setTimeout(() => {
                gameOverRope()
            }, 200)
        }
    }

    function jump() {
        if (!characterJumps) {
            characterJumps = true
            playSound(jumpSound)
            box.style.top = '140px'
            setTimeout(() => {
                characterJumps = false
                box.style.top = '170px'
            }, 300)
        }
    }

/*
*
* General Game
*
*/

    document.getElementById('title-button').addEventListener('click', startGame)

    function startGame() {
        hide(title)
        hide(titleButton)
        hide(howToPlayButton)
        hide(displayTrophiesButton)
        selectScreen.style.display = 'grid'
        show(titleSelect)
        hide(battleTicker)
        enemyParty = setTeams[round]
        schoolbell.play()
        music.volume = 0.3
        music.loop = true
        music.play()

    }

    const fadeOutElement = document.getElementById('fade-out') 

    function activateFade() {
        fadeSound.play()
        fadeOutElement.classList.remove('hidden', 'fade-out')
        fadeOutElement.classList.add('fade-out')
        setTimeout(() => fadeOutElement.classList.add('hidden'), 2000)
    }

    function activateFadeGameover() {
        fadeSound.play()
        fadeOutElement.classList.remove('hidden', 'fade-out') 
        fadeOutElement.classList.add('fade-out-red')
    }

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
        playSound(confirmSound)
        showTutorial = !showTutorial

        if (showTutorial) {
            hide(title)
            hide(titleButton)
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
        tutorialScreen.innerHTML = showFirstPageTutorial ? 
            `<h2>How to play</h2>
            <p>
                Every kid has three stats: ${strengthIcon} strength, ${intelligenceIcon}
                intelligence and ${assholinessIcon} assholiness.
            </p>
            <p>
                ${strengthIcon} Strength: 
                good against type ${intelligenceIcon}, weak against high ${assholinessIcon} stat. 
            </p>
            <p>
                ${intelligenceIcon} Intelligence: 
                good against type ${assholinessIcon}, weak against high ${strengthIcon} stat.
            </p>
            <p>
                ${assholinessIcon} Assholiness: 
                strong against type ${strengthIcon}, weak against high ${intelligenceIcon} stat.
            </p>
            <p>
                ${shieldIcon} Defend: this character only takes half damage that turn, but won't attack.
            </p>
            <button id="back-button">Back</button>
            <button id="toggle-tutorial-button">More</button>`
        :
            `<img src="images_schoolfight/tutorial.png" style="width: 100%"></img>
            <div style="position: absolute; top: 170px; left: 120px;width: 120px; height: 40px; padding: 8px; opacity: 0;background: rgba(255,165,0,0.7); border-radius: 8px; animation: toggleTutorialSteps 12s infinite">1. Click your character</div>
            <div style="position: absolute; top: 68px; left: 150px;width: 120px; height: 40px; padding: 8px; opacity: 0; background: rgba(255,165,0,0.7); border-radius: 8px; animation: toggleTutorialSteps 12s infinite; animation-delay: 4s">2. Choose attack type</div>
            <div style="position: absolute; top: 170px; left: 346px;width: 120px; height: 40px; padding: 8px; opacity: 0; background: rgba(255,165,0,0.7); border-radius: 8px; animation: toggleTutorialSteps 12s infinite; animation-delay: 8s">3. Choose target enemy</div>
            <button id="back-button">Back</button>
            <button id="toggle-tutorial-button">More</button>`
    }

    dialogueBoxWrapper.addEventListener('click', nextDialogue)

    function nextDialogue() {
        if(party.length === 0) return

        if (showDialogue && indexOfMessage === 0) {
            indexOfMessage = 1
            dialogueBox.innerHTML = dialogues[round][indexOfMessage]
            return
        }

        indexOfMessage = 0
        hide(dialogueBoxWrapper)
        show(itemBox)
        showDialogue = false

        if (round === 3) {
            ropeInterval = setInterval(moveRope, 1000 / gamespeed)
            hide(itemBox)
        }

        if (round === 5) {
            moveBackgroundInterval = setInterval(moveBackground, 1000 / 120)
            steps.playbackRate = 2
            steps.loop = true
            steps.play()
            const spritePosition = eval(`${party[0].class}SidePosition`)
            runningSprite.style.top = spritePosition.top
            runningSprite.style.left = spritePosition.left
            characterRunning.classList.add('running')
            enemyRunning.classList.add('running')
            hide(itemBox)
        }

        if (round === 8) {
            bossmusic.play()
            bossmusic.volume = 0.6
            bossmusic.loop = true
        }
    }

    function addCharacter(event) {
        const character = event.currentTarget.getAttribute('character')
        const obj = new Character(eval(character))

        if (party.length < 3) {
            playSound(confirmSound)
            obj.id = party.length + 1
            party.push(obj)
            titleSelect.innerHTML = `Add characters to your party ${party.length}/3`
            document.getElementById(`energy-char${obj.id}-text`).innerHTML = obj.class
        }

        if (party.length == 3) {
            showDialogue = true
            activateFade()
            setTimeout(() => {
                initializeGame()
            }, 1000)
        }
    }

    function initializeGame() {
        hide(selectScreen)
        hide(selectScreen2)
        hide(titleSelect)
        dialogueBoxWrapper.style.opacity = 1
        dialogueBox.innerHTML = dialogues[round][indexOfMessage]
        const energyBars = Array.from(document.getElementsByClassName('energybar'))
        energyBars.forEach(bar => show(bar))
        const spriteContainers = Array.from(document.getElementsByClassName('sprite-container'))
        spriteContainers.forEach(sprite => show(sprite))
        showPlayersprites()
        showEnemysprites()
        bombButton.innerHTML = `<i class="fas fa-bomb"></i>x${bombs}`
        itemButton.innerHTML = `${snackIcon}x${snacks}`
    }

    function showPlayersprites() {
        party.forEach((element, index) => { 
            const charSprite = document.getElementById(`char${index + 1}-sprite`) 
            const spritePosition = eval(`${element.class}SpritePosition`) 
            Object.keys(spritePosition).forEach(key => { 
                charSprite.style[key] = spritePosition[key] 
            }) 
            document.querySelector(`.buttons-char${index + 1}[type='strength'] i span`).innerHTML = element.strength 
            document.querySelector(`.buttons-char${index + 1}[type='intelligence'] i span`).innerHTML = element.intelligence 
            document.querySelector(`.buttons-char${index + 1}[type='assholiness'] i span`).innerHTML = element.assholiness 
        })
    }

    function showEnemysprites() {
        enemyParty.forEach((element, index) => {
            element.id = index + 1
            const enemySprite = document.getElementById(`enemy${index + 1}-sprite`) 
            const spritePosition = eval(`${element.class}SpritePosition`) 
            Object.keys(spritePosition).forEach(key => { 
                enemySprite.style[key] = spritePosition[key] 
            })
            document.getElementById(`energy-enemy${index + 1}-text`).innerHTML = element.class
        })
    }

    function selectTarget(event) {
        document.querySelector(`#char${selectedChar.id} .overflow-wrapper`).classList.add('selected')
        const enemyWrapper = event.target.closest('.right-party')
        const id = enemyWrapper.getAttribute('enemy')
        const enemy = enemyParty[parseInt(id)]
        const possibleMoves = getPossibleMoves()

        if (attackType !== "") {
            Array.from(document.getElementsByClassName('open')).forEach(element => {
                element.classList.add('hidden-buttons')
                element.classList.remove('open')
            })
        }


        if (playerTurn && moves.length < possibleMoves && selectedChar !== "" && enemy.energy > 0) {
            moves.push({ attacker: selectedChar, target: enemy, type: attackType })
            selectedChar = ""
            intSelector = ""
            attackType = ""
            playSound(confirmSound)
        }

        if (moves.length === possibleMoves) {
            runFightanimation()
            document.querySelectorAll('.hidden-buttons').forEach(element => { 
                element.classList.remove('hidden-buttons') 
            })
            fightSound.play()
        }
    }

    function selectChar(event) {
        const target = event.currentTarget
        hide(bombContainerWrapper)
        playSound(confirmSound)
        const index = event.currentTarget.getAttribute('partymember')
        selectedChar = party[index]
        intSelector = target.getAttribute('char')
        attackType = target.getAttribute('type')
        indexAttr = target.getAttribute('index')

        if (attackType == "") {
            selectDefend(selectedChar, intSelector, indexAttr)
        }

        Array.from(document.getElementsByClassName('open')).forEach(openedElement => {
            openedElement.classList.remove('open')
            openedElement.classList.add('hidden')
        })
    }

    function showButtons(event) {
        if (!showDialogue && !fightanimationRunning && !disableAttackButtons) {
            const element = event.currentTarget
            hide(battleTicker)
            Array.from(document.getElementsByClassName('left-party')).forEach(element => {
                element.classList.remove('open')
            })
            element.classList.toggle('open')

        }
    }

    function selectDefend(player, int, index) {
        const openButtons = document.querySelectorAll(`.open`)
        openButtons.forEach(element => { 
            element.classList.add("hidden-buttons") 
            element.classList.remove("open") 
        })
        party[index].defends = true
        moves.push({ attacker: player, target: "", type: "" })
        playSound(confirmSound)

        if (moves.length === getPossibleMoves()) {
            runFightanimation()
            fightSound.play()
            setTimeout(() => {
                document.querySelectorAll('.hidden-buttons').forEach(element => { 
                    element.classList.remove('hidden-buttons') 
                })
            }, 2500)
        }

    }

    function runFightanimation() {
        const allSelected = document.querySelectorAll('.selected')
        allSelected.forEach(selected => selected.classList.remove('selected'))
        overlay.style.zIndex = '999'
        fightanimationRunning = true
        punchSounds.playbackRate = 3
        hide(itemBox)
        setTimeout(() => punchSounds.play(), 500)
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
            fightanimationRunning = false
        }, 3000)
        setTimeout(() => {
            hide(battleTicker)
        }, 4000)
        calculateDamage()
        moves = []
    }

    function setCharactersDefeated() {
        enemyParty.forEach(element => {
            if (element.energy <= 0) {
                const defeated = document.getElementById(`enemy${element.id}`)
                defeated.classList.add('defeated')
            }
        })
        party.forEach(element => {
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
            battleMessages.push("<span class='text-enemy'>Enemy " + enemy.class + " <i class='fas fa-shield-alt'></i>" + "</span><br>")
        })
    }

    function handlePlayerMoves() {
        moves.forEach(element => {
            if (element.attacker.defends) {
                battleMessages.push("<span class='text-player'>" + element.attacker.class + " <i class='fas fa-shield-alt'></i>" + "</span><br>")
                return
            }

            battleMessages.push("<span class='text-player'>" + element.attacker.class + '  ' + setBattletickerIcon(element.type) + '  ' + "<span class='text-enemy'>Enemy " + element.target.class + "</span><br>")
            const selector = element.type
            const attack = element.attacker[selector]
            const defense = getDefenseType(selector, "target")
            const typeBonus = getEffectiveness(selector, element.target.type)

            let damage = attack * typeBonus * (100 / (100 + element.target[defense] * 10))
            element.target.takeDamage(damage)

            if (element.target.energy < 0) {
                element.target.energy = 0
                setTimeout(() => deathcry2.play(), 2500)
            }
        })
    }

    function randomAttacktype() {
        switch (lastMoveTeacher) {
            case attackTypes.strength: {
                selector = attackTypes.assholiness
                lastMoveTeacher = attackTypes.assholiness
                break
            }
            case attackTypes.assholiness: {
                selector = attackTypes.intelligence
                lastMoveTeacher = attackTypes.intelligence
                break
            }
            case attackTypes.intelligence: {
                selector = attackTypes.strength
                lastMoveTeacher = attackTypes.strength
                break
            }
        }

        return selector
    }

    function calculateDamage() {
        const remainingEnemyParty = getRemainingEnemies()
        document.getElementById('battle-ticker') .style.display = 'block'
        battleMessages = []
        setEnemiesDefending()
        handlePlayerMoves()
        const possibleTargets = getRemainingParty()

        remainingEnemyParty.forEach(enemy => {
            if (!enemy.defends) {
                const selector = (enemy.type === attackTypes.teacher || enemy.type === attackTypes.allrounder) 
                    ? randomAttacktype() : enemy.type
                const attack = enemy[selector]
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

                const defense = getDefenseType(selector, target)
                const typeBonus = getEffectiveness(selector, target.type)

                battleMessages.push("<span class='text-enemy'> Enemy " + enemy.class + "</span>" + setBattletickerIcon(selector) + "<span class='text-player'>" + target.class + "</span><br>")
                const damage = attack * typeBonus * (100 / (100 + target[defense] * 10))

                target.takeDamage(damage)

                if (target.energy <= 0) {
                    setTimeout(() => deathcry.play(), 2500)
                }
            }
            updateEnergybars()
            resetDefending()
        })

        if (remainingEnemyParty.length > 0 && round <= 8){
            setTimeout(() => itemBox.style.display = 'block', 2500)
        }

        if (getPossibleMoves() === 0) {
            setTimeout(() => {
                hide(battleTicker)
                show(titleSelect)
                titleSelect.innerHTML = gameOverTemplate
                hide(itemBox)
                bossmusic.pause()
            }, 2500)
        }
        const joinedBattleMessages = battleMessages.join(" ")
        battleTicker.innerHTML = joinedBattleMessages
        checkRemainingEnemies()
    }

    function getPossibleMoves() {
        const remainingChars = party.filter(char => char.energy > 0) 
        return remainingChars.length
    }

    function resetDefending() {
        enemyParty.forEach(enemy => {
            enemy.defends = false
        })
        party.forEach(char => {
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

        if (remainingEnemies.length > 0) return

        checkSurvivors()
        round += 1
        disableAttackButtons = true
        setTimeout(() => {
            hide(battleTicker)
            show(titleSelect)

            if (round < 9) {
                titleSelect.innerHTML = nextRoundTemplate
                return
            }

            handleTrohies()

            bossmusic.pause()
            runVictoryAnimation()
            setTimeout(() => {
                victorySound.play()
                cheerSound.play()
            }, 500)
            showConfetti()
            titleSelect.innerHTML = victoryTemplate
        }, 2600)
    }

    function checkSurvivors() {
        hide(itemBox)
        party.forEach(char => {
            if (char.energy > 0) {
                survivalpoints += 1
            }
        })

        if ((survivalpoints >= 10 && itemsReceived == 1 && round < 8) || (survivalpoints >= 5 && itemsReceived == 0 && round < 9)) {
            updateItembox()            
        }
    }

    function updateItembox(){
        itemsReceived += 1
        bombs += 1
        snacks += 1
        setTimeout(()=> itemBox.style.display = 'block', 2500)
        bombButton.setAttribute('disabled', true)
        bombButton.innerHTML = `<i class="fas fa-bomb"></i><span style='color:limegreen'>+1</span>`
        bombButtonWrapper.classList.add('animated-text')
        itemButton.setAttribute('disabled', true)
        itemButton.innerHTML = `${snackIcon}<span style='color:limegreen'>+1</span>`
        itemButtonWrapper.classList.add('animated-text')
        setTimeout(()=>{
            hide(itemBox)
            bombButton.removeAttribute('disabled')
            itemButton.removeAttribute('disabled')
            bombButton.innerHTML = `<i class="fas fa-bomb"></i>x${bombs}`
            itemButton.innerHTML = `${snackIcon}x${snacks}`
            bombButtonWrapper.classList.remove('animated-text')
            itemButtonWrapper.classList.remove('animated-text')
        },6000)
    }
    
    function changeBackground() {
        switch (round) {
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
                const spritePosition = eval(`${party[0].class}SpritePosition`)
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

    function startNextRound() { 
        activateFade() 
        hide(itemBox) 
        hide(bombContainerWrapper) 
        setTimeout(() => changeBackground(), 500) 
        setTimeout(() => { 
            showDialogue = true 
            disableAttackButtons = false 
            show(dialogueBoxWrapper) 
            const dialogueBox = document.getElementById("dialogue-box") 
            dialogueBox.innerHTML = dialogues[round][indexOfMessage] 
            document.querySelectorAll(".sprite-container").forEach(sprite => { 
                sprite.classList.remove("hidden-buttons") 
            }) 
            schoolbell.play()
            party.forEach(element => element.energy = 100) 
            enemyParty = setTeams[round] 
            enemyParty.forEach((element, index) => { 
                element.id = index + 1 
                if (element.class === "Dummy") { 
                    hide(document.getElementById(`energybar-enemy${element.id}`)) 
                    return 
                } 
                document.getElementById(`energy-enemy${element.id}-text`).innerHTML = element.class 
            }) 
            drawEnergybars() 
            document.querySelectorAll(".defeated").forEach(element => { 
                element.classList.remove("defeated") 
            }) 
            showPlayersprites() 
            showEnemysprites() 
            hide(document.getElementById("next-button")) 
            titleSelect.innerHTML = "" 
            if (round === 3) {
                hideAll('energybar') 
                show(energyChar3) 
                show(document.getElementById("rope-skipping-game"))
                hideAll('left-party') 
                const ropeSprite = document.getElementById("rope-sprite")
                const spritePosition = eval(`${party[2].class}SpritePosition`)
                ropeSprite.style.top = spritePosition.top
                ropeSprite.style.left = spritePosition.left
            } 
            if (round === 5) {
                hideAll('energybar') 
                hideAll('left-party')
            }

            if (round !== 3 && round !== 5) { 
                hide(document.getElementById("rope-skipping-game"))
                showAll('left-party')
                showAll('energybar') 

                document.querySelectorAll(".energybar").forEach(energybar => { 
                    energybar.style.display = 'block' 
                }) 
            } 
            
            if (round === 8) { 
                music.pause() 
                hide(document.getElementById("energybar-enemy1")) 
                hide(document.getElementById("energybar-enemy3")) 
            } 
        }, 1000) 
    }

    function drawEnergybars() { 
        for (let i = 0; i <= 2; i++) { 
            const charEnergyBar = document.getElementById(`energy-char${i + 1}`)
            charEnergyBar.style.width = party[i].energy + "%"
            charEnergyBar.style.background = party[i].energy < 30 ? "red" : "green"
            show(charEnergyBar)
            const enemyEnergyBar = document.getElementById(`energy-enemy${i + 1}`)
            enemyEnergyBar.style.width = enemyParty[i].energy + "%"
            enemyEnergyBar.style.background = enemyParty[i].energy < 30 ? "red" : "green"
            show(enemyEnergyBar)
        } 
    }

    function updateEnergybars() { 
        for (let i = 0; i <= 2; i++) { 
            const charEnergyBar = document.getElementById(`energy-char${i + 1}`) 
            charEnergyBar.style.width = party[i].energy + "%"
            charEnergyBar.style.background = party[i].energy < 30 ? "red" : "green"
            const enemyEnergyBar = document.getElementById(`energy-enemy${i + 1}`)
            enemyEnergyBar.style.width = enemyParty[i].energy + "%"
            enemyEnergyBar.style.background = enemyParty[i].energy < 30 ? "red" : "green"
        }
    }   
    const body = document.querySelector('body')
    const actions = {
        '#char1.victory': () => playSound(clapSound), 
        '#char2.victory': () => playSound(laughSound), 
        '#char3.victory': () => playSound(screamSound), 
        '#next-button': startNextRound 
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
        element.addEventListener('click', switchSelectscreen)
    })

    function showConfetti() {
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement("div")
            confetti.className = "confetti"
            const colorNumber = Math.floor(Math.random() * 360)
            const color = `hsl(${colorNumber}, 50%, 50%)`
            const animationDelay = Math.random() * 20 + "s"
            const xPosition = Math.random() * 100
            confetti.style.animationDelay = animationDelay 
            confetti.style.backgroundColor = color 
            confetti.style.left = xPosition + "%"
            backgroundElement.append(confetti)
        }
    }

    function showBomb(){
        bombContainerWrapper.style.display = 'block'
        for (let i = 0; i < 100; i++) {
            let cloud = document.createElement("div")
            cloud.className = "bombcloud"
            let animationDelay = Math.random() * 5 + "s"
            let xPosition = Math.random() * 100
            cloud.style.animationDelay = animationDelay 
            cloud.style.top = "-150px" 
            cloud.style.left = (xPosition - 50) + "px"
            bombContainer.append(cloud)
        }
        setTimeout(()=>{
            document.querySelectorAll('.right-party:not(.defeated)').forEach(element => {
                element.classList.add('bombed-enemy')
            })
            stinkSound.play()
        },2000)
        setTimeout(()=>{
            document.querySelectorAll('.right-party:not(.defeated)').forEach(element => {
                element.classList.remove('bombed-enemy')
            })
        },3500)
        setTimeout(()=>{
            hide(bombContainerWrapper)
        },7000)
    }

    function runVictoryAnimation() {
        hideAll('energybar')
        char1.style.top = '200px'
        char1.style.left = '150px'
        char2.style.top = '200px'
        char2.style.left = '250px'
        char3.style.top = '200px'
        char3.style.left = '350px'
        char1.classList.add('victory')
        char2.classList.add('victory')
        char3.classList.add('victory')

        setTimeout(function () {
            Array.from(document.getElementsByClassName('left-party')).forEach(element => {
                element.classList.remove('defeated')
            })
        }, 100)
    }

    document.getElementById('item-button').addEventListener('click', eatSnack)
    document.getElementById('bomb-button').addEventListener('click', throwBomb)

    function eatSnack() {
        if (party.length === 0 || snacks === 0) return
        itemsUsed += 1
        itemUsed = true
        const aliveLeftParty = document.querySelectorAll('.left-party:not(defeated)')
        aliveLeftParty.forEach(element => element.classList.add('eating-snack'))
        setTimeout(()=>{ 
            aliveLeftParty.forEach(element => element.classList.remove('eating-snack'))
        },1000)
        battleTicker.innerHTML = `You had a <span style='color: orange'>snack</span>!<br>30% <span style='color:lightblue'>health</span> recovered`
        battleTicker.style.display = 'block'
        eatingSound.play()
        hide(itemBox)
        snacks -= 1
        party.forEach(char => {
            if (char.energy <= 0) return
            
            char.energy += 30

            if (char.energy > 100) char.energy = 100
        })
        updateEnergybars()
        itemButton.innerHTML = `${snackIcon}x${snacks}`
    }

    function throwBomb() { 
        if (bombs <= 0 || enemyParty.length === 0) return
        itemsUsed += 1
        itemUsed = true
        battleTicker.innerHTML = "<span style='color:limegreen'>Stink bomb</span>!<br>Enemies take 20% <span style='color:red'>damage</span>!" 
        battleTicker.style.display = 'block' 
        
        showBomb()
        hide(itemBox) 

        bombs -= 1 
        bombButton.innerHTML = `${bombIcon}x${bombs}` 
        
        if (getRemainingEnemies().length === 0) return 
        
        enemyParty.forEach(enemy => { 
            enemy.energy -= 30
            if(enemy.energy <= 0) enemy.energy = 0 
            updateEnergybars() 
            checkRemainingEnemies()
            setTimeout(() => { 
                setCharactersDefeated()
            }, 5000) 
        }) 
    }

    function getRemainingEnemies() {
        const remainingEnemies = enemyParty.filter(enemy => enemy.energy > 0)
        return remainingEnemies
    }

    function getRemainingParty() {
        const remainingChars = party.filter(char => char.energy > 0)
        return remainingChars
    }

    function switchSelectscreen() {
        clicksound.play()
        displaySelectScreen1 = !displaySelectScreen1
        if (!displaySelectScreen1) {
            hide(selectScreen)
            selectScreen2.style.display = 'grid'
        } else {
            hide(selectScreen2)
            selectScreen.style.display = 'grid'
        }
    }
})

