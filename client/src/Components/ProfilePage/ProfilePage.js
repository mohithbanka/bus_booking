import React from "react";
import "./ProfilePage.css";
import ProfileHeader from "../ProfileHeader/ProfileHeader";
import UserInfoCard from "../UserInfoCard/UserInfoCard";
import BookingHistory from "../BookingHistory/BookingHistory";
import PaymentMethods from "../PaymentMethods/PaymentMethods";

const ProfilePage = () => {
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

export default ProfilePage;
