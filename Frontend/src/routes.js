import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./App";
import Lobby from "./pages/Lobby";

export default function NavigationRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/lobby" element={<Lobby />} />
      </Routes>
    </BrowserRouter>
  );
}
