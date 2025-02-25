import React from "react";
import "./Navbar.css"; // Optional CSS file for styling
import logo from "./download.png";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="navbar-logo">
        <a href="/">
          <img src={logo} alt="Logo" />
        </a>
      </div>

      {/* Navigation Links */}
      <div>
        <ul className="navbar-links">
          <li>
            <a href="/">
              <i class="fa-solid fa-house"></i>Home
            </a>
          </li>
          <li>
            <a href="/help">
              <i class="fa-solid fa-headset"></i>Help
            </a>
          </li>
          <li className="dropdown">
            <a href="/my-profile" className="dropdown-toggle">
              <i class="fa-regular fa-user"></i>
              My Account
            </a>
            <ul className="dropdown-menu">
              <li>
                <a href="/my-profile">My Profile</a>
              </li>
              <li>
                <a href="/my-trips">My Trips</a>
              </li>
              <li>
                <a href="/wallet">Wallet</a>
              </li>
              <li>
                <a href="/signin">Sign In</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
