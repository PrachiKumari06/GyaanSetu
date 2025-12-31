import React from "react";
import { Link } from "react-router-dom";
import Navbaar from "./Navbar";
import logo from "../assets/logo.png";
import { FaBookOpen, FaUsers, FaRocket } from "react-icons/fa";

export default function About() {
  return (
    <div className="bg-gradient-to-r from-black to-blue-950 w-full overflow-x-hidden text-white">
      <Navbaar />

      <div className="min-h-screen px-6 md:px-16 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-orange-400">
            About GyaanSetu
          </h1>
          <p className="text-gray-400 mt-4 md:w-2/3 mx-auto">
            GyaanSetu is a learning platform built to bridge the gap between
            knowledge and real-world skills. Our goal is to make quality
            education accessible, practical, and engaging for everyone.
          </p>
        </section>

        {/* Mission / Vision */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          <div className="bg-gray-900 p-8 rounded-lg text-center hover:scale-105 duration-300">
            <FaBookOpen className="text-4xl text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
            <p className="text-gray-400">
              To provide structured, easy-to-understand courses that help
              learners build real skills and confidence.
            </p>
          </div>

          <div className="bg-gray-900 p-8 rounded-lg text-center hover:scale-105 duration-300">
            <FaUsers className="text-4xl text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Our Community</h3>
            <p className="text-gray-400">
              We believe learning grows faster in a supportive community where
              learners share knowledge and grow together.
            </p>
          </div>

          <div className="bg-gray-900 p-8 rounded-lg text-center hover:scale-105 duration-300">
            <FaRocket className="text-4xl text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
            <p className="text-gray-400">
              To become a trusted platform where learners can upgrade skills
              and unlock new career opportunities.
            </p>
          </div>
        </section>

        {/* Why GyaanSetu */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-orange-400 mb-6 text-center">
            Why Choose GyaanSetu?
          </h2>
          <div className="max-w-4xl mx-auto text-gray-400 space-y-4 text-center">
            <p>✔ Beginner-friendly and practical courses</p>
            <p>✔ Focus on real-world skills, not just theory</p>
            <p>✔ Affordable and accessible learning</p>
            <p>✔ Clean and distraction-free learning experience</p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Start Your Learning Journey Today
          </h2>
          <p className="text-gray-400 mb-6">
            Explore our courses and take the first step toward upgrading your
            skills.
          </p>
          <Link
            to="/courses"
            className="bg-orange-500 px-6 py-3 rounded font-semibold hover:bg-white hover:text-black duration-300"
          >
            Explore Courses
          </Link>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-700 py-8 text-center">
        <div className="flex justify-center items-center gap-2 mb-2">
          <img src={logo} alt="logo" className="w-8 h-8 rounded-full" />
          <span className="text-orange-400 font-bold text-lg">GyaanSetu</span>
        </div>
        <p className="text-gray-500 text-sm">
          © 2025 GyaanSetu. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
