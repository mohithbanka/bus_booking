import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import ProfileHeader from "../Components/ProfileHeader/ProfileHeader";
import UserInfoCard from "../Components/UserInfoCard/UserInfoCard";
import BookingHistory from "../Components/BookingHistory/BookingHistory";
import PaymentMethods from "../Components/PaymentMethods/PaymentMethods";

const UserProfilepage = () => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    // Get the token from localStorage (assuming you store it after login)
    const token = localStorage.getItem("token");

    // If token exists, fetch user data
    if (token) {
      fetch("http://localhost:5000/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setUserDetails(data); // Set user details to state
          }
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, []);

  return (
    <div className="profile-page">
      <ProfileHeader />
      <div className="profile-content">
        {userDetails && <UserInfoCard user={userDetails} />}
        <div className="profile-details">
          <BookingHistory />
          <PaymentMethods />
        </div>
      </div>
    </div>
  );
};

export default UserProfilepage;
