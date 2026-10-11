import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Test from './text.jsx'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { stateStore } from './store/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={stateStore}>
      <div className='h-screen w-full overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none]'>
        <App />
      </div>
    </Provider>
    {/* <Test/> */}
  </StrictMode>,
)
