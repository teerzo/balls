import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import R3FCanvas from './canvas';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <R3FCanvas />
      <div id="interface"> BUTTONS HERE </div>
    </>
  )
}

export default App
