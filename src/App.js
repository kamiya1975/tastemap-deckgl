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

function App() {
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
  const [userPinCoords, setUserPinCoords] = useState(null);
  const [nearestPoints, setNearestPoints] = useState([]);
  const [zMetric, setZMetric] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userRatings, setUserRatings] = useState({});
  const [productWindow, setProductWindow] = useState(null);

  const drawerContentRef = useRef(null);

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
      const y = Math.floor(-d.SweetAxis / cellSize) * cellSize;
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
  }, [data, userRatings]);

  const mainLayer = useMemo(() => {
    if (is3D) {
      return new ColumnLayer({
        id: `columns-${zMetric}`,
        data,
        diskResolution: 12,
        radius: 0.05,
        extruded: true,
        elevationScale: 2,
        getPosition: (d) => [d.BodyAxis, -d.SweetAxis],
        getElevation: (d) => (zMetric ? Number(d[zMetric]) || 0 : 0),
        getFillColor: (d) => typeColorMap[d.Type] || typeColorMap.Other,
        pickable: true,
        onClick: (info) => {
          if (info && info.object) {
            const { BodyAxis, SweetAxis } = info.object;
            setViewState((prev) => ({
              ...prev,
              target: [BodyAxis, -SweetAxis, 0],
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
    return ratingObj ? ratingObj.rating * 0.1 : 0.05;
  },
  sizeUnits: "common",
  pickable: false,
  });

  const ratingDateLayer = new TextLayer({
  id: "rating-dates",
  data: data.filter((d) => userRatings[d.JAN]),
  getPosition: (d) => [d.BodyAxis, -d.SweetAxis, 0],
  getText: (d) => {
    const dateStr = userRatings[d.JAN]?.date;
    return dateStr ? new Date(dateStr).toLocaleDateString() : "";
  },
  getSize: 14,
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
      })
    : null;

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {!is3D && (
        <>
          <div style={{
            position: "absolute", top: "10px", left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2, background: "rgba(255,255,255,0.85)",
            padding: "4px 8px", borderRadius: "4px",
            fontSize: "14px", fontWeight: "bold"
          }}>↑ Sweet</div>
          <div style={{
            position: "absolute", bottom: "10px", left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2, background: "rgba(255,255,255,0.85)",
            padding: "4px 8px", borderRadius: "4px",
            fontSize: "14px", fontWeight: "bold"
          }}>↓ Dry</div>
          <div style={{
            position: "absolute", top: "50%", left: "10px",
            transform: "translateY(-50%)",
            zIndex: 2, background: "rgba(255,255,255,0.85)",
            padding: "4px 8px", borderRadius: "4px",
            fontSize: "14px", fontWeight: "bold"
          }}>← Light</div>
          <div style={{
            position: "absolute", top: "50%", right: "10px",
            transform: "translateY(-50%)",
            zIndex: 2, background: "rgba(255,255,255,0.85)",
            padding: "4px 8px", borderRadius: "4px",
            fontSize: "14px", fontWeight: "bold"
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
          setViewState((prev) => ({
            ...prev,
            rotationX: nextIs3D ? 30 : 0,
            rotationOrbit: nextIs3D ? 30 : 0,
          }));
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

      <Drawer
        anchor="bottom"
        open={isDrawerOpen}
        variant="persistent"
        hideBackdrop
        PaperProps={{
          style: { height: "50%", display: "flex", flexDirection: "column" },
        }}
      >
        <div
          style={{
            padding: "8px 16px",
            borderBottom: "1px solid #ddd",
            background: "#f9f9f9",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={() => {
              setIsDrawerOpen(false);
              if (productWindow) {
                productWindow.close();
                setProductWindow(null);
              }
            }}
            style={{
              background: "#eee",
              border: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            閉じる
          </button>
        </div>

        <div
          ref={drawerContentRef}
          style={{
            padding: "16px",
            overflowY: "auto",
            flex: 1,
          }}
        >
          <h3>打点に近いワイン</h3>
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
