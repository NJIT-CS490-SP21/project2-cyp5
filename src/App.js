import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import './Board.css';
import {Board} from './Board.js';


function App() {
  return(
  <Board />
 );
}

export default App;
