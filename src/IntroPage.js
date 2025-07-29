import React, { useState } from "react";
import "./App.css";

function IntroPage() {
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [isGenderPickerOpen, setIsGenderPickerOpen] = useState(false);
  const [isBirthdatePickerOpen, setIsBirthdatePickerOpen] = useState(false);

  const handleSubmit = () => {
    if (!nickname || !gender || !birthdate) {
      alert("全ての項目を入力してください");
      return;
    }
    console.log("登録完了:", { nickname, gender, birthdate });
    // 登録処理をここに追加
  };

  return (
    <div className="intro-container">
      <h1 className="intro-title">あなたについて教えてください</h1>
      <p className="intro-subtitle">解析やアドバイスがパーソナライズされます</p>

      <div className="form-group">
        <label>ニックネーム</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="例: カミヤ"
        />
      </div>

      <div className="form-group" onClick={() => setIsGenderPickerOpen(true)}>
        <label>性別</label>
        <input
          type="text"
          value={gender}
          placeholder="選択してください"
          readOnly
        />
      </div>

      <div className="form-group" onClick={() => setIsBirthdatePickerOpen(true)}>
        <label>生年月日</label>
        <input
          type="text"
          value={birthdate}
          placeholder="選択してください"
          readOnly
        />
      </div>

      <button className="submit-button" onClick={handleSubmit}>
        登録して始める
      </button>

      {/* 性別モーダル */}
      {isGenderPickerOpen && (
        <GenderPicker
          value={gender}
          onChange={(val) => {
            setGender(val);
            setIsGenderPickerOpen(false);
          }}
          onClose={() => setIsGenderPickerOpen(false)}
        />
      )}

      {/* 生年月日モーダル */}
      {isBirthdatePickerOpen && (
        <BirthdatePicker
          value={birthdate}
          onChange={(val) => {
            setBirthdate(val);
            setIsBirthdatePickerOpen(false);
          }}
          onClose={() => setIsBirthdatePickerOpen(false)}
        />
      )}
    </div>
  );
}

// モーダル共通スタイル
const modalStyle = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  padding: "20px",
  borderTopLeftRadius: "16px",
  borderTopRightRadius: "16px",
  boxShadow: "0 -2px 10px rgba(0,0,0,0.2)",
  zIndex: 1000,
  animation: "slideUp 0.3s ease-out",
};

// 性別モーダル
function GenderPicker({ value, onChange, onClose }) {
  const options = ["男性", "女性", "無回答"];
  return (
    <div style={modalStyle}>
      <p style={{ textAlign: "center", marginBottom: 10 }}>性別を設定してください</p>
      {options.map((option) => (
        <div
          key={option}
          style={{
            padding: "12px",
            backgroundColor: value === option ? "#eee" : "#fff",
            textAlign: "center",
            fontSize: "18px",
            cursor: "pointer",
          }}
          onClick={() => onChange(option)}
        >
          {option}
        </div>
      ))}
      <button onClick={onClose} style={closeBtnStyle}>キャンセル</button>
    </div>
  );
}

// 生年月日モーダル
function BirthdatePicker({ value, onChange, onClose }) {
  const [selectedDate, setSelectedDate] = useState(
    value || new Date().toISOString().split("T")[0]
  );

  const handleConfirm = () => {
    onChange(selectedDate);
  };

  return (
    <div style={modalStyle}>
      <p style={{ textAlign: "center", marginBottom: 10 }}>生年月日を設定してください</p>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{
          display: "block",
          margin: "0 auto 12px",
          fontSize: "16px",
        }}
      />
      <button onClick={handleConfirm} style={confirmBtnStyle}>決定</button>
      <button onClick={onClose} style={closeBtnStyle}>キャンセル</button>
    </div>
  );
}

// ボタンスタイル
const closeBtnStyle = {
  display: "block",
  margin: "10px auto 0",
  backgroundColor: "#ccc",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "pointer",
};

const confirmBtnStyle = {
  display: "block",
  margin: "0 auto 8px",
  backgroundColor: "#4CAF50",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "pointer",
};

export default IntroPage;
