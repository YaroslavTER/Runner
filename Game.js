var canvas = document.getElementById('canvasId')
var ctx = canvas.getContext('2d')
var height = canvas.clientHeight, width = canvas.clientWidth

const GRAY = "#474747"
const DARK_GRAY = "#303030"

var defBlockHeight = 30

var userBlock = {x: 0, y: 0, height: defBlockHeight}
var jumpCoef = 2, isJump = false
var time = 1
var middle = width/2-userBlock.height

var mainGameCycle
var isBegin = false
var run = false
var platform = {height: 2.5, width: width}

var enemies = []
var minDistance = 1, maxDistance = 50

function RunGame(){
    mainGameCycle = setInterval(function(){
        console.log("x: ", userBlock.x, "y: ", userBlock.y)
        if(userBlock.x < middle){
            userBlock.x++
            Jump()
            Draw()
            if(userBlock.x + 1 == middle)
                GenerateEnemies()
        } if(userBlock.x == middle){
            Jump()
            Draw()
            RunEnemies()
            IsCollision()
        }
    },time)
}

function Jump(){
    if(isJump){
        userBlock.y += jumpCoef
        isJump = userBlock.y < userBlock.height*2 +
                               userBlock.height/2 ? true : false
    } else if(!isJump && userBlock.y > 0){
        if(!IsCollision())
            userBlock.y -= jumpCoef
    }
}

function IsCollision(){
    var isCollision = false
    for(var enemy of enemies){
        if(userBlock.y == enemy.y + enemy.height && 
           userBlock.x >= enemy.x - enemy.height &&
           userBlock.x <= enemy.x + enemy.height)
            isCollision = true
    }
    return isCollision
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
            console.log(enemy.x)
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
        if(!isBegin){
            RunGame()
            isBegin = true
        } else isJump = true
    }
})
