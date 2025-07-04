import React from "react";
import { useParams } from "react-router-dom";

function ProductPage() {
  const { jan } = useParams();

  // ローカルストレージに保存したデータを取得
  const allData = JSON.parse(localStorage.getItem("umapData") || "[]");
  const product = allData.find((d) => d.JAN === jan);

  if (!product) {
    return <div>商品が見つかりません</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>商品ページ</h1>
      <p><strong>JAN:</strong> {product.JAN}</p>
      <p><strong>Type:</strong> {product.Type}</p>

      {/* 評価プルダウン */}
      <div style={{ marginTop: "20px" }}>
        <label>
          評価:
          <select style={{ marginLeft: "10px", fontSize: "16px" }}>
            <option value="5">★★★★★</option>
            <option value="4">★★★★☆</option>
            <option value="3">★★★☆☆</option>
            <option value="2">★★☆☆☆</option>
            <option value="1">★☆☆☆☆</option>
          </select>
        </label>
      </div>

      {/* 閉じるボタン */}
      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() => window.close()}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
          }}
        >
          閉じる
        </button>
      </div>
    </div>
  );
}

export default ProductPage;
