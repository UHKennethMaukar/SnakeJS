// Note the 'Currying' in the Js codebase, to facilitate use of pure functions
const adjust    = n => f => xs => mapi(x => i => i == n ? f(x) : x)(xs) // Runs function f at index n of the x's
const dropFirst = xs => xs.slice(1)
const dropLast  = xs => xs.slice(0, xs.length - 1)
const id        = x => x
const k         = x => y => x
const map       = f => xs => xs.map(f) // Replaces all elements within an array with that of the input f
const mapi      = f => xs => xs.map((x, i) => f(x)(i))
const merge     = o1 => o2 => Object.assign({}, o1, o2)
const mod       = x => y => ((y % x) + x) % x // http://bit.ly/2oF4mQ7
const objOf     = k => v => ({ [k]: v })
const pipe      = (...fns) => x => [...fns].reduce((acc, f) => f(acc), x)
const prop      = k => o => o[k]
const range     = n => m => Array.apply(null, Array(m - n)).map((_, i) => n + i) // Creates an array of elements consisting all values from n to m
const rep       = c => n => map(k(c))(range(0)(n)) // Creates an array of elements containing c repeated n times
const rnd       = min => max => Math.floor(Math.random() * max) + min
/* const spec      = o => x => Object.keys(o) 
  .map(k => objOf(k)(o[k](x)))
  .reduce((acc, o) => Object.assign(acc, o)) */ // Suggested alternative for point-free style implementation of next function in snake.js

module.exports = { adjust, dropFirst, dropLast, id, k, map, merge, mod, objOf, pipe, prop, range, rep, rnd} // Include spec if used
