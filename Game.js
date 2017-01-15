var canvas = document.getElementById('canvasId')
var ctx = canvas.getContext('2d')
var height = canvas.clientHeight, width = canvas.clientWidth

const GRAY = "#474747"
const DARK_GRAY = "#303030"

var defBlockHeight = 30
var userBlock = {x: 0, y: 0, color: GRAY, height: defBlockHeight}

var jumpCoef = 2.5, isJump = false
var jumpLimit = userBlock.height*2 + userBlock.height
var jumpLimit_ = jumpLimit + defBlockHeight
var limitIsChanged = false

var time = 1
var middle = width/2-userBlock.height

var mainGameCycle
var isBegin = false
var run = false
var runCounter = 0
var score = 0

var platform = {height: 2.5, width: width}

var enemies = []
var minDistance = 1, maxDistance = 50

function RunGame(){
    mainGameCycle = setInterval(function(){
        if(runCounter == 1){
            if(userBlock.x < middle){
                userBlock.x++
                Jump()
                Draw()
                console.log("jumpLimit: ", jumpLimit)
                if(userBlock.x + 1 == middle)
                    GenerateEnemies()
            } if(userBlock.x == middle){
                Jump()
                Draw()
                RunEnemies()
                IsCollision()
                isSideCollision()
                console.log("jumpLimit: ", jumpLimit)
            }
        }
    },time)
}

function Jump(){
    if(isJump){
        userBlock.y += jumpCoef
        isJump = userBlock.y < jumpLimit ? true : false
    } else if(!isJump && userBlock.y > 0){
        if(!IsCollision()){
            userBlock.y -= jumpCoef
            if(limitIsChanged){
                jumpLimit -= defBlockHeight
                limitIsChanged = false
            }
        }
    }
}

function IsCollision(){
    var isCollision = false
    for(var enemy of enemies){
        if(userBlock.y == enemy.y + enemy.height &&
           userBlock.x >= enemy.x - enemy.height &&
           userBlock.x <= enemy.x + enemy.height){
            isCollision = true
            if(!limitIsChanged){
                jumpLimit += defBlockHeight
                limitIsChanged = true
            }
            score += 0.5
            document.getElementById('scoreId').innerHTML = '' + score
            console.log("on box")
        }
    }
    return isCollision
}

function isSideCollision(){
    for(var enemy of enemies){
        if(userBlock.x == enemy.x - enemy.height + 1 &&
            userBlock.y >= enemy.y - enemy.height + 1 &&
            userBlock.y <= enemy.y + enemy.height - 1){
            runCounter++
            console.log("side collision")
        }
    }
}

function Draw(){
    ctx.clearRect(0, 0, width, height)

    DrawBlock(userBlock, GRAY)

    for(var enemy of enemies)
        DrawBlock(enemy, GRAY)

    ctx.fillStyle = DARK_GRAY
    ctx.fillRect(0, height/2+userBlock.height,
                 platform.width, platform.height)
}

function DrawBlock(inputBlock, color){
    ctx.fillStyle = color
    ctx.fillRect(inputBlock.x, height/2-inputBlock.y,
                 inputBlock.height, inputBlock.height)
}

function RunEnemies(){
    for(var enemy of enemies){
        enemy.x--
        if(enemy.x == -height){
            enemy.x = GenerateDistance()
        }
    }
}

function GenerateEnemies(){
    var numberOfEnemies = 5
    var enemyCounter = 0
    while(enemyCounter < numberOfEnemies){
        enemies.push({x: GenerateDistance(), y: 0, height: defBlockHeight})
        enemyCounter++
    }
}

function GenerateDistance(){
    return width + defBlockHeight*GetRandInRange(minDistance, maxDistance)
}

function GetRandInRange(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min
}

Draw()

document.addEventListener('keydown', function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which)
    if(event.which == 32 && (userBlock.y == 0 || IsCollision())){
        if(runCounter == 0){
            RunGame()
            runCounter++
        } else isJump = true
    }
})
