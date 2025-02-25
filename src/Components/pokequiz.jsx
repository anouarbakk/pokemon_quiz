import React, { useState } from "react";
import "./PokemonQuiz.css";

const Pokequiz = () => {
  const [progress, setProgress] = useState(0);

  const incrementProgress = () => {
    setProgress((prev) => {
      const newProgress = prev + 10;
      return newProgress;
    });
  };

  return (
    <div className="cont">
      <ul className="options">
        <li>
          <h1 className="question text">What's 1 + 1</h1>
        </li>
        <li>
          <button className="option text" onClick={incrementProgress}>
            2
          </button>
        </li>
        <li>
          <button className="option text">0</button>
        </li>
        <li>
          <button className="option text">4</button>
        </li>
        <li>
          <button className="option text">8</button>
        </li>
        <li>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Pokequiz;
