import React, { useEffect, useState } from "react";
import axios from "axios";

function ProductPage() {
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [dishName, setDishName] = useState("");
  const [dishImage, setDishImage] = useState(null);
  const [message, setMessage] = useState("");

  const jan = window.location.pathname.split("/").pop();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("umapData") || "[]");
    const found = data.find((d) => d.JAN === jan);
    setProduct(found);

    const ratings = JSON.parse(localStorage.getItem("userRatings") || "{}");
    if (ratings[jan]) {
      setRating(ratings[jan].rating);
      setDishName(ratings[jan].dishName || "");
    }
  }, [jan]);

  const handleRatingChange = (e) => {
    const newRating = Number(e.target.value);
    setRating(newRating);
  };

  const handleDishNameChange = (e) => {
    setDishName(e.target.value);
  };

  const handleDishImageChange = (e) => {
    setDishImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dishName || !rating) {
      setMessage("料理名と評価は必須です。");
      return;
    }

    const formData = new FormData();
    formData.append("dish_name", dishName);
    formData.append("wine_jan", jan);
    formData.append("score", rating);
    if (dishImage) {
      formData.append("image", dishImage);
    }

    try {
      const res = await axios.post("http://localhost:8000/api/evaluate", formData);
      setMessage("送信が成功しました！");
      // ローカルにも保存
      const ratings = JSON.parse(localStorage.getItem("userRatings") || "{}");
      ratings[jan] = { rating, dishName, date: new Date().toISOString() };
      localStorage.setItem("userRatings", JSON.stringify(ratings));
    } catch (err) {
      console.error(err);
      setMessage("送信に失敗しました。");
    }
  };

  if (!product) return <div>商品が見つかりませんでした。</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>{product.商品名 || "（名称不明）"}</h2>
      <p>JANコード: {product.JAN}</p>
      <p>タイプ: {product.Type || "不明"}</p>

      <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
        <div>
          <label>
            料理名：
            <input
              type="text"
              value={dishName}
              onChange={handleDishNameChange}
              required
              style={{ marginLeft: "8px", padding: "4px" }}
            />
          </label>
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>
            料理画像：
            <input
              type="file"
              accept="image/*"
              onChange={handleDishImageChange}
              style={{ marginLeft: "8px" }}
            />
          </label>
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>
            評価：
            <select
              value={rating}
              onChange={handleRatingChange}
              required
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
        </div>

        <button
          type="submit"
          style={{
            marginTop: "16px",
            padding: "8px 12px",
            background: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          評価を送信
        </button>
      </form>

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}}

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
