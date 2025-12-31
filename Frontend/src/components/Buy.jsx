import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function Buy() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const navigate = useNavigate();

  const token = (() => {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const fetchCourse = async () => {
      if (!token) return;
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/course/${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setCourse(response.data.course);
      } catch (error) {
        console.log("Error fetching course: ", error);
        toast.error("Failed to fetch course details");
      }
    };

    const fetchTotalPurchases = async () => {
      if (!token) return;
      try {
        const response = await axios.get(
          "http://localhost:5001/api/v1/user/purchased",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        const purchases = response.data.courseData || [];
        const total = purchases.reduce(
          (sum, item) => sum + (item.price || 0),
          0
        );
        setTotalPurchases(total);
      } catch (error) {
        console.log("Error fetching total purchases: ", error);
      }
    };

    fetchCourse();
    fetchTotalPurchases();
  }, [courseId, token]);

  const handlePurchase = async () => {
    if (
      !token ||
      token.trim() === "" ||
      token === "null" ||
      token === "undefined"
    ) {
      toast.error("Please login to purchase the course");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `http://localhost:5001/api/v1/course/buy/${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const message = response?.data?.message || "";

      if (message.toLowerCase().includes("already purchased")) {
        toast.error("You have already purchased this course");
        setTimeout(() => navigate("/purchases"), 500);
        return;
      }

      toast.success(message || "Course purchased successfully");
      setTimeout(() => navigate("/purchases"), 500);
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "";
      if (
        error.response?.status === 400 ||
        msg.toLowerCase().includes("already purchased")
      ) {
        toast.error("You have already purchased this course");
        setTimeout(() => navigate("/purchases"), 1200);
      } else if (error.response?.status === 401) {
        toast.error("Please login again");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(msg || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="flex flex-col items-center justify-center py-4 space-y-1 px-4 bg-gradient-to-b from-gray-900 to-gray-700">
      <Toaster position="top-center" />

      {course && (
        <div className="bg-gray-900 p-3 rounded-lg shadow-lg w-full max-w-md text-white space-y-3 border-amber-500 border-2">
          {/* Course Image */}
          <img
            src={course.image?.url}
            alt={course.title}
            className="rounded mb-4 w-full h-48 object-cover"
          />
          {/* Title and Description */}
          <h2 className="text-xl font-bold">{course.title}</h2>
          <p className="text-gray-400">{course.description}</p>
          {/* Price */}
          <div className="flex justify-between items-center mt-2">
            <span className="font-bold text-lg">
              ₹{course.price}{" "}
              <span className="line-through text-gray-500 pl-2">
                ₹{Math.round(course.price * 1.2)}
              </span>
            </span>
            <span className="text-green-600">20% off</span>
          </div>
          {/* Why Choose This Course Section */}{" "}
          <div className="bg-gray-800 p-4 rounded-lg mt-4 text-white">
            {" "}
            <h3 className="font-bold mb-2">Why Choose This Course?</h3>{" "}
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {" "}
              <li>Practical, hands-on lessons to build real skills</li>{" "}
              <li>Learn from industry experts with years of experience</li>{" "}
              <li>Lifetime access to course materials</li>{" "}
            </ul>{" "}
          </div>{" "}
        </div>
      )}

      <div className="text-orange-500">
        Total Purchases:{" "}
        <span className="font-bold">₹{course ? course.price : 0}</span>
      </div>

      <button
        className="bg-orange-500 text-white px-6 py-3 rounded-lg"
        onClick={handlePurchase}
        disabled={loading}
      >
        {loading ? "Processing..." : "Buy Now"}
      </button>
    </div>
  );
}
export default Buy;
