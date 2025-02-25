import React from "react";
import "./Footer.css"; // Optional CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Contact Section */}
        <div className="footer-section">
          <div>
            <h3>Contact Us</h3>
          </div>
          <p>
            {/* Customer Support: <a href="tel:+1800123456">+1 800 123 456</a> */}
            redBus is the world's largest online bus ticket booking service
            trusted by over 25 million happy customers globally. redBus offers
            bus ticket booking through its website, iOS and Android mobile apps
            for all major routes.
          </p>
          <p>
            Email:{" "}
            <a href="mailto:support@busbooking.com">support@busbooking.com</a>
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="/terms">Terms & Conditions</a>
            </li>
            <li>
              <a href="/privacy">Privacy Policy</a>
            </li>
            <li>
              <a href="/about">About Us</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="footer-section">
          <div>
            <h3>Follow Us</h3>
          </div>

          <div className="social-icons">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="footer-section">
          <p>&copy; 2024 BusBooking. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
