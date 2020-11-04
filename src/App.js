import React from 'react';


import './App.scss';
import Panorama from './pages/panorama-page/panorama.page'
import Menu from './components/header/menu.component.jsx'
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Menu>

        </Menu>
      </header>
        <Panorama/>
    </div>
  );
}

export default App;
