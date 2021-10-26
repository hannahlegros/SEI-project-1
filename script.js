const game = document.getElementById("canvas")
// save the bottomLeft square as a var for energy level tracker
const energy = document.getElementById("bottomLeft")
// save bottomRight square as var to display messages to player
const messageBoard = document.getElementById("bottomRight")
const vy = (Math.random() * -10) - 5
const gravity = 0.5
game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])
console.log("this is game width:\n", game.width)
console.log("this is game height:\n", game.height)

// get game context and declare it 2d
const ctx = game.getContext('2d')
messageBoard.innerText = "Avoid the humans!"

// create alien character using constructor (green)
class Alien {
    constructor(x, y, color, width, height) {
        this.x = x
		this.y = y
		this.color = color
		this.width = width
		this.height = height
		this.alive = true
        this.energy = 50
        this.direction = {
            up: false,
            left: false,
            down: false,
            right: false
        }
	}
    // assign motion to alien (wasd)
    alienDirection(key) {
        if (key.toLowerCase() == 'w') this.direction.up = true
        if (key.toLowerCase() == 'a') this.direction.left = true
        if (key.toLowerCase() == 's') this.direction.down = true
        if (key.toLowerCase() == 'd') this.direction.right = true
    }
    stopAlienDirection(key) {
        if (key.toLowerCase() == 'w') this.direction.up = false
        if (key.toLowerCase() == 'a') this.direction.left = false
        if (key.toLowerCase() == 's') this.direction.down = false
        if (key.toLowerCase() == 'd') this.direction.right = false
    }
    // define boundaries for alien (edges of the board)
    // also assigning movement to key press event
    // apply gravity force to alien so they return to the ground after "jumping"
    moveAlien () {
        if (this.y < game.height-15) {
            this.y -= vy
            // vy + gravity
        }
        if (this.direction.up) {
            this.y -= 20
        }
        if (this.y <= 0) {
            this.y = 0
        }
        if (this.direction.left) {
            this.x -= 15
        }
        if (this.x <= 0) {
            this.x = 0
        }
        if (this.direction.down) {
            this.y += 15
        }
        if (this.y + this.height >= game.height) {
            this.y = game.height - this.height
        }
        if (this.direction.right) {
            this.x += 15
        }
        if (this.x + this.width >= game.width) {
            this.x = game.width - this.width
        }
    }
    create = function () {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
        energy.innerText = `Energy: ${alien.energy}`
    }
}

// create human characters using constructor (red)
class Human {
    constructor(x, y, color, width, height) {
        this.x = x, 
        this.y = y, 
        this.color = color,
        this.width = width,
        this.height = height,
        this.alive = true
    }
    // assign steady right to left motion to humans
    moveHuman () {
        this.x = (this.x)-4
    }
    create = function () {
        ctx.fillStyle = "#730202"
        ctx.fillRect((game.width), (game.height-20), 20, 20)
        
    }
}
// let human = new Human((game.width), (game.height-20), "#730202", 20, 20)

// create boosters using constructor (yellow)
class Booster {
    constructor(x, y, color, width, height) {
        this.x = x, 
        this.y = y, 
        this.color = color,
        this.width = width,
        this.height = height,
        this.alive = true
    }
    // assign steady right to left motion to boosters
    moveBooster () {
        this.x = (this.x)-5
    }
    create = function () {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

// const randomizer = Math.floor(Math.random(game.height)-9)

let alien = new Alien(15, (game.height)-15, "#148e55", 15, 15)
let booster = new Booster((game.width), (game.height)-20, "gold", 9, 9)
// console.log('this is the alien\n', alien)
// console.log('this is the first human\n', human)

// create collision detection
// alien hits human: deduct energy points, turn alien red momentarily
const humanHit = () => {
    let alienFlash = () =>{
        alien.color = "#148e55"
    }
    if (alien.x < human.x + human.width &&
        alien.x + alien.width > human.x &&
        alien.y < human.y + human.height &&
        alien.y + alien.height > human.y){
            alien.energy = (alien.energy)-2
            alien.color = "red"
            messageBoard.innerText = "Look out!"
            setTimeout(alienFlash, 400)
    }
}

// alien hits booster: add energy points, make booster disapper
const gainBooster = () => {
    if (alien.x < booster.x + booster.width &&
        alien.x + alien.width > booster.x &&
        alien.y < booster.y + booster.height &&
        alien.y + alien.height > booster.y){
            alien.energy = (alien.energy)+10
            booster.alive = false
            messageBoard.innerText = "Way to go!"
    }
}

// clear game
const stopGame = () => {
    clearInterval(intervalForGame)
    ctx.clearRect(0, 0, game.width, game.height)
}

// define winning conditions
// if energy level goes above threshold, you escape!
// define losing conditions
// if energy level goes below threshold, you are captured :(
const winOrLose = () => {
    if (alien.energy >= 100){
        messageBoard.innerText = "Yay! You escaped the humans!"
        stopGame()
    }
    else if (alien.energy < 0){
        messageBoard.innerText = "Oh no...you've been captured."
        stopGame()
    }
}

let humanArray1 = []
for(let i = 0; i < 5; i++){
    humanArray1[i] = new Human()
}
function drawf() {
    let ctxd = game.getContext('2d')
    console.log(ctxd)
    humanArray1[0].ctxd.clearRect(0, 0, game.width, game.height)
    humanArray1.forEach(function(human){
        human.create()
        raf = window.requestAnimationFrame(drawf)
    })
}

// function to initiate motion on board, start game
const playGame = () => {
    ctx.clearRect(0, 0, game.width, game.height)
    alien.create()
    alien.moveAlien()
    drawf()
    console.log(human)
    // while(alien.alive){
    //     window.setInterval(() =>{
    //         human.create(), 5000})
    // }
    // setInterval(humanInterval, 1000)
    human.moveHuman()
    if(booster.alive){
        booster.create()
        booster.moveBooster()
        gainBooster()
    }
    humanHit()
    winOrLose()
}

energy.innerText = `Energy: ${alien.energy}`

const intervalForGame = setInterval(playGame, 50)
// const humanInterval = setInterval(human.create, 1000)

// set event listener for alien motion 
document.addEventListener('keydown', (e) => {
    alien.alienDirection(e.key)
})
document.addEventListener('keyup', (e) => {
    if(['w', 'a', 's', 'd'].includes(e.key)) {
        alien.stopAlienDirection(e.key)
    }
})


// have multiple humans at random intervals

// have multiple boosters at random locations

// restart button




// const randomNumber = () => {
//     return ((Math.floor(Math.random)) * 5) * 200
// }
// console.log("this is a random number:\n", randomNumber())
// setTimeout(human.create, randomNumber())