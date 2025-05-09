import React, { useState, useEffect } from "react";
import ProfileHeader from "../Components/ProfileHeader/ProfileHeader";
import UserInfoCard from "../Components/UserInfoCard/UserInfoCard";
import BookingHistory from "../Components/BookingHistory/BookingHistory";
import PaymentMethods from "../Components/PaymentMethods/PaymentMethods";

const UserProfilepage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to view your profile");
      setLoading(false);
      return;
    }

    // Fetch user details
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUserDetails(data.user);
      } catch (err) {
        setError(err.message);
      }
    };

    // Fetch booking history
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookings", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();
        setBookings(data.bookings || []);
      } catch (err) {
        setError(err.message);
      }
    };

    // Fetch payment methods
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/payment-methods", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch payment methods");
        const data = await response.json();
        setPaymentMethods(data.paymentMethods || []);
      } catch (err) {
        setError(err.message);
      }
    };

    // Fetch all data
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([fetchUserData(), fetchBookings(), fetchPaymentMethods()]);
      setLoading(false);
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ProfileHeader user={userDetails} />
      <div className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            {userDetails && <UserInfoCard user={userDetails} />}
          </div>
          <div className="md:col-span-2 space-y-6">
            <BookingHistory bookings={bookings} />
            <PaymentMethods paymentMethods={paymentMethods} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilepage;