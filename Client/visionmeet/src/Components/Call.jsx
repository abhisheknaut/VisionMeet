import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhoneSlash,
  faArrowLeft,
  faMicrophoneLines,
  faCamera,
  faLink,
  faMicrophoneSlash,
  faCameraRotate,
} from "@fortawesome/free-solid-svg-icons";
import io from "socket.io-client";
import { set } from "mongoose";

// Connect to backend signaling server
const socket = io("https://visionmeet-pgte.onrender.com");


const HostPage = () => {
  const { id } = useParams(); // roomId from URL
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [stream, setStream] = useState(null);
  const [customId, setCustomId] = useState("");
  const [ count ,setCount] = useState()
  const roomId = id;
  useEffect(() => {
    const initStream = async () => {
      try {
        // 1. Get user media

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }

        // 2. Create RTCPeerConnection
        peerConnection.current = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        // Add local tracks
        mediaStream.getTracks().forEach((track) => {
          peerConnection.current.addTrack(track, mediaStream);
        });

        // Remote stream
        peerConnection.current.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // ICE candidates
        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", {
              candidate: event.candidate,
              roomId,
            });
          }
        };

        // 3. Join room
        socket.emit("join-room", roomId);

        // 4. When a new user joins → create & send offer
        socket.on("user-joined", async () => {
          const offer = await peerConnection.current.createOffer();
          await peerConnection.current.setLocalDescription(offer);
          socket.emit("offer", { offer, roomId });
        });

        // 5. Receive offer → set remote desc → create & send answer
        socket.on("offer", async ({ offer }) => {
          if (!peerConnection.current.currentRemoteDescription) {
            await peerConnection.current.setRemoteDescription(
              new RTCSessionDescription(offer)
            );
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            socket.emit("answer", { answer, roomId });
          }
        });

        // 6. Receive answer → set remote desc
        socket.on("answer", async ({ answer }) => {
          if (!peerConnection.current.currentRemoteDescription) {
            await peerConnection.current.setRemoteDescription(
              new RTCSessionDescription(answer)
            );
          }
        });

        // 7. Receive ICE candidate
        socket.on("ice-candidate", async ({ candidate }) => {
          try {
            await peerConnection.current.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          } catch (err) {
            console.error("Error adding ICE candidate", err);
          }
        });
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
      const handleCopy = async () => {
        await navigator.clipboard.writeText(roomId);
        alert("Copied : ", roomId);
      };
    };

    initStream();

    return () => {
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [id]);

  // Toggle camera
  const toggleCamera = () => {
    if (stream) {
      stream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setIsCameraOn((prev) => !prev);
    }
  };

  // Toggle mic
  const toggleMic = () => {
    if (stream) {
      stream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setIsMicOn((prev) => !prev);
    }
  };
  useEffect(()=>{
    setCustomId(roomId)
  },[customId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center p-4 bg-blue-600 text-white">
        <div className="flex ml-1.5 ">
          <Link to="/callpage">
            <FontAwesomeIcon icon={faArrowLeft} size="2x" color="white" />
          </Link>
        </div>
        <div className="text-sm">
          Room ID: <p className="underline">{id}</p>
        </div>
      </header>

      {/* Video Area */}
      <main className="flex-1 flex flex-col items-center justify-center gap-4">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="rounded-2xl shadow-lg w-3/4 max-w-3xl bg-black"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="rounded-2xl shadow-lg w-3/4 max-w-3xl bg-black"
        />
        <p className="mt-2 text-gray-600">Connected to room...</p>
      </main>

      {/* Controls */}
      <footer className="flex justify-center gap-6 p-4 bg-gray-100 border-t">
        <button
          onClick={toggleMic}
          className={`px-4 py-2 rounded-full ${
            isMicOn ? "bg-blue-500" : "bg-red-500"
          } text-white`}
        >
          {isMicOn ? 
            <FontAwesomeIcon icon={faMicrophoneLines} size="1x" color="white" />
          : 
            <FontAwesomeIcon icon={faMicrophoneSlash} size="1x"color="white"/>
          }
        </button>

        <button
          onClick={toggleCamera}
          className={`px-4 py-2 rounded-full ${
            isCameraOn ? "bg-blue-500" : "bg-red-500"
          } text-white`}
        >
          {isCameraOn ? (
            <FontAwesomeIcon icon={faCamera} size="1x" color="white" />
          ) : (
            <FontAwesomeIcon icon={faCameraRotate} size="1x" color="white"/>
          )}
        </button>

        <button
          onClick={async() => {
            await navigator.clipboard.writeText(customId).then(
              alert("Copied")
            )
          }}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white"
        >
          <FontAwesomeIcon icon={faLink} size="1x" color="white" />
        </button>

        <button
          className="bg-red-500 px-3 py-1 rounded-full hover:bg-red-600"
          onClick={() => {
            initStream = function () {}
            ( navigate("/callpage"));
          }}
        >
          <FontAwesomeIcon icon={faPhoneSlash} size="1x" color="white" />
        </button>
      </footer>
    </div>
  );
};

export default HostPage;

