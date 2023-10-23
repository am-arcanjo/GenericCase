import "./App.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="Home-header">
      <Link to="/lobby">
        <p className="Button"> get started </p>
      </Link>
    </div>
  );
}

export default Home;
