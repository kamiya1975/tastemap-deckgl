// src/IntroPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const slides = [
  { id: 1, color: 'blue', label: '説明１' },
  { id: 2, color: 'yellow', label: '説明２' },
  { id: 3, color: 'red', label: '説明３' },
];

export default function IntroPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handleScroll = (e) => {
    const index = Math.round(e.target.scrollLeft / window.innerWidth);
    setCurrentIndex(index);
  };

  const handleStart = () => {
    navigate('/store'); // ← 小文字でOK
  };

  return (
    <div className="intro-wrapper">
      <div className="slides-container" onScroll={handleScroll}>
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="slide"
            style={{ backgroundColor: slide.color }}
          >
            <span style={{ fontSize: '24px', color: slide.color === 'yellow' ? '#000' : '#fff' }}>
              {slide.label}
            </span>
          </div>
        ))}
      </div>

      <div className="indicator">
        {slides.map((_, index) => (
          <div key={index} className={`dot ${index === currentIndex ? 'active' : ''}`} />
        ))}
      </div>

      <div className="footer-button">
        {currentIndex < slides.length - 1 ? (
          <button onClick={() => navigate('/store')}>スキップ</button>
        ) : (
          <button onClick={handleStart}>はじめる</button>
        )}
      </div>
    </div>
  );
}
