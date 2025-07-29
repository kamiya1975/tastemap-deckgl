import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography
} from '@mui/material';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nickname: '',
    password: '',
    showPassword: false,
    birthYear: '',
    birthMonth: '',
    gender: '',
  });

  const [genderOpen, setGenderOpen] = useState(false);
  const [birthOpen, setBirthOpen] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const togglePassword = () =>
    setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }));

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

  return (
    <div className="register-container">
      <div className="register-title">味覚マップを保存しよう</div>
      <div className="register-subtitle">自分の好みに合ったワインを見つけるために登録してください</div>

      <form onSubmit={handleSubmit}>
        {/* ニックネーム */}
        <div className="register-field">
          <label>ニックネーム</label>
          <input
            type="text"
            value={formData.nickname}
            onChange={handleChange('nickname')}
            placeholder="例：ワイン好き太郎"
          />
        </div>

        {/* パスワード */}
        <div className="register-field">
          <label>パスワード</label>
          <div style={{ position: 'relative' }}>
            <input
              type={formData.showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              placeholder="●●●●●●"
            />
            <span
              onClick={togglePassword}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                cursor: 'pointer',
                fontSize: '18px',
              }}
            >
              {formData.showPassword ? '🙈' : '👁️'}
            </span>
          </div>
        </div>

        {/* 生年月 */}
        <div className="register-field">
          <label>生年月</label>
          <input
            type="text"
            value={
              formData.birthYear && formData.birthMonth
                ? `${formData.birthYear}年 ${formData.birthMonth}月`
                : ''
            }
            onClick={() => setBirthOpen(true)}
            readOnly
          />
        </div>

        {/* 性別 */}
        <div className="register-field">
          <label>性別</label>
          <input
            type="text"
            value={formData.gender}
            onClick={() => setGenderOpen(true)}
            readOnly
          />
        </div>

        <button type="submit" className="register-button">
          登録してはじめる
        </button>
        <button
          type="button"
          className="register-button"
          style={{ backgroundColor: '#aaa', marginTop: '12px' }}
          onClick={() => navigate('/map')}
        >
          登録せずに試してみる
        </button>
      </form>

      {/* 性別モーダル */}
      <Drawer anchor="bottom" open={genderOpen} onClose={() => setGenderOpen(false)}>
        <div style={{ padding: '16px' }}>
          <Typography variant="h6" align="center">性別を選択</Typography>
          <List>
            {['男性', '女性', 'その他'].map((option) => (
              <ListItem button key={option} onClick={() => {
                setFormData((prev) => ({ ...prev, gender: option }));
                setGenderOpen(false);
              }}>
                <ListItemText primary={option} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>

      {/* 生年月モーダル */}
      <Drawer anchor="bottom" open={birthOpen} onClose={() => setBirthOpen(false)}>
        <div style={{ padding: '16px' }}>
          <Typography variant="h6" align="center">生年月を選択</Typography>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <select
              value={formData.birthYear}
              onChange={(e) => setFormData((prev) => ({ ...prev, birthYear: e.target.value }))}
            >
              <option value="">年</option>
              {Array.from({ length: 100 }, (_, i) => 2025 - i).map((y) => (
                <option key={y} value={y}>{y}年</option>
              ))}
            </select>
            <select
              value={formData.birthMonth}
              onChange={(e) => setFormData((prev) => ({ ...prev, birthMonth: e.target.value }))}
            >
              <option value="">月</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{m}月</option>
              ))}
            </select>
          </div>
          <Button
            fullWidth
            onClick={() => setBirthOpen(false)}
            style={{ marginTop: '16px', color: '#34c28b' }}
          >
            決定
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
