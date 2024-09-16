const box = document.getElementById("box")
const energyChar3 = document.getElementById("energy-char3")
const girlLeft = document.getElementById("girl-left")
const girlRight = document.getElementById("girl-right")
const clickOverlay = document.getElementById("click-overlay")
const ropeSkips = document.getElementById("rope-skips")
const titleSelect = document.getElementById("title-select")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let moveRopeDownwards = false
let y = 270
let skips = 0
let gamespeed = 100
let characterJumps = false
let points = 0

const failSound = new Audio("wrong.wav")
const girlcry = new Audio("girlcry.mp3")
const deathcry = new Audio("deathcry.wav")

clickOverlay.addEventListener("click", jump)

function moveRope() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.beginPath()
    ctx.moveTo(150, 200)
    ctx.bezierCurveTo(150, y, 400, y, 400, 200)
    ctx.lineWidth = moveRopeDownwards ? 2 : 4
    ctx.stroke()

    if (moveRopeDownwards && y < 280) { 
        y += 2 
    }

    if (!moveRopeDownwards && y > 20) {
        y -= 2
    }

    if (y >= 280 || y <= 80) {
        moveRopeDownwards = !moveRopeDownwards
        skips += .5
        canvas.style.zIndex = moveRopeDownwards ? "1" : "3"
        if (skips % 3 == 0) {
            clearInterval(ropeInterval); gamespeed *= 1.1; ropeInterval = setInterval(moveRope, 1000 / gamespeed)
        } 

        if (y < 240) return
        
        (characterJumps && party[2].energy > 0) ? handleJumpedOverRope() : handleHitByRope() 

    }
}

function jump() {
    if (!characterJumps) {
        characterJumps = true
        box.style.top = "140px"
        setTimeout(() => {
            characterJumps = false
            box.style.top = "170px"
        }, 300)
    }
}

function handleJumpedOverRope() {
    points += 1
    confirmSound.currentTime = 0
    confirmSound.play()
    ropeSkips.innerHTML = `Skips: ${points}/20`

    if (points == 20) {
        round += 1
        girlLeft.classList.add("defeated")
        girlRight.classList.add("defeated")
        clearInterval(ropeInterval)
        girlcry.play()
        titleSelect.style.display = "block"
        titleSelect.innerHTML =
            `You won! <br><br><br><br> <button id="next-button">Next round</button>`
        canvas.style.display = "none"
        clickOverlay.style.display = "none"
    }
}

function handleHitByRope() {
    party[2].energy -= 35
    failSound.currentTime = 0
    failSound.play()
    energyChar3.style.width = party[2].energy + "%"
    if (party[2].energy <= 0) {
        box.classList.add("defeated")
        setTimeout(() => {
            clearInterval(ropeInterval)
            deathcry.play()
            canvas.style.display = "none"
            clickOverlay.style.display = "none"
            titleSelect.style.display = "block"
            titleSelect.innerHTML =
                `You lost...!? <br><br><br><br> <button id="refresh-button">Try again</button>`
        }, 200)
    }
}