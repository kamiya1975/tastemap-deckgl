import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SliderPage() {
  const navigate = useNavigate();
  const [sweetness, setSweetness] = useState(50);
  const [body, setBody] = useState(50);
  const [sweetRange, setSweetRange] = useState([0, 100]);
  const [bodyRange, setBodyRange] = useState([0, 100]);

  // 初期データ読み込み
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("umapData") || "[]");
    const blendF = data.find(d => d.JAN === "blendF");

    if (blendF) {
      setSweetness(blendF.SweetAxis);
      setBody(blendF.BodyAxis);
    }

    if (data.length > 0) {
      const sweetValues = data.map(d => d.SweetAxis);
      const bodyValues = data.map(d => d.BodyAxis);
      setSweetRange([Math.min(...sweetValues), Math.max(...sweetValues)]);
      setBodyRange([Math.min(...bodyValues), Math.max(...bodyValues)]);
    }
  }, []);

  const handleNext = () => {
    // SweetAxisはY軸で符号反転するので注意
    const userPinCoords = [body, -sweetness];
    localStorage.setItem("userPinCoords", JSON.stringify(userPinCoords));
    navigate("/map");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Helvetica Neue, Arial, sans-serif" }}>
      <h2>好みの調整</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>甘味: {sweetness.toFixed(2)}</label>
        <input
          type="range"
          min={sweetRange[0]}
          max={sweetRange[1]}
          step="0.01"
          value={sweetness}
          onChange={(e) => setSweetness(Number(e.target.value))}
          style={{ width: "100%" }}
        />
        <div style={{ fontSize: "12px", color: "#666" }}>
          範囲: {sweetRange[0].toFixed(2)} 〜 {sweetRange[1].toFixed(2)}
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>コク: {body.toFixed(2)}</label>
        <input
          type="range"
          min={bodyRange[0]}
          max={bodyRange[1]}
          step="0.01"
          value={body}
          onChange={(e) => setBody(Number(e.target.value))}
          style={{ width: "100%" }}
        />
        <div style={{ fontSize: "12px", color: "#666" }}>
          範囲: {bodyRange[0].toFixed(2)} 〜 {bodyRange[1].toFixed(2)}
        </div>
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
          fontSize: "16px"
        }}
      >
        次へ
      </button>
    </div>
  );
}

export default SliderPage;
