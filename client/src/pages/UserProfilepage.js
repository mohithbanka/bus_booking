import React from "react";
import "./ProfilePage.css";
import ProfileHeader from "../Components/ProfileHeader/ProfileHeader";
import UserInfoCard from "../Components/UserInfoCard/UserInfoCard";
import BookingHistory from "../Components/BookingHistory/BookingHistory";
import PaymentMethods from "../Components/PaymentMethods/PaymentMethods";

const UserProfilepage = () => {
  return (
    <div className="profile-page">
      <ProfileHeader />
      <div className="profile-content">
        <UserInfoCard />
        <div className="profile-details">
          <BookingHistory />
          <PaymentMethods />
        </div>
      </div>
    </div>
  );
};

export default UserProfilepage;
