import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* タイトル（固定） */}
      <div style={{ padding: "16px", textAlign: "center" }}>
        <h2 style={{ margin: 0 }}>購入した店舗を選んでください。</h2>
      </div>

      {/* タブ（固定） */}
      <div
        style={{
          display: "flex",
          maxWidth: "500px",
          width: "100%",
          margin: "0 auto",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          overflow: "hidden",
        }}
      >
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
          }}
        >
          店舗一覧
        </div>
      </div>

      {/* リスト部分（スクロール可能） */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          backgroundColor: "#fff",
          maxWidth: "500px",
          margin: "0 auto",
          width: "100%",
          borderBottomLeftRadius: "12px",
          borderBottomRightRadius: "12px",
          borderLeft: "1px solid #ccc",
          borderRight: "1px solid #ccc",
          borderBottom: "1px solid #ccc",
        }}
      >
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
              <div style={{ textDecoration: "underline", color: "#007bff" }}>
                {store.name} {store.branch}
              </div>
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
                      <div style={{ textDecoration: "underline", color: "#007bff" }}>
                        {store.name} {store.branch}
                      </div>
                      <div>{store.distance}km</div>
                    </div>
                  ))}
              </React.Fragment>
            );
          })}
      </div>
    </div>
  );
}
