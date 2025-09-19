import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  // ✅ popup state
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: true,
  });

  const navigate = useNavigate();

  // cloudinary
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("upload_preset", "abhishek");
    formData.append("file", file);

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dm7wnamde/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        setImageUrl(data.secure_url);

        // ✅ Success popup after upload
        alert("✅ Image uploaded successfully!");
      } else {
        alert("❌ Image upload failed, please try again!");
      }
    } catch (err) {
      alert("❌ Error while uploading image!");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem("image", imageUrl);
    const userData = { name, email, password, image: imageUrl };

    try {
      const sendData = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const res = await sendData.json();

      // ✅ FIX: comparison instead of assignment
      if (res.code === 200) {
        setPopup({
          show: true,
          message: "✅ Registered successfully!",
          success: true,
        });
        setTimeout(() => {
          navigate("/Home");
        }, 1500);
      } else {
        setPopup({
          show: true,
          message: "❌ Something went wrong!",
          success: false,
        });
      }
    } catch (err) {
      setPopup({ show: true, message: "⚠️ Server error!", success: false });
    }
  };

  return (
    <div className="h-screen flex relative">
      {/* ✅ Popup */}
      {popup.show && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 20, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold z-50 ${
            popup.success ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {popup.message}
        </motion.div>
      )}

      <motion.div
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full flex items-center justify-center bg-gray-100"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="w-96 p-8 bg-white rounded-2xl shadow-2xl"
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1wov_8TKaQ7XGdarX4kX2Lp8_Dmw7id6TH2dikmfYK--KCOP7OYFQCS5RApdBSG-c0XY&usqp=CAU"
            className="h-30 w-30 ml-25 rounded-full"
          ></img>
          <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">
            {isLogin ? "Login" : "Register"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <motion.input
                type="text"
                name="name"
                placeholder="Username"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <div className="flex">
              {!isLogin && (
                <motion.input
                  type="file"
                  name="image"
                  placeholder="Profile picture"
                  className="w-50 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
              )}
              {!isLogin && file && (
                <button
                  type="button"
                  onClick={handleUpload}
                  className="w-full ml-8 rounded-lg bg-green-400 font-sans"
                >
                  Add
                </button>
              )}
            </div>
            <motion.input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              whileFocus={{ scale: 1.02 }}
              required
            />
            <motion.input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              whileFocus={{ scale: 1.02 }}
              required
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition"
            >
              {isLogin ? "Login" : "Register"}
            </motion.button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 font-semibold hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
