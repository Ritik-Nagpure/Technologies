import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from './Router/Router'

import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="p-2 ">
      <Router />
    </div>
  </React.StrictMode>,
)
