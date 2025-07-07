import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SliderPage() {
  const navigate = useNavigate();
  const [sweetness, setSweetness] = useState(50);
  const [body, setBody] = useState(50);
  const [minMax, setMinMax] = useState(null);
  const [blendF, setBlendF] = useState(null);

  useEffect(() => {
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

        const blendFItem = data.find((d) => d.JAN === "blendF");
        if (blendFItem) {
          setBlendF(blendFItem);
        }
      })
      .catch((error) => {
        console.error("データ取得エラー:", error);
      });
  }, []);

  const handleNext = () => {
    if (!minMax || !blendF) return;

    const { minSweet, maxSweet, minBody, maxBody } = minMax;

    const sweetValue =
      sweetness <= 50
        ? blendF.SweetAxis - ((50 - sweetness) / 50) * (blendF.SweetAxis - minSweet)
        : blendF.SweetAxis + ((sweetness - 50) / 50) * (maxSweet - blendF.SweetAxis);

    const bodyValue =
      body <= 50
        ? blendF.BodyAxis - ((50 - body) / 50) * (blendF.BodyAxis - minBody)
        : blendF.BodyAxis + ((body - 50) / 50) * (maxBody - blendF.BodyAxis);

    localStorage.setItem("userPinCoords", JSON.stringify([bodyValue, -sweetValue]));
    navigate("/map");
  };

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center", fontSize: "20px", marginBottom: "30px" }}>
        基準のワインを飲んだ印象は？
      </h2>

      {/* 甘味スライダー */}
      <div style={{ marginBottom: "40px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "6px",
          }}
        >
          <span>← こんなに甘みは不要</span>
          <span>もっと甘みが欲しい →</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={sweetness}
          onChange={(e) => setSweetness(Number(e.target.value))}
          style={{
            width: "100%",
            appearance: "none",
            height: "8px",
            borderRadius: "5px",
            background: `linear-gradient(to right, #007bff ${sweetness}%, #ddd ${sweetness}%)`,
            outline: "none",
            marginTop: "8px",
            // サム（つまみ）のカスタム
            WebkitAppearance: "none",
          }}
        />
        <style>
          {`
          input[type=range]::-webkit-slider-thumb {
            appearance: none;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: white;
            border: 2px solid #ccc;
            box-shadow: 0 0 6px rgba(0,0,0,0.2);
            cursor: pointer;
            margin-top: -10px;
          }

          input[type=range]::-moz-range-thumb {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: white;
            border: 2px solid #ccc;
            box-shadow: 0 0 6px rgba(0,0,0,0.2);
            cursor: pointer;
          }
        `}
        </style>
      </div>

      {/* コクスライダー */}
      <div style={{ marginBottom: "40px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "6px",
          }}
        >
          <span>← もっと軽やかが良い</span>
          <span>濃厚なコクが欲しい →</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={body}
          onChange={(e) => setBody(Number(e.target.value))}
          style={{
            width: "100%",
            appearance: "none",
            height: "8px",
            borderRadius: "5px",
            background: `linear-gradient(to right, #007bff ${body}%, #ddd ${body}%)`,
            outline: "none",
            marginTop: "8px",
            WebkitAppearance: "none",
          }}
        />
      </div>

      {/* 次へボタン */}
      <button
        onClick={handleNext}
        style={{
          background: "#fff",
          color: "#007bff",
          padding: "14px 30px",
          fontSize: "16px",
          fontWeight: "bold",
          border: "2px solid #007bff",
          borderRadius: "6px",
          cursor: "pointer",
          display: "block",
          margin: "0 auto",
        }}
      >
        次へ
      </button>
    </div>
  );
}

export default SliderPage;
