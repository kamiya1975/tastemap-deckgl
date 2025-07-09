import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const mockStores = [
  { name: "スーパーマーケットA", branch: "●●●店", distance: 1.5, prefecture: "愛知県" },
  { name: "スーパーマーケットB", branch: "●●●店", distance: 1.6, prefecture: "愛知県" },
  { name: "スーパーマーケットA", branch: "●●●店", distance: 2.5, prefecture: "静岡県" },
  { name: "スーパーマーケットC", branch: "●●●店", distance: 3.5, prefecture: "三重県" },
  { name: "スーパーマーケットD", branch: "●●●店", distance: 3.6, prefecture: "岐阜県" },
  { name: "スーパーマーケットA", branch: "●●●店", distance: 5.5, prefecture: "愛知県" },
];

const prefectures = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

export default function StorePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("nearby"); // "nearby" or "prefecture"
  const [selectedPrefecture, setSelectedPrefecture] = useState("北海道");
  const [stores, setStores] = useState([]);

  useEffect(() => {
    setStores(mockStores);
  }, []);

  const filteredStores =
    tab === "nearby"
      ? stores.sort((a, b) => a.distance - b.distance)
      : stores.filter((store) => store.prefecture === selectedPrefecture);

  return (
    <div style={{ padding: "16px", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
        購入した店舗を選んでください。
      </h2>

      {/* タブ切替 */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
        <button
          onClick={() => setTab("nearby")}
          style={{
            padding: "8px 16px",
            marginRight: "8px",
            border: tab === "nearby" ? "2px solid #444" : "1px solid #ccc",
            background: tab === "nearby" ? "#eee" : "#fff",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          近い店舗
        </button>
        <button
          onClick={() => setTab("prefecture")}
          style={{
            padding: "8px 16px",
            border: tab === "prefecture" ? "2px solid #444" : "1px solid #ccc",
            background: tab === "prefecture" ? "#eee" : "#fff",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          店舗一覧
        </button>
      </div>

      {/* 都道府県セレクト */}
      {tab === "prefecture" && (
        <div style={{ textAlign: "center", marginBottom: "12px" }}>
          <select
            value={selectedPrefecture}
            onChange={(e) => setSelectedPrefecture(e.target.value)}
            style={{
              fontSize: "1rem",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            {prefectures.map((pref, idx) => (
              <option key={idx} value={pref}>
                {pref}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 店舗リスト */}
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          border: "1px solid #ccc",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {/* ヘッダー */}
        <div style={{ display: "flex", background: "#999", color: "#fff" }}>
          <div style={{ flex: "1", padding: "10px", textAlign: "center" }}>📌</div>
          <div style={{ flex: "4", padding: "10px" }}>店舗一覧</div>
          <div style={{ flex: "2", padding: "10px", textAlign: "right" }}>距離</div>
        </div>

        {/* 一覧 */}
        {filteredStores.map((store, idx) => (
          <div
            key={idx}
            onClick={() => {
              // 選択データの処理など
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
            <div style={{ flex: "2", textAlign: "right" }}>
              {store.distance}km
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
