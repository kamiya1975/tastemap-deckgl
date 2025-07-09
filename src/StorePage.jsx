import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 仮の店舗データ（prefecture単位で割当）
const mockStores = [
  { name: "スーパーマーケットA", branch: "●●●店", distance: 1.5, prefecture: "北海道" },
  { name: "スーパーマーケットB", branch: "●●●店", distance: 1.6, prefecture: "北海道" },
  { name: "スーパーマーケットC", branch: "●●●店", distance: 3.5, prefecture: "青森県" },
  { name: "スーパーマーケットD", branch: "●●●店", distance: 3.6, prefecture: "岩手県" },
  { name: "スーパーマーケットA", branch: "●●●店", distance: 5.5, prefecture: "宮城県" },
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
  const [tab, setTab] = useState("nearby");
  const [expanded, setExpanded] = useState(null);

  const sortedStores = [...mockStores].sort((a, b) => a.distance - b.distance);

  return (
    <div style={{ padding: "16px", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "16px" }}>
        購入した店舗を選んでください。
      </h2>

      {/* タブ切り替え */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
        <button
          onClick={() => setTab("nearby")}
          style={{
            padding: "8px 24px",
            border: "none",
            backgroundColor: tab === "nearby" ? "#000" : "#ccc",
            color: tab === "nearby" ? "#fff" : "#333",
            borderTopLeftRadius: "6px",
            borderBottomLeftRadius: "6px",
          }}
        >
          近い店舗
        </button>
        <button
          onClick={() => setTab("list")}
          style={{
            padding: "8px 24px",
            border: "none",
            backgroundColor: tab === "list" ? "#000" : "#ccc",
            color: tab === "list" ? "#fff" : "#333",
            borderTopRightRadius: "6px",
            borderBottomRightRadius: "6px",
          }}
        >
          店舗一覧
        </button>
      </div>

      {/* タブ: 近い店舗 */}
      {tab === "nearby" && (
        <div style={{ maxWidth: "500px", margin: "0 auto", border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden" }}>
          <div style={{ display: "flex", background: "#999", color: "#fff" }}>
            <div style={{ flex: "1", padding: "10px", textAlign: "center" }}>近い店舗</div>
            <div style={{ flex: "2", padding: "10px", textAlign: "right" }}>距離</div>
          </div>

          {sortedStores.map((store, idx) => (
            <div
              key={idx}
              onClick={() => navigate("/slider")}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                borderTop: "1px solid #ccc",
                cursor: "pointer",
                background: "#f9f9f9",
              }}
            >
              <div>{store.name} {store.branch}</div>
              <div>{store.distance}km</div>
            </div>
          ))}
        </div>
      )}

      {/* タブ: 店舗一覧（都道府県ごとのアコーディオン） */}
      {tab === "list" && (
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
          {prefectures.map((pref, idx) => {
            const storesInPref = mockStores.filter((s) => s.prefecture === pref);
            const isOpen = expanded === pref;

            return (
              <div key={idx} style={{ border: "1px solid #ccc", borderRadius: "6px", marginBottom: "8px" }}>
                <div
                  onClick={() => setExpanded(isOpen ? null : pref)}
                  style={{
                    padding: "10px",
                    backgroundColor: "#f0f0f0",
                    display: "flex",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  <span>{pref}</span>
                  <span>{isOpen ? "▲" : "▼"}</span>
                </div>

                {isOpen &&
                  storesInPref.map((store, i) => (
                    <div
                      key={i}
                      onClick={() => navigate("/slider")}
                      style={{
                        padding: "10px",
                        borderTop: "1px solid #ddd",
                        cursor: "pointer",
                        background: "#fff",
                      }}
                    >
                      {store.name} {store.branch}
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
