import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ProductPage() {
  const { janCode } = useParams();
  const [dishName, setDishName] = useState("");
  const [dishImage, setDishImage] = useState(null);
  const [rating, setRating] = useState("4");
  const [submitMessage, setSubmitMessage] = useState("");

  const API_URL = "https://a7402b7f2d09.ngrok-free.app";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDishImage(file);
    }
  };

  const handleSubmit = async () => {
    if (!dishName || !dishImage || !rating) {
      setSubmitMessage("すべての項目を入力してください。");
      return;
    }

    const formData = new FormData();
    formData.append("wine_jan", janCode);
    formData.append("dish_name", dishName);
    formData.append("score", rating);
    formData.append("image", dishImage);

    try {
      await axios.post(`${API_URL}/api/evaluate`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSubmitMessage("送信が完了しました！");
      setDishName("");
      setDishImage(null);
      setRating("4");
    } catch (error) {
      console.error("評価送信エラー:", error);
      setSubmitMessage("送信に失敗しました。");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>商品評価ページ</h2>
      <p>JANコード: {janCode}</p>

      <div style={{ marginBottom: "1rem" }}>
        <label>料理名：</label>
        <input
          type="text"
          value={dishName}
          onChange={(e) => setDishName(e.target.value)}
          style={{ marginLeft: "1rem" }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>料理画像：</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginLeft: "1rem" }}
        />
        {dishImage && (
          <div style={{ marginTop: "0.5rem" }}>
            <p>{dishImage.name}</p>
            <img
              src={URL.createObjectURL(dishImage)}
              alt="料理プレビュー"
              style={{ maxWidth: "200px", marginTop: "10px" }}
            />
          </div>
        )}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>評価：</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          style={{ marginLeft: "1rem" }}
        >
          <option value="1">★☆☆☆☆☆☆</option>
          <option value="2">★★☆☆☆☆☆</option>
          <option value="3">★★★☆☆☆☆</option>
          <option value="4">★★★★☆☆☆</option>
          <option value="5">★★★★★☆☆</option>
          <option value="6">★★★★★★☆</option>
          <option value="7">★★★★★★★</option>
        </select>
      </div>

      <button onClick={handleSubmit} style={{ padding: "0.5rem 1rem", backgroundColor: "green", color: "white", border: "none", borderRadius: "5px" }}>
        評価を送信
      </button>

      {submitMessage && (
        <p style={{ marginTop: "1rem", color: submitMessage.includes("失敗") ? "red" : "green" }}>
          {submitMessage}
        </p>
      )}
    </div>
  );
}

export default ProductPage;
