import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import './Board.css';
import {Board} from './Board.js';

const socket = io(); // Connects to socket connection

function App() {
  return(
  <Board />
 );
}

export default App;
