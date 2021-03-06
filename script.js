// GAME VARIABLES

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
energy.style.visibility = "hidden"
messageBoard.style.visibility = "hidden"

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

// image and sound vars
let boosterSound = new Sound("sounds/collectcoin.mp3")
let losingSound = new Sound("sounds/losingTrumpet.mp3")
let backgroundMusic = new Sound("sounds/arcadebackground.mp3")
let winningSound = new Sound ("sounds/winning.mp3")
let collisionSound = new Sound("sounds/collision.mp3")
let alienImg = new Image()
let humanOneImg = new Image()
let humanTwoImg = new Image()
let boosterImg = new Image()
alienImg.src = ("img/alien.png")
humanOneImg.src = ("img/human1.png")
humanTwoImg.src = ("img/human2.png")
boosterImg.src = ("img/boostercoin.png")

// FUNCTION TO RUN BACKGROUND NOISES
function Sound(src) {
    this.sound = document.createElement("audio")
    this.sound.src = src
    this.sound.setAttribute("preload", "auto")
    this.sound.setAttribute("controls", "none")
    this.sound.style.display = "none"
    document.body.appendChild(this.sound)
    this.play = function() {
        this.sound.play()
    }
    this.stop = function() {
        this.sound.pause()
    }
}

// CONSTRUCTOR CLASSES

// create constructor for alien, main character
class Alien {
    constructor(img, x, y, width, height) {
        this.img = img,
        this.x = x,
        this.y = y,
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
        energy.innerText = `Energy: ${alien.energy}`
     }
}

// create human characters using constructor, bad guys
class Human {
    constructor(img, x, y, width, height) {
        this.img = img,
        this.x = x,
        this.y = y,
        this.width = width,
        this.height = height,
        this.alive = true
    }
    // assign steady right to left motion to humans
    moveHuman() {
        if (this.y < (game.height - 29)) {
            this.x = (this.x) - 3
        }
        else {
            this.x = (this.x) - 5
        }
    }
    render = function () {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
}

// create boosters using constructor, yellow coins to gain energy
class Booster {
    constructor(img, x, y, width, height) {
        this.img = img,
        this.x = x,
        this.y = y,
        this.width = width,
        this.height = height,
        this.alive = true
    }
    // assign steady right to left motion to boosters
    moveBooster() {
        if (this.y > game.height - 50) {
            this.x = (this.x) - 4
        }
        else {
            this.x = (this.x) - 6
        }
    }
    render = function () {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
}

// GAME FUNCTIONS

// clear game when win/lose conditions are met 
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

// define winning conditions
// if energy level goes above threshold, you escape!
// define losing conditions
// if energy level goes below threshold, you are captured :(
const winOrLose = () => {
    if (alien.energy >= 100) {
        messageBoard.innerText = "Yay!! You escaped!!"
        stopGame()
        winningSound.play()
    }
    else if (alien.energy <= 0) {
        messageBoard.innerText = "Oh no...you've been captured."
        stopGame()
        losingSound.play()
    }
}

// assign attributes for alien
let alien = new Alien(alienImg, 15, (game.height) -27, 15, 27)

// assign attributes to humans and multiply them
function spawnHuman() {
    let human = new Human(humanOneImg, (game.width), (game.height) - 30, 20, 30)
    humanArray.push(human)
}
function spawnHumanTwo() {
    let humanTwo = new Human(humanTwoImg, (game.width), (game.height) - 27, 24, 27)
    humanTwoArray.push(humanTwo)
}

// assign attributes to boosters and multiply them
function spawnBooster() {
    let booster = new Booster(boosterImg, (game.width), (game.height) - 25, 9, 9)
    boosterArray.push(booster)
}
function spawnHighBooster() {
    let highBooster = new Booster(boosterImg, (game.width), (game.height) - 150, 9, 9)
    highBoosterArray.push(highBooster)
}

// create collision detection
// alien hits human: deduct energy points, turn alien red momentarily
const humanHit = () => {
    humanArray.forEach(human => {
        if (alien.x < human.x + human.width &&
            alien.x + alien.width > human.x &&
            alien.y < human.y + human.height &&
            alien.y + alien.height > human.y) {
            alien.energy = (alien.energy) - 3
            messageBoard.innerText = "Look out!"
            collisionSound.play()
        }
    })
    humanTwoArray.forEach(humanTwo => {
        if (alien.x < humanTwo.x + humanTwo.width &&
            alien.x + alien.width > humanTwo.x &&
            alien.y < humanTwo.y + humanTwo.height &&
            alien.y + alien.height > humanTwo.y) {
            alien.energy = (alien.energy) - 4
            messageBoard.innerText = "Look out!"
            collisionSound.play()
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
            boosterSound.play()
        }
    })
    highBoosterArray.forEach(highBooster => {
        if (alien.x < highBooster.x + highBooster.width &&
            alien.x + alien.width > highBooster.x &&
            alien.y < highBooster.y + highBooster.height &&
            alien.y + alien.height > highBooster.y) {
            alien.energy = (alien.energy) + 5
            highBooster.alive = false
            highBooster.x = -10
            messageBoard.innerText = "Way to go!"
            boosterSound.play()
        }
    })
}

// game play function (loops through due to assigned interval in initiateGame func)
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

// start/restart button function (called from event listener)
const initiateGame = () => {
    backgroundMusic.play()
    startButton.style.visibility = "hidden"
    explainGame.style.visibility = "hidden"
    energy.style.visibility = "visible"
    messageBoard.style.visibility = "visible"
    messageBoard.innerText = "Avoid the humans!"
    alien.energy = 50
    intervalForGame = setInterval(playGame, 70)
    spawnHumanInt = setInterval(spawnHuman, 3490)
    spawnHumanTwoInt = setInterval(spawnHumanTwo, 6740)
    spawnBoosterInt = setInterval(spawnBooster, 4620)
    spawnHighBoostInt = setInterval(spawnHighBooster, 2770)
}

// EVENT LISTENERS

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