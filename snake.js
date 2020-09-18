const base = require('./base')
// const { prop } = require('./base')
Object.getOwnPropertyNames(base).map(p => global[p] = base[p]) // Helper function to invoke 'map' function from base without explicitly stating 'base.map'

// Constants for direction & velocity
const NORTH = { x: 0, y:-1 }
const SOUTH = { x: 0, y: 1 }
const EAST  = { x: 1, y: 0 }
const WEST  = { x:-1, y: 0 }

// Point operations, checking for equality
const pointEq = p1 => p2 => p1.x == p2.x && p1.y == p2.y // Alternative possibly better implementation: const pointEq = deepEq

// Random position within grid
const rndPos = table => ({
  x: rnd(0)(table.cols - 1),
  y: rnd(0)(table.rows - 1)
})

// Booleans - given the next move and the current state, will snake...
const willEat = state => pointEq(nextHead(state))(state.apple)
const willCrash = state => state.snake.find(pointEq(nextHead(state)))
const validMove = move => state => // if move is valid given the state
  state.moves[0].x + move.x != 0 || state.moves[0].y + move.y != 0 // Next move + current direction != 0 
// i.e. opposite direction input is invalid, to prevent snake crashing into itself

// Next values based on state
const nextMoves = state => state.moves.length > 1 ? dropFirst(state.moves) : state.moves // Drops the first move from queue, else snake retains state (move) if no input
const nextHead  = state => state.snake.length == 0 
  ? { x: 2, y: 2 } // default start position of snake; fixed here for debugging convenience. For random spawn, use rndPos(state)
  : {
    x: mod(state.cols)(state.snake[0].x + state.moves[0].x), // Updates position of snake head in direction of travel
    y: mod(state.rows)(state.snake[0].y + state.moves[0].y) // Modulo is used for computing position so snake can warp to opposite side if it reaches edge of tiles 
  }
const nextApple = state => willEat(state) ? rndPos(state) : state.apple // if snake given current state will eat apple, spawn new apple in random pos, else retain apple
const nextSnake = state => willCrash(state) // Manipulates snake array whereby foremost and last elements are added/removed to simulate movement & growth
  ?
  [] // If snake will crash, next state will contain snake with empty array i.e reset snake
  :
  (willEat(state) ?
    [nextHead(state)].concat(state.snake) // If eat, adds new "head", shifts existing elements in snake backwards
    :
    [nextHead(state)].concat(dropLast(state.snake))) // Else, add new head but also remove tail to preserve length

// Initial state, takes null arguments, returns an object
const initialState = () => ({
  cols:  20,
  rows:  14,
  moves: [EAST], // Snake moves right by default at start
  snake: [],
  apple: { x: 16, y: 2 }, // Can be changed to random position, placed here for debugging convenience
})

// Next computes next state given the existing state
const next = state => ({
  rows: prop('rows')(state),
  cols: prop('cols')(state),
  moves: nextMoves(state),
  snake: nextSnake(state),
  apple: nextApple(state),
}) 

// Takes current state and move input, verifies if move is valid. Uses stacks to queue command input
const enqueue = (state, move) => validMove(move)(state)
  ? merge(state)({ moves: state.moves.concat([move]) }) // merges current state with the array of new (valid) moves
  : state // if invalid move, state remains unchanged

module.exports = { EAST, NORTH, SOUTH, WEST, initialState, enqueue, next, }
