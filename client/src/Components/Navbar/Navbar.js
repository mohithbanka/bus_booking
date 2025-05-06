import React, { useState } from "react";
import logo from "./download.png"; // Ensure the logo path is correct

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-lg py-4 px-4 sm:px-6 lg:px-10 flex justify-between items-center sticky top-0 z-50">
      {/* Logo Section */}
      <div className="navbar-logo">
        <a href="/" aria-label="Homepage">
          <img
            src={logo}
            alt="Bus Booking Logo"
            className="w-24 sm:w-28 transition-transform duration-300 hover:scale-105"
          />
        </a>
      </div>

      {/* Hamburger Button for Mobile */}
      <button
        className="sm:hidden text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-2"
        onClick={toggleMenu}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <i className={`fa-solid ${isOpen ? "fa-times" : "fa-bars"} text-xl`}></i>
      </button>

      {/* Navigation Links */}
      <ul
        className={`${
          isOpen ? "flex" : "hidden"
        } sm:flex flex-col sm:flex-row absolute sm:static top-16 left-0 w-full sm:w-auto bg-white sm:bg-transparent shadow-lg sm:shadow-none p-4 sm:p-0 gap-4 sm:gap-8 items-center transition-all duration-300 ease-in-out z-40`}
      >
        <li>
          <a
            href="/"
            className="flex items-center gap-2 text-primary font-medium hover:bg-hover px-3 py-2 rounded-md transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            <i className="fa-solid fa-house"></i>
            Home
          </a>
        </li>
        <li>
          <a
            href="/help"
            className="flex items-center gap-2 text-primary font-medium hover:bg-hover px-3 py-2 rounded-md transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            <i className="fa-solid fa-headset"></i>
            Help
          </a>
        </li>
        <li className="relative group py-2"> {/* Added py-2 for hover area */}
          <a
            href="/my-profile"
            className="flex items-center gap-2 text-primary font-medium hover:bg-hover px-3 py-2 rounded-md transition-colors duration-300"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <i className="fa-regular fa-user flex items-center justify-center h-5 w-5 border-2 border-secondary rounded-full"></i>
            My Account
          </a>
          {/* Dropdown Menu */}
          <ul
            className="absolute top-full left-0 mt-0 w-48 bg-white shadow-lg rounded-md py-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-2 transition-all duration-300 hidden group-hover:block z-10"
            role="menu"
          >
            <li role="menuitem">
              <a
                href="/my-profile"
                className="block px-4 py-2 text-primary hover:bg-hover transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                My Profile
              </a>
            </li>
            <li role="menuitem">
              <a
                href="/my-trips"
                className="block px-4 py-2 text-primary hover:bg-hover transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                My Trips
              </a>
            </li>
            <li role="menuitem">
              <a
                href="/wallet"
                className="block px-4 py-2 text-primary hover:bg-hover transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Wallet
              </a>
            </li>
            <li role="menuitem">
              <a
                href="/login"
                className="block px-4 py-2 text-primary hover:bg-hover transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;