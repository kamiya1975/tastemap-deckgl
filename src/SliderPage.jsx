import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SliderPage() {
  const navigate = useNavigate();
  const [sweetness, setSweetness] = useState(50);
  const [body, setBody] = useState(50);

  const handleNext = () => {
    // 必要なら選択値をContextやURLに渡す
    navigate("/map");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>好みの調整</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>甘味: {sweetness}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={sweetness}
          onChange={(e) => setSweetness(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>コク: {body}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      <button
        onClick={handleNext}
        style={{
          background: "#4CAF50",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        次へ
      </button>
    </div>
  );
}

export default SliderPage;
