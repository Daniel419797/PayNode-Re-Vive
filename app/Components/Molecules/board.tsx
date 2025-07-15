// 'use client'
// import React, { useState } from 'react'
// import Square from '../Atoms/square'

// const winningCombos = [ 
//   [0, 1, 2], [3, 4, 5], [6, 7, 8],
//   [0, 3, 6], [1, 4, 7], [2, 5, 8],
//   [0, 4, 8], [2, 4, 6]
//  ]

// export default function Board () {

//   const [ squares, setSquares ] = useState(Array(9).fill(''))
//   const [xIsNext, setXIsNext] = useState(true)
//   const winner = getWinner(squares)
//   const status = winner ? `winner ${winner}` : squares.every(Boolean) ? 'Is a draw!' : `Next player: ${xIsNext ? 'X' : 'O'}`
  
//   function handleClick(i: number) {
//     if (squares[i] || winner) return
//     const next = [...squares]
//     next[i] = xIsNext ? 'X' : 'O'
//     setSquares(next)
//     setXIsNext(!xIsNext)
//   }
//   function handleReset() {
//     setSquares(Array(9).fill(''))
//     setXIsNext(false)
//   }
//   return (
//     <div>
//       <h2>Tic Tac Toe</h2>
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 80px)' }}>
//         {squares.map((val, i) => ( 
//           <Square key={i} value={val} onClick={() => handleClick(i)}/>
//         ) )}
//         <button onClick={handleReset}>Reset</button>
        
//       </div>
//     </div>
//   )

// }
// function getWinner(squares: string[]) {
//   for (let [a, b, c] of winningCombos) {
//     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//       return squares[a]

//     }
//   }
//   return null
// }