import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

export default function IntroPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // 登録フォームの状態管理（Hookはここで定義）
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [gender, setGender] = useState('');

  const handleScroll = (e) => {
    const index = Math.round(e.target.scrollLeft / window.innerWidth);
    setCurrentIndex(index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nickname || !password || !birthYear || !birthMonth || !gender) {
      alert('すべての項目を入力してください');
      return;
    }
    const formData = {
      nickname,
      password,
      birth: `${birthYear}-${birthMonth}`,
      gender,
    };
    console.log('登録データ:', formData);
    navigate('/map');
  };

  const slides = getSlides(
    navigate,
    {
      nickname,
      password,
      showPassword,
      birthYear,
      birthMonth,
      gender,
    },
    {
      setNickname,
      setPassword,
      setShowPassword,
      setBirthYear,
      setBirthMonth,
      setGender,
    },
    handleSubmit
  );

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
              overflowY: 'auto',
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
    </div>
  );
}

function getSlides(navigate, state, setters, handleSubmit) {
  const {
    nickname,
    password,
    showPassword,
    birthYear,
    birthMonth,
    gender,
  } = state;

  const {
    setNickname,
    setPassword,
    setShowPassword,
    setBirthYear,
    setBirthMonth,
    setGender,
  } = setters;

  return [
    {
      id: 1,
      color: 'white',
      content: (
        <>
          <img src="/img/slide1.png" alt="基準のワイン" style={{ maxWidth: '60%', marginBottom: '20px' }} />
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
          <img src="/img/slide2.png" alt="TasteMap" style={{ maxWidth: '60%', marginBottom: '20px' }} />
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
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
  {/* ニックネーム */}
  <label style={styles.label}>ニックネーム</label>
  <input
    type="text"
    value={nickname}
    onChange={(e) => setNickname(e.target.value)}
    style={styles.input}
    placeholder="例：ワイン好き太郎"
  />

  {/* パスワード */}
  <label style={styles.label}>パスワード</label>
  <div style={{ position: 'relative' }}>
    <input
      type={showPassword ? 'text' : 'password'}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      style={styles.input}
      placeholder="●●●●●●"
    />
    <span
      style={styles.eyeIcon}
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? '🙈' : '👁️'}
    </span>
  </div>

  {/* 生年月 */}
  <label style={styles.label}>生年月（年・月）</label>
  <div style={{ display: 'flex', gap: '10px' }}>
    <select
      value={birthYear}
      onChange={(e) => setBirthYear(e.target.value)}
      style={styles.input}
    >
      <option value="">年を選択</option>
      {Array.from({ length: 80 }, (_, i) => 2025 - i).map((year) => (
        <option key={year} value={year}>{year}年</option>
      ))}
    </select>

    <select
      value={birthMonth}
      onChange={(e) => setBirthMonth(e.target.value)}
      style={styles.input}
    >
      <option value="">月を選択</option>
      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
        <option key={month} value={month}>{month}月</option>
      ))}
    </select>
  </div>

  {/* 性別 */}
  <label style={styles.label}>性別</label>
  <select
    value={gender}
    onChange={(e) => setGender(e.target.value)}
    style={styles.input}
  >
    <option value="">選択してください</option>
    <option value="男性">男性</option>
    <option value="女性">女性</option>
    <option value="その他">その他</option>
  </select>

  {/* 登録ボタン */}
  <button type="submit" style={buttonStyle}>
    登録してはじめる
  </button>
  <button
    type="button"
    style={secondaryButtonStyle}
    onClick={() => navigate('/map')}
  >
    登録せずに試してみる
  </button>
</form>
        </>
      ),
    },
  ];
}

// 共通スタイル
const styles = {
  label: {
    fontWeight: 'bold',
    marginTop: '10px',
    display: 'block',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: '10px',
  },
  eyeIcon: {
    position: 'absolute',
    right: '10px',
    top: '12px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  marginTop: '20px',
  width: '100%',
};

const secondaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#aaa',
  marginTop: '10px',
};
