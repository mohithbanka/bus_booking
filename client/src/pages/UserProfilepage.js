import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  const navigate = useNavigate();

  // const BACKEND_URL = process.env.REACT_APP_BACKEND_URL||"http://localhost:5000";
  const BACKEND_URL = "http://localhost:5000";
  console.log("BACKEND_URL:", BACKEND_URL);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    
    if (!token) {
      setError("Please log in to view your profile");
      setLoading(false);
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        });
        setUserDetails(response.data.user);
      } catch (err) {
        throw new Error(
          err.response?.data?.message || "Failed to fetch user data"
        );
      }
    };

    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        });
        setBookings(response.data.bookings || []);
      } catch (err) {
        throw new Error(
          err.response?.data?.message || "Failed to fetch bookings"
        );
      }
    };

    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/payment-methods`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        });
        setPaymentMethods(response.data.paymentMethods || []);
      } catch (err) {
        throw new Error(
          err.response?.data?.message || "Failed to fetch payment methods"
        );
      }
    };

    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchUserData(),
          fetchBookings(),
          fetchPaymentMethods(),
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [BACKEND_URL, navigate]);

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
      {/* <ProfileHeader user={userDetails} /> */}
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