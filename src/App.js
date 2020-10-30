import React from 'react';

import { Counter } from './features/counter/Counter';
import './App.css';
import Panorama from './pages/panorama-page/panorama.page'
function App() {
  return (
    <div className="App">
      <div className="App-header">
        <Panorama/>
        <Counter />
      </div>
    </div>
  );
}

export default App;
