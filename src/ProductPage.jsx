import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ProductPage() {
  const { janCode } = useParams();
  const navigate = useNavigate();

  const [dishName, setDishName] = useState("");
  const [dishImage, setDishImage] = useState(null);
  const [rating, setRating] = useState("4");
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef();

  const API_URL = "https://05b6654fc72e.ngrok-free.app";

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

    if (dishImage.size > 5 * 1024 * 1024) {
      setSubmitMessage("画像サイズは5MB以下にしてください。");
      return;
    }

    const formData = new FormData();
    formData.append("wine_jan", janCode);
    formData.append("dish_name", dishName);
    formData.append("score", parseInt(rating));
    formData.append("image", dishImage);

    try {
      setIsSubmitting(true);
      await axios.post(`${API_URL}/api/evaluate`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSubmitMessage("送信が完了しました！");
      setDishName("");
      setDishImage(null);
      setRating("4");
      fileInputRef.current.value = "";
    } catch (error) {
      console.error("評価送信エラー:", error);
      if (error.response?.data?.detail) {
        setSubmitMessage(`送信に失敗しました: ${error.response.data.detail}`);
      } else {
        setSubmitMessage("送信に失敗しました。");
      }
    } finally {
      setIsSubmitting(false);
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
          ref={fileInputRef}
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

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: isSubmitting ? "gray" : "green",
          color: "white",
          border: "none",
          borderRadius: "5px",
          marginRight: "1rem",
        }}
      >
        {isSubmitting ? "送信中..." : "評価を送信"}
      </button>

      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#555",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        ⬅ 一覧に戻る
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
