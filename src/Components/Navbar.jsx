import React from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <>
      <nav className="navbar">
        <ul className="navbar-list">
          <li className="navbar-item button">
            <Link to="/pokequiz">Start Game</Link>
          </li>
          <li className="navbar-item button">
            <Link to="/login">Log in</Link>
          </li>
          <li className="navbar-item button">About us</li>
          <li className="navbar-item button">Contact</li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
