import React from "react";
import Authentication from "./Components/Authentication";
import Home from "./Components/Home";
import Protected from "./Components/ProtectRoute";
import { Route, Routes } from "react-router-dom";
import CallPage from "./Components/CallPage";
import Call from "./Components/Call";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Authentication />}></Route>
        <Route path="/Home" element={<Home />}></Route>
        <Route path="/callpage" element={<CallPage />}></Route>
        <Route path="/call/:id" element={<Call />}></Route>
      </Routes>
    </div>
  );
}

export default App;
