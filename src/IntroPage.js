import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function IntroPage() {
  const navigate = useNavigate();
  const images = ["/slide1.png", "/slide2.png", "/slide3.png"]; // 画像は public フォルダに配置
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextSlide = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate("/store"); // 最後の画像なら遷移
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
        justifyContent: "space-between",
        backgroundColor: "#fff",
      }}
    >
      {/* スライドエリア */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img
          src={images[currentIndex]}
          alt={`画像${currentIndex + 1}`}
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
          onClick={handleNextSlide}
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
