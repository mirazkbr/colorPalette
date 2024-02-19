import { useState } from 'react'
import './App.css'
import ColorPalette from './component/ColorPalette'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <ColorPalette/>
      </div>
    </>
  )
}

export default App
