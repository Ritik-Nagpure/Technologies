import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { cartStore } from './store/cartstore.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={cartStore}>
      <div className='h-screen w-full overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none]'>
        <App />
      </div>
    </Provider>
  </StrictMode>,
)
