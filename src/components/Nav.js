import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Nav() {
  const navStyle = {
    color: "white",
  };
  return (
    <nav>
      <h3>Stock Info</h3>
      <ul className="nav-links">
        <Link style={navStyle} to="/">
          <li>Home</li>
        </Link>
        <Link style={navStyle} to="/stock">
          <li>Stock</li>
        </Link>
      </ul>
    </nav>
  );
}
export default Nav;
