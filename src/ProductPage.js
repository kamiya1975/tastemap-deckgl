import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductPage() {
  const { jan } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("umapData");
    if (stored) {
      const parsed = JSON.parse(stored);
      const found = parsed.find((item) => item.JAN === jan);
      setProduct(found);
    }
  }, [jan]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>商品ページ</h1>
      {product ? (
        <>
          <p><strong>JAN:</strong> {product.JAN}</p>
          <p><strong>Type:</strong> {product.Type || "不明"}</p>
        </>
      ) : (
        <p>データが見つかりません。</p>
      )}
    </div>
  );
}

export default ProductPage;
