const game = document.getElementById("canvas")
// save the bottomLeft square as a var for energy level tracker
const energy = document.getElementById("bottomLeft")
// save bottomRight square as var to display messages to player
const messageBoard = document.getElementById("bottomRight")

game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])
// console.log("this is game width:\n", game.width)
// console.log("this is game height:\n", game.height)

// get game context and declare it 2d
const ctx = game.getContext('2d')

// create alien character using constructor (green)
class Alien {
    constructor(x, y, color, width, height) {
        this.x = x
		this.y = y
		this.color = color
		this.width = width
		this.height = height
		this.alive = true
        this.energy = energy
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
    moveAlien () {
        if (this.direction.up) {
            this.y -= 15
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
        ctx.fillStyle = this.color
		ctx.fillRect(this.x, this.y, this.width, this.height)
	}
}
let alien = new Alien(15, (game.height)-15, "#148e55", 15, 15)
// console.log('this is the alien\n', alien)

alien.render()

// set event listener for alien motion 
document.addEventListener('keydown', (e) => {
    alien.alienDirection(e.key)
})
document.addEventListener('keyup', (e) => {
    if(['w', 'a', 's', 'd'].includes(e.key)) {
        alien.stopAlienDirection(e.key)
    }
})

    // apply gravity force to alien so they return to the ground after "jumping"
// create human characters using constructor (red)
    // have multiple humans at random intervals
    // assign steady right to left motion to humans
// create boosters using constructor (yellow)
    // have multiple boosters at random locations
    // assign steady right to left motion to boosters
// create collision detection
    // alien hits human: deduct energy points, turn alien red momentarily
    // alien hits booster: add energy points, make booster disapper
// define winning conditions
    // if energy level goes above threshold, you escape!
        // clear humans and boosters
// define losing conditions
    // if energy level goes below threshold, you are captured :(
        // humans take you away
// restart button