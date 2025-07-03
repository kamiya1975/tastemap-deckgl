import React, { useEffect, useState, useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { OrbitView, OrthographicView } from "@deck.gl/core";
import { ScatterplotLayer, LineLayer } from "@deck.gl/layers";

// 初期ビュー
const INITIAL_VIEW_STATE_3D = {
  target: [0, 0, 0],
  rotationX: 45,
  rotationOrbit: 30,
  zoom: 3,
  minZoom: 0,
  maxZoom: 1000,
};

const INITIAL_VIEW_STATE_2D = {
  target: [0, 0, 0],
  zoom: 4,
  minZoom: 0,
  maxZoom: 1000,
};

function App() {
  const [data, setData] = useState([]);
  const [is3D, setIs3D] = useState(true);

  useEffect(() => {
    fetch("umap_data.json")
      .then((res) => res.json())
      .then((d) => {
        console.log("データ読み込み完了:", d.length, "件");
        setData(d);
      });
  }, []);

  const typeColorMap = {
    White: [0, 120, 255],
    Red: [255, 0, 0],
    Rose: [255, 102, 204],
    Sparkling: [255, 255, 0],
    Other: [150, 150, 150],
  };

  // 点群範囲を計算
  const gridLines = useMemo(() => {
    if (data.length === 0) return [];

    const xs = data.map(d => d.umap_x);
    const ys = data.map(d => d.umap_y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    // 余白
    const padding = 0.1;
    const startX = minX - padding;
    const endX = maxX + padding;
    const startY = minY - padding;
    const endY = maxY + padding;

    const spacing = 0.1;
    const lines = [];

    // 縦線
    for (let x = startX; x <= endX; x += spacing) {
      lines.push({
        sourcePosition: [x, startY, 0],
        targetPosition: [x, endY, 0],
      });
    }

    // 横線
    for (let y = startY; y <= endY; y += spacing) {
      lines.push({
        sourcePosition: [startX, y, 0],
        targetPosition: [endX, y, 0],
      });
    }

    return lines;
  }, [data]);

  const gridLineLayer = new LineLayer({
    id: "grid-lines",
    data: gridLines,
    getSourcePosition: d => d.sourcePosition,
    getTargetPosition: d => d.targetPosition,
    getColor: [200, 200, 200, 120],
    getWidth: 1,
    pickable: false,
  });

  const scatterLayer = new ScatterplotLayer({
    id: "scatter",
    data,
    getPosition: d => [d.umap_x, d.umap_y, (d.甘味 ?? 0) * 0.001],
    getFillColor: d => typeColorMap[d.Type] || typeColorMap.Other,
    getRadius: 0.1,
    pickable: true,
  });

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <DeckGL
        views={is3D ? new OrbitView() : new OrthographicView()}
        initialViewState={is3D ? INITIAL_VIEW_STATE_3D : INITIAL_VIEW_STATE_2D}
        controller={true}
        layers={[gridLineLayer, scatterLayer]}
      />

      {/* 切り替えボタン */}
      <button
        onClick={() => setIs3D(!is3D)}
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
          cursor: "pointer"
        }}
      >
        {is3D ? "2D表示" : "3D表示"}
      </button>
    </div>
  );
}

export default App;
