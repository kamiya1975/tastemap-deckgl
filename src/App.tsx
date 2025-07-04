import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import ProductPage from "./ProductPage";

function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/products/:jan" element={<ProductPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Root;