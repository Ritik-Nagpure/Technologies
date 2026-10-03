import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import mainStore from './store/main_store.ts'

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={mainStore}>
      <div className='w-full m-0'>
        <App />
      </div>
    </Provider>
  </StrictMode>,
)
