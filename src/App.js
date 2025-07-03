import React, { useEffect, useState, useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { OrbitView, OrthographicView } from "@deck.gl/core";
import { ScatterplotLayer, ColumnLayer, LineLayer } from "@deck.gl/layers";

function App() {
  const [data, setData] = useState([]);
  const [is3D, setIs3D] = useState(true);
  const [viewState, setViewState] = useState(null);
  const [pinCoords, setPinCoords] = useState(null);
  const [zMetric, setZMetric] = useState("甘味");

  useEffect(() => {
    fetch("umap_data.json")
      .then((res) => res.json())
      .then((d) => {
        console.log("データ読み込み完了:", d.length, "件");
        setData(d);
        const target = d.find(item => item.JAN === "850755000028");
        if (target) {
          setPinCoords([target.umap_x, target.umap_y]);
          setViewState({
            target: [target.umap_x, target.umap_y, 0],
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

  const mainLayer = is3D
    ? new ColumnLayer({
        id: "columns",
        data,
        diskResolution: 12,
        radius: 0.3,
        extruded: true,
        elevationScale: 2, // ← 高さの倍率(調整可)
        getPosition: d => [d.umap_x, d.umap_y],
        getElevation: d => Number(d[zMetric]) || 0,
        getFillColor: d => typeColorMap[d.Type] || typeColorMap.Other,
        pickable: true,
        onClick: info => {
          if (info && info.object) {
            const { umap_x, umap_y } = info.object;
            setViewState({
              ...viewState,
              target: [umap_x, umap_y, 0],
            });
            setPinCoords([umap_x, umap_y]);
          }
        },
      })
    : new ScatterplotLayer({
        id: "scatter",
        data,
        getPosition: d => [d.umap_x, d.umap_y, 0],
        getFillColor: d => typeColorMap[d.Type] || typeColorMap.Other,
        getRadius: 0.2,
        pickable: true,
        onClick: info => {
          if (info && info.object) {
            const { umap_x, umap_y } = info.object;
            setViewState({
              ...viewState,
              target: [umap_x, umap_y, 0],
            });
            setPinCoords([umap_x, umap_y]);
          }
        },
      });

  const pinLayer = pinCoords
    ? new ScatterplotLayer({
        id: "pin",
        data: [pinCoords],
        getPosition: d => [d[0], d[1], 0],
        getFillColor: [0, 255, 0],
        getRadius: 0.3,
        pickable: false,
      })
    : null;

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {viewState && (
        <DeckGL
          views={is3D ? new OrbitView() : new OrthographicView()}
          viewState={viewState}
          onViewStateChange={({ viewState: vs }) => setViewState(vs)}
          controller={true}
          layers={[
            new LineLayer({
              id: "grid-lines",
              data: gridLines,
              getSourcePosition: d => d.sourcePosition,
              getTargetPosition: d => d.targetPosition,
              getColor: [200, 200, 200, 120],
              getWidth: 1,
              pickable: false,
            }),
            mainLayer,
            pinLayer,
          ]}
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
          cursor: "pointer",
        }}
      >
        {is3D ? "2D表示" : "3D表示"}
      </button>

      {is3D && (
        <select
          value={zMetric}
          onChange={e => setZMetric(e.target.value)}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 1,
            padding: "6px",
            fontSize: "14px",
          }}
        >
          <option value="甘味">甘味</option>
          <option value="酸味">酸味</option>
          <option value="渋味">渋味</option>
          <option value="果実味">果実味</option>
          <option value="ボディ">ボディ</option>
        </select>
      )}

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
            Center: [{viewState.target[0].toFixed(2)}, {viewState.target[1].toFixed(2)}]
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
