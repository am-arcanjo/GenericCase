import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";

export default function NavigationRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={Home} />
        <Route path="/lobby" element={Lobby} />
      </Routes>
    </BrowserRouter>
  );
}
