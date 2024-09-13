const canvas = $("#canvas")[0]
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

$("#click-overlay").click(() => jump())

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
        if (moveRopeDownwards) {
            $(canvas).css({ "z-index": "1" })
        } else { $(canvas).css({ "z-index": "3" }) } if (skips % 3 == 0) {
            clearInterval(ropeInterval); gamespeed *= 1.1; ropeInterval = setInterval(moveRope, 1000 / gamespeed)
        } if (y >= 240) {
            if (characterJumps && party[2].energy > 0) {
                points += 1
                confirmSound.currentTime = 0
                confirmSound.play()
                $("#rope-skips").html(`Skips: ${points}/20`)

                if (points == 20) {
                    round += 1
                    $("#girl-left").addClass("defeated")
                    $("#girl-right").addClass("defeated")
                    clearInterval(ropeInterval)
                    girlcry.play()
                    document.getElementById("title-select").style.display = "block"
                    document.getElementById("title-select").innerHTML =
                        `You won! <br><br><br><br> <button id="next-button">Next round</button>`
                    $("canvas").css({ "display": "none" })
                    $("#click-overlay").css({ "display": "none" })
                }
            } else {
                party[2].energy -= 35
                failSound.currentTime = 0
                failSound.play()
                $("#energy-char3").css({ "width": party[2].energy + "%" })
                if (party[2].energy <= 0) {
                    $("#box").addClass("defeated")
                    setTimeout(() => {
                        clearInterval(ropeInterval)
                        deathcry.play()
                        $("canvas").css({ "display": "none" })
                        $("#click-overlay").css({ "display": "none" })
                        $("#title-select").css({ "display": "block" })
                        $("#title-select").html(
                            `You lost...!? <br><br><br><br> <button id="refresh-button">Try again</button>`)
                    }
                        , 200)
                }
            }
        }
    }
}

function jump() {
    if (!characterJumps) {
        characterJumps = true
        $("#box").css({ "top": "140px" })
        setTimeout(() => {
            characterJumps = false
            $("#box").css({ "top": "170px" })
        }, 300)
    }
}