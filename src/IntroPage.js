import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // スタイルは適宜調整

const slides = [
  {
    id: 1,
    color: 'white',
    content: (
      <>
        <img
          src="/img/slide1.png" // ← 必要に応じて適切な画像パスへ
          alt="基準のワイン"
          style={{ maxWidth: '60%', marginBottom: '20px' }}
        />
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>基準のワイン</h2>
        <p style={{ lineHeight: '1.8em' }}>
          ワインの真ん中の味である<br />
          基準のワインを飲み<br />
          その味を基準に<br />
          自分の好みを知ることができます。
        </p>
        <p style={{ marginTop: '10px' }}>その基準があなたのコンパスです。</p>
      </>
    ),
  },
  {
    id: 2,
    color: 'white',
    content: (
      <>
        <img
          src="/img/slide2.png"
          alt="TasteMap"
          style={{ maxWidth: '60%', marginBottom: '20px' }}
        />
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>TasteMap</h2>
        <p style={{ lineHeight: '1.8em' }}>
          コンパスである基準のワインから発見した<br />
          あなたの好みに近いワインを飲んで評価し、<br />
          あなただけの地図を作りましょう。
        </p>
      </>
    ),
  },
  {
    id: 3,
    color: '#f8f8f8',
    content: (
      <>
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>味覚マップを保存しよう</h2>
        <p style={{ lineHeight: '1.8em' }}>
          ワインの評価を記録すると、<br />
          あなた専用の味覚地図が育っていきます。
        </p>
        <p style={{ marginTop: '10px' }}>登録すれば、いつでもどこでも地図を再開できます。</p>
        <div style={{ marginTop: '20px' }}>
          <button style={buttonStyle} onClick={() => navigate('/register')}>
            登録してはじめる
          </button>
          <button style={secondaryButtonStyle} onClick={() => navigate('/map')}>
            ゲストとして試す
          </button>
        </div>
      </>
    ),
  },
];

export default function IntroPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handleScroll = (e) => {
    const index = Math.round(e.target.scrollLeft / window.innerWidth);
    setCurrentIndex(index);
  };

  const handleSkip = () => {
    navigate('/map'); // ゲスト扱い
  };

  return (
    <div className="intro-wrapper">
      <div className="slides-container" onScroll={handleScroll}>
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="slide"
            style={{
              backgroundColor: slide.color,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100vw',
              height: '100vh',
              padding: '20px',
              boxSizing: 'border-box',
              scrollSnapAlign: 'start',
              flexShrink: 0,
            }}
          >
            {slide.content}
          </div>
        ))}
      </div>

      <div className="indicator">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>

      <div className="footer-button">
        {currentIndex < slides.length - 1 ? (
          <button onClick={handleSkip}>スキップ</button>
        ) : null}
      </div>
    </div>
  );
}

// スタイル定義
const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: '#333',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  margin: '10px',
};

const secondaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#aaa',
};

