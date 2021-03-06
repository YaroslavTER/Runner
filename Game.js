var canvas = document.getElementById('canvasId')
var ctx = canvas.getContext('2d')
var height = canvas.clientHeight, width = canvas.clientWidth

const GRAY = "rgb(71,71,71)"
const DARK_GRAY = "rgb(48,48,48)"

const MIN_VALUE = 71
const MAX_VALUE = 255

const MIN_ENEMIES_NUMBER = 5
const MAX_ENEMIES_NUMBER = 20

const MIN_TIME = 1
const MAX_TIME = 6

var defBlockHeight = 30
var userBlock = {x: 0, y: 0, color: MIN_VALUE, height: defBlockHeight}

var jumpCoef = 2.5, isJump = false
var jumpLimit = userBlock.height * 2 + userBlock.height / 2
var limitIsChanged = false

var time = MAX_TIME
var middle = width / 2 - userBlock.height
var distanceTraveled = 0, distanceTraveledToDrop = 5000

var mainGameCycle
var isBegin = false
var run = false
var runCounter = 0
var score = 0

var platform = {height: 2.5, width: width}

var numberOfEnemies = MIN_ENEMIES_NUMBER, growCoef = 2
var enemies = []
var minDistance = 1, maxDistance = 50

function RunGame() {
    mainGameCycle = setInterval(function() {
        if(runCounter == 1) {
            if(userBlock.x < middle) {
                MovingBeforeMiddle()
            } if(userBlock.x == middle) {
                MovingAfterMiddle()
            }
            ComplexityManager()
        }
    },time)
}

function MovingBeforeMiddle() {
    userBlock.x++
    Jump()
    Draw()
    if(userBlock.x + 1 == middle)
        GenerateEnemies()
}

function MovingAfterMiddle() {
    Jump()
    Draw()
    RunEnemies()
    IsCollision()
    isSideCollision()
    if(userBlock.y == 0 && userBlock.color > MIN_VALUE)
        userBlock.color--
}

function ComplexityManager() {
    if(time > MIN_TIME && (distanceTraveled == distanceTraveledToDrop/2 ||
                           distanceTraveled == distanceTraveledToDrop)) {
        time--
        console.log("speedUp")
    }
    if(distanceTraveled == distanceTraveledToDrop) {
        if(enemies.length < MAX_ENEMIES_NUMBER) {
            AddEnemies(growCoef)
            console.log("numberOfEnemies: ", enemies.length)
        }
        distanceTraveled = 0
    } else distanceTraveled++
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
            if(userBlock.color < MAX_VALUE)
                userBlock.color++
            DescribeScore()
        }
    }
    return isCollision
}

function DescribeScore() {
    document.getElementById("scoreId").innerHTML = "" + score
}

function isSideCollision() {
    for(var enemy of enemies) {
        if(userBlock.x == enemy.x - enemy.height + 1 &&
           userBlock.y >= enemy.y - enemy.height + 1 &&
           userBlock.y <= enemy.y + enemy.height - 1) {
            runCounter++
            return
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
    var enemyCounter = 0
    while(enemyCounter < MIN_ENEMIES_NUMBER) {
        AddEnemies(1)
        enemyCounter++
    }
}

function AddEnemies(numberToAdd) {
    var addCounter = 0
    while(addCounter < numberToAdd) {
        enemies.push({x: GenerateDistance(), y: 0, height: defBlockHeight})
        addCounter++
    }
}

function GenerateDistance() {
     return enemies.length == 0 ? distance = width + defBlockHeight
                                : width + defBlockHeight*
                                          GetRandInRange(minDistance,
                                                         maxDistance);
}

function GetRandInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function ClearEnemies() {
    while(enemies.length > 0) {
        enemies.pop()
    }
}

function RestartGame() {
    score = 0
    userBlock.x = 0
    userBlock.y = 0
    userBlock.color = MIN_VALUE
    time = MAX_TIME
    distanceTraveled = 0
    ClearEnemies()
    clearInterval(mainGameCycle)
    DescribeScore()
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
            RestartGame()
            runCounter = 1
        } else if(userBlock.y == 0 || IsCollision())
            isJump = true
    }
})
