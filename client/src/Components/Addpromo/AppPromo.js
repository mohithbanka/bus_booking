import React from "react";
import "./AppPromo.css";
import googleplay from "./google-play-badge.png";
import appstore from "./pp-store-badge.png";
import qrCode from "./qrcode_localhost.png";

const AppPromo = () => {
  return (
    <div className="app-promo">
      {/* Left Section */}
      <div className="content-left">
        <h2>ENJOY THE APP!</h2>
        <ul>
          <li>
            <span className="check-icon">✔</span> Quick access
          </li>
          <li>
            <span className="check-icon">✔</span> Superior live tracking
          </li>
        </ul>
        <div className="ratings">
          <div>
            <p className="rating">4.5 ★</p>
            <p>50M+ downloads</p>
            <p>Play Store</p>
          </div>
          <div>
            <p className="rating">4.6 ★</p>
            <p>50M+ downloads</p>
            <p>App Store</p>
          </div>
        </div>
      </div>

      {/* Middle Section (QR Code) */}
      <div className="content-middle">
        <p>Scan to download</p>
        <div className="qr-code">
          <img src={qrCode} alt="QR Code" />
        </div>
      </div>

      {/* Right Section (Store Buttons) */}
      <div className="content-right">
        <p>Download the App on</p>
        <div className="store-buttons">
          <a
            href="https://play.google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={googleplay} className="google-play-button" alt="Google Play" />
          </a>
          <a
            href="https://www.apple.com/app-store/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={appstore} className="app-store-button" alt="App Store" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AppPromo;
