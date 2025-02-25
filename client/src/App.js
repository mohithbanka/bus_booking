import { Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./Components/Footer/Footer";
import Navbar from "./Components/Navbar/Navbar";
import Homepage from "./pages/Homepage";
import SearchPage from "./pages/SearchPage";
import UserProfilepage from "./pages/UserProfilepage";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/my-profile" element={<UserProfilepage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
