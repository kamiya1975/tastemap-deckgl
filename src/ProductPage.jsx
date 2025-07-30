import React, { useEffect, useState } from "react";

// ✅ 美しい均衡な円の評価コンポーネント
const CircleRating = ({ value, currentRating, onClick }) => {
  const baseSize = 12;
  const ringGap = 4;

  const outerSize = baseSize + ringGap * 2 * 4; // 最大サイズを基準に（5重円を想定）

  return (
    <div
      onClick={() => onClick(value)}
      style={{
        position: "relative",
        width: `${outerSize}px`,
        height: `${outerSize}px`,
        margin: "6px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {[...Array(value)].map((_, i) => {
        const size = baseSize + ringGap * 2 * i;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: `${size}px`,
              height: `${size}px`,
              border: `1.5px solid ${value === currentRating ? "#000" : "#bbb"}`,
              borderRadius: "50%",
              boxSizing: "border-box",
              backgroundColor: "transparent",
            }}
          />
        );
      })}
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
        borderTopLeftRadius: "0px",   // 👈 上側は直線に
        borderTopRightRadius: "0px",
        borderBottomLeftRadius: "0px", // 👈 下側も直線に
        borderBottomRightRadius: "0px",
        borderLeft: "none",            // 👈 必要に応じて線も外せる
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
          right: "12px",
          fontSize: "24px",
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
      <h2 style={{ margin: "8px 0", fontWeight: "bold" }}>{product.商品名 || "（名称不明）"}</h2>
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
          display: "flex",               // ← 横並び
          justifyContent: "space-between",     // ← 左右に分ける
          alignItems: "center",         // ← ベースラインで整列
          gap: "10px",                  // ← 評価と◎の間隔
          //padding: "16px 0",                // 👈 横の余白
        }}
      >
        <div style={{ 
          fontWeight: "bold",
          fontSize: "16px",
          width: "60px", // ← 固定幅にして左揃え
          }}
          >
            評価
            </div>

        <div style={{ 
          display: "flex",
          //gap: "2px",  //◎の間隔を調整
          flexShrink: 0,
           }}
           >
          {[1, 2, 3, 4, 5].map((v) => (
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
        ワインとは、主にブドウから作られたお酒（酒税法上は果実酒に分類）です。
        また、きわめて長い歴史をもつこのお酒は、西洋文明の象徴の一つであると同時に、
        昨今では、世界標準の飲み物と言えるまでになっています。
        ワインとは、主にブドウから作られたお酒（酒税法上は果実酒に分類）です。
        また、きわめて長い歴史をもつこのお酒は、西洋文明の象徴の一つであると同時に、
        昨今では、世界標準の飲み物と言えるまでになっています。
        ワインとは、主にブドウから作られたお酒（酒税法上は果実酒に分類）です。
        また、きわめて長い歴史をもつこのお酒は、西洋文明の象徴の一つであると同時に、
        昨今では、世界標準の飲み物と言えるまでになっています。
      </div>
    </div>
  );
}
