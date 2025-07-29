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
    agreed: false,
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

    // パスワード長さチェック（4〜20文字）
    if (password.length < 4 || password.length > 20) {
      alert('パスワードは4文字以上20文字以内で入力してください');
      return;
    }

    // 登録処理と遷移
    const submitted = {
      nickname,
      password,
      birth: `${birthYear}-${birthMonth}`,
      gender,
    };
    console.log('登録データ:', submitted);
    navigate('/store');
  };

  const styles = {
  input: {
    padding: '10px',
    fontSize: '16px',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '5px',  // ← ここを追加！
    appearance: 'none',    // iOSの矢印を制御したい場合（任意）
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundColor: '#fff',
    backgroundImage: 'none',
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#fff',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
  },
  label: {
    marginTop: '20px',
    marginBottom: '8px',
    display: 'block',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  eyeIcon: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    cursor: 'pointer',
    fontSize: '18px',
  },
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
              justifyContent: 'flex-start',
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
          <img src="/img/slide1.png" alt="基準のワイン" 
          style={{ 
            maxWidth: '60%', 
            marginBottom: '20px',
            margin: '80px auto 30px auto' // 上下に余白、中央寄せ
            }} />
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
          <img src="/img/slide2.png" alt="TasteMap" 
          style={{ 
            maxWidth: '60%', 
            marginBottom: '20px',
            margin: '80px auto 30px auto'  // 上下に余白、中央寄せ
            }} />
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
          <p style={{ 
            marginBottom: '20px', 
            fontSize: '16px',
            margin: '80px auto 30px auto'
            }}>
            あなたの地図を作り始めるには、まず登録から。
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
                placeholder="パスワードは4文字以上20文字以内"
              />
              <span style={styles.eyeIcon} onClick={togglePassword}>
                {formData.showPassword ? '●' : '-'}
              </span>
            </div>

            <label style={styles.label}>年齢確認（お酒は20歳から）</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select value={formData.birthYear} onChange={handleChange('birthYear')} style={styles.input}>
                <option value="">西暦</option>
                {/* options */}
              </select>

              <select value={formData.birthMonth} onChange={handleChange('birthMonth')} style={styles.select}>
               <option value="">生まれ月</option>
                {/* options */}
              </select>

            <label style={styles.label}>性別</label>
              <select value={formData.gender} onChange={handleChange('gender')} style={styles.select}>
                <option value="">選択してください</option>
                <option value="男性">男性</option>
                <option value="女性">女性</option>
                <option value="その他">回答しない</option>
              </select>
            </div>

            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <input
                type="checkbox"
                id="agree"
                checked={formData.agreed}
                onChange={(e) => setFormData((prev) => ({ ...prev, agreed: e.target.checked }))}
                style={{ marginRight: '8px' }}
              />
              <label htmlFor="agree" style={{ fontSize: '14px', color: '#333' }}>
                <a href="/terms" style={{ color: '#007bff' }} target="_blank" rel="noopener noreferrer">
                  利用規約
                </a>
                に同意します
              </label>
            </div>

            <button 
              type="submit" 
              style={{ ...buttonStyle, opacity: formData.agreed ? 1 : 0.5 }}
              disabled={!formData.agreed}
            >
              登録してはじめる
            </button>

            <button 
              type="button" 
              style={{ ...secondaryButtonStyle, opacity: formData.agreed ? 1 : 0.5 }}
              disabled={!formData.agreed}
              onClick={() => navigate('/store')}
            >
              ゲストとして試す（記録は保存されません）
            </button>
          </form>

          <p style={{ fontSize: '12px', marginTop: '16px', color: '#666', textAlign: 'center' }}>
            登録後は、設定画面からいつでも<br />
            ニックネーム変更や利用店舗の追加ができます。
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
