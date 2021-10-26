const game = document.getElementById("canvas")
// save the bottomLeft square as a var for energy level tracker
const energy = document.getElementById("bottomLeft")
// save bottomRight square as var to display messages to player
const messageBoard = document.getElementById("bottomRight")
// velocity on the y axis (for gravity)
const vy = (Math.random() * -10) - 5
// save start button and explain game message field as var
const startButton = document.getElementById("start")
const explainGame = document.getElementById("explain")

game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])
console.log("this is game width:\n", game.width)
console.log("this is game height:\n", game.height)

// get game context and declare it 2d
const ctx = game.getContext('2d')
let raf


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
        this.alive = true,
        this.ctx = ctx
    }
    // assign steady right to left motion to humans
    moveHuman () {
        this.x = (this.x)-4
    }
    create = function () {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
        // ctx.fillStyle = "#730202"
        // ctx.fillRect((game.width), (game.height-20), 20, 20)
    }
}
let human = new Human((game.width), (game.height-20), "#730202", 20, 20)

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

let alien = new Alien(15, (game.height)-15, "#148e55", 15, 15)
// let human = new Human()
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
            alien.energy = (alien.energy)-4
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

// function drawf() {
//     let humanArray1 = []
//     for(let i = 0; i < 5; i++){
//     humanArray1[i] = new Human()}
//     humanArray1[0].ctx.clearRect(0, 0, game.width, game.height)
//     humanArray1.forEach(function(human){
//         human.create()
//     })
// }
        
// function to initiate motion on board, start game
const playGame = () => {
    ctx.clearRect(0, 0, game.width, game.height)
    alien.create()
    alien.moveAlien()
    human.create()
    human.moveHuman()
    // drawf()
    // raf = window.requestAnimationFrame(drawf)
    if(booster.alive){
        booster.create()
        booster.moveBooster()
        gainBooster()
    }
    humanHit()
    winOrLose()
}

const initiateGame = () =>{
    startButton.style.visibility = "hidden"
    explainGame.style.visibility = "hidden"
    const intervalForGame = setInterval(playGame, 50)
    messageBoard.innerText = "Avoid the humans!"
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

// clear game
// restart button
const stopGame = (intervalForGame) => {
    clearInterval(intervalForGame)
    ctx.clearRect(0, 0, game.width, game.height)
    startButton.style.visibility = "visible"
    explainGame.style.visibility = "visible"
    explainGame.innerText = "Another round?"
}

// set event listener for alien motion 
document.addEventListener('keydown', (e) => {
    alien.alienDirection(e.key)
})
document.addEventListener('keyup', (e) => {
    if(['w', 'a', 's', 'd'].includes(e.key)) {
        alien.stopAlienDirection(e.key)
    }
})

// set event listener for 'Play Game' button
document.addEventListener('click', initiateGame)


// have multiple humans at random intervals

// have multiple boosters at random locations
