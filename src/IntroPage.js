import React from "react";
import { useNavigate } from "react-router-dom";

export default function IntroPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>ワインマップ</h1>
      <p>あなたに合うワインを見つけましょう</p>
      <button
        onClick={() => navigate("/store")}
        style={{
          fontSize: "1.2rem",
          padding: "10px 20px",
          cursor: "pointer",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      >
        はじめる
      </button>
    </div>
  );
}
