import React, { useEffect, useState, useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { OrbitView, OrthographicView } from "@deck.gl/core";
import { ScatterplotLayer, LineLayer } from "@deck.gl/layers";

// 初期ビュー
const INITIAL_VIEW_STATE_3D = {
  target: [0, 0, 0],
  rotationX: 14,
  rotationOrbit: 85,
  zoom: 8,
  minZoom: 0,
  maxZoom: 100,
};

const INITIAL_VIEW_STATE_2D = {
  target: [0, 0, 0],
  zoom: 4,
  minZoom: 0,
  maxZoom: 100,
};

function App() {
  const [data, setData] = useState([]);
  const [is3D, setIs3D] = useState(true);
  const [viewState, setViewState] = useState(
    is3D ? INITIAL_VIEW_STATE_3D : INITIAL_VIEW_STATE_2D
  );

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

  // 広域グリッド線
  const gridLines = useMemo(() => {
    const startX = -100;
    const endX = +100;
    const startY = -100;
    const endY = +100;
    const spacing = 2;

    const lines = [];

    for (let x = startX; x <= endX; x += spacing) {
      lines.push({
        sourcePosition: [x, startY, 0],
        targetPosition: [x, endY, 0],
      });
    }
    for (let y = startY; y <= endY; y += spacing) {
      lines.push({
        sourcePosition: [startX, y, 0],
        targetPosition: [endX, y, 0],
      });
    }

    return lines;
  }, []);

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
        viewState={viewState}
        onViewStateChange={({ viewState: vs }) => setViewState(vs)}
        controller={true}
        layers={[gridLineLayer, scatterLayer]}
      />

      {/* 切り替えボタン */}
      <button
        onClick={() => {
          const nextIs3D = !is3D;
          setIs3D(nextIs3D);
          setViewState(nextIs3D ? INITIAL_VIEW_STATE_3D : INITIAL_VIEW_STATE_2D);
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
          cursor: "pointer"
        }}
      >
        {is3D ? "2D表示" : "3D表示"}
      </button>

      {/* 状態表示 */}
      <div
        style={{
          position: "absolute",
          top: "50px",
          right: "10px",
          zIndex: 1,
          background: "rgba(255,255,255,0.9)",
          padding: "6px 10px",
          fontSize: "12px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      >
        <div>Zoom: {viewState.zoom.toFixed(2)}</div>
        {is3D && (
          <>
            <div>RotationX: {viewState.rotationX?.toFixed(1)}°</div>
            <div>RotationOrbit: {viewState.rotationOrbit?.toFixed(1)}°</div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

