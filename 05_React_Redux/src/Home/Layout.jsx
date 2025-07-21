import Header from './Header'
import Footer from './Footer'
import Lessons from './Lessons'

import { useState } from 'react'

function Layout() {
  let [isDark, setIsDark] = useState(true)

  const togglemode = () => {
    setIsDark(!isDark)
    console.log(isDark)
  }

  return (
    <div className={`flex flex-col justify-between h-full ${isDark ? "dark-mode" : "light-mode"}` }>
      <div className="">
        <Header isDark={isDark} toggle={ togglemode}/>
      </div>
      <div className="">
        <Lessons />
      </div>
      <div className="">
        <Footer />
      </div>
    </div>
  )
}

export default Layout
