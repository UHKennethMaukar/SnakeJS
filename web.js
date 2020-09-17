const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// Mutable "global" state
let state = initialState()

// Position helpers; constant variables to minimize code duplication
const x = c => Math.round(c * canvas.width / state.cols)
const y = r => Math.round(r * canvas.height / state.rows)

// Game loop draw
const draw = () => {
  // clears canvas
  ctx.fillStyle = '#232323'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // draw snake
  ctx.fillStyle = 'rgb(0,200,50)'
  state.snake.map(p => ctx.fillRect(x(p.x), y(p.y), x(1), y(1))) // Maps a function over snake which is an array of positions

  // draw apples
  ctx.fillStyle = 'rgb(255,50,0)'
  ctx.fillRect(x(state.apple.x), y(state.apple.y), x(1), y(1))

  // add crash visual effect
  if (state.snake.length == 0) {
    ctx.fillStyle = 'rgb(255,0,0)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
}

// Game loop update
const step = t1 => t2 => { //Step keeps track of time using timestamps t1 & t2
  if (t2 - t1 > 100) { //100ms
    state = next(state) //updates global state given current state
    draw()
    window.requestAnimationFrame(step(t2))
  } else {
    window.requestAnimationFrame(step(t1)) //do not update state and keep using t1 as reference time stamp
  }
}

// Key events for player control
window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'w': case 'ArrowUp':    state = enqueue(state, NORTH); break
    case 'a': case 'ArrowLeft':  state = enqueue(state, WEST);  break
    case 's': case 'ArrowDown':  state = enqueue(state, SOUTH); break
    case 'd': case 'ArrowRight': state = enqueue(state, EAST);  break
  }
})

// Main - Initiates
window.requestAnimationFrame(step(0)) // Initiates game loop on start
