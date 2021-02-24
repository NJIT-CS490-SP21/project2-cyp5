import logo from './logo.svg';
import React from 'react';
import './App.css';
import './Board.css';
import { useState, useRef,useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

export function Board() {
  const [board, setBoard] = useState(['','','','','','','','','']);
  const [board2,setBoard2] = useState(0);
  
  function TicTac(props){
    function toggleText(){
      if (board2==0)
      {
        tic = new String('X');
        setBoard2(tac => (tac = 1));
      }
      else
      {
        tic = new String('O');
        setBoard2(tac => (tac = 0));
      }
      
      let array = [...board];
      array[props.name] = tic;
      setBoard(array);
      socket.emit('ticTac', { position: props.name });
  }
    return (<div class="box" onClick={toggleText}>{board[props.name]}</div>);
  }
  let tic = '';
  useEffect(() => {
    
    socket.on('ticTac', (data) => {
      if (board2==0)
      {
        tic = new String('X');
        setBoard2(tac => (tac = 1));
      }
      else
      {
        tic = new String('O');
        setBoard2(tac => (tac = 0));
      }
      //console.log('Event received!');
      //console.log(data);
      let array = [...board];
      array[data.position] = tic;
      setBoard(array);
    });
  }, [board]);
  
  return (
    <div class="board">
    <TicTac name="0" />
    <TicTac name="1" />
    <TicTac name="2" />
    <TicTac name="3" />
    <TicTac name="4" />
    <TicTac name="5" />
    <TicTac name="6" />
    <TicTac name="7" />
    <TicTac name="8" />
    </div>
  );
}
export default Board;