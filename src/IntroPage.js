import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function IntroPage() {
  const navigate = useNavigate();
  const images = ["/slide1.png", "/slide2.png", "/slide3.png"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const startXRef = useRef(null);

  const handleTouchStart = (e) => {
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!startXRef.current) return;
    const deltaX = e.changedTouches[0].clientX - startXRef.current;
    if (deltaX > 50 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (deltaX < -50 && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    startXRef.current = null;
  };

  return (
    <div
      style={{
        height: "100vh",
        maxWidth: "480px",
        margin: "0 auto",
        border: "8px solid black",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        position: "relative",
        boxSizing: "border-box",
        justifyContent: "space-between",
        padding: "40px 20px 60px",
      }}
    >
      {/* スライダーエリア */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          height: "60%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={images[currentIndex]}
          alt={`slide-${currentIndex + 1}`}
          style={{
            width: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            border: "2px solid black",
          }}
        />
      </div>

      {/* インジケーター */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        {images.map((_, index) => (
          <div
            key={index}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: index === currentIndex ? "#555" : "#ccc",
              margin: "0 5px",
            }}
          />
        ))}
      </div>

      {/* スキップボタン */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          onClick={() => navigate("/store")}
          style={{
            fontSize: "1.1rem",
            padding: "12px 24px",
            border: "2px solid #33aaff",
            color: "#33aaff",
            background: "white",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          スキップ
        </button>
      </div>
    </div>
  );
}
