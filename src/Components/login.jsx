import React from "react";
import "./login.css";
import { Link } from "react-router-dom";
const Login = () => {
  return (
    <div className="login-container">
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <button className="login-button">log in</button>
      <button className="signup-button">
        <Link to="/signup">sign up</Link>
      </button>
    </div>
  );
};

export default Login;
