const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const userModel = require("./model");
const { Server } = require("socket.io");
const http = require("http");

// ✅ create http server and socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:'*', // React frontend
    credentials: true,
  },
});

app.use(cors());

let sockets = [];

// ✅ socket.io signaling logic
io.on("connection", (socket) => {
  console.log("✅ New socket connected:", socket.id);

  sockets.push(socket.id);

  // Join room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`📌 User ${socket.id} joined room ${roomId}`);
    socket.to(roomId).emit("user-joined", socket.id);
  });
  socket.on("videoarea", (sockets) => {
    socket.to(sockets).emit("videoarea", sockets);
  });

  // Handle offer
  socket.on("offer", ({ offer, roomId }) => {
    console.log(`📡 Offer received from ${socket.id} in room ${roomId}`);
    socket.to(roomId).emit("offer", { offer, from: socket.id });
  });

  // Handle answer
  socket.on("answer", ({ answer, roomId }) => {
    console.log(`📡 Answer received from ${socket.id} in room ${roomId}`);
    socket.to(roomId).emit("answer", { answer, from: socket.id });
  });

  // Handle ICE candidates
  socket.on("ice-candidate", ({ candidate, roomId }) => {
    console.log(`❄️ ICE candidate from ${socket.id} in room ${roomId}`);
    socket.to(roomId).emit("ice-candidate", { candidate, from: socket.id });
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
    sockets.filter((id) => id !== socket.id);
  });
});

// ✅ middleware
app.use(express.json());
app.use(cookieParser());

// --- REST APIs (auth) ---
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", async (req, res) => {
  const { name, email, password, image } = req.body;

  try {
    if (name) {
      // Register
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Email already used" }); // conflict
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await userModel.insertOne({
        email,
        password: hashedPassword,
        name,
        image,
      });

      const token = jwt.sign({ email }, "secret_key", { expiresIn: "1d" });

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Successfully SignUp", email: email });
    } else {
      // Login
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }
      const token = jwt.sign({ email }, "secret_key", { expiresIn: "1d" });
      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // true in prod
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res
        .status(200)
        .json({ code: 200, message: "Successfully Login", email: email });
    }
  } catch (err) {
    console.error("❌ Server Error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // true in production
    sameSite: "lax",
  });
  return res.status(200).json({ message: "Logged out successfully" });
});

// Call route just for debug
app.get("/call/:id", async (req, res) => {
  const url = req.params.id;
  console.log("Call room requested:", url);
  res.send(`Room ID: ${url}`);
});

// ❌ fix: use `server.listen`, not `app.listen`
server.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});


