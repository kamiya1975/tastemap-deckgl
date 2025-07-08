import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function IntroPage() {
  const navigate = useNavigate();
  const slides = [
    { color: "#2196f3", label: "画像 1" }, // 青
    { color: "#ffeb3b", label: "画像 2" }, // 黄
    { color: "#f44336", label: "画像 3" }, // 赤
  ];
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
    } else if (deltaX < -50 && currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    startXRef.current = null;
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* スライド本体 */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: slides[currentIndex].color,
          color: currentIndex === 1 ? "#000" : "#fff",
          fontSize: "24px",
          fontWeight: "bold",
          userSelect: "none",
        }}
      >
        {slides[currentIndex].label}
      </div>

      {/* インジケータ */}
      <div style={{ textAlign: "center", margin: "12px 0" }}>
        {slides.map((_, index) => (
          <span
            key={index}
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              margin: "0 5px",
              borderRadius: "50%",
              backgroundColor: currentIndex === index ? "#333" : "#ccc",
            }}
          />
        ))}
      </div>

      {/* 固定ボタン */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          left: 0,
          width: "100%",
          textAlign: "center",
        }}
      >
        <button
          onClick={() => navigate("/store")}
          style={{
            fontSize: "1.2rem",
            padding: "12px 32px",
            background: "black",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          次へ
        </button>
      </div>
    </div>
  );
}
