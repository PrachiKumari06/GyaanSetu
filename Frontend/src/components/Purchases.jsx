import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // directly get token

  // Redirect if not logged in
  useEffect(() => {
    setIsLoggedIn(!!token);
    if (!token) navigate("/login");
  }, [token, navigate]);

  // Fetch purchases
  useEffect(() => {
    const fetchPurchases = async () => {
      if (!token) return;
      try {
        const response = await axios.get(
          "http://localhost:5001/api/v1/user/purchased-courses",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setPurchases(response.data?.courseData || response.data?.purchases || []);
      } catch (error) {
        setErrorMessage(error?.response?.data?.errors || "Failed to fetch purchase data");
      }
    };
    fetchPurchases();
  }, [token]);

  // Logout
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5001/api/v1/user/logout", { withCredentials: true });
      toast.success("Logout successful");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.errors || "Error logging out");
    } finally {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      navigate("/login");
    }
  };

  // Sidebar toggle
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Normalize purchases
  const displayPurchases = Array.isArray(purchases)
    ? purchases.map((p) => {
        const courseObj = p?.course || p?.courseId || p;
        return {
          _id: courseObj?._id,
          title: courseObj?.title || "Untitled",
          description: courseObj?.description || "",
          price: courseObj?.price || "",
          image: courseObj?.image || {},
        };
      })
    : [];

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gradient-to-r from-black to-blue-950 p-5 transform  ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-50`}
      >
         <div className="flex items-center mb-10 mt-10 md:mt-0">
                  <img src={logo} alt="Profile" className="rounded-full h-12 w-12" />
                </div>
        <nav>
          <ul className="mt-16 md:mt-0">
            <li className="mb-4">
              <Link to="/" className="flex items-center  text-white hover:text-orange-500 duration-300">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/courses" className="flex items-center  text-white hover:text-orange-500 duration-300">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/purchases" className="flex items-center text-orange-500">
                <FaDownload className="mr-2" /> Purchases
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/settings" className="flex items-center  text-white hover:text-orange-500 duration-300">
                <IoMdSettings className="mr-2" /> Settings
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button type="button" onClick={handleLogout} className="flex items-center  text-white hover:text-orange-500 duration-300">
                  <IoLogOut className="mr-2" /> Logout
                </button>
              ) : (
                <Link to="/login" className="flex items-center  text-white hover:text-orange-500 duration-300">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar toggle button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-orange-600 text-white p-2 rounded-lg"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
      </button>

      {/* Main Content */}
      <div className={`flex-1 p-8 bg-gradient-to-r from-blue-950 to-black transition-all duration-300 overflow-x-hidden ${isSidebarOpen ? "ml-64" : "ml-0"} md:ml-67`}>
        <h2 className="text-xl font-bold mt-9 md:mt-0 mb-6 text-orange-500">My Purchases :-</h2>

        {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}

        {displayPurchases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayPurchases.map((purchase) => (
              <div key={purchase._id} className="border border-gray-700 bg-gray-900/70 rounded-lg shadow-md p-6">
                <div className="flex flex-col items-center space-y-4">
                  <img
                    className="rounded-lg w-full h-48 object-contain"
                    src={purchase.image?.url || "https://via.placeholder.com/200"}
                    alt={purchase.title}
                  />
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-white">{purchase.title}</h3>
                    <p className="text-gray-600">
                      {purchase.description.length > 100
                        ? `${purchase.description.slice(0, 100)}...`
                        : purchase.description}
                    </p>
                    <span className="font-bold text-white font-semibold text-sm mt-2 block">
  {purchase.price ? `₹${purchase.price} only` : ""}
</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-xl">You have no purchases yet.</p>
        )}
      </div>
    </div>
  );
}

export default Purchases;
