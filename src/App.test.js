import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import Board from './Board';

const React = require('react');

test('Join button disappears', () => {
  const result = render(<App />);
  const temp = screen.getByPlaceholderText('username');
  fireEvent.change(temp, { target: { value: 'Chirag' } });

  const joinButtonElemet = screen.getByText('Login');
  expect(joinButtonElemet).toBeInTheDocument();
  fireEvent.click(joinButtonElemet);
  const insideLogin = screen.getByText('Welcome,');
  expect(insideLogin).toBeInTheDocument();
});

test('LeaderBoard test', () => {
  const result = render(<App />);
  const temp = screen.getByPlaceholderText('username');
  fireEvent.change(temp, { target: { value: 'Chirag' } });
  const joinButtonElemet = screen.getByText('Login');
  expect(joinButtonElemet).toBeInTheDocument();
  fireEvent.click(joinButtonElemet);
  const leaderBoardButton = screen.getByText('LeaderBoard');
  expect(leaderBoardButton).toBeInTheDocument();
  fireEvent.click(leaderBoardButton);
});

test('Logout test', () => {
  const result = render(<App />);
  const temp = screen.getByPlaceholderText('username');
  fireEvent.change(temp, { target: { value: 'Chirag' } });
  const joinButtonElemet = screen.getByText('Login');
  expect(joinButtonElemet).toBeInTheDocument();
  fireEvent.click(joinButtonElemet);
  const logoutButton = screen.getByText('Logout');
  expect(logoutButton).toBeInTheDocument();
  fireEvent.click(logoutButton);
});
