import Header from './Header'
import Footer from './Footer'
import Core from './Core'
import Library from './Library'

import { useState } from 'react'

function Layout() {
  const [isDark, setIsDark] = useState(true);
  const [home, setHome] = useState('core');

  const togglemode = () => {
    setIsDark(!isDark)
    console.log(isDark)
  }

  const notesMode = (name) => {
    setHome(name);
  }

  return (
    <div className={`flex flex-col justify-between h-full ${isDark ? "dark-mode" : "light-mode"}`}>
      <div className="">
        <Header isDark={isDark} toggle={togglemode} notesMode={notesMode}/>
      </div>
      <div className="">
        {home == 'core' ? <Core /> : <Library />}
      </div>
      <div className="">
        <Footer />
      </div>
    </div>
  )
}

export default Layout
