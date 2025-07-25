import React, { useEffect, useState } from "react";

function ProductPage() {
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);

  // JANコードをURLから取得
  const jan = window.location.pathname.split("/").pop();

  useEffect(() => {
    // umapDataをlocalStorageから取得
    const data = JSON.parse(localStorage.getItem("umapData") || "[]");
    const found = data.find((d) => d.JAN === jan);
    setProduct(found);

    // 既存評価を読み込み
    const ratings = JSON.parse(localStorage.getItem("userRatings") || "{}");
    if (ratings[jan]) {
      setRating(ratings[jan].rating);
    }
  }, [jan]);

  const handleRatingChange = (e) => {
    const newRating = Number(e.target.value);
    setRating(newRating);

    const ratings = JSON.parse(localStorage.getItem("userRatings") || "{}");

    if (newRating === 0) {
      // 未評価に戻す → 削除
      delete ratings[jan];
    } else {
      // 評価する
      ratings[jan] = {
        rating: newRating,
        date: new Date().toISOString(),
      };
    }

    localStorage.setItem("userRatings", JSON.stringify(ratings));
  };

  if (!product) return <div>商品が見つかりませんでした。</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>{product.商品名 || "（名称不明）"}</h2>
      <p>JANコード: {product.JAN}</p>
      <p>タイプ: {product.Type || "不明"}</p>
      <label>
        評価:
        <select
          value={rating}
          onChange={handleRatingChange}
          style={{ marginLeft: "8px" }}
        >
          <option value={0}>未評価</option>
          <option value={1}>★</option>
          <option value={2}>★★</option>
          <option value={3}>★★★</option>
          <option value={4}>★★★★</option>
          <option value={5}>★★★★★</option>
        </select>
      </label>
      <br />
      <button
        onClick={() => window.close()}
        style={{
          marginTop: "16px",
          padding: "8px 12px",
          background: "#eee",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        閉じる
      </button>
    </div>
  );
}

export default ProductPage;