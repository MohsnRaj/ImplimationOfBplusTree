import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import BPlusTreeVisualization from './BPlusTreeVisualization.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BPlusTreeVisualization />
  </React.StrictMode>,
)
