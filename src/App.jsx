import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import R3FCanvas from './canvas';


function App() {
  const canvasRef = useRef();

  const [count, setCount] = useState(0)

  function spawnBall() {
    // console.log('spawnBall');
    canvasRef.current.spawnBall()
  } 

  return (
    <>
      {/* <div className="header">
        <button onClick={spawnBall}> SPAWN </button>
      </div> */}
      <R3FCanvas ref={canvasRef} />
      {/* <div className="footer">
        <button onClick={spawnBall}> SPAWN </button>
      </div> */}
    </>
  )
}

export default App
