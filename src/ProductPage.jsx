import React, { useEffect, useState } from "react";

// ✅ 評価コンポーネント（「ー」だけ左に微調整）
const CircleRating = ({ value, currentRating, onClick }) => {
  const outerSize = 40;
  const baseSize = 8;
  const ringGap = 3;
  const ringCount = value === 0 ? 1 : value;

  return (
    <div
      onClick={() => onClick(value)}
      style={{
        position: "relative",
        width: `${outerSize}px`,
        height: `${outerSize}px`,
        margin: "2px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        boxSizing: "border-box",
        ...(value === 0 ? { marginLeft: "10px" } : {}),
      }}
    >
      {[...Array(ringCount)].map((_, i) => {
        const size = baseSize + ringGap * 2 * i;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: `${size}px`,
              height: `${size}px`,
              border: `1.5px solid ${
                value === currentRating ? "#000" : "#bbb"
              }`,
              borderRadius: "50%",
              boxSizing: "border-box",
              backgroundColor: "transparent",
            }}
          />
        );
      })}
      {value === 0 && (
        <span
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: currentRating === 0 ? "#000" : "#bbb",
            zIndex: 1,
          }}
        >
          ー
        </span>
      )}
    </div>
  );
};

export default function ProductPage() {
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);

  const jan = window.location.pathname.split("/").pop();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("umapData") || "[]");
    const found = data.find((d) => d.JAN === jan);
    setProduct(found);

    const ratings = JSON.parse(localStorage.getItem("userRatings") || "{}");
    if (ratings[jan]) {
      setRating(ratings[jan].rating);
    }
  }, [jan]);

  const handleCircleClick = (value) => {
    const newRating = value === rating ? 0 : value;
    setRating(newRating);

    const ratings = JSON.parse(localStorage.getItem("userRatings") || "{}");
    if (newRating === 0) {
      delete ratings[jan];
    } else {
      ratings[jan] = {
        rating: newRating,
        date: new Date().toISOString(),
      };
    }
    localStorage.setItem("userRatings", JSON.stringify(ratings));
  };

  if (!product) return <div>商品が見つかりませんでした。</div>;

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        maxWidth: "500px",
        margin: "0 auto",
        padding: "16px",
        border: "2px solid #ccc",
        borderRadius: "0px",
        borderLeft: "none",
        borderRight: "none",
        borderTop: "none",
        borderBottom: "none",
      }}
    >
      {/* 閉じるボタン */}
      <div
        onClick={() => window.close()}
        style={{
          position: "absolute",
          top: "12px",
          right: "20px",
          fontSize: "36px",
          cursor: "pointer",
        }}
      >
        ×
      </div>

      {/* 商品画像 */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <img
          src={`/img/${jan}.png`}
          alt="商品画像"
          style={{ maxHeight: "300px", objectFit: "contain" }}
        />
      </div>

      {/* 商品名・価格 */}
      <h2 style={{ margin: "8px 0", fontWeight: "bold" }}>
        {product.商品名 || "（名称不明）"}
      </h2>
      <p style={{ display: "flex", alignItems: "center", margin: "4px 0" }}>
        <span
          style={{
            width: "16px",
            height: "16px",
            backgroundColor: "#651E3E",
            borderRadius: "4px",
            marginRight: "8px",
          }}
        />
        ¥{product.価格 || 1800}
      </p>

      {/* 味データ */}
      <p style={{ margin: "4px 0" }}>
        Body: {Number(product.BodyAxis).toFixed(2)}, Sweet:{" "}
        {Number(product.SweetAxis).toFixed(2)}
      </p>

      {/* 原産地・年 */}
      <p style={{ margin: "4px 0" }}>
        {product.生産地 || "リオハ, スペイン"} / {product.収穫年 || "1996"}
      </p>

      {/* 評価 */}
      <div
        style={{
          marginTop: "24px",
          paddingTop: "8px",
          paddingBottom: "8px",
          borderTop: "1px solid #ccc",
          borderBottom: "1px solid #ccc",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              fontSize: "16px",
              minWidth: "48px",
              whiteSpace: "nowrap",
            }}
          >
            評価
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              width: "100%",
              maxWidth: "300px",
            }}
          >
            {[0, 1, 2, 3, 4, 5].map((v) => (
              <CircleRating
                key={v}
                value={v}
                currentRating={rating}
                onClick={handleCircleClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 解説文 */}
      <div style={{ marginTop: "20px", fontSize: "14px", lineHeight: "1.6" }}>
        ワインとは、主にブドウから作られたお酒（酒税法上は果実酒に分類）です。
        また、きわめて長い歴史をもつこのお酒は、西洋文明の象徴の一つであると同時に、
        昨今では、世界標準の飲み物と言えるまでになっています。
      </div>
    </div>
  );
}
