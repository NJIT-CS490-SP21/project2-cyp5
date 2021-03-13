import React, { useState } from 'react';
import PropTypes from 'prop-types';

function LoginForm({ Login, error }) {
  const [details, setDetails] = useState({ name: '' });

  const clickHandler = (e) => {
    e.preventDefault();
    Login(details);
  };
  return (
    <form onSubmit={clickHandler}>
      <h1>React - Tic Tac Toe!</h1>
      <h3>Login below to access the game.</h3>
      <br />
      <br />
      <div className="form-inner">
        {error !== '' ? <div className="error">{error}</div> : ''}
        <div className="form-group">
          <lable htmlFor="name">Username:</lable>
          <input
            type="text"
            name="name"
            className="inputbox"
            id="name"
            onChange={(e) => setDetails({ ...details, name: e.target.value })}
            value={details.name}
          />
        </div>
        <input type="submit" value="Login" />
      </div>
    </form>
  );
}

LoginForm.propTypes = {
  error: PropTypes.string,
  Login: PropTypes.string,
};

LoginForm.defaultProps = {
  error: PropTypes.string,
  Login: PropTypes.string,
};

export default LoginForm;
