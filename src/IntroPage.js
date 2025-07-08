import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // App.css に必要なクラスが含まれている前提

const slides = [
  { id: 1, color: 'blue', label: '画像 1' },
  { id: 2, color: 'yellow', label: '画像 2' },
  { id: 3, color: 'red', label: '画像 3' },
];

function SliderIntro() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handleScroll = (e) => {
    const index = Math.round(e.target.scrollLeft / window.innerWidth);
    setCurrentIndex(index);
  };

  const handleStart = () => {
    navigate('/StorePage');
  };

  return (
    <div className="intro-wrapper">
      <div className="slides-container" onScroll={handleScroll}>
        {slides.map((slide, index) => (
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

      {/* スライドインジケーター */}
      <div className="indicator">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* フッターボタン */}
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

export default SliderIntro;
