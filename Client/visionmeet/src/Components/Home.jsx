// HomePage.jsx
import React from "react";
import { motion } from "framer-motion";
import { FiLogOut, FiVideo, FiUsers, FiShield, FiZap } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import "@fontsource/poppins"; // install with: npm i @fontsource/poppins

const HomePage = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    const res = await fetch("http://localhost:4000/logout");
    if (res.status === 200) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900 font-[Poppins] flex flex-col">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="flex items-center justify-between px-8 py-4 shadow bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-blue-200"
      >
        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-extrabold text-blue-600"
        >
          VisionMeet
        </motion.h1>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-5 py-2 rounded-xl shadow hover:bg-blue-500 transition"
        >
          <FiLogOut size={20} /> Logout
        </motion.button>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="flex flex-col items-center justify-center text-center px-6 mt-20"
      >
        <img src="https://i.gadgets360cdn.com/large/google_meet_1587045951213.jpg" className="w-90">
        </img>
        <h2 className="text-5xl md:text-6xl font-extrabold text-blue-700 mb-6 mt-3">
          Welcome to VisionMeet
        </h2>
        <p className="text-gray-600 text-lg max-w-3xl leading-relaxed">
          VisionMeet is a next-gen video conferencing platform built with{" "}
          
          . Enjoy secure, smooth, and real-time meetings designed for students,
          professionals, and communities worldwide.
        </p>

        <Link to="/callpage">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-10 bg-blue-600 text-white font-bold px-8 py-3 rounded-xl shadow hover:bg-blue-500 transition"
          >
            🚀 Start a Meeting
          </motion.button>
        </Link>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 1 }}
        className="px-8 py-20 flex-1"
      >
        <h3 className="text-4xl font-bold text-center mb-12 text-blue-600">
          Why Choose VisionMeet?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-md border border-blue-100"
          >
            <FiVideo size={40} className="text-blue-600 mb-4" />
            <h4 className="text-xl font-semibold mb-2">HD Video Calls</h4>
            <p className="text-gray-600 text-sm">
              Enjoy crystal-clear video and audio for seamless meetings with
              your team.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-md border border-blue-100"
          >
            <FiUsers size={40} className="text-blue-500 mb-4" />
            <h4 className="text-xl font-semibold mb-2">Group Meetings</h4>
            <p className="text-gray-600 text-sm">
              Host group sessions with real-time chat, screen sharing, and
              collaboration.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-md border border-blue-100"
          >
            <FiShield size={40} className="text-blue-400 mb-4" />
            <h4 className="text-xl font-semibold mb-2">
              Secure Authentication
            </h4>
            <p className="text-gray-600 text-sm">
              JWT-based authentication ensures only authorized users can join.
            </p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-md border border-blue-100"
          >
            <FiZap size={40} className="text-blue-300 mb-4" />
            <h4 className="text-xl font-semibold mb-2">Fast & Reliable</h4>
            <p className="text-gray-600 text-sm">
              Lightweight architecture gives smooth performance, even on low
              bandwidth.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-black border-t border-blue-200 text-gray-600 text-sm py-6 text-center">
          <p>© {new Date().getFullYear()} VisionMeet. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
