import React from 'react';
import './App.css';
import './Board.css';
import { useState, useRef,useEffect } from 'react';
import io from 'socket.io-client';
import LoginForm from './components/LoginForm.js';
import {calculateWinner} from './components/Winner.js';

const socket = io(); // Connects to socket connection
export function Board() {
  const [board, setBoard] = useState(['','','','','','','','','']);
  const [board2,setBoard2] = useState(0);
  const [user, setUser] = useState({name: ""});
  const [error, setError] = useState("");//catch if details are actually correct
  const [userList, setUserList] = useState([]);
  const [nextTurn,setNextTurn] = useState('X');
    
  const winner = calculateWinner(board);
  let status;
  if(winner){
    status = "Winner is Player " + winner;
  }
    //console.log(winner);

  const Login = details => {
    if(details.name != ""){
    setUser({name: details.name});
    setUserList((prevList) => [...prevList, details.name]);
    socket.emit('user', {name: details.name});
    }
    else{
      setError("Please Enter a name to proceed!");
    }
  };
  
  const Logout = details => {
    console.log(user.name);
    socket.emit('remove_user', user.name);
    setUser({name: ""});
    
  };
  
  function TicTac(props){
    function toggleText(){
      if(winner==null){
        console.log(userList);
      if (user.name === userList[0] || user.name === userList[1]){
        console.log(user.name);
        console.log(userList[1]);
        console.log(board2);
        if(user.name === userList[0] && board2 == 0)
        {
        if (board2==0)
        {
          nxtTurn = 'X';
          setBoard2(prevTurn => (prevTurn = 1));
        }
        else
        {
          nxtTurn = 'O';
          setBoard2(prevTurn => (prevTurn = 0));
        }
        
        let array = [...board];
        array[props.name] = nxtTurn;
        setBoard(array);
        socket.emit('ticTac', { position: props.name });}
    }
    if(user.name === userList[1] && board2 == 1)
        {
        if (board2==0)
        {
          nxtTurn = 'X';
          setBoard2(prevTurn => (prevTurn = 1));
        }
        else
        {
          nxtTurn = 'O';
          setBoard2(prevTurn => (prevTurn = 0));
        }
        
        let array = [...board];
        array[props.name] = nxtTurn;
        setBoard(array);
        socket.emit('ticTac', { position: props.name });}
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    }
    }
    return (<div class="box" onClick={toggleText}>{board[props.name]}</div>);
  }
  
  let nxtTurn = null;
  useEffect(() => {
    socket.on('remove_user',(data) => {
    setUserList(data);
    });
    socket.on('user', (data) => {
    setUserList(data);
   
    });
  }, []);

  
  useEffect(() => {
    socket.on('ticTac', (data) => {
      if(data.ret){
        setBoard(data.ret);
      }
      else{
      if (board2==0)
      {
        nxtTurn = 'X';
        setBoard2(prevTurn => (prevTurn = 1));
      }
      else
      {
        nxtTurn = 'O';
        setBoard2(prevTurn => (prevTurn = 0));
      }
      let array = [...board];
      array[data.position] = nxtTurn;
      setBoard(array);}
    });
  }, [board]);
  
  function reset(){
    const reset_board = ['','','','','','','','',''];
    setBoard(reset_board);
    socket.emit('ticTac',{ret:reset_board});
  }
  
  function Reset(){
    if (user.name === userList[0] || user.name === userList[1]){//restricts spectators to click reset button
      return(<button onClick={reset}>Reset Board</button>)
      
    }
    else{
      return(<div></div>);
    }
  }
  
  return (
    <div class="App">
      {(user.name != "") ? (
        <div class="welcome">
        <h1>React - Tic Tac Toe!</h1>
        <h3>Welcome, <span>{user.name}</span></h3><br></br>
        <b> {status} </b>
        {winner !== null? <b></b>: <b>{status}</b>}<br></br>
        <div class="mainboard">
        <div class="mainapp">
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
          <div class="userlist">
          <br></br>
            <wrap>
             Current User's List:<br></br></wrap>
            {userList.map((item, index) => (
              <li>{item}</li>
            ))}
          </div>
          </div>
        <div>
        <Reset />
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