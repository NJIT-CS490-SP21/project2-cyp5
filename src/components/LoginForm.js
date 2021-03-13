import React, { useState } from "react";

function LoginForm({ Login, error }) {
  const [details, setDetails] = useState({ name: "" });

  const clickHandler = (e) => {
    e.preventDefault();
    Login(details);
  };
  return (
    <form onSubmit={clickHandler}>
      <h1>React - Tic Tac Toe!</h1>
      <h3>Login below to access the game.</h3>
      <br></br>
      <br></br>
      <div class="form-inner">
        {error != "" ? <div class="error">{error}</div> : ""}
        <div class="form-group">
          <lable htmlFor="name">Username:</lable>
          <input
            type="text"
            name="name"
            class="inputbox"
            id="name"
            onChange={(e) => setDetails({ ...details, name: e.target.value })}
            value={details.name}
          />
          {/* Anytime it is change, a function is called (onChange) which passes through the event which holds the value */}
        </div>
        <input type="submit" value="Login" />
      </div>
    </form>
  );
}

export default LoginForm;
