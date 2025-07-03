import React, { useEffect, useState, useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { OrbitView, OrthographicView } from "@deck.gl/core";
import { ScatterplotLayer, LineLayer, IconLayer } from "@deck.gl/layers";

function App() {
  const [data, setData] = useState([]);
  const [is3D, setIs3D] = useState(true);
  const [viewState, setViewState] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    fetch("umap_data.json")
      .then((res) => res.json())
      .then((d) => {
        console.log("データ読み込み完了:", d.length, "件");
        setData(d);

        const janTarget = d.find(item => item.JAN === "850755000028");
        if (janTarget) {
          setViewState({
            target: [janTarget.umap_x, janTarget.umap_y, 0],
            rotationX: 14,
            rotationOrbit: 85,
            zoom: 8,
            minZoom: 0,
            maxZoom: 100,
          });
        } else {
          setViewState({
            target: [0, 0, 0],
            rotationX: 30,
            rotationOrbit: 30,
            zoom: 3,
            minZoom: 0,
            maxZoom: 100,
          });
        }
      });
  }, []);

  const typeColorMap = {
    White: [0, 120, 255],
    Red: [255, 0, 0],
    Rose: [255, 102, 204],
    Sparkling: [255, 255, 0],
    Other: [150, 150, 150],
  };

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

  // 2D表示の「×」マーカー
  const crossLayer2D = new ScatterplotLayer({
    id: "cross-2d",
    data: data.filter(d => d.JAN === "850755000028"),
    getPosition: d => [d.umap_x, d.umap_y, 0],
    getFillColor: [0, 255, 0],
    getRadius: 0.2,
    getLineWidth: 4,
    stroked: true,
    getLineColor: [0, 255, 0],
    radiusScale: 1,
    radiusMinPixels: 10,
    radiusMaxPixels: 20,
    pickable: false,
  });

  // 3D表示のピン
  const iconLayer3D = new IconLayer({
    id: "icon-3d",
    data: data.filter(d => d.JAN === "850755000028"),
    getPosition: d => [d.umap_x, d.umap_y, 0],
    getIcon: d => "marker",
    iconAtlas:
      "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg",
    iconMapping: {
      marker: { x: 0, y: 0, width: 512, height: 512, mask: false },
    },
    sizeScale: 15,
    getSize: d => 5,
    getColor: [255, 0, 0],
    pickable: false,
  });

  const layers = [gridLineLayer, scatterLayer];
  if (is3D) {
    layers.push(iconLayer3D);
  } else {
    layers.push(crossLayer2D);
  }

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {viewState && (
        <DeckGL
          views={is3D ? new OrbitView() : new OrthographicView()}
          viewState={viewState}
          onViewStateChange={({ viewState: vs }) => {
            if (!initialized) {
              setInitialized(true);
            }
            setViewState(vs);
          }}
          controller={true}
          layers={layers}
        />
      )}

      <button
        onClick={() => {
          const nextIs3D = !is3D;
          setIs3D(nextIs3D);
          setViewState({
            target: viewState.target,
            rotationX: nextIs3D ? 30 : 0,
            rotationOrbit: nextIs3D ? 30 : 0,
            zoom: viewState.zoom,
            minZoom: 0,
            maxZoom: 100,
          });
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

      {viewState && (
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
          <div>
            Center:
            [{viewState.target[0].toFixed(2)}, {viewState.target[1].toFixed(2)}]
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
