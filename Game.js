var canvas = document.getElementById('canvasId')
var ctx = canvas.getContext('2d')
var height = canvas.clientHeight, width = canvas.clientWidth

const GRAY = "#474747"
const DARK_GRAY = "#303030"

var userBlock = {x: 0, y: 0, height: 30}
var moveStep = 1, jump = false
var time = 1
var middle = width/2-userBlock.height

var mainGameCycle
var platform = {height: 5, width: width}
var enemyes = []

function RunGame(){
    mainGameCycle = setInterval(function(){
        console.log("x: ", userBlock.x, "y: ", userBlock.y)
        if(userBlock.x < middle){
            userBlock.x += moveStep
            Jump()
            Draw()
        } if(userBlock.x == middle){
            Jump()
            Draw()
            RunEnemies()
        }
    },time)
}

function Jump(){
    if(jump){
        userBlock.y += moveStep
        jump = userBlock.y < userBlock.height + userBlock.height/2 ? true : false
    } else if(!jump && userBlock.y > 0)
        userBlock.y -= moveStep
}

function Draw(){
    ctx.clearRect(0, 0, width, height)

    ctx.fillStyle = GRAY
    ctx.fillRect(userBlock.x, height/2-userBlock.y, userBlock.height, userBlock.height)

    ctx.fillStyle = DARK_GRAY
    ctx.fillRect(0, height/2+userBlock.height,
                 platform.width, platform.height)
}

function RunEnemies(){

}

document.addEventListener('keydown', function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which)
    if(event.which == 32 && userBlock.y == 0)
        jump = true
})

RunGame()
