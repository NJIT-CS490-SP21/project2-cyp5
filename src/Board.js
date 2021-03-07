import React from 'react';
import './App.css';
import './Board.css';
import { useState,useEffect } from 'react';
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
  const [scoreBord, scoreBoardList] = useState([]);
  const [result, setResultList] = useState([]);
  const[show,setShow]=useState(false);  
  const winner = calculateWinner(board);
  
  const [ nxtTurn, setNxtTurn ] = useState('X');
  
  useEffect(() => {
    if(winner != null){
      //setWinner_checker("Winner is Player " + winner);
      if (winner === 'X' && user.name === userList[0]){
        socket.emit('results',{'win':userList[0],'lose':userList[1]});
      }
      else if (winner === 'O' && user.name === userList[0]){
        socket.emit('results',{'win':userList[1],'lose':userList[0]});
      }
    }
  }, [winner]);
  
  let winner_checker2;
  if(winner){
    winner_checker2 = "Winner is Player " + winner;
  }
  
  const Login = details => {
    if(details.name !== ""){
    setUser({name: details.name});
    setUserList((prevList) => [...prevList, details.name]);
    socket.emit('user', {name: details.name});
    }
    else{
      setError("Please Enter a name to proceed!");
    }
  };
  
  const Logout = details => {
    if (user.name === userList[0] || user.name === userList[1])
    {
    reset();
    }
    socket.emit('remove_user', user.name);
    setUser({name: ""});
  };
  
  function toggleText(index){
      if(winner==null){
          if (board[index] === ''){
          if(user.name === userList[0] && nxtTurn === 'X')
          {
            setBoard((prevList) => {
              let newList = [...prevList];
              newList[index] = nxtTurn;
              return newList;
            });
            
            setNxtTurn(prevTurn => prevTurn === 'X' ? 'O' : 'X');
            
            socket.emit('ticTac', { position: index, turn: nxtTurn });
            
          }
          else if(user.name === userList[1] && nxtTurn === 'O')
          {
            setBoard((prevList) => {
              let newList = [...prevList];
              newList[index] = nxtTurn;
              return newList;
            });
            
            setNxtTurn(prevTurn => prevTurn === 'X' ? 'O' : 'X');
            
            socket.emit('ticTac', { position: index, turn: nxtTurn });
          }
          }
      }
    }
  
  function TicTac(props)
  {
    return (<div class="box" onClick={() => toggleText(props.name)}>{board[props.name]}</div>);
  }
  
  useEffect(() => {
    socket.on('remove_user',(data) => {
    setUserList(data);
    });
    socket.on('user', (data) => {
    setUserList(data);
    });
    
    socket.on('score_board',(data) => {
    scoreBoardList(data.users);
    });
    
    socket.on('score',(data) => {
    setResultList(data.score);
    });
    
  }, []);

  useEffect(() => {
    socket.on('ticTac', (data) => {
      if(data.ret){
        setBoard(data.ret);
      }
      else
      {
        setNxtTurn(prevTurn => prevTurn === 'X' ? 'O' : 'X');
        
        setBoard((prevList) => {
          let newList = [...prevList];
          newList[data.position] = data.turn;
          return newList;
        });
      }
    });
  }, []);
  
  function reset(){
    const reset_board = [null,null,null,null,null,null,null,null,null];
    setBoard(reset_board);
    socket.emit('ticTac',{ret:reset_board});
  }
  
  function Reset(){
    if (user.name === userList[0] || user.name === userList[1]){//restricts spectators to click reset button
      return(<button onClick={reset}>Reset Board</button>);
      
    }
    else{
      return(<div></div>);
    }
  }
  return (
    <div class="App">
      {(user.name !== "") ? (
        <div class="welcome">
        <h1>React - Tic Tac Toe!</h1>
        <h3>Welcome, <span>{user.name}</span></h3><br></br>
        <b> {winner_checker2}</b>
        <h1>{nxtTurn}'s Turn</h1>
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
              <div><list>{item}</list></div>
            ))}
          </div>
          <div class="scoreBoard">
          <button onClick={()=>setShow(!show)}>LeaderBoard</button>
          {
            show ?
            <div classname="score_list">
              <ul>
              <wrap>Names:<br></br></wrap>
              {scoreBord.map((item, index) => (
              <div><list><center>{item}</center></list></div>
              ))}
              </ul>
              <ul>
                <wrap>Scores:<br></br></wrap>
                {result.map((item, index) => (
                  <div><list><center>{item}</center></list></div>
                ))}
              </ul>
            </div>
            : null
          } 
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