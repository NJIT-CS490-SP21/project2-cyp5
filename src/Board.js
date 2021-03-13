import React, { useState, useEffect } from 'react';
import './App.css';
import './Board.css';
import PropTypes from 'prop-types';

import io from 'socket.io-client';
import LoginForm from './components/LoginForm';
import { calculateWinner } from './components/Winner';

const socket = io(); // Connects to socket connection
export function Board() {
  const [board, setBoard] = useState(['', '', '', '', '', '', '', '', '']);
  const [user, setUser] = useState({ name: '' });
  const [error, setError] = useState(''); // catch if details are actually correct
  const [userList, setUserList] = useState([]);
  const [scoreBord, scoreBoardList] = useState([]);
  const [result, setResultList] = useState([]);
  const [show, setShow] = useState(false);
  const winner = calculateWinner(board);

  const [nxtTurn, setNxtTurn] = useState('X');

  useEffect(() => {
    if (winner != null) {
      // setWinner_checker("Winner is Player " + winner);
      if (winner === 'X' && user.name === userList[0]) {
        socket.emit('results', { win: userList[0], lose: userList[1] });
      } else if (winner === 'O' && user.name === userList[0]) {
        socket.emit('results', { win: userList[1], lose: userList[0] });
      }
    }
  }, [winner]);

  let WinnerChecker2;
  if (winner) {
    WinnerChecker2 = `Winner is Player ${winner}`;
  }

  const Login = (details) => {
    if (details.name !== '') {
      setUser({ name: details.name });
      setUserList((prevList) => [...prevList, details.name]);
      socket.emit('user', { name: details.name });
    } else {
      setError('Please Enter a name to proceed!');
    }
  };

  function reset() {
    const ResetBoard = ['', '', '', '', '', '', '', '', ''];
    setBoard(ResetBoard);
    socket.emit('ticTac', { ret: ResetBoard });
  }

  const Logout = (details) => {
    console.log(details);
    if (user.name === userList[0] || user.name === userList[1]) {
      reset();
    }
    socket.emit('remove_user', user.name);
    setUser({ name: '' });
  };

  function toggleText(index) {
    if (winner == null) {
      if (board[index] === '') {
        if (user.name === userList[0] && nxtTurn === 'X') {
          setBoard((prevList) => {
            const newList = [...prevList];
            newList[index] = nxtTurn;
            return newList;
          });

          setNxtTurn((prevTurn) => (prevTurn === 'X' ? 'O' : 'X'));

          socket.emit('ticTac', { position: index, turn: nxtTurn });
        } else if (user.name === userList[1] && nxtTurn === 'O') {
          setBoard((prevList) => {
            const newList = [...prevList];
            newList[index] = nxtTurn;
            return newList;
          });

          setNxtTurn((prevTurn) => (prevTurn === 'X' ? 'O' : 'X'));

          socket.emit('ticTac', { position: index, turn: nxtTurn });
        }
      }
    }
  }

  function TicTac(props) {
    const { name } = props;
    if (name >= 0) {
      return (
        <div role="button" tabIndex={0} className="box" onClick={() => toggleText(name)} onKeyDown={() => toggleText(name)}>
          {board[name]}
        </div>
      );
    }
  }

  useEffect(() => {
    socket.on('remove_user', (data) => {
      setUserList(data);
    });
    socket.on('user', (data) => {
      setUserList(data);
    });

    socket.on('score_board', (data) => {
      scoreBoardList(data.users);
    });

    socket.on('score', (data) => {
      setResultList(data.score);
    });
  }, []);

  useEffect(() => {
    socket.on('ticTac', (data) => {
      if (data.ret) {
        setBoard(data.ret);
      } else {
        setNxtTurn((prevTurn) => (prevTurn === 'X' ? 'O' : 'X'));

        setBoard((prevList) => {
          const newList = [...prevList];
          newList[data.position] = data.turn;
          return newList;
        });
      }
    });
  }, []);

  function Reset() {
    if (user.name === userList[0] || user.name === userList[1]) {
      // restricts spectators to click reset button
      return <button onClick={reset} type="submit">Reset Board</button>;
    }
    return <div />;
  }
  return (
    <div className="App">
      {user.name !== '' ? (
        <div className="welcome">
          <h1>React - Tic Tac Toe!</h1>
          <h3>
            Welcome,
            {' '}
            <span>{user.name}</span>
          </h3>
          <br />
          <b>
            {' '}
            {WinnerChecker2}
          </b>
          <h1>
            {`${nxtTurn}'s Turn`}
          </h1>
          <div className="mainboard">
            <div className="mainapp">
              <div className="board">
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
            <div className="userlist">
              <br />
              <wrap>
                Current Users List:
                <br />
              </wrap>
              {userList.map((item) => (
                <div>
                  <list>{item}</list>
                </div>
              ))}
            </div>
            <div className="scoreBoard">
              <button onClick={() => setShow(!show)} type="submit">LeaderBoard</button>
              {show ? (
                <div className="score_list">
                  <ul>
                    <wrap>
                      Names:
                      <br />
                    </wrap>
                    {scoreBord.map((item) => (
                      <div>
                        <list>
                          <center>{item}</center>
                        </list>
                      </div>
                    ))}
                  </ul>
                  <ul>
                    <wrap>
                      Scores:
                      <br />
                    </wrap>
                    {result.map((item) => (
                      <div>
                        <list>
                          <center>{item}</center>
                        </list>
                      </div>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
          <div>
            <Reset />
          </div>
          <button onClick={Logout} type="submit">Logout</button>
        </div>
      ) : (
        <h2>
          <LoginForm Login={Login} error={error} />
        </h2>
      )}
    </div>
  );
}

Board.propTypes = {
  // name: PropTypes.string,
  name: PropTypes.string,
};

Board.defaultProps = {
  // name: PropTypes.string,
  name: PropTypes.string,
};

export default Board;
