import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Home/Layout'

import L01 from './Lessons/L01'
import L02 from './Lessons/L02'
import L03 from './Lessons/L03'
import L04 from './Lessons/L04'
import L05 from './Lessons/L05'
import L06 from './Lessons/L06'
import L07 from './Lessons/L07'

const App = () => {
  return (
    <div className='w-full h-full'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} />

          <Route path="/L01" element={<L01 />} />
          <Route path="/L02" element={<L02 />} />
          <Route path="/L03" element={<L03 />} />
          <Route path="/L04" element={<L04 />} />
          <Route path="/L05" element={<L05 />} />
          <Route path="/L06" element={<L06 />} />
          <Route path="/L07" element={<L07 />} />

          <Route path="/*" element={<h1>Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App