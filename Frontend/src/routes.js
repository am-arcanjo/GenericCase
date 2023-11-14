import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import Area from "./pages/Area";

export default function NavigationRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/area/:id" element={<Area />} />
      </Routes>
    </BrowserRouter>
  );
}
