import logo from './logo.svg';
import './App.css';
import './Board.css';
import {Board} from './Board.js';
import { useState, useRef } from 'react';



function App() {
  return(
  <Board />
 );
}

@socketio.on('chat')

export default App;