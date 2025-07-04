import React from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProductPage() {
  const { jan } = useParams();
  const navigate = useNavigate();

  // umapDataをlocalStorageから読み込む
  const data = JSON.parse(localStorage.getItem("umapData") || "[]");
  const product = data.find((d) => d.JAN === jan);

  if (!product) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>商品が見つかりません</h1>
        <button onClick={() => navigate(-1)}>戻る</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>商品ページ</h1>
      <p>
        <strong>JAN:</strong> {product.JAN}
      </p>
      <p>
        <strong>Type:</strong> {product.Type}
      </p>
      <div style={{ marginTop: "30px" }}>
        <button
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            fontSize: "16px",
          }}
          onClick={() => navigate(-1)}
        >
          閉じる
        </button>
      </div>
    </div>
  );
}

export default ProductPage;
