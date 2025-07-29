import React, { useState } from "react";
import "./RegisterPage.css";

function RegisterPage() {
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");

  return (
    <div className="register-container">
      <h2 className="register-title">あなたについて教えてください</h2>
      <p className="register-subtitle">解析やアドバイスがパーソナライズされます</p>

      <div className="register-field">
        <label>ニックネーム</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="カミヤ"
        />
      </div>

      <div className="register-field">
        <label>性別</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">選択してください</option>
          <option value="男性">男性</option>
          <option value="女性">女性</option>
          <option value="無回答">無回答</option>
        </select>
      </div>

      <div className="register-field">
        <label>生年月日</label>
        <input
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
        />
      </div>

      <button
        className="register-button"
        onClick={() => {
          console.log("登録:", { nickname, gender, birthdate });
        }}
        disabled={!nickname || !gender || !birthdate}
      >
        設定する
      </button>
    </div>
  );
}

export default RegisterPage;
