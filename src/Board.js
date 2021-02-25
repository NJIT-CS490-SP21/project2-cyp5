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
      const winner = calculateWinner(board)
      function getStatus(){
      if (winner) {
      return "Winner: " + winner;
    }}
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
  
   //function that calculates the winner
  function calculateWinner(squares) {
    //get our set of winning combinations
    const winningLines = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6]
      ];
      //looping through this set
      for (let i = 0; i < winningLines.length; i++){
        //check to see if values in our square array fulfill the winning requirements
        const [a,b,c] = winningLines[i];
        if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]){
          //if so return X or O
          return squares[a];
        }
      }
      //else return nothing
      return null;
  }
  
  return (
    <div>
    <h1> Tic Tac Toe React </h1>
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
    </div>
  );
}
export default Board;