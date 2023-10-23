import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

function Home() {
  return (
    <div className="Home-header">
      <Link to="/lobby">
        <p className="Button">Get Started</p>
      </Link>
    </div>
  );
}

export default Home;
