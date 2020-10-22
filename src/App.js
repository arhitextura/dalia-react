import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import Panorama from './pages/panorama-page/panorama.page'
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Panorama/>
        <Counter />
      </header>
    </div>
  );
}

export default App;
