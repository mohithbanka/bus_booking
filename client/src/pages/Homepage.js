import React, { Component } from "react";
import Navbar from "../Components/Navbar/Navbar";
import Header from "../Components/Header/Header";
import HeroSection from "../Components/HeroSection/HeroSection";
import PopularRoutes from "../Components/PopularRoutes/PopularRoutes";
import Apppromo from "../Components/Apppromo/AppPromo";
import Faq from "../Components/Faqs/Faq";
import Footer from "../Components/Footer/Footer";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-red-600">Something went wrong</h2>
          <p className="text-gray-600">{this.state.error?.message || "Unknown error"}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Homepage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ErrorBoundary>
        {/* <Navbar /> */}
        <Header />
        <HeroSection />
        <PopularRoutes />
        <Apppromo />
        <Faq />
        {/* <Footer /> */}
      </ErrorBoundary>
    </div>
  );
};

export default Homepage;