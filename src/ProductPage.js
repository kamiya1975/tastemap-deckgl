import React from "react";

function ProductPage({ product, onClose, onRate }) {
  return (
    <div style={{ padding: "20px" }}>
      <h1>商品ページ</h1>
      <p><strong>JAN:</strong> {product.jan}</p>
      <p><strong>Type:</strong> {product.type}</p>

      <div style={{ marginTop: "30px" }}>
        <button
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            fontSize: "16px"
          }}
          onClick={onClose}
        >
          閉じる
        </button>

        <button
          style={{
            padding: "10px 20px",
            fontSize: "16px"
          }}
          onClick={() => onRate(product)}
        >
          評価
        </button>
      </div>
    </div>
  );
}

export default ProductPage;
