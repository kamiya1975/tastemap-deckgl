import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SliderPage() {
  const navigate = useNavigate();

  const [sweetness, setSweetness] = useState(0);
  const [body, setBody] = useState(0);
  const [sweetRange, setSweetRange] = useState([0, 100]);
  const [bodyRange, setBodyRange] = useState([0, 100]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("umapData") || "[]");

    if (data.length > 0) {
      const sweetValues = data.map(d => d.SweetAxis);
      const bodyValues = data.map(d => d.BodyAxis);
      const sweetMin = Math.min(...sweetValues);
      const sweetMax = Math.max(...sweetValues);
      const bodyMin = Math.min(...bodyValues);
      const bodyMax = Math.max(...bodyValues);

      setSweetRange([sweetMin, sweetMax]);
      setBodyRange([bodyMin, bodyMax]);

      // 範囲中央を初期値に
      setSweetness((sweetMin + sweetMax) / 2);
      setBody((bodyMin + bodyMax) / 2);
    }
  }, []);

  const handleNext = () => {
    // SweetAxis, BodyAxisをlocalStorageに保存
    localStorage.setItem(
      "userPinCoords",
      JSON.stringify([body, -sweetness])
    );
    navigate("/map");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>好みの調整</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>
          甘味: {sweetness.toFixed(2)}
        </label>
        <input
          type="range"
          min={sweetRange[0]}
          max={sweetRange[1]}
          step="0.01"
          value={sweetness}
          onChange={(e) => setSweetness(parseFloat(e.target.value))}
          style={{ width: "100%" }}
        />
        <div style={{ fontSize: "12px", color: "#555" }}>
          範囲: {sweetRange[0].toFixed(2)} ～ {sweetRange[1].toFixed(2)}
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>
          コク: {body.toFixed(2)}
        </label>
        <input
          type="range"
          min={bodyRange[0]}
          max={bodyRange[1]}
          step="0.01"
          value={body}
          onChange={(e) => setBody(parseFloat(e.target.value))}
          style={{ width: "100%" }}
        />
        <div style={{ fontSize: "12px", color: "#555" }}>
          範囲: {bodyRange[0].toFixed(2)} ～ {bodyRange[1].toFixed(2)}
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
        }}
      >
        次へ
      </button>
    </div>
  );
}

export default SliderPage;
