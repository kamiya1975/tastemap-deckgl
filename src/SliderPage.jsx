import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SliderPage() {
  const navigate = useNavigate();
  const [sweetness, setSweetness] = useState(50);
  const [body, setBody] = useState(50);
  const [minMax, setMinMax] = useState(null);

  useEffect(() => {
    // pca_result.json を直接読み込み
    fetch("pca_result.json")
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) return;

        const sweetValues = data.map((d) => d.SweetAxis);
        const bodyValues = data.map((d) => d.BodyAxis);

        const minSweet = Math.min(...sweetValues);
        const maxSweet = Math.max(...sweetValues);
        const minBody = Math.min(...bodyValues);
        const maxBody = Math.max(...bodyValues);

        setMinMax({ minSweet, maxSweet, minBody, maxBody });

        const blendF = data.find((d) => d.JAN === "blendF");
        if (blendF) {
          const sweetScaled =
            ((blendF.SweetAxis - minSweet) / (maxSweet - minSweet)) * 100;
          const bodyScaled =
            ((blendF.BodyAxis - minBody) / (maxBody - minBody)) * 100;

          setSweetness(Math.round(sweetScaled));
          setBody(Math.round(bodyScaled));
        }
      })
      .catch((error) => {
        console.error("データ取得エラー:", error);
      });
  }, []);

  const handleNext = () => {
    if (!minMax) return;

    const { minSweet, maxSweet, minBody, maxBody } = minMax;

    // スライダーをDBスケールに逆変換
    const sweetValue = minSweet + (sweetness / 100) * (maxSweet - minSweet);
    const bodyValue = minBody + (body / 100) * (maxBody - minBody);

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
        {minMax && (
          <div style={{ fontSize: "12px", color: "#555" }}>
            範囲: {minMax.minSweet.toFixed(2)} 〜 {minMax.maxSweet.toFixed(2)}
          </div>
        )}
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
        {minMax && (
          <div style={{ fontSize: "12px", color: "#555" }}>
            範囲: {minMax.minBody.toFixed(2)} 〜 {minMax.maxBody.toFixed(2)}
          </div>
        )}
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
