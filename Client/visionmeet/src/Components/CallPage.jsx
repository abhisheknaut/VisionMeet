// Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { FiVideo, FiUsers } from "react-icons/fi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Home from "./Home";


const CallPage = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const [user ,setUser ] =useState("")
  const userImage = localStorage.getItem("image")
  

  const handleHost = () => {
    const newRoom = crypto.randomUUID(); // generate unique room id
    navigate(`/call/${newRoom}`);
  };

  const handleJoin = async() => {
    console.log("user with", roomId);
    navigate(`/call/${roomId}`);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex flex-col items-center font-sans">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md px-8 py-4 flex justify-between items-center">
        <div className="flex">
          <Link to="/Home">
            <FontAwesomeIcon icon={faArrowLeft} size="2x" color="black" />
          </Link>
          <h1 className="text-2xl font-bold text-blue-700 ml-2">VisionMeet</h1>
        </div>
        <img src={userImage} className="h-12 w-12 rounded-full size-2.5" ></img>
      </nav>

      {/* Dashboard Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <img src="https://i.gadgets360cdn.com/large/google_meet_1587045951213.jpg"
        className="mt-8 w-90">
        </img>
        <h2 className="text-4xl md:text-5xl font-bold text-blue-700 mb-6">
          Welcome to VisionMeet
        </h2>
        <p className="text-gray-600 max-w-xl mb-12">
          Host or Join high-quality video calls seamlessly. Share the room ID
          with friends and collaborate in real-time with audio, video, and
          screen sharing.
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Host Card */}
          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center w-72">
            <FiVideo size={40} className="text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Host a Call</h3>
            <p className="text-gray-500 text-sm mb-4">
              Create a new meeting room and invite participants.
            </p>
            <button
              onClick={handleHost}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
            >
              Start Hosting
            </button>
          </div>

          {/* Join Card */}
          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center w-72">
            <FiUsers size={40} className="text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Join a Call</h3>
            <p className="text-gray-500 text-sm mb-4">
              Enter a room ID to join an existing meeting.
            </p>
            <form onSubmit={(e)=>
              handleSubmit(e)}>
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="border px-3 py-2 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                onClick={handleJoin}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition"
              >
                Join Call
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-black py-4 text-center text-gray-500 text-sm shadow-inner">
        © {new Date().getFullYear()} VisionMeet. All rights reserved.
      </footer>
    </div>
  );
};

export default CallPage;
