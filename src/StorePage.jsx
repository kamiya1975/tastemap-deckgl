import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const mockStores = [
  { name: "スーパーマーケットA", branch: "●●●店", prefecture: "北海道", lat: 34.928, lng: 137.05 },
  { name: "スーパーマーケットB", branch: "●●●店", prefecture: "北海道", lat: 34.93, lng: 137.04 },
  { name: "スーパーマーケットA", branch: "●●●店", prefecture: "青森県", lat: 34.92, lng: 137.06 },
  { name: "スーパーマーケットC", branch: "●●●店", prefecture: "岩手県", lat: 34.925, lng: 137.045 },
  { name: "スーパーマーケットD", branch: "●●●店", prefecture: "宮城県", lat: 34.927, lng: 137.042 },
  { name: "スーパーマーケットA", branch: "●●●店", prefecture: "宮城県", lat: 34.93, lng: 137.055 },
];

const prefectures = ["北海道", "青森県", "岩手県", "宮城県"];

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = deg => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function StorePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("nearby");
  const [expanded, setExpanded] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [storesWithDistance, setStoresWithDistance] = useState([]);
  const [showPrompt, setShowPrompt] = useState(true);

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        const updatedStores = mockStores.map((store) => {
          const distance = haversineDistance(latitude, longitude, store.lat, store.lng);
          return { ...store, distance: distance.toFixed(1) };
        });

        setStoresWithDistance(updatedStores.sort((a, b) => a.distance - b.distance));
        setShowPrompt(false);
      },
      (err) => {
        console.warn("位置情報の取得に失敗:", err);
        setStoresWithDistance(mockStores.map(s => ({ ...s, distance: 999 })));
        setShowPrompt(false);
      }
    );
  };

  const handleDeny = () => {
    setStoresWithDistance(mockStores.map(s => ({ ...s, distance: 999 })));
    setShowPrompt(false);
  };

  const handleStoreSelect = () => {
    navigate("/slider");
  };

  return (
    <div style={{ fontFamily: "sans-serif", height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 上部のバナー形式の確認表示 */}
      {showPrompt && (
        <div style={{
          backgroundColor: "#007bff", color: "#fff", padding: "10px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontSize: "14px"
        }}>
          <span>近くの購入した店舗を探します。位置情報を取得しても良いですか？</span>
          <div>
            <button onClick={handleGetLocation} style={{ margin: "0 5px" }}>Yes</button>
            <button onClick={handleDeny}>No</button>
          </div>
        </div>
      )}

      {/* タイトル */}
      <div style={{ padding: "16px", textAlign: "center", position: "sticky", top: 0, background: "#fff", zIndex: 10 }}>
        <h2 style={{ margin: 0 }}>購入した店舗を選んでください。</h2>
      </div>

      {/* タブ */}
      <div style={{ display: "flex", maxWidth: "500px", width: "100%", margin: "0 auto" }}>
        <div onClick={() => setTab("nearby")} style={{
          flex: 1, textAlign: "center", padding: "12px 0", backgroundColor: tab === "nearby" ? "#000" : "#ccc",
          color: "#fff", fontWeight: "bold", cursor: "pointer"
        }}>近い店舗</div>
        <div onClick={() => setTab("list")} style={{
          flex: 1, textAlign: "center", padding: "12px 0", backgroundColor: tab === "list" ? "#000" : "#ccc",
          color: "#fff", fontWeight: "bold", cursor: "pointer"
        }}>店舗一覧</div>
      </div>

      {/* 本体部分 */}
      <div style={{
        flex: 1, overflowY: "auto", backgroundColor: "#fff", maxWidth: "500px", margin: "0 auto", width: "100%",
        borderBottomLeftRadius: "12px", borderBottomRightRadius: "12px", borderLeft: "1px solid #ccc",
        borderRight: "1px solid #ccc", borderBottom: "1px solid #ccc"
      }}>
        {tab === "nearby" &&
          storesWithDistance.map((store, idx) => (
            <div key={idx} onClick={handleStoreSelect} style={{
              display: "flex", justifyContent: "space-between", padding: "12px",
              borderBottom: "1px solid #eee", cursor: "pointer"
            }}>
              <div style={{ textDecoration: "underline", color: "#007bff" }}>
                {store.name} {store.branch}
              </div>
              <div>{store.distance}km</div>
            </div>
          ))}

        {tab === "list" &&
          prefectures.map((pref, idx) => {
            const storesInPref = mockStores.filter(s => s.prefecture === pref);
            const isOpen = expanded === pref;

            return (
              <React.Fragment key={idx}>
                <div onClick={() => setExpanded(isOpen ? null : pref)} style={{
                  padding: "12px", fontWeight: "bold", backgroundColor: "#f0f0f0",
                  borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between",
                  alignItems: "center", cursor: "pointer"
                }}>
                  <span>{pref}</span><span>{isOpen ? "▲" : "▼"}</span>
                </div>
                {isOpen &&
                  storesInPref.map((store, i) => (
                    <div key={i} onClick={handleStoreSelect} style={{
                      display: "flex", justifyContent: "space-between", padding: "12px",
                      borderBottom: "1px solid #eee", cursor: "pointer", backgroundColor: "#fff"
                    }}>
                      <div>{store.name} {store.branch}</div>
                      <div>{store.distance ?? "-"}km</div>
                    </div>
                  ))}
              </React.Fragment>
            );
          })}
      </div>
    </div>
  );
}
