$(document).ready(function () {
    function adjustGameSize() {
        window.innerWidth >= window.innerHeight * 550/314 
        ? document.getElementById("game-wrapper").style.transform = `scale(${window.innerWidth/660})`
        : document.getElementById("game-wrapper").style.transform = `scale(1)`
    }
    
    adjustGameSize()
    window.addEventListener("resize", adjustGameSize)

    let id = 1
    let showTutorial = false
    let round = 0
    let party = []
    let moves = []
    let possibleMoves = 3
    let possibleTargets = []
    let playerTurn = true
    let selectedChar = ""
    let intSelector
    let attackType
    let remainingEnemyParty = []
    let selectScreen1 = false
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

    /*
    *
    * Helper Functions
    * 
    */

    function playSound(sound) {
        sound.pause()
        sound.currentTime = 0
        sound.play()
    }

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

    const energybarEnemy1 = $("#energy-enemy1")
    const energybarEnemy2 = $("#energy-enemy2")
    const energybarEnemy3 = $("#energy-enemy3")

    const strengthIcon = "<i class='fas fa-hand-rock'></i>"
    const assholinessIcon = "<i class='fas fa-hand-middle-finger'></i>"
    const intelligenceIcon = "<i class='fas fa-glasses'></i>"
    const shieldIcon = "<i class='fas fa-shield-alt'></i>"
    const bombIcon = "<i class='fas fa-bomb'></i>"
    const snackIcon = "<i class='fas fa-hamburger'></i>"

    /*
     * 
     * Sounds
     * 
     */

    let confirmSound = new Audio("sounds_schoolfight/confirm.wav")
    let schoolbell = new Audio("sounds_schoolfight/schoolbell.wav")
    let music = new Audio("sounds_schoolfight/music.mp3")
    let fightanimationRunning = false
    let failSound = new Audio("sounds_schoolfight/wrong.wav")
    let steps = new Audio("sounds_schoolfight/steps.wav")
    let fightSound = new Audio("sounds_schoolfight/fight.mp3")
    let fadeSound = new Audio("sounds_schoolfight/fade.wav")
    let punchSounds = new Audio("sounds_schoolfight/punches.wav")
    let deathcry = new Audio("sounds_schoolfight/deathcry.wav")
    let deathcry2 = new Audio("sounds_schoolfight/deathcry2.wav")
    let clicksound = new Audio("sounds_schoolfight/clicksound.wav")
    let girlcry = new Audio("sounds_schoolfight/girlcry.mp3")
    let evilLaugh = new Audio("sounds_schoolfight/evil-laugh.wav")
    let victorySound = new Audio("sounds_schoolfight/victory.mp3")
    let bossmusic = new Audio("sounds_schoolfight/bossmusic.wav")
    let jumpSound = new Audio("sounds_schoolfight/jump.wav")
    let stinkSound = new Audio("sounds_schoolfight/stinksound.wav")
    let eatingSound = new Audio("sounds_schoolfight/eating.wav")
    let cheerSound = new Audio("sounds_schoolfight/cheer.wav")
    let clapSound = new Audio("sounds_schoolfight/clap.wav")
    let screamSound = new Audio("sounds_schoolfight/scream.mp3")
    let laughSound = new Audio("sounds_schoolfight/laugh.wav")


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
    let showWarning = false

    /*
     * 
     * Ropeskip Minigame variables
     * 
     */

    let canvas = $("#canvas")[0]
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

    let bully = {
        id: undefined,
        class: "Bully",
        type: attackTypes.strength,
        energy: 100,
        strength: 16,
        intelligence: 0,
        assholiness: 10,
        defends: false
    }

    let squealer = {
        id: undefined,
        class: "Squealer",
        energy: 100,
        type: attackTypes.assholiness,
        strength: 2,
        intelligence: 2,
        assholiness: 18,
        defends: false
    }

    let nerd = {
        id: undefined,
        class: "Nerd",
        type: attackTypes.intelligence,
        energy: 100,
        strength: 0,
        intelligence: 20,
        assholiness: 0,
        defends: false
    }

    let wally = {
        id: undefined,
        class: "Wally",
        type: attackTypes.strength,
        energy: 100,
        strength: 20,
        intelligence: 0,
        assholiness: 0,
        defends: false
    }

    let richkid = {
        id: undefined,
        class: "Richkid",
        type: attackTypes.assholiness,
        energy: 100,
        strength: 0,
        intelligence: 12,
        assholiness: 14,
        defends: false
    }

    let sportskid = {
        id: undefined,
        class: "Sportskid",
        type: attackTypes.strength,
        energy: 100,
        strength: 14,
        intelligence: 12,
        assholiness: 0,
        defends: false
    }

    let joe = {
        id: undefined,
        class: "Joe",
        type: attackTypes.allrounder,
        energy: 100,
        strength: 8,
        intelligence: 8,
        assholiness: 8,
        defends: false
    }

    let weirdo = {
        id: undefined,
        class: "Weirdo",
        type: attackTypes.intelligence,
        energy: 100,
        strength: 2,
        intelligence: 14,
        assholiness: 10,
        defends: false
    }

    let wolf = {
        id: undefined,
        class: "Wolfkid",
        type: attackTypes.strength,
        energy: 100,
        strength: 16,
        intelligence: 0,
        assholiness: 10,
        defends: false
    }

    let dummy = {
        id: undefined,
        class: "Dummy",
        type: attackTypes.strength,
        energy: 0,
        strength: 0,
        intelligence: 0,
        assholiness: 0,
        defends: false
    }

    let teacher = {
        id: undefined,
        class: "Teacher",
        type: attackTypes.teacher,
        energy: 100,
        strength: 34,
        intelligence: 34,
        assholiness: 34,
        defends: false
    }

    let enemyParty = []
    let setTeams = [
        [{ ...bully }, { ...nerd }, { ...squealer }], //1
        [{ ...squealer }, { ...wally }, { ...richkid }], //2
        [{ ...sportskid }, { ...sportskid }, { ...sportskid }], //3
        [{ ...dummy }, { ...dummy }, { ...dummy }], //4 (rope skipping)
        [{ ...richkid }, { ...nerd }, { ...bully }], //5
        [{ ...dummy }, { ...dummy }, { ...dummy }], //6 (running)
        [{ ...richkid }, { ...richkid }, { ...richkid }],  //6
        [{ ...nerd }, { ...nerd }, { ...nerd }], //7
        [{ ...dummy }, { ...teacher }, { ...dummy }], //8
    ]

    /**
     * 
     * Dialogues
     * 
     */

    let dialogues = [
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
    let disableAttackBtns = false

    /**
     * 
     * HTML Templates
     * 
     */

    const nextRoundTemplate = `You won! <br><br><br><br> <button id="next-button">Next round</button>`
    const victoryTemplate = `Congratulations! <br> You are king of school!<br><br><br><br> <button id="refresh-button">Play again</button>`
    const gameOverTemplate = `You lost...!? <br><br><br><br> <button id="refresh-button">Try again</button>`

    /**
     * 
     * Running Minigame
     * 
     */

    function moveBackground() {
        bgs.forEach((_,index) => {
            bgs[index] += 1
            if (bgs[index] >= 616) bgs[index] = -313
        })
        characterLeft += .1
        enemyLeft -= .2
        let distance = enemyLeft - characterLeft
        if (distance < 160 && !showWarning) {
            showWarning = true
            $("#running-background h2").html("Run faster!!! He almost got you!")
            $("#running-background h2").addClass("animated-text")
            evilLaugh.play()
        }

        if (enemyLeft < characterLeft + 20) {
            gameOverRunningGame()
        }

        if (characterLeft < -60) {
            nextRoundRunningGame()
        }
        $("#running-bg-1").css({ "left": bgs[0] + "px" })
        $("#running-bg-2").css({ "left": bgs[1] + "px" })
        $("#running-bg-3").css({ "left": bgs[2] + "px" })
        $("#character-running").css({ "left": characterLeft + "px" })
        $("#enemy-running").css({ "left": enemyLeft + "px" })

        $("#character-running").css({ "left": characterLeft + "px" })
    }

    function gameOverRunningGame() {
        clearInterval(moveBackgroundInterval)
        evilLaugh.play()
        steps.pause()
        $("#title-select").css({ "display": "block" })
        $("#title-select").html(gameOverTemplate)
        $("#character-running").removeClass("running")
        $("#enemy-running").removeClass("running")
        $("#running-background h2").hide()
        activateFadeGameover()
    }

    function nextRoundRunningGame() {
        clearInterval(moveBackgroundInterval)
        $("#character-running").removeClass("running")
        $("#enemy-running").removeClass("running")
        $("#running-background h2").hide()
        deathcry.play()
        round += 1
        $("#enemy-running").addClass("defeated")
        steps.pause()
        document.getElementById("title-select").style.display = "block"
        document.getElementById("title-select").innerHTML =
            nextRoundTemplate
    }


    $("#overlay-running").on("click", () => { characterLeft -= 4 })


    /**
     * 
     * Rope Skip Minigame
     * 
     */

    $("#click-overlay").click(function () { jump() })

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
            moveRopeDownwards ? $(canvas).css({ "z-index": "1" }) : $(canvas).css({ "z-index": "3" })

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
        $("#girl-left").addClass("defeated")
        $("#girl-right").addClass("defeated")
        clearInterval(ropeInterval)
        girlcry.play()
        $("#title-select").show()
        $("#title-select").html(nextRoundTemplate)
        $("canvas").hide()
        $("#click-overlay").hide()
    }

    function gameOverRope() {
        clearInterval(ropeInterval)
        deathcry.play()
        $("canvas").hide()
        $("#click-overlay").hide()
        $("#title-select").show()
        $("#title-select").html(gameOverTemplate)
    }

    function getPointRope() {

        points += 1
        playSound(confirmSound)
        $("#rope-skips").html(`Skips: ${points}/20`)
        if (points == 20) {
            nextRoundRope()
        }
    }


    function getHitRope() {
        party[2].energy -= 30
        playSound(failSound)
        $("#energy-char3").css({ "width": party[2].energy + "%", "background": party[2].energy < 30 ? "red" : "green" })
        if (party[2].energy <= 0) {
            $("#box").addClass("defeated")
            setTimeout(() => {
                gameOverRope()
            }, 200)
        }
    }

    function jump() {
        if (!characterJumps) {
            characterJumps = true
            playSound(jumpSound)
            $("#box").css({ "top": "140px" })
            setTimeout(() => {
                characterJumps = false
                $("#box").css({ "top": "170px" })
            }, 300)
        }
    }

/*
*
* General Game
*
*/

    $("#title-button").on("click", startgame)
    function startgame() {
        $("#title").hide()
        $("#title-button").hide()
        $("#how-to-play-btn").hide()
        $("#select-screen").css({ "display": "grid" })
        $("#title-select").show()
        $("#battle-ticker").hide()
        enemyParty = setTeams[round]
        schoolbell.play()
        music.volume = 0.3
        music.loop = true
        music.play()

    }

    function activateFade() {
        fadeSound.play()
        $("#fade-out").removeClass("hidden")
        $("#fade-out").removeClass("fade-out")
        $("#fade-out").addClass("fade-out")
        setTimeout(() => $("#fade-out").addClass("hidden"), 2000)
    }

    function activateFadeGameover() {
        fadeSound.play()
        $("#fade-out").removeClass("hidden")
        $("#fade-out").removeClass("fade-out")
        $("#fade-out").addClass("fade-out-red")
    }

    $("#how-to-play-btn").on("click", toggleTutorial)
    $("#tutorial-screen").on("click", "#back-btn", toggleTutorial)
    function toggleTutorial() {
        playSound(confirmSound)
        showTutorial = !showTutorial

        if (showTutorial) {
            $("#title").hide()
            $("#title-button").hide()
            $("#tutorial-screen").show()
            $("#how-to-play-btn").css({ "top": "80%" })
            $("#back-btn").show()
            $("#how-to-play-btn").hide()
            return
        }

        $("#title").show()
        $("#title-button").show()
        $("#tutorial-screen").hide()
        $("#how-to-play-btn").css({ "top": "65%" })
        $("#back-btn").hide()
        $("#how-to-play-btn").show()
    }

    let showFirstPageTutorial = true
    $("#tutorial-screen").on("click", "#toggleTutorialBtn", switchTutorialPage)

    function switchTutorialPage() {
        showFirstPageTutorial = !showFirstPageTutorial
        if (showFirstPageTutorial) {
            $("#tutorial-screen").html(`      <h2>How to play</h2>
            <p>
                Every kid has three stats: ${strengthIcon} strength, ${intelligence}
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
            <button id="back-btn">Back</button>
            <button id="toggleTutorialBtn">More</button>`)
        } else {
            $("#tutorial-screen").html(`<img src="images_schoolfight/tutorial.png" style="width: 100%"></img>
            <div style="position: absolute; top: 170px; left: 120px;width: 120px; height: 40px; padding: 8px; opacity: 0;background: rgba(255,165,0,0.7); border-radius: 8px; animation: toggleTutorialSteps 12s infinite">1. Click your character</div>
            <div style="position: absolute; top: 68px; left: 150px;width: 120px; height: 40px; padding: 8px; opacity: 0; background: rgba(255,165,0,0.7); border-radius: 8px; animation: toggleTutorialSteps 12s infinite; animation-delay: 4s">2. Choose attack type</div>
            <div style="position: absolute; top: 170px; left: 346px;width: 120px; height: 40px; padding: 8px; opacity: 0; background: rgba(255,165,0,0.7); border-radius: 8px; animation: toggleTutorialSteps 12s infinite; animation-delay: 8s">3. Choose target enemy</div>
            <button id="back-btn">Back</button>
            <button id="toggleTutorialBtn">More</button>`)
        }
    }

    $("#dialogue-box-wrapper").on("click", nextDialogue)

    function nextDialogue() {
        if(party.length === 0) return

        if (showDialogue && indexOfMessage === 0) {
            indexOfMessage = 1
            document.getElementById("dialogue-box").innerHTML = dialogues[round][indexOfMessage]
            return
        }

        indexOfMessage = 0
        document.getElementById("dialogue-box-wrapper").style.display = "none"
        $("#itembox").show()
        showDialogue = false

        if (round === 3) {
            ropeInterval = setInterval(moveRope, 1000 / gamespeed)
            $("#itembox").hide()
        }

        if (round === 5) {
            moveBackgroundInterval = setInterval(moveBackground, 1000 / 120)
            steps.playbackRate = 2
            steps.loop = true
            steps.play()
            $("#character-running img").css(eval(`${party[0].class}SidePosition`))
            $("#character-running").addClass("running")
            $("#enemy-running").addClass("running")
            $("#itembox").hide()
        }

        if (round === 8) {
            bossmusic.play()
            bossmusic.volume = 0.6
            bossmusic.loop = true
        }
    }

    $("body").on("click", ".add-button", addCharacter)

    function addCharacter() {
        const obj = JSON.parse(JSON.stringify(eval($(this).attr("character"))))

        if (party.length < 3) {
            playSound(confirmSound)
            obj.id = id
            enemyParty[id - 1].id = id
            id += 1
            party.push(obj)
            document.getElementById("title-select").innerHTML = `Add characters to your party ${party.length}/3`
            document.getElementById(`energy-char${id - 1}-text`).innerHTML = obj.class
            document.getElementById(`energy-enemy${id - 1}-text`).innerHTML = enemyParty[id - 2].class
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
        $("#select-screen").hide()
        $("#title-select").hide()
        document.getElementById("dialogue-box-wrapper").style.opacity = 1
        document.getElementById("dialogue-box").innerHTML = dialogues[round][indexOfMessage]
        $(".energybar").show()
        $(".sprite-container").show()
        showPlayersprites()
        showEnemysprites()
        $("#bomb-button button").html(`<i class="fas fa-bomb"></i>x${bombs}`)
        $("#item-button button").html(`${snackIcon}x${snacks}`)
    }

    function showPlayersprites() {
        party.forEach((element, index) => {
            $(`#char${index + 1}-sprite`).css(eval(`${element.class}SpritePosition`))
            $(`.btns-char${index + 1}[type='strength'] i span`).html(element.strength)
            $(`.btns-char${index + 1}[type='intelligence'] i span`).html(element.intelligence)
            $(`.btns-char${index + 1}[type='assholiness'] i span`).html(element.assholiness)
        })
    }

    function showEnemysprites() {
        enemyParty.forEach((element, index) => {
            $(`#enemy${index + 1}-sprite`).css(eval(`${element.class}SpritePosition`))
        })
    }

    $("body").on("click", ".right-party", selectTarget)

    function selectTarget() {
        $(`#char${selectedChar.id} .overflow-wrapper`).addClass("selected")
        const enemy = enemyParty[$(this).attr("enemy")]

        if (attackType !== "") {
            $(".open").each(function () {
                $(this).addClass("hidden-buttons")
                $(this).removeClass("open")
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
            $("div").each(function () {
                $(this).removeClass("hidden-buttons")
            })
            fightSound.play()
        }
    }

    $("body").on("click", ".btns-char", selectChar)

    function selectChar() {
        $("#bomb-container-wrapper").hide()
        playSound(confirmSound)
        selectedChar = party[$(this).attr("partymember")]
        intSelector = $(this).attr("char")
        attackType = $(this).attr("type")
        indexAttr = $(this).attr("index")

        if (attackType == "") {
            selectDefend(selectedChar, intSelector, indexAttr)
        }
        $(".open").each(function () {
            $(this).addClass("hidden")
            $(this).removeClass("open")
        })
    }

    $("body").on("click", ".left-party", showButtons)

    function showButtons(event) {
        if (!showDialogue && !fightanimationRunning && !disableAttackBtns) {
            $("#battle-ticker").hide()
            $(".left-party").removeClass("open")
            $(this).toggleClass("open")

        }
    }

    function selectDefend(player, int, index) {
        let openButtons = document.querySelectorAll(`.open`)
        openButtons.forEach(element => { 
            element.classList.add("hidden-buttons") 
            element.classList.remove("open") 
        })
        party[index].defends = true
        moves.push({ attacker: player, target: "", type: "" })
        playSound(confirmSound)

        if (moves.length == possibleMoves) {
            runFightanimation()
            fightSound.play()
            setTimeout(() => {
                $("div").each(function () {
                    $(this).removeClass("hidden-buttons")
                })
            }, 2500)
        }

    }

    function runFightanimation() {
        $(".selected").removeClass("selected")
        $("#overlay").css({ "z-index": "999" })
        fightanimationRunning = true
        punchSounds.playbackRate = 3
        $("#itembox").hide()
        setTimeout(() => punchSounds.play(), 500)
        Array.from(document.querySelectorAll(".left-party, .right-party")).forEach(element => 
            {
                element.style.animationDelay = `${Math.floor(Math.random() * 250)}ms`
        })
        $(".sprite-container.alive").each(function () {
            if ($(this).hasClass("left-party")) {
                $(this).addClass("animated-character1")
                
            } else {
                $(this).addClass("animated-character2")
            }
        })
        setTimeout(() => {
            $("#overlay").css({ "z-index": "-1" })
            $(".animated-character1").each(function () {
                $(this).removeClass("animated-character1")
            })
            $(".animated-character2").each(function () {
                $(this).removeClass("animated-character2")
            })
            $(".btns-char").each(function () {
                $(this).removeClass("hidden")
            })
            setCharactersDefeated()
        }, 2600)
        setTimeout(() => {
            fightanimationRunning = false
        }, 3000)
        setTimeout(() => {
            $("#battle-ticker").hide()
        }, 4000)
        calculateDamage()
        moves = []
    }

    function setCharactersDefeated() {
        enemyParty.forEach(element => {
            if (element.energy <= 0) {
                $(`#enemy${element.id}`).addClass("defeated")
            }
        })
        party.forEach(element => {
            if (element.energy <= 0) {
                $(`#char${element.id}`).addClass("defeated")
            }
        })
    }

    function setEnemiesDefending() {
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

            if (!element.target.defends) damage = damage * 2

            element.target.energy -= damage

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
        remainingEnemyParty = []
        enemyParty.forEach(enemy => { if (enemy.energy > 0) remainingEnemyParty.push(enemy) })
        $("#battle-ticker").show()
        battleMessages = []
        setEnemiesDefending()
        handlePlayerMoves()
        possibleTargets = []
        party.forEach(element => {
            if (element.energy > 0) {
                possibleTargets.push(element)
            }
        })

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
                let damage = 2 * attack * typeBonus * (100 / (100 + target[defense] * 10))

                if (target.defends) damage = damage / 2

                target.energy -= damage

                if (target.energy <= 0) {
                    setTimeout(() => deathcry.play(), 2500)
                }
            }
            let remainingChars = []
            party.forEach(char => {
                if (char.energy > 0) {
                    remainingChars.push(char)
                }
            })
            possibleMoves = remainingChars.length
            updateEnergybars()
            resetDefending()
        })

        if (remainingEnemyParty.length > 0 && round <= 8){
            setTimeout(()=>$("#itembox").show(),2500)
        }

        if (possibleMoves == 0) {
            setTimeout(() => {
                $("#battle-ticker").hide()
                $("#title-select").show()
                $("#title-select").html(gameOverTemplate)
                $("#itembox").hide()
                bossmusic.pause()
            }, 2500)
        }
        let battleTicker = battleMessages.join(" ")
        $("#battle-ticker").html(battleTicker)
        checkRemainingEnemies()
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
        const remainingEnemies = []
        enemyParty.forEach(element => {
            if (element.energy > 0) remainingEnemies.push(element)
        })

        if (remainingEnemies.length > 0) return

        checkSurvivors()
        round += 1
        disableAttackBtns = true
        setTimeout(() => {
            $("#battle-ticker").hide()
            $("#title-select").show()

            if (round < 9) {
                $("#title-select").html(nextRoundTemplate)
                return
            }

            bossmusic.pause()
            runVictoryAnimation()
            setTimeout(() => {
                victorySound.play()
                cheerSound.play()
            }, 500)
            showConfetti()
            $("#title-select").html(victoryTemplate)
        }, 2600)
    }

    function checkSurvivors() {
        $("#itembox").hide()
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
        setTimeout(()=>$("#itembox").show(),2500)
        $("#bomb-button button").attr('disabled', true)
        $("#bomb-button button").html(`<i class="fas fa-bomb"></i><span style='color:limegreen'>+1</span>`)
        $("#bomb-button").addClass("animated-text")
        $("#item-button button").attr('disabled', true)
        $("#item-button button").html(`${snackIcon}<span style='color:limegreen'>+1</span>`)
        $("#item-button").addClass("animated-text")
        setTimeout(()=>{
            $("#itembox").hide()
            $("#bomb-button button").attr('disabled', false)
            $("#item-button button").attr('disabled', false)
            $("#bomb-button button").html(`<i class="fas fa-bomb"></i>x${bombs}`)
            $("#item-button button").html(`${snackIcon}x${snacks}`)
            $("#bomb-button").removeClass("animated-text")
            $("#item-button").removeClass("animated-text")
        },6000)
    }
    
    function changeBackground() {
        switch (round) {
            case 0: {
                document.getElementById("background").style.backgroundImage = "url('images_schoolfight/background1.jpg')"
                break
            }
            case 2: {
                document.getElementById("background").style.backgroundImage = "url('images_schoolfight/background2.jpg')"
                break
            }
            case 5: {
                $("#running-background").show()
                $("#character-running img").css(eval(`${party[0].class}SpritePosition`))
                break
            }
            case 6: {
                document.getElementById("background").style.backgroundImage = "url('images_schoolfight/background3.jpg')"
                $("#running-background").hide()
                break
            }
            case 8: {
                document.getElementById("background").style.backgroundImage = "url('images_schoolfight/background4.jpg')"
                break
            }
            default: return
        }
    }

    $("body").on("click", "#next-button", startNextRound)

    function startNextRound() {
        activateFade()
        $("#itembox").hide()
        $("#bomb-container-wrapper").hide()
        setTimeout(() => changeBackground(), 500)
        setTimeout(() => {
            showDialogue = true
            disableAttackBtns = false
            $("#dialogue-box-wrapper").show()
            $("#dialogue-box").html(dialogues[round][indexOfMessage])
            $(".sprite-container").each(function () {
                $(this).removeClass("hidden-buttons")
            })
            schoolbell.play()
            party.forEach(element => element.energy = 100)
            enemyParty = setTeams[round]
            enemyParty.forEach((element, index) => {
                element.id = index + 1

                if (element.class === "Dummy") {
                    $(`#energybar-enemy${element.id}`).hide()
                    return
                }

                $(`#energy-enemy${element.id}-text`).html(element.class)
            })
            possibleMoves = 3
            drawEnergybars()
            $(".defeated").each(function () {
                $(this).removeClass("defeated")
            })
            showPlayersprites()
            showEnemysprites()
            $("#next-button").hide()
            document.getElementById("title-select").innerHTML = ""

            if (round == 3) {

                $(".energybar").hide()
                $("#energybar-char3").show()
                $("#rope-skipping-game").show()
                $(".left-party").hide()
                $("#rope-sprite").css(eval(`${party[2].class}SpritePosition`))
            }
            
            if (round == 5) {
                $(".energybar").hide()
                $(".left-party").hide()
            } 
            
            if (round !== 3 && round !== 5) {
                $("#rope-skipping-game").hide()
                $(".left-party").show()
                $(".energybar").show()
            }

            if (round == 8) {
                music.pause()
                $("#energybar-enemy1").hide()
                $("#energybar-enemy3").hide()
            }
        }, 1000)

    }

    function drawEnergybars() {
        for (let i = 0; i <= 2; i++) {
            $(`#energy-char${i + 1}`).css({ 
                "width": party[i].energy + "%", 
                "background": party[i].energy < 30 ? "red" : "green", 
                "display": "block" 
            })
            $(`#energy-enemy${i + 1}`).css({ 
                "width": enemyParty[i].energy + "%", 
                "background": enemyParty[i].energy < 30 ? "red" : "green", 
                "display": "block" 
            })
        }
    }

    function updateEnergybars() {
        for (let i = 0; i <= 2; i++) {
            $(`#energy-char${i + 1}`).css({ 
                "width": party[i].energy + "%", 
                "background": party[i].energy < 30 ? "red" : "green" 
            })
            $(`#energy-enemy${i + 1}`).css({ 
                "width": enemyParty[i].energy + "%", 
                "background": enemyParty[i].energy < 30 ? "red" : "green" 
            })
        }
    }

    $("body").on("click", "#refresh-button", refresh)

    function refresh() {
        window.location.reload()
    }

    function showConfetti() {
        $("#confetti-container").show()
        for (let i = 0; i < 100; i++) {
            let confetti = document.createElement("div")
            confetti.className = "confetti"
            let colorNumber = Math.floor(Math.random() * 360)
            let color = `hsl(${colorNumber}, 50%, 50%)`
            let animationDelay = Math.random() * 20 + "s"
            let xPosition = Math.random() * 100
            $(confetti).css({ 
                "animation-delay": animationDelay, 
                "background-color": color, 
                "left": xPosition + "%" 
            })
            $("#background").append(confetti)
        }
    }

    function showBomb(){
        $("#bomb-container-wrapper").show()
        for (let i = 0; i < 100; i++) {
            let cloud = document.createElement("div")
            cloud.className = "bombcloud"
            let animationDelay = Math.random() * 5 + "s"
            let xPosition = Math.random() * 100
            $(cloud).css({ 
                "animation-delay": animationDelay, 
                "top": "-150px", 
                "left": xPosition - 50 + "px" 
            })
            $("#bomb-container").append(cloud)
        }
        setTimeout(()=>{
            $(".right-party:not(.defeated)").each(function(){
                $(this).addClass("bombed-enemy")
            })
            stinkSound.play()
        },2000)
        setTimeout(()=>{
            $(".right-party").each(function(){
                $(this).removeClass("bombed-enemy")
            })
        },4000)
        setTimeout(()=>{
            $("#bomb-container-wrapper").hide()
        },7000)
    }

    $("body").on("click", "#char1.victory", function(){
            playSound(clapSound)
        }
    )

    $("body").on("click", "#char2.victory", function(){
            playSound(laughSound)
        }
    )

    $("body").on("click", "#char3.victory", function(){
            playSound(screamSound)
        }
    )

    function runVictoryAnimation() {
        $("#char1").css({ "top": "200px", "left": "150px" })
        $("#char2").css({ "top": "200px", "left": "250px" })
        $("#char3").css({ "top": "200px", "left": "350px" })
        $("#char1").addClass("victory")
        $("#char2").addClass("victory")
        $("#char3").addClass("victory")
        setTimeout(function () {
            $(".left-party").each(function () {
                $(this).removeClass("defeated")
            })
        }, 100)
    }

    $("#item-button button").on("click", eatSnack)
    $("#bomb-button button").on("click", throwBomb)

    function eatSnack() {
        if (party.length === 0 || snacks === 0) return

        $(".left-party:not(defeated)").each(function(){
            $(this).addClass("eating-snack")
        })
        setTimeout(()=>{
            $(".left-party:not(defeated)").each(function(){
                $(this).removeClass("eating-snack")
            })
        },1000)
        $("#battle-ticker").html("You had a <span style='color: orange'>snack</span>!<br>30% <span style='color:lightblue'>health</span> recovered")
        $("#battle-ticker").show()
        eatingSound.play()
        $("#itembox").hide()
        snacks -= 1
        party.forEach(char => {
            if (char.energy <= 0) return
            
            char.energy += 30

            if (char.energy > 100) char.energy = 100
        })
        updateEnergybars()
        $("#item-button button").html(`${snackIcon}x${snacks}`)
    }

    function throwBomb() {
        if (bombs <= 0 || enemyParty.length === 0) return

        $("#battle-ticker").html("<span style='color:limegreen'>Stink bomb</span>!<br>Enemies take 20% <span style='color:red'>damage</span>!")
        $("#battle-ticker").show()
        showBomb()
        $("#itembox").hide()
        bombs -= 1
        $("#bomb-button button").html(`${bombIcon}x${bombs}`)
        let remainingEnemies = []
        enemyParty.forEach(enemy => {
            if (enemy.energy <= 0) return
            remainingEnemies.push(enemy)
        })

        if (remainingEnemies.length === 0) return

        enemyParty.forEach(enemy => {
            enemy.energy -= 20
            updateEnergybars()
            checkRemainingEnemies()
            setTimeout(()=>{
                setCharactersDefeated()
            }, 3000)
        })
    }


    $("body").on("click", ".selectscreen-btn", switchSelectscreen)

    function switchSelectscreen() {
        clicksound.play()
        if (selectScreen1) {
            selectScreen1 = false
            $("#select-screen").html(`
        <button class="selectscreen-btn left-btn"><i class="fas fa-angle-left"></i></button>
        <button class="selectscreen-btn right-btn"><i class="fas fa-angle-right"></i></button>
        <div>
            <div class="selectsprite" style="overflow: hidden; width: 60px; height: 100px;">
                <div style="position: relative; height: 100%">

                    <img src="images_schoolfight/Character_spriteSheet.png" style="position: absolute; top: -425px; left: -340px;">
                </div>

            </div>
        </div>
        <div>
            <div class="selectsprite" style="overflow: hidden; width: 60px; height: 100px;">
                <div style="position: relative; height: 100%">
                    <img src="images_schoolfight/Character_spriteSheet.png" style="position: absolute; top: -320px; left: -42px;">
                </div>
            </div>
        </div>
        <div>
            <div class="selectsprite" style="overflow: hidden; width: 60px; height: 100px;">
                <div style="position: relative; height: 100%">
                    <img src="images_schoolfight/Character_spriteSheet.png"
                        style="position: absolute; top: -425px; left: -42px;z-index: 0">
                </div>
            </div>
        </div>
        <div class="desc-box">
            Class: Bully
            <br>
            Type: Strength
            <br>
            Strength: 16
            <br>
            Intelligence: 0
            <br>
            Assholiness: 10
            <br>
            <button class="add-button" character="bully">Add</button>
        </div>
        <div class="desc-box">
            Class: Squealer
            <br>
            Type: Assholiness
            <br>
            Strength: 2
            <br>
            Intelligence: 2
            <br>
            Assholiness: 18
            <br>
            <button class="add-button" character="squealer">Add</button>
        </div>
        <div class="desc-box">
            Class: Nerd
            <br>
            Type: Intelligence
            <br>
            Strenth: 0
            <br>
            Intelligence: 20
            <br>
            Assholiness: 0
            <br>
            <button class="add-button" character="nerd">Add</button>
        </div>`)
        } else {
            selectScreen1 = true
            $("#select-screen").html(`
        <button class="selectscreen-btn left-btn"><i class="fas fa-angle-left"></i></button>
        <button class="selectscreen-btn right-btn"><i class="fas fa-angle-right"></i></button>
        <div>
            <div class="selectsprite" style="overflow: hidden; width: 60px; height: 100px;">
                <div style="position: relative; height: 100%">

                    <img src="images_schoolfight/Character_spriteSheet.png" style="position: absolute; top: -105px; left: -340px;">
                </div>

            </div>
        </div>
        <div>
            <div class="selectsprite" style="overflow: hidden; width: 60px; height: 100px;">
                <div style="position: relative; height: 100%">
                    <img src="images_schoolfight/Character_spriteSheet.png" style="position: absolute; top: -320px; left: -340px;">
                </div>
            </div>
        </div>
        <div>
            <div class="selectsprite" style="overflow: hidden; width: 60px; height: 100px;">
                <div style="position: relative; height: 100%">
                    <img src="images_schoolfight/Character_spriteSheet.png"
                        style="position: absolute; top: -215px; left: -340px;">
                </div>
            </div>
        </div>
        <div class="desc-box">
            Class: Wally
            <br>
            Type: Strength
            <br>
            Strength: 20
            <br>
            Intelligence: 0
            <br>
            Assholiness: 0
            <br>
            <button class="add-button" character="wally">Add</button>
        </div>
        <div class="desc-box">
            Class: Sports Kid
            <br>
            Type: Strength
            <br>
            Strength: 14
            <br>
            Intelligence: 12
            <br>
            Assholiness: 0
            <br>
            <button class="add-button" character="sportskid">Add</button>
        </div>
        <div class="desc-box">
            Class: Rich Kid
            <br>
            Type: Assholiness
            <br>
            Strenth: 0
            <br>
            Intelligence: 12
            <br>
            Assholiness: 14
            <br>
            <button class="add-button" character="richkid">Add</button>
        </div>
        
        `
            )
        }

    }
})

