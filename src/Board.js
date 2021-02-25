import logo from './logo.svg';
import React from 'react';
import './App.css';
import './Board.css';
import { useState, useRef,useEffect } from 'react';
import io from 'socket.io-client';
import LoginForm from './components/LoginForm.js';

const socket = io(); // Connects to socket connection

export function Board() {
  const [board, setBoard] = useState(['','','','','','','','','']);
  const [board2,setBoard2] = useState(0);
  const [user, setUser] = useState({name: ""});
  const [error, setError] = useState("");//catch if details are actually correct
  
  const Login = details => {
    if(details.name != ""){
    setUser({name: details.name});
    console.log(details);
    }else{
      setError("Please Enter a name to proceed!")
    }
  }
  
  const Logout = details => {
    setUser({name: ""});
    console.log("Logout");
  }
  
  function TicTac(props){
    function toggleText(){
      if (board2==0)
      {
        nxtTurn = new String('X');
        setBoard2(prevTurn => (prevTurn = 1));
      }
      else
      {
        nxtTurn = new String('O');
        setBoard2(prevTurn => (prevTurn = 0));
      }
      
      let array = [...board];
      array[props.name] = nxtTurn;
      setBoard(array);
      socket.emit('ticTac', { position: props.name });
  }
    return (<div class="box" onClick={toggleText}>{board[props.name]}</div>);
  }
  let nxtTurn = '';
  useEffect(() => {
    
    socket.on('ticTac', (data) => {
      if (board2==0)
      {
        nxtTurn = new String('X');
        setBoard2(prevTurn => (prevTurn = 1));
      }
      else
      {
        nxtTurn = new String('O');
        setBoard2(prevTurn => (prevTurn = 0));
      }
      //console.log('Event received!');
      //console.log(data);
      let array = [...board];
      array[data.position] = nxtTurn;
      setBoard(array);
    });
  }, [board]);
  
  return (
    <div class="App">
      {(user.name != "") ? (
        <div class="welcome">
        <h1>Welcome, <span>{user.name}</span></h1>
        <div class="mainapp">
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
        <button onClick={Logout}>Logout</button>
        </div>
        ) : (<h2>
          <LoginForm Login={Login} error={error}/>
          </h2>
        )}
    </div>
  );
}
export default Board;