var canvas = document.getElementById('canvasId')
var ctx = canvas.getContext('2d')
var height = canvas.clientHeight, width = canvas.clientWidth

const GRAY = "#474747"
const DARK_GRAY = "#303030"

var userBlock = {x: 0, y: 0, height: 30}
var moveStep = 1
var time = 1
var middle = width/2-userBlock.height

var mainGameCycle
var platform = {height: 5, width: width}
var enemyes = []

function Draw(){
    ctx.clearRect(0, 0, height, width)

    ctx.fillStyle = GRAY
    ctx.fillRect(userBlock.x, height/2-userBlock.y, userBlock.height, userBlock.height)

    ctx.fillStyle = DARK_GRAY
    ctx.fillRect(0, height/2+userBlock.height,
                 platform.width, platform.height)
}

mainGameCycle = setInterval(function(){
    if(userBlock.x <= middle){
        userBlock.x += moveStep
        Draw()
    }
},time)
