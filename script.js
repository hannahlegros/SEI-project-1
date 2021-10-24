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


// set event listener for alien motion 
// assign basic motion to alien (wasd)
// define boundaries for alien (edges of the board)
// apply gravity force to alien so they return to the ground after "jumping"
// create human characters using constructor (red)
// assign steady right to left motion to humans
// create boosters using constructor (yello)
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