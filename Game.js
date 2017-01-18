var canvas = document.getElementById('canvasId')
var ctx = canvas.getContext('2d')
var height = canvas.clientHeight, width = canvas.clientWidth

const GRAY = "rgb(71,71,71)"
const DARK_GRAY = "rgb(48,48,48)"

const MIN_VALUE = 71
const MAX_VALUE = 255

var defBlockHeight = 30
var userBlock = {x: 0, y: 0, color: MIN_VALUE, height: defBlockHeight}

var jumpCoef = 2.5, isJump = false
var jumpLimit = userBlock.height * 2 + userBlock.height / 2
var limitIsChanged = false

var time = 1
var middle = width / 2 - userBlock.height

var mainGameCycle
var isBegin = false
var run = false
var runCounter = 0
var score = 0

var platform = {height: 2.5, width: width}

var enemies = []
var minDistance = 1, maxDistance = 50

function RunGame() {
    mainGameCycle = setInterval(function() {
        if(runCounter == 1) {
            if(userBlock.x < middle) {
                userBlock.x++
                Jump()
                Draw()
                console.log("jumpLimit: ", jumpLimit)
                if(userBlock.x + 1 == middle)
                    GenerateEnemies()
            } if(userBlock.x == middle) {
                Jump()
                Draw()
                RunEnemies()
                IsCollision()
                isSideCollision()
                if(userBlock.y == 0 && userBlock.x % 2 == 0 &&
                                       userBlock.color > MIN_VALUE)
                    userBlock.color--
                console.log("jumpLimit: ", jumpLimit)
            }
        }
    },time)
}

function Jump() {
    if(isJump) {
        userBlock.y += jumpCoef
        isJump = userBlock.y < jumpLimit ? true : false
    } else if(!isJump && userBlock.y > 0) {
        if(!IsCollision()) {
            userBlock.y -= jumpCoef
            if(limitIsChanged) {
                jumpLimit -= defBlockHeight
                limitIsChanged = false
            }
        }
    }
}

function IsCollision() {
    var isCollision = false
    for(var enemy of enemies) {
        if(userBlock.y == enemy.y + enemy.height &&
           userBlock.x >= enemy.x - enemy.height + 1 &&
           userBlock.x <= enemy.x + enemy.height - 1) {
            isCollision = true
            if(!limitIsChanged) {
                jumpLimit += defBlockHeight
                limitIsChanged = true
            }
            score += 0.5
            if(userBlock.x % 2 == 0 && userBlock.color < MAX_VALUE)
                userBlock.color++
            document.getElementById("scoreId").innerHTML = "" + score
            console.log("on box")
        }
    }
    return isCollision
}

function isSideCollision() {
    for(var enemy of enemies) {
        if(userBlock.x == enemy.x - enemy.height + 1 &&
           userBlock.y >= enemy.y - enemy.height + 1 &&
           userBlock.y <= enemy.y + enemy.height - 1) {
            runCounter++
            console.log("side collision")
        }
    }
}

function Draw() {
    ctx.clearRect(0, 0, width, height)

    ctx.fillStyle = "rgb(" + userBlock.color + ", 71, 71)"
    ctx.fillRect(userBlock.x, height/2-userBlock.y,
                 userBlock.height, userBlock.height)

    for(var enemy of enemies)
        DrawBlock(enemy, GRAY)

    ctx.fillStyle = DARK_GRAY
    ctx.fillRect(0, height/2+userBlock.height,
                 platform.width, platform.height)
}

function DrawBlock(inputBlock, color) {
    ctx.fillStyle = color
    ctx.fillRect(inputBlock.x, height/2-inputBlock.y,
                 inputBlock.height, inputBlock.height)
}

function RunEnemies() {
    for(var enemy of enemies) {
        enemy.x--
        if(enemy.x == -height) {
            enemy.x = GenerateDistance()
        }
    }
}

function GenerateEnemies() {
    var numberOfEnemies = 5
    var enemyCounter = 0
    while(enemyCounter < numberOfEnemies) {
        enemies.push({x: GenerateDistance(), y: 0, height: defBlockHeight})
        enemyCounter++
    }
}

function GenerateDistance() {
    return width + defBlockHeight*GetRandInRange(minDistance, maxDistance)
}

function GetRandInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function ClearEnemies() {
    while(enemies.length > 0) {
        enemies.pop()
    }
    console.log(enemies.length)
}

function RestartGame() {
    score = 0
    userBlock.x = 0
    userBlock.y = 0
    userBlock.color = MIN_VALUE
    ClearEnemies()
    clearInterval(mainGameCycle)
    RunGame()
}

Draw()

document.addEventListener('keydown', function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which)
    if(event.which == 32) {
        if(runCounter == 0) {
            RunGame()
            runCounter++
        } else if(runCounter == 2) {
            console.log()
            RestartGame()
            runCounter = 1
        } else if(userBlock.y == 0 || IsCollision()) isJump = true
        console.log("runCounter: ",runCounter)
        console.log("space")
    }
    console.log(event.which)
})
