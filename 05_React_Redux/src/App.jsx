import Header from './Home/Header'
import Footer from './Home/Footer'
import Lessons from './Home/Lessons'

import { useState } from 'react'

function App() {
  let [isDark, setIsDark] = useState(true)

  const togglemode = () => {
    setIsDark(!isDark)
    console.log(isDark)
  }

  return (
    <div className='flex flex-col justify-between'>
      <div>
        <Header />
        <button onClick={() => {togglemode()}}> Switch </button>
        {isDark.toString()}
      </div>
      <div>
        <Lessons />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  )
}

export default App
