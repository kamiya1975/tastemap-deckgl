import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SliderPage() {
  const navigate = useNavigate();
  const [sweetness, setSweetness] = useState(50);
  const [body, setBody] = useState(50);
  const [minMax, setMinMax] = useState(null);

  useEffect(() => {
    // umapDataロード
    const data = JSON.parse(localStorage.getItem("umapData") || "[]");
    if (data.length === 0) return;

    // 全体のmin/max
    const sweetValues = data.map((d) => d.SweetAxis);
    const bodyValues = data.map((d) => d.BodyAxis);

    const minSweet = Math.min(...sweetValues);
    const maxSweet = Math.max(...sweetValues);
    const minBody = Math.min(...bodyValues);
    const maxBody = Math.max(...bodyValues);

    setMinMax({ minSweet, maxSweet, minBody, maxBody });

    // blendFを探す
    const blendF = data.find((d) => d.JAN === "blendF");
    if (blendF) {
      // スケーリングして0〜100に
      const sweetScaled = ((blendF.SweetAxis - minSweet) / (maxSweet - minSweet)) * 100;
      const bodyScaled = ((blendF.BodyAxis - minBody) / (maxBody - minBody)) * 100;

      setSweetness(Math.round(sweetScaled));
      setBody(Math.round(bodyScaled));
    }
  }, []);

  const handleNext = () => {
    if (!minMax) return;

    const { minSweet, maxSweet, minBody, maxBody } = minMax;

    // 0-100をDBスケールに逆変換
    const sweetValue = minSweet + (sweetness / 100) * (maxSweet - minSweet);
    const bodyValue = minBody + (body / 100) * (maxBody - minBody);

    // localStorageに保存
    localStorage.setItem("userPinCoords", JSON.stringify([bodyValue, -sweetValue]));

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
          onChange={(e) => setSweetness(Number(e.target.value))}
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
          onChange={(e) => setBody(Number(e.target.value))}
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
