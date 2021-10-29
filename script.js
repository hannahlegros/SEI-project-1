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

// global vars to be defined later
let intervalForGame
let spawnHumanInt
let spawnHumanTwoInt
let spawnBoosterInt
let spawnHighBoostInt
let human
let humanTwo
let booster
let highBooster

let humanArray = []
let humanTwoArray = []
let boosterArray = []
let highBoosterArray = []

function Sound(src) {
    this.sound = document.createElement('audio')
    this.sound.src = src
    this.sound.setAttribute('preload', 'auto')
    this.sound.setAttribute('controls', 'none')
    this.sound.style.display = 'none'
    document.body.appendChild(this.sound)
    this.play = function() {
        this.sound.play()
    }
    this.stop = function() {
        this.sound.pause()
    }
}

let boosterSound = new Sound('sounds/booster.mp3')
let losingSound = new Sound('sounds/losingTrumpet.mp3')
let backgroundMusic = new Sound('sounds/arcadebackground.mp3')
let alienImg = new Image()
let humanOneImg = new Image()
let humanTwoImg = new Image()
alienImg.src = ('img/alien.png')
humanOneImg.src = ('img/human1.png')
humanTwoImg.src = ('img/human2.png')

// create alien character using constructor (green)
class Alien {
    constructor(img, x, y, width, height) {
        this.img = img,
        this.x = x,
        this.y = y,
        // this.color = color
        this.width = width,
        this.height = height,
        this.alive = true,
        this.energy = 50,
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
    moveAlien() {
        if (this.y < game.height - 15) {
            this.y -= vy
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
    render = function () {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
         // ctx.fillStyle = this.color
         // ctx.fillRect(this.x, this.y, this.width, this.height)
        energy.innerText = `Energy: ${alien.energy}`
     }
}

// create human characters using constructor (red)
class Human {
    constructor(img, x, y, width, height) {
        this.img = img,
        this.x = x,
        this.y = y,
        // this.color = color,
        this.width = width,
        this.height = height,
        this.alive = true
    }
    // assign steady right to left motion to humans
    moveHuman() {
        if (this.y < (game.height - 21)) {
            this.x = (this.x) - 4
        }
        else {
            this.x = (this.x) - 5
        }
    }
    render = function () {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
        // ctx.fillStyle = this.color
        // ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

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
    moveBooster() {
        if (this.y > game.height - 50) {
            this.x = (this.x) - 6
        }
        else {
            this.x = (this.x) - 5
        }
    }
    render = function () {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

// clear game
const stopGame = () => {
    backgroundMusic.stop()
    ctx.clearRect(0, 0, game.width, game.height)
    startButton.style.visibility = "visible"
    explainGame.style.visibility = "visible"
    explainGame.innerText = "Another round?"
    clearInterval(intervalForGame)
    clearInterval(spawnHumanInt)
    clearInterval(spawnHumanTwoInt)
    clearInterval(spawnBoosterInt)
    clearInterval(spawnHighBoostInt)
    humanArray = []
    humanTwoArray = []
    boosterArray = []
    highBoosterArray = []
    alien.x = 15
    alien.y = (game.height)-27
}

// assign arguments for my alien
let alien = new Alien(alienImg, 15, (game.height) -27, 15, 27)

// have multiple humans at random intervals
function spawnHuman() {
    let human = new Human(humanOneImg, (game.width), (game.height) - 30, 20, 30)
    humanArray.push(human)
}
function spawnHumanTwo() {
    let humanTwo = new Human(humanTwoImg, (game.width), (game.height) - 22, 22, 22)
    humanTwoArray.push(humanTwo)
}

// have multiple boosters at random locations
function spawnBooster() {
    let booster = new Booster((game.width), (game.height) - 25, "gold", 9, 9)
    booster.alive = true
    boosterArray.push(booster)
}
function spawnHighBooster() {
    let highBooster = new Booster((game.width), (game.height) - 150, "gold", 9, 9)
    highBoosterArray.push(highBooster)
}

// create collision detection
// alien hits human: deduct energy points, turn alien red momentarily
const humanHit = () => {
    // let alienFlash = () => {
    //     alien.color = "#148e55"
    // }
    humanArray.forEach(human => {
        if (alien.x < human.x + human.width &&
            alien.x + alien.width > human.x &&
            alien.y < human.y + human.height &&
            alien.y + alien.height > human.y) {
            alien.energy = (alien.energy) - 3
            // alien.color = "red"
            messageBoard.innerText = "Look out!"
            // setTimeout(alienFlash, 400)
        }
    })
    humanTwoArray.forEach(humanTwo => {
        if (alien.x < humanTwo.x + humanTwo.width &&
            alien.x + alien.width > humanTwo.x &&
            alien.y < humanTwo.y + humanTwo.height &&
            alien.y + alien.height > humanTwo.y) {
            alien.energy = (alien.energy) - 4
            // alien.color = "red"
            messageBoard.innerText = "Look out!"
            // setTimeout(alienFlash, 400)
        }
    })
}

// alien hits booster: add energy points, make booster disapper
const gainBooster = () => {
    boosterArray.forEach(booster => {
        if (alien.x < booster.x + booster.width &&
            alien.x + alien.width > booster.x &&
            alien.y < booster.y + booster.height &&
            alien.y + alien.height > booster.y) {
            alien.energy = (alien.energy) + 10
            booster.alive = false
            booster.x = -10
            messageBoard.innerText = "Way to go!"
            boosterSound.play
        }
    })
    highBoosterArray.forEach(highBooster => {
        if (alien.x < highBooster.x + highBooster.width &&
            alien.x + alien.width > highBooster.x &&
            alien.y < highBooster.y + highBooster.height &&
            alien.y + alien.height > highBooster.y) {
            alien.energy = (alien.energy) + 10
            highBooster.alive = false
            highBooster.x = -10
            messageBoard.innerText = "Way to go!"
            boosterSound.play
        }
    })
}

// define winning conditions
// if energy level goes above threshold, you escape!
// define losing conditions
// if energy level goes below threshold, you are captured :(
const winOrLose = () => {
    if (alien.energy >= 100) {
        messageBoard.innerText = "Yay! You escaped the humans!"
        stopGame()
    }
    else if (alien.energy <= 0) {
        messageBoard.innerText = "Oh no...you've been captured."
        stopGame()
        losingSound.play()
    }
}

// game play function
const playGame = () => {
    winOrLose()
    ctx.clearRect(0, 0, game.width, game.height)
    alien.render()
    alien.moveAlien()
    humanArray.forEach(human => {
        human.render()
        human.moveHuman()
    })
    humanTwoArray.forEach(humanTwo =>{
        humanTwo.render()
        humanTwo.moveHuman()
    })
    boosterArray.forEach(booster => {
        booster.render()
        booster.moveBooster()
        if (booster.alive) {
            gainBooster()
        }
    })
    highBoosterArray.forEach(highBooster => {
        highBooster.render()
        highBooster.moveBooster()
        if (highBooster.alive) {
            gainBooster()   
        }
    })
    humanHit()
}

// start/restart button function
const initiateGame = () => {
    backgroundMusic.play()
    startButton.style.visibility = "hidden"
    explainGame.style.visibility = "hidden"
    messageBoard.innerText = "Avoid the humans!"
    alien.energy = 50
    intervalForGame = setInterval(playGame, 60)
    spawnHumanInt = setInterval(spawnHuman, 3000)
    spawnHumanTwoInt = setInterval(spawnHumanTwo, 5740)
    spawnBoosterInt = setInterval(spawnBooster, 4620)
    spawnHighBoostInt = setInterval(spawnHighBooster, 2770)
}

// set event listener for alien motion 
document.addEventListener('keydown', (e) => {
    alien.alienDirection(e.key)
})
document.addEventListener('keyup', (e) => {
    if (['w', 'a', 's', 'd'].includes(e.key)) {
        alien.stopAlienDirection(e.key)
    }
})

// set event listener for 'Play Game' button
startButton.addEventListener('click', initiateGame)