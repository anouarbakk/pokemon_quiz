import React, { useState, useEffect } from "react";
import "./PokemonQuiz.css";
import { Link } from "react-router-dom";
const Pokequiz = () => {
  const [progress, setProgress] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add cache-busting parameter to URL
    const url = `pokemon-quiz-qi2cedvtq-anouarbakks-projects.vercel.app/quiz?timestamp=${Date.now()}`;

    fetch(url, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setLoading(false);
      });
  }, []); // Empty dependency array = runs only on mount

  const handleResponse = (response) => {
    const currentQuestion = data[currentQuestionIndex];
    console.log(
      "Selected:",
      response,
      "Correct:",
      currentQuestion.correctAnswer
    );

    if (response === currentQuestion.correctAnswer) {
      setProgress((prev) => Math.min(prev + 100 / data.length, 100));
    }

    setCurrentQuestionIndex((prev) => prev + 1);
  };

  if (loading) return <h1>Loading...</h1>;
  if (!data || data.length === 0) return <h1>Error loading quiz questions</h1>;
  if (currentQuestionIndex >= data.length) {
    if (progress < 50) {
      return (
        <div className="cont">
          <ul className="options">
            <li>
              <h1 className="text">
                Not too bad, Try again! You can do better.
              </h1>
            </li>
            <li>
              <button className="option text">
                <Link to="/">Home</Link>
              </button>
            </li>
          </ul>
        </div>
      );
    }
    return (
      <div className="cont">
        <ul className="options">
          <li>
            <h1 className="text">
              Congratulation you got more than half the answers right!
            </h1>
          </li>
          <li>
            <button className="option text">
              <Link to="/">Home</Link>
            </button>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="cont">
      <ul className="options">
        <li>
          <h1 className="question text">
            {data[currentQuestionIndex].question}
          </h1>
        </li>
        {data[currentQuestionIndex].options.map((option, index) => (
          <li key={index}>
            <button
              className="option text"
              onClick={() => handleResponse(option)}
            >
              {option}
            </button>
          </li>
        ))}
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
