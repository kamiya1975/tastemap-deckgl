import React from "react";
import { Routes, Route } from "react-router-dom";
import IntroPage from "./IntroPage";
import StorePage from "./StorePage";
import SliderPage from "./SliderPage";
import MapPage from "./MapPage";
import ProductPage from "./ProductPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<IntroPage />} />
      <Route path="/store" element={<StorePage />} />
      <Route path="/slider" element={<SliderPage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/products/:jan" element={<ProductPage />} />
    </Routes>
  );
}

export default App;
