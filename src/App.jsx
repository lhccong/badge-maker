import React, { useState, useRef } from 'react'
import './App.css'
import BadgeMaker from './components/BadgeMaker'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>徽章生成器</h1>
        <p>创建你的专属徽章</p>
      </header>
      <main>
        <BadgeMaker />
      </main>
      </div>
  )
}

export default App
