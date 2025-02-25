import { useState } from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import { Routes, Route } from "react-router-dom";
import Login from "./Components/login";
import Signup from "./Components/signup";
import PokemonQuiz from "./Components/pokequiz";
function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Navbar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pokequiz" element={<PokemonQuiz />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
