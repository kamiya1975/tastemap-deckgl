import React, { useEffect, useState } from "react";
import DeckGL from "@deck.gl/react";
import { OrbitView, OrthographicView } from "@deck.gl/core";
import { ScatterplotLayer, GridCellLayer } from "@deck.gl/layers";

// 初期ビュー設定
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

  // データ読み込み
  useEffect(() => {
    fetch("umap_data.json")
      .then((res) => res.json())
      .then((d) => {
        console.log("データ読み込み完了:", d.length, "件");
        setData(d);
      });
  }, []);

  // タイプごとの色
  const typeColorMap = {
    White: [0, 120, 255],
    Red: [255, 0, 0],
    Rose: [255, 102, 204],
    Sparkling: [255, 255, 0],
    Other: [150, 150, 150],
  };

  // 背景の升目罫線レイヤー
  const gridLineLayer = new GridCellLayer({
    id: "grid-lines",
    data,
    getPosition: d => [d.umap_x, d.umap_y],
    cellSize: 0.05, // 升目の大きさ
    elevationScale: 0,
    getElevationWeight: () => 0,
    elevationAggregation: "MAX",
    getColorWeight: () => 1,
    colorAggregation: "MAX",
    getFillColor: () => [200, 200, 200, 50], // 薄いグレー
    extruded: false,
    pickable: false,
  });

  // データのヒートマップ
  const gridLayer = new GridCellLayer({
    id: "grid",
    data,
    getPosition: d => [d.umap_x, d.umap_y],
    cellSize: 0.001,
    elevationScale: 0.001,
    getElevationWeight: d => d.甘味 ?? 0,
    elevationAggregation: "MEAN",
    getColorWeight: d => d.甘味 ?? 0,
    colorAggregation: "MEAN",
    extruded: true,
    pickable: false,
  });

  // ワインの散布図
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
        layers={[gridLineLayer, gridLayer, scatterLayer]}
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
