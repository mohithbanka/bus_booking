import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "./quickroute2.png"; // Ensure the logo path is correct

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg py-2 px-4 sm:px-6 lg:px-8 flex justify-between items-center sticky top-0 z-50">
      {/* Logo Section */}
      <div className="navbar-logo">
        <Link to="/" aria-label="QuickRoute Homepage">
          <img
            src={logo}
            alt="QuickRoute Logo"
            className="w-20 sm:w-24 h-auto rounded-md shadow-md transform hover:scale-105 hover:shadow-lg transition-all duration-300"
          />
        </Link>
      </div>

      {/* Hamburger Button for Mobile */}
      <button
        className="sm:hidden text-white focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md p-1 hover:bg-blue-800 transition-colors duration-300"
        onClick={toggleMenu}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <i className={`fa-solid ${isOpen ? "fa-times" : "fa-bars"} text-2xl`}></i>
      </button>

      {/* Navigation Links */}
      <ul
        className={`${
          isOpen ? "flex" : "hidden"
        } sm:flex flex-col sm:flex-row absolute sm:static top-12 left-0 w-full sm:w-auto bg-blue-800 sm:bg-transparent shadow-lg sm:shadow-none p-4 sm:p-0 gap-4 sm:gap-8 items-center transition-all duration-300 ease-in-out z-40`}
      >
        <li>
          <Link
            to="/"
            className="flex items-center gap-2 text-white font-medium hover:bg-blue-700 px-3 py-2 rounded-md transition-colors duration-300 text-base sm:text-lg"
            onClick={() => setIsOpen(false)}
          >
            <i className="fa-solid fa-house text-blue-200 text-base"></i>
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link
            to="/help"
            className="flex items-center gap-2 text-white font-medium hover:bg-blue-700 px-3 py-2 rounded-md transition-colors duration-300 text-base sm:text-lg"
            onClick={() => setIsOpen(false)}
          >
            <i className="fa-solid fa-headset text-blue-200 text-base"></i>
            <span>Help</span>
          </Link>
        </li>
        <li className="relative group py-2">
          <Link
            to={user ? "/my-profile" : "/login"}
            className="flex items-center gap-2 text-white font-medium hover:bg-blue-700 px-3 py-2 rounded-md transition-colors duration-300 text-base sm:text-lg"
            aria-haspopup="true"
            aria-expanded={isOpen}
          >
            <i className="fa-regular fa-user flex items-center justify-center h-6 w-6 border-2 border-blue-200 rounded-full text-blue-200 text-base"></i>
            <span>{user ? user.name || "My Account" : "My Account"}</span>
          </Link>
          {/* Dropdown Menu */}
          <ul
            className="absolute top-full left-0 mt-0 w-48 bg-white text-gray-800 shadow-lg rounded-md py-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-2 transition-all duration-300 hidden group-hover:block z-10"
            role="menu"
          >
            {user ? (
              <>
                <li role="menuitem">
                  <Link
                    to="/my-profile"
                    className="block px-4 py-2 text-base hover:bg-blue-100 hover:text-blue-700 transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    My Profile
                  </Link>
                </li>
                <li role="menuitem">
                  <Link
                    to="/my-trips"
                    className="block px-4 py-2 text-base hover:bg-blue-100 hover:text-blue-700 transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    My Trips
                  </Link>
                </li>
                <li role="menuitem">
                  <Link
                    to="/wallet"
                    className="block px-4 py-2 text-base hover:bg-blue-100 hover:text-blue-700 transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Wallet
                  </Link>
                </li>
                <li role="menuitem">
                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-base hover:bg-blue-100 hover:text-blue-700 transition-colors duration-300"
                    role="menuitem"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li role="menuitem">
                <Link
                  to="/login"
                  className="block px-4 py-2 text-base hover:bg-blue-100 hover:text-blue-700 transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;