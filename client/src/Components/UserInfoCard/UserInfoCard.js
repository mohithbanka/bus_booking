import React from "react";
import "./UserInfoCard.css";

const UserInfoCard = () => {
  return (
    <div className="user-info-card">
      <div className="user-icon">
        <i className="fa-regular fa-user"></i>
      </div>
      <h2>John Doe</h2>
      <p>Email: johndoe@example.com</p>
      <p>Phone: +91 9876543210</p>
      <button>Edit Profile</button>
    </div>
  );
};

export default UserInfoCard;
