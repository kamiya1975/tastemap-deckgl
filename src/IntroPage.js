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

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate("/store");
    }
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
      }}
    >
      {/* スキップボタン */}
      <button
        onClick={() => navigate("/store")}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 10,
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          border: "none",
          padding: "6px 12px",
          borderRadius: "4px",
          fontSize: "0.9rem",
        }}
      >
        スキップ
      </button>

      {/* 画像スライダー */}
      <div
        style={{ flex: 1, overflow: "hidden" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[currentIndex]}
          alt={`slide-${currentIndex + 1}`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* インジケーター */}
      <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
        {images.map((_, index) => (
          <div
            key={index}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: index === currentIndex ? "#000" : "#ccc",
              margin: "0 5px",
            }}
          />
        ))}
      </div>

      {/* 次へボタン */}
      <div style={{ padding: "20px", textAlign: "center" }}>
        <button
          onClick={handleNext}
          style={{
            width: "80%",
            fontSize: "1.2rem",
            padding: "12px",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          次へ
        </button>
      </div>
    </div>
  );
}
