import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

export default function IntroPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nickname: '',
    password: '',
    showPassword: false,
    birthYear: '',
    birthMonth: '',
    gender: '',
  });

  const handleScroll = (e) => {
    const index = Math.round(e.target.scrollLeft / window.innerWidth);
    setCurrentIndex(index);
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nickname, password, birthYear, birthMonth, gender } = formData;
    if (!nickname || !password || !birthYear || !birthMonth || !gender) {
      alert('すべての項目を入力してください');
      return;
    }

    const submitted = {
      nickname,
      password,
      birth: `${birthYear}-${birthMonth}`,
      gender,
    };
    console.log('登録データ:', submitted);
    navigate('/map');
  };

  const allSlides = slides(formData, setFormData, handleChange, handleSubmit, navigate);

  return (
    <div className="intro-wrapper">
      <div className="slides-container" onScroll={handleScroll}>
        {allSlides.map((slide) => (
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
        {allSlides.map((_, index) => (
          <div key={index} className={`dot ${index === currentIndex ? 'active' : ''}`} />
        ))}
      </div>
    </div>
  );
}

function slides(formData = {}, setFormData = () => {}, handleChange = () => {}, handleSubmit = () => {}, navigate = () => {}) {
  const togglePassword = () =>
    setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }));

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
      color: 'white',
      content: (
        <>
          <p style={{ marginBottom: '20px', fontSize: '16px' }}>
            地図や履歴を保存するには、ログイン登録が必要です。
          </p>

          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
            <label style={styles.label}>ニックネームとパスワードを登録</label>
            <input
              type="text"
              value={formData.nickname}
              onChange={handleChange('nickname')}
              style={styles.input}
              placeholder="ニックネーム"
            />
            <div style={{ position: 'relative' }}>
              <input
                type={formData.showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange('password')}
                style={styles.input}
                placeholder="パスワード"
              />
              <span style={styles.eyeIcon} onClick={togglePassword}>
                {formData.showPassword ? '●' : '_'}
              </span>
            </div>

            <label style={styles.label}>年齢確認</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select value={formData.birthYear} onChange={handleChange('birthYear')} style={styles.input}>
                <option value="">西暦</option>
                {Array.from({ length: 80 }, (_, i) => 2015 - i).map((year) => (
                  <option key={year} value={year}>{year}年</option>
                ))}
              </select>
              <select value={formData.birthMonth} onChange={handleChange('birthMonth')} style={styles.input}>
                <option value="">生まれ月</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>{month}月</option>
                ))}
              </select>
            </div>

            <label style={styles.label}>性別</label>
            <select value={formData.gender} onChange={handleChange('gender')} style={styles.input}>
              <option value="">選択してください</option>
              <option value="男性">男性</option>
              <option value="女性">女性</option>
              <option value="その他">回答しない</option>
            </select>

            <button type="submit" style={buttonStyle}>登録してはじめる</button>
            <button type="button" style={secondaryButtonStyle} onClick={() => navigate('/store')}>
              ゲストとして試す（記録は保存されません）
            </button>
          </form>

          <p style={{ fontSize: '12px', marginTop: '16px', color: '#666', textAlign: 'center' }}>
            登録後は、設定画面からいつでも<br />
            ニックネーム変更や利用店舗の追加ができます。
          </p>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
            <a href="/terms" style={{ color: '#007bff' }}>利用規約</a>
          </p>
        </>
      ),
    },
  ];
}

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
  padding: '12px',
  fontSize: '16px',
  backgroundColor: '#e5e3db', // やや温かみのあるグレー
  color: '#000',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  marginTop: '20px',
  width: '100%',
};

const secondaryButtonStyle = {
  padding: '12px',
  fontSize: '14px',
  backgroundColor: '#bbb',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  marginTop: '10px',
  width: '100%',
  opacity: 0.8,
};
