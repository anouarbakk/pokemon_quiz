import React from "react";
import "./signup.css";
const Signup = () => {
  return (
    <div className="login-container">
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <input type="password" placeholder="Confirm Password" />
      <button className="signup-button">sign up</button>
    </div>
  );
};

export default Signup;
