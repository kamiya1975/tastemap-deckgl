// src/StorePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function StorePage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>店舗を選んでください</h1>
      <button
        onClick={() => navigate("/slider")}
        style={{
          fontSize: "1.2rem",
          padding: "10px 20px",
          cursor: "pointer",
          borderRadius: "4px",
          border: "1px solid #ccc",
          marginTop: "20px",
        }}
      >
        次へ
      </button>
    </div>
  );
}
