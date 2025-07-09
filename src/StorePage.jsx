import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// 仮のデータ
const mockStores = [
  { name: "スーパーマーケットA", branch: "●●●店", distance: 1.5, prefecture: "北海道" },
  { name: "スーパーマーケットB", branch: "●●●店", distance: 1.6, prefecture: "北海道" },
  { name: "スーパーマーケットA", branch: "●●●店", distance: 2.5, prefecture: "青森県" },
  { name: "スーパーマーケットC", branch: "●●●店", distance: 3.5, prefecture: "岩手県" },
  { name: "スーパーマーケットD", branch: "●●●店", distance: 3.6, prefecture: "宮城県" },
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

  const handleStoreSelect = () => {
    navigate("/slider");
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "16px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "16px" }}>
        購入した店舗を選んでください。
      </h2>

      {/* タブ切替 */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
        <div
          onClick={() => setTab("nearby")}
          style={{
            flex: 1,
            textAlign: "center",
            padding: "10px 0",
            backgroundColor: tab === "nearby" ? "#000" : "#ccc",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          近い店舗
        </div>
        <div
          onClick={() => setTab("list")}
          style={{
            flex: 1,
            textAlign: "center",
            padding: "10px 0",
            backgroundColor: tab === "list" ? "#000" : "#ccc",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          店舗一覧
        </div>
      </div>

      {/* リスト表示 */}
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          border: "1px solid #ccc",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {/* 見出し行 */}
        <div style={{ display: "flex", background: "#999", color: "#fff" }}>
          <div style={{ flex: "4", padding: "10px" }}>店舗一覧</div>
          <div style={{ flex: "2", padding: "10px", textAlign: "right" }}>距離</div>
        </div>

        {/* 本体リスト */}
        <div>
          {tab === "nearby" &&
            sortedStores.map((store, idx) => (
              <div
                key={idx}
                onClick={handleStoreSelect}
                style={{
                  display: "flex",
                  borderTop: "1px solid #ddd",
                  padding: "10px",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                }}
              >
                <div style={{ flex: "4" }}>{store.name} {store.branch}</div>
                <div style={{ flex: "2", textAlign: "right" }}>{store.distance}km</div>
              </div>
            ))}

          {tab === "list" &&
            prefectures.map((pref, idx) => {
              const storesInPref = mockStores.filter((s) => s.prefecture === pref);
              const isOpen = expanded === pref;

              return (
                <React.Fragment key={idx}>
                  <div
                    onClick={() => setExpanded(isOpen ? null : pref)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px",
                      borderTop: "1px solid #ccc",
                      backgroundColor: "#f0f0f0",
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
                        onClick={handleStoreSelect}
                        style={{
                          display: "flex",
                          borderTop: "1px solid #eee",
                          padding: "10px",
                          backgroundColor: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ flex: "4" }}>{store.name} {store.branch}</div>
                        <div style={{ flex: "2", textAlign: "right" }}>{store.distance}km</div>
                      </div>
                    ))}
                </React.Fragment>
              );
            })}
        </div>
      </div>
    </div>
  );
}
