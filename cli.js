// Command line interface implementation, for initial reference & testing
const readline = require('readline');
const base     = require('./base')

// Mutable state
let State = initialState()

// Matrix operations, note this is not an actual array
const Matrix = {
  make:      table => rep(rep('.')(table.cols))(table.rows),
  set:       val   => pos => adjust(pos.y)(adjust(pos.x)(k(val))), // See code below for original and more detailed implementation, improved to avoid mutation
  /* set:       val   => pos => matrix => { // Produces a new matrix containing updated values at specific positions
    matrix[pos.y][pos.x] = val
    return matrix
  }*/ 
  addSnake:  state => pipe(...map(Matrix.set('X'))(state.snake)), // Given some state, produces a pipeline which spreads the result of mapping the value 'X' over the snake
  addApple:  state => Matrix.set('o')(state.apple),
  addCrash:  state => state.length == 0 ? map(map(k('#'))) : id, // To visualize a crash with the matrix being filled with #, else return id function
  toString:  xsxs  => xsxs.map(xs => xs.join(' ')).join('\r\n'), // An array of an array of X's i.e. there is an outer and inner array, for visual representation of game grid
  fromState: state => pipe(
    Matrix.make,
    Matrix.addSnake(state),
    Matrix.addApple(state),
    Matrix.addCrash(state),
  )(state)
}

// Constants for direction & velocity
const NORTH = { x: 0, y:-1 }
const SOUTH = { x: 0, y: 1 }
const EAST  = { x: 1, y: 0 }
const WEST  = { x:-1, y: 0 }

// Key events for player control
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') process.exit() // 'Ctrl + c' to exit
  switch (key.name.toUpperCase()) {
    case 'W': case 'K': case 'UP':    State = enqueue(State, NORTH); break
    case 'A': case 'H': case 'LEFT':  State = enqueue(State, WEST);  break
    case 'S': case 'J': case 'DOWN':  State = Snake.enqueue(State, SOUTH); break
    case 'D': case 'L': case 'RIGHT': State = Snake.enqueue(State, EAST);  break
  }
});

// Game loop
const show = () => console.log(pipe(Matrix.fromState, Matrix.toString)(State)) 
const step = () => State = next(State)

// Main
setInterval(() => { step(); show() }, 100)
