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
    <div style={{ padding: "30px", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "40px" }}>基準のワインを飲んだ印象は？</h2>

      {/* 甘味スライダー */}
      <div style={{ marginBottom: "50px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontWeight: "bold" }}>
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
            marginTop: "10px",
          }}
        />
      </div>

      {/* コクスライダー */}
      <div style={{ marginBottom: "50px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontWeight: "bold" }}>
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
            marginTop: "10px",
          }}
        />
      </div>

      {/* 次へボタン */}
      <button
        onClick={handleNext}
        style={{
          background: "#4CAF50",
          color: "#fff",
          padding: "12px 24px",
          fontSize: "16px",
          border: "none",
          borderRadius: "4px",
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
