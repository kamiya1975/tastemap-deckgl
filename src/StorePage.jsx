import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// 仮データ
const mockStores = [
  { name: "スーパーマーケットA", branch: "●●●店", distance: 1.5, prefecture: "北海道" },
  { name: "スーパーマーケットB", branch: "●●●店", distance: 1.6, prefecture: "北海道" },
  { name: "スーパーマーケットA", branch: "●●●店", distance: 2.5, prefecture: "青森県" },
  { name: "スーパーマーケットC", branch: "●●●店", distance: 3.5, prefecture: "岩手県" },
  { name: "スーパーマーケットD", branch: "●●●店", distance: 3.6, prefecture: "宮城県" },
  { name: "スーパーマーケットA", branch: "●●●店", distance: 5.5, prefecture: "宮城県" },
];

const prefectures = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"
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
    <div
      style={{
        fontFamily: "sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      {/* タイトル */}
      <h2 style={{ textAlign: "center", marginBottom: "12px" }}>
        購入した店舗を選んでください。
      </h2>

      {/* タブ + リストの枠 */}
      <div
        style={{
          flex: 1,
          maxWidth: "500px",
          margin: "0 auto",
          border: "1px solid #ccc",
          borderRadius: "12px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* タブ */}
        <div style={{ display: "flex", backgroundColor: "#eee" }}>
          <div
            onClick={() => setTab("nearby")}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "12px 0",
              backgroundColor: tab === "nearby" ? "#000" : "#ccc",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.2s",
            }}
          >
            近い店舗
          </div>
          <div
            onClick={() => setTab("list")}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "12px 0",
              backgroundColor: tab === "list" ? "#000" : "#ccc",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.2s",
            }}
          >
            店舗一覧
          </div>
        </div>

        {/* スクロール可能エリア */}
        <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#fff" }}>
          {tab === "nearby" &&
            sortedStores.map((store, idx) => (
              <div
                key={idx}
                onClick={handleStoreSelect}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                }}
              >
                <div>{store.name} {store.branch}</div>
                <div>{store.distance}km</div>
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
                      padding: "12px",
                      fontWeight: "bold",
                      backgroundColor: "#f0f0f0",
                      borderBottom: "1px solid #ccc",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
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
                          justifyContent: "space-between",
                          padding: "12px",
                          borderBottom: "1px solid #eee",
                          cursor: "pointer",
                          backgroundColor: "#fff",
                        }}
                      >
                        <div>{store.name} {store.branch}</div>
                        <div>{store.distance}km</div>
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
