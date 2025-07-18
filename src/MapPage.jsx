import React, { useEffect, useState, useMemo, useRef } from "react";
import DeckGL from "@deck.gl/react";
import { OrbitView, OrthographicView } from "@deck.gl/core";
import {
  ScatterplotLayer,
  ColumnLayer,
  LineLayer,
  TextLayer,
  GridCellLayer,
} from "@deck.gl/layers";
import Drawer from "@mui/material/Drawer";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [is3D, setIs3D] = useState(false);
  const [viewState, setViewState] = useState({
    target: [0, 0, 0],
    rotationX: 0,
    rotationOrbit: 0,
    zoom: 5,
    minZoom: 4.0,
    maxZoom: 10.0,
  });
  const [saved2DViewState, setSaved2DViewState] = useState(null);
  const [userPinCoords, setUserPinCoords] = useState(null);
  const [nearestPoints, setNearestPoints] = useState([]);
  const [zMetric, setZMetric] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userRatings, setUserRatings] = useState({});
  const [productWindow, setProductWindow] = useState(null);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [sweetness, setSweetness] = useState(50);
  const [body, setBody] = useState(50);
  const drawerContentRef = useRef(null);
  const [hasConfirmedSlider, setHasConfirmedSlider] = useState(false);

  useEffect(() => {
    if (location.state?.autoOpenSlider) {
      setIsSliderOpen(true);
    }
  }, [location.state]);

  // PCA + UMAPをマージして読み込み
  useEffect(() => {
    Promise.all([
      fetch("pca_result.json").then((res) => res.json()),
      fetch("umap_data.json").then((res) => res.json())
    ])
    .then(([pcaData, umapData]) => {
      const umapMap = {};
      umapData.forEach((item) => {
        umapMap[item.JAN] = item;
      });

      const merged = pcaData.map((item) => ({
        ...item,
        ...(umapMap[item.JAN] || {})
      }));

      setData(merged);
      localStorage.setItem("umapData", JSON.stringify(merged));
    })
    .catch((error) => {
      console.error("データ取得エラー:", error);
    });
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("userRatings");
    if (stored) {
      setUserRatings(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("userRatings", JSON.stringify(userRatings));
  }, [userRatings]);

  useEffect(() => {
    if (drawerContentRef.current) {
      drawerContentRef.current.scrollTop = 0;
    }
  }, [nearestPoints]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === "userRatings") {
        const updated = JSON.parse(event.newValue);
        setUserRatings(updated);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    // スライダーで保存した打点をロードする
    const storedPin = localStorage.getItem("userPinCoords");
    if (storedPin) {
      const coords = JSON.parse(storedPin);
      setUserPinCoords(coords);

      // viewStateを打点中心に更新
      setViewState((prev) => ({
        ...prev,
        target: [coords[0], coords[1]+ 5.0, 0], // 中心を打点に
        zoom: prev.zoom // ズームは前のまま
      }));

      if (data.length > 0) {
        const nearest = data
          .map((d) => ({
            ...d,
           distance: Math.hypot(d.BodyAxis - coords[0], -d.SweetAxis - coords[1]),
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 10);

        setNearestPoints(nearest);
      }
    }
  }, [data]);

  const typeColorMap = {
    White: [0, 120, 255],
    Red: [255, 0, 0],
    Rose: [255, 102, 204],
    Sparkling: [255, 255, 0],
    Other: [150, 150, 150],
  };

  const gridInterval = 0.2;
  const cellSize = 0.2;

  const gridLines = useMemo(() => {
    const lines = [];
    for (let x = -100; x <= 100; x += gridInterval) {
      lines.push({
        sourcePosition: [x, -100, 0],
        targetPosition: [x, 100, 0],
      });
    }
    for (let y = -100; y <= 100; y += gridInterval) {
      lines.push({
        sourcePosition: [-100, y, 0],
        targetPosition: [100, y, 0],
      });
    }
    return lines;
  }, [gridInterval]);

  const cells = useMemo(() => {
    const map = new Map();
    data.forEach((d) => {
      const x = Math.floor(d.BodyAxis / cellSize) * cellSize;
      const y = Math.floor((is3D ? d.SweetAxis : -d.SweetAxis) / cellSize) * cellSize;
      const key = `${x},${y}`;
      if (!map.has(key)) {
        map.set(key, { position: [x, y], count: 0, hasRating: false });
      }
      if (userRatings[d.JAN]) {
        map.get(key).hasRating = true;
      }
      map.get(key).count += 1;
    });
    return Array.from(map.values());
  }, [data, userRatings, is3D]);

  const mainLayer = useMemo(() => {
    if (is3D) {
      return new ColumnLayer({
        id: `columns-${zMetric}`,
        data,
        diskResolution: 12,
        radius: 0.05,
        extruded: true,
        elevationScale: 2,
        getPosition: (d) => [d.BodyAxis, d.SweetAxis],
        getElevation: (d) => (zMetric ? Number(d[zMetric]) || 0 : 0),
        getFillColor: (d) => typeColorMap[d.Type] || typeColorMap.Other,
        pickable: true,
        onClick: (info) => {
          if (info && info.object) {
            const { BodyAxis, SweetAxis } = info.object;
            setViewState((prev) => ({
              ...prev,
              target: [BodyAxis, SweetAxis, 0],
            }));
          }
        },
      });
    } else {
      return new ScatterplotLayer({
        id: "scatter",
        data,
        getPosition: (d) => [d.BodyAxis, -d.SweetAxis, 0],
        getFillColor: (d) => typeColorMap[d.Type] || typeColorMap.Other,
        getRadius: 0.05,
        pickable: true,
      });
    }
  }, [data, is3D, zMetric]);

  const gridCellLayer = new GridCellLayer({
    id: "grid-cells",
    data: cells,
    cellSize,
    getPosition: (d) => d.position,
    getFillColor: (d) =>
      d.hasRating ? [180, 100, 50, 150] : [200, 200, 200, 80],
    getElevation: 0,
    pickable: false,
  });

  const ratingLayer = new ScatterplotLayer({
  id: "rating-bubbles",
  data: data.filter((d) => userRatings[d.JAN]),
  getPosition: (d) => [d.BodyAxis, -d.SweetAxis, 0],
  getFillColor: [255, 165, 0, 180],
  getRadius: (d) => {
    const ratingObj = userRatings[d.JAN];
    return ratingObj ? ratingObj.rating * 0.2 : 0.01;
  },
  sizeUnits: "common",
  pickable: false,
  });

  const ratingDateLayer = new TextLayer({
  id: "rating-dates",
  data: data.filter((d) => userRatings[d.JAN]),
  getPosition: (d) => [d.BodyAxis, -d.SweetAxis,  is3D ? 0.1 : 0],
  getText: (d) => {
    const dateStr = userRatings[d.JAN]?.date;
    return dateStr ? new Date(dateStr).toLocaleDateString() : "";
  },
  getSize: 12,
  sizeUnits: "pixels",
  getColor: [50, 50, 50, 200],
  getTextAnchor: "start",
  getAlignmentBaseline: "center",
  });

  const userPinLayer = userPinCoords
    ? new ScatterplotLayer({
        id: "user-pin",
        data: [userPinCoords],
        getPosition: (d) => [d[0], d[1], -0.01],
        getFillColor: [0, 255, 0, 200],
        getRadius: 0.3,
        pickable: false,
      })
    : null;

  const textLayer = nearestPoints.length
    ? new TextLayer({
        id: "nearest-labels",
        data: nearestPoints.map((d, i) => ({
          position: [
            d.BodyAxis,
            -d.SweetAxis,
            is3D ? (Number(d[zMetric]) || 0) + 0.05 : 0,
          ],
          text: String(i + 1),
        })),
        getPosition: (d) => d.position,
        getText: (d) => d.text,
        getSize: is3D ? 0.1 : 16,
        sizeUnits: is3D ? "meters" : "pixels",
        getColor: [0, 0, 0],
        getTextAnchor: "middle",
        getAlignmentBaseline: "center",
        fontFamily: "Helvetica Neue",
      })
    : null;

  const textLayer = useMemo(() => {
  return nearestPoints.length
    ? new TextLayer({
        id: "nearest-labels",
        data: nearestPoints.map((d, i) => ({
          position: [
            d.BodyAxis,
            -d.SweetAxis,
            is3D ? (Number(d[zMetric]) || 0) + 0.05 : 0,
          ],
          text: String(i + 1),
        })),
        getPosition: (d) => d.position,
        getText: (d) => d.text,
        getSize: is3D ? 0.1 : 16,
        sizeUnits: is3D ? "meters" : "pixels",
        getColor: [0, 0, 0],
        getTextAnchor: "middle",
        getAlignmentBaseline: "center",
        fontFamily: "Helvetica Neue",
      })
    : null;
}, [nearestPoints, is3D, zMetric]); // useMemo依存関係

// 👇 ここにリングレイヤー
const ratingCircleLayers = useMemo(() => {
  return Object.entries(userRatings).flatMap(([jan, rating]) => {
    const item = data.find(d => d.JAN === jan);
    if (!item || !item.BodyAxis || !item.SweetAxis) return [];

    const count = Math.min(rating, 6);
    const radiusBase = 0.15;

    return Array.from({ length: count }).map((_, i) => new PathLayer({
      id: `ring-${jan}-${i}`,
      data: [{
        path: Array.from({ length: 40 }, (_, j) => {
          const angle = (j / 40) * Math.PI * 2;
          const radius = radiusBase * (i + 1);
          return [
            item.BodyAxis + Math.cos(angle) * radius,
            (is3D ? item.SweetAxis : -item.SweetAxis) + Math.sin(angle) * radius
          ];
        }),
      }],
      pickable: false,
      getPath: d => d.path,
      getColor: [51, 51, 51, 255],
      widthMinPixels: 2,
      widthMaxPixels: 2,
      getWidth: 2,
      opacity: 1,
    }));
  });
}, [data, userRatings, is3D]);

  return (
    <div style={{ 
      position: "absolute", 
      top: 0,
      left: 0,
      margin: 0,
      padding: 0,
      width: "100%", 
      height: "100%",
       }}>
      {!is3D && (
        <>
          <div style={{
            position: "absolute", top: "10px", left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2, background: "rgba(255,255,255,0.85)",
            padding: "4px 8px", borderRadius: "4px",
            fontSize: "14px", fontWeight: "bold",
            fontFamily: "Helvetica Neue, Arial, sans-serif",
          }}>↑ Sweet</div>
          <div style={{
            position: "absolute", bottom: "30px", left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2, background: "rgba(255,255,255,0.85)",
            padding: "4px 8px", borderRadius: "4px",
            fontSize: "14px", fontWeight: "bold",
            fontFamily: "Helvetica Neue, Arial, sans-serif",
          }}>↓ Dry</div>
          <div style={{
            position: "absolute", top: "45%", left: "10px",
            transform: "translateY(-50%)",
            zIndex: 2, background: "rgba(255,255,255,0.85)",
            padding: "4px 8px", borderRadius: "4px",
            fontSize: "14px", fontWeight: "bold",
            fontFamily: "Helvetica Neue, Arial, sans-serif",
          }}>← Light</div>
          <div style={{
            position: "absolute", top: "45%", right: "10px",
            transform: "translateY(-50%)",
            zIndex: 2, background: "rgba(255,255,255,0.85)",
            padding: "4px 8px", borderRadius: "4px",
            fontSize: "14px", fontWeight: "bold",
            fontFamily: "Helvetica Neue, Arial, sans-serif",
          }}>Heavy →</div>
        </>
      )}

      <DeckGL
        views={is3D ? new OrbitView() : new OrthographicView()}
        viewState={viewState}
        onViewStateChange={({ viewState: vs }) => setViewState(vs)}
        controller={{
          dragPan: true,
          dragRotate: true,
          minRotationX: 5,
          maxRotationX: 90,
          minZoom: 4.0,
          maxZoom: 10.0,
        }}
        onClick={(info) => {
          if (is3D) return;
          if (info && info.coordinate) {
            const [x, y] = info.coordinate;
            setUserPinCoords([x, y]);

            const nearest = data
              .map((d) => ({
                ...d,
                distance: Math.hypot(d.BodyAxis - x, -d.SweetAxis - y),
              }))
              .sort((a, b) => a.distance - b.distance)
              .slice(0, 10);

            setNearestPoints(nearest);
            setIsDrawerOpen(true);
          }
        }}
        layers={[
          gridCellLayer,
          new LineLayer({
            id: "grid-lines",
            data: gridLines,
            getSourcePosition: (d) => d.sourcePosition,
            getTargetPosition: (d) => d.targetPosition,
            getColor: [200, 200, 200, 120],
            getWidth: 1,
            pickable: false,
          }),
          mainLayer,
          userPinLayer,
          textLayer,
          ratingLayer,
          ratingDateLayer,
          ...ratingCircleLayers,
        ]}
      />

      {is3D && (
        <select
          value={zMetric}
          onChange={(e) => setZMetric(e.target.value)}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 1,
            padding: "6px",
            fontSize: "14px",
          }}
        >
          <option value="">ー</option>
          <option value="ブドウ糖">甘味</option>
          <option value="リンゴ酸">フルティー</option>
          <option value="総ポリフェノール">渋味</option>
          <option value="Vanillin">Vanillin</option>
          <option value="Furfural">Furfural</option>
        </select>
      )}

 <button
  onClick={() => {
    const nextIs3D = !is3D;
    setIs3D(nextIs3D);

    if (nextIs3D) {
      // 2Dの位置を保存
      setSaved2DViewState(viewState);

      // 3D用
      setViewState({
        ...viewState,
        rotationX: 45,
        rotationOrbit: 0,
      });
    } else {
      // 2D用に戻す
      setViewState({
        ...saved2DViewState,
        rotationX: undefined,
        rotationOrbit: undefined,
      });
    }
  }}
  style={{
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 1,
    padding: "8px 12px",
    fontSize: "14px",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
  }}
>
  {is3D ? "→ Map" : "→ TasteData"}
</button>

      {!is3D && (
      <button
        onClick={() => {
          setSweetness(50);   // ← 追加
          setBody(50);        // ← 追加
          setIsSliderOpen(true);
        }}
        style={{
          position: "absolute",
          top: "70px",        // 「→ TasteData」ボタンの下に配置
          right: "10px",
          zIndex: 1,
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: "#eee",
          border: "1px solid #ccc",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        ★
      </button>
      )}

<Drawer
  anchor="bottom"
  open={isSliderOpen}
  onClose={() => setIsSliderOpen(false)}
  PaperProps={{
    style: {
      width: "100%",
      height: "400px",
      padding: "24px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "stretch",
      fontFamily: "sans-serif",
    },
  }}
>
  <div style={{ display: "flex", justifyContent: "flex-end" }}>
    <button
      onClick={() => setIsSliderOpen(false)}
      style={{
        background: "#eee",
        border: "1px solid #ccc",
        padding: "6px 10px",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      閉じる
    </button>
  </div>

  <h2 style={{ textAlign: "center", fontSize: "20px", marginBottom: "24px" }}>
    基準のワインを飲んだ印象は？
  </h2>

  {/* 甘味スライダー */}
  <div style={{ marginBottom: "32px" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "14px",
        fontWeight: "bold",
        marginBottom: "6px",
      }}
    >
      <span>← こんなに甘みは不要</span>
      <span>もっと甘みが欲しい →</span>
    </div>
    <input
      type="range"
      min="0"
      max="100"
      value={sweetness}
      onChange={(e) => setSweetness(Number(e.target.value))}
      style={{
        width: "100%",
        appearance: "none",
        height: "10px",
        borderRadius: "5px",
        background: `linear-gradient(to right, #007bff ${sweetness}%, #ddd ${sweetness}%)`,
        outline: "none",
        marginTop: "8px",
        WebkitAppearance: "none",
      }}
    />
  </div>

  {/* コクスライダー */}
  <div style={{ marginBottom: "32px" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "14px",
        fontWeight: "bold",
        marginBottom: "6px",
      }}
    >
      <span>← もっと軽やかが良い</span>
      <span>濃厚なコクが欲しい →</span>
    </div>
    <input
      type="range"
      min="0"
      max="100"
      value={body}
      onChange={(e) => setBody(Number(e.target.value))}
      style={{
        width: "100%",
        appearance: "none",
        height: "10px",
        borderRadius: "5px",
        background: `linear-gradient(to right, #007bff ${body}%, #ddd ${body}%)`,
        outline: "none",
        marginTop: "8px",
        WebkitAppearance: "none",
      }}
    />
  </div>

  {/* 地図生成ボタン */}
  <button
    onClick={() => {
      const blendF = data.find((d) => d.JAN === "blendF");
      if (!blendF) return;

      const sweetValues = data.map((d) => d.SweetAxis);
      const bodyValues = data.map((d) => d.BodyAxis);
      const minSweet = Math.min(...sweetValues);
      const maxSweet = Math.max(...sweetValues);
      const minBody = Math.min(...bodyValues);
      const maxBody = Math.max(...bodyValues);

      const sweetValue =
        sweetness <= 50
          ? blendF.SweetAxis - ((50 - sweetness) / 50) * (blendF.SweetAxis - minSweet)
          : blendF.SweetAxis + ((sweetness - 50) / 50) * (maxSweet - blendF.SweetAxis);

      const bodyValue =
        body <= 50
          ? blendF.BodyAxis - ((50 - body) / 50) * (blendF.BodyAxis - minBody)
          : blendF.BodyAxis + ((body - 50) / 50) * (maxBody - blendF.BodyAxis);

      const coords = [bodyValue, -sweetValue];
      setUserPinCoords(coords);
      localStorage.setItem("userPinCoords", JSON.stringify(coords));
      setIsSliderOpen(false);

      setViewState((prev) => ({
      ...prev,
      target: [coords[0], coords[1]+5.0, 0],
    }));

      const nearest = data
        .map((d) => ({
          ...d,
          distance: Math.hypot(d.BodyAxis - coords[0], -d.SweetAxis - coords[1]),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10);

      setNearestPoints(nearest);
      setIsDrawerOpen(true);
    }}
    style={{
      background: "#fff",
      color: "#007bff",
      padding: "14px 30px",
      fontSize: "16px",
      fontWeight: "bold",
      border: "2px solid #007bff",
      borderRadius: "6px",
      cursor: "pointer",
      display: "block",
      margin: "0 auto",
    }}
  >
    決定
  </button>
</Drawer>

{/* 打点に近いワイン表示 */}
<Drawer
  anchor="bottom"
  open={isDrawerOpen && nearestPoints.length > 0}
  onClose={() => setIsDrawerOpen(false)}
  PaperProps={{
    style: {
      width: "100%",
      height: "400px",
      padding: "0",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
  }}
>
  {/* 固定ヘッダー */}
  <div
    style={{
      padding: "8px 16px",
      borderBottom: "1px solid #ddd",
      background: "#f9f9f9",
      flexShrink: 0,
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h3 style={{ margin: 0 }}>打点に近いワイン</h3>
      <button
        onClick={() => {
          setIsDrawerOpen(false);
          setUserPinCoords(null);
          setNearestPoints([]);
        }}
        style={{
          background: "#eee",
          border: "1px solid #ccc",
          padding: "6px 10px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        閉じる
      </button>
    </div>
  </div>

  {/* スクロールするリスト部分 */}
  <div
    style={{
      flex: 1,
      overflowY: "auto",
      padding: "8px 16px",
      backgroundColor: "#fff",
    }}
  >
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {nearestPoints.map((item, idx) => (
        <li
          key={idx}
          onClick={() => {
            const newWin = window.open(`/products/${item.JAN}`, "_blank");
            setProductWindow(newWin);
          }}
          style={{
            padding: "8px 0",
            borderBottom: "1px solid #eee",
            cursor: "pointer",
          }}
        >
          <strong>{idx + 1}.</strong> {item.商品名 || "（名称不明）"}
          <br />
          <small>
            Type: {item.Type || "不明"} / 距離: {item.distance?.toFixed(2)}
          </small>
        </li>
      ))}
    </ul>
  </div>
</Drawer>

</div> 
);
}

export default App;