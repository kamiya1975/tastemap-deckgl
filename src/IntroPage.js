import React, { useState, useRef, useEffect } from "react";
import "./SliderIntro.css";

const slides = [
  { color: "#007bff", label: "青" },
  { color: "#ffc107", label: "黄" },
  { color: "#dc3545", label: "赤" },
];

export default function SliderIntro({ onFinish }) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    // 初期表示時に先頭へ
    if (containerRef.current) {
      containerRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
    setIndex(0);
  }, []);

  const handleNext = () => {
    if (index < slides.length - 1) {
      const newIndex = index + 1;
      setIndex(newIndex);
      containerRef.current.scrollTo({
        left: containerRef.current.clientWidth * newIndex,
        behavior: "smooth",
      });
    } else {
      onFinish(); // 最後のスライドで「はじめる」押されたとき
    }
  };

  const handleScroll = () => {
    const newIndex = Math.round(
      containerRef.current.scrollLeft / containerRef.current.clientWidth
    );
    setIndex(newIndex);
  };

  return (
    <div className="intro-wrapper">
      <div className="slides-container" ref={containerRef} onScroll={handleScroll}>
        {slides.map((slide, idx) => (
          <div className="slide" key={idx} style={{ backgroundColor: slide.color }}>
            <h1>{slide.label}</h1>
          </div>
        ))}
      </div>
      <div className="indicator">
        {slides.map((_, idx) => (
          <span key={idx} className={`dot ${idx === index ? "active" : ""}`} />
        ))}
      </div>
      <div className="footer-button">
        <button onClick={handleNext}>
          {index === slides.length - 1 ? "はじめる" : "つぎへ"}
        </button>
      </div>
    </div>
  );
}
