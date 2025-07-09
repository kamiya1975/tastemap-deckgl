// src/StorePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// 仮データ（後にDBから取得・位置計算へ）
const mockStores = [
  { name: "スーパーマーケットA", branch: "●●●店", distance: 1.5 },
  { name: "スーパーマーケットB", branch: "●●●店", distance: 1.6 },
  { name: "スーパーマーケットA", branch: "●●●店", distance: 2.5 },
  { name: "スーパーマーケットC", branch: "●●●店", distance: 3.5 },
  { name: "スーパーマーケットD", branch: "●●●店", distance: 3.6 },
  { name: "スーパーマーケットA", branch: "●●●店", distance: 5.5 },
];

export default function StorePage() {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);

  useEffect(() => {
    // 将来的には現在地取得 → DBとの距離計算 に置き換える
    setStores(mockStores.sort((a, b) => a.distance - b.distance));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        購入した店舗を選んでください。
      </h2>

      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          border: "1px solid #ccc",
          borderRadius: "8px",
          overflow: "hidden",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", background: "#999", color: "#fff" }}>
          <div style={{ flex: "1", padding: "10px", textAlign: "center" }}>📍</div>
          <div style={{ flex: "4", padding: "10px" }}>店舗一覧</div>
          <div style={{ flex: "2", padding: "10px", textAlign: "right" }}>距離</div>
        </div>

        {stores.map((store, idx) => (
          <div
            key={idx}
            onClick={() => {
              // 今後ここで選択された店舗情報を記録
              navigate("/slider");
            }}
            style={{
              display: "flex",
              borderTop: "1px solid #ccc",
              padding: "10px",
              cursor: "pointer",
              backgroundColor: "#f9f9f9",
            }}
          >
            <div style={{ flex: "1", textAlign: "center" }}>　</div>
            <div style={{ flex: "4" }}>
              {store.name} {store.branch}
            </div>
            <div style={{ flex: "2", textAlign: "right" }}>{store.distance}km</div>
          </div>
        ))}
      </div>
    </div>
  );
}
