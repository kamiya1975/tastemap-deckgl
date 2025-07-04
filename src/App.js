import React, { useEffect, useState, useMemo, useRef } from "react";
import DeckGL from "@deck.gl/react";
import { OrbitView, OrthographicView } from "@deck.gl/core";
import { ScatterplotLayer, ColumnLayer, LineLayer, TextLayer, GridCellLayer } from "@deck.gl/layers";
import Drawer from "@mui/material/Drawer";

function App() {
  const [data, setData] = useState([]);
  const [is3D, setIs3D] = useState(false);
  const [viewState, setViewState] = useState(null);
  const [userPinCoords, setUserPinCoords] = useState(null);
  const [nearestPoints, setNearestPoints] = useState([]);
  const [zMetric, setZMetric] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const drawerContentRef = useRef(null);

  useEffect(() => {
    fetch("umap_data.json")
      .then((res) => res.json())
      .then((d) => {
        console.log("データ読み込み完了:", d.length, "件");
        setData(d);
        setViewState({
          target: [0, 0, 0],
          rotationX: 0,
          rotationOrbit: 0,
          zoom: 5,
          minZoom: 4.0,
          maxZoom: 10.0,
        });
      });
  }, []);

  useEffect(() => {
    if (nearestPoints.length > 0) {
      setIsDrawerOpen(true);
    }
  }, [nearestPoints]);

  useEffect(() => {
    if (drawerContentRef.current) {
      drawerContentRef.current.scrollTop = 0;
    }
  }, [nearestPoints]);

  const typeColorMap = {
    White: [0, 120, 255],
    Red: [255, 0, 0],
    Rose: [255, 102, 204],
    Sparkling: [255, 255, 0],
    Other: [150, 150, 150],
  };

  // グリッド線の間隔
  const gridInterval = 0.2; // ←ここを0.2や1.0に変更すれば調整可能

  // グリッド線
  const gridLines = useMemo(() => {
    const startX = -100;
    const endX = +100;
    const startY = -100;
    const endY = +100;

    const lines = [];
    for (let x = startX; x <= endX; x += gridInterval) {
      lines.push({
        sourcePosition: [x, startY, 0],
        targetPosition: [x, endY, 0],
      });
    }
    for (let y = startY; y <= endY; y += gridInterval) {
      lines.push({
        sourcePosition: [startX, y, 0],
        targetPosition: [endX, y, 0],
      });
    }
    return lines;
  }, [gridInterval]);

  // グリッドセル（背景ブロック）
  const cellSize = gridInterval; // ここも合わせて統一
  const cells = useMemo(() => {
    const map = new Map();
    data.forEach(d => {
      const x = Math.floor(d.umap_x / cellSize) * cellSize;
      const y = Math.floor(d.umap_y / cellSize) * cellSize;
      const key = `${x},${y}`;
      if (!map.has(key)) {
        map.set(key, { position: [x, y], count: 0 });
      }
      map.get(key).count += 1;
    });
    return Array.from(map.values());
  }, [data, cellSize]);

  // ワイン打点
  const mainLayer = useMemo(() => {
    if (is3D) {
      return new ColumnLayer({
        id: `columns-${zMetric}`,
        data,
        diskResolution: 12,
        radius: 0.05,
        extruded: true,
        elevationScale: 2,
        getPosition: d => [d.umap_x, d.umap_y],
        getElevation: d => (zMetric ? Number(d[zMetric]) || 0 : 0),
        getFillColor: d => typeColorMap[d.Type] || typeColorMap.Other,
        pickable: true,
        onClick: info => {
          if (info && info.object) {
            const { umap_x, umap_y } = info.object;
            setViewState(prev => ({
              ...(prev || {}),
              target: [umap_x, umap_y, 0],
            }));
          }
        },
      });
    } else {
      return new ScatterplotLayer({
        id: "scatter",
        data,
        getPosition: d => [d.umap_x, d.umap_y, 0],
        getFillColor: d => typeColorMap[d.Type] || typeColorMap.Other,
        getRadius: 0.05,
        pickable: true,
        onClick: info => {
          if (info && info.object) {
            const { umap_x, umap_y } = info.object;
            setViewState(prev => ({
              ...(prev || {}),
              target: [umap_x, umap_y, 0],
            }));
          }
        },
      });
    }
  }, [data, is3D, zMetric]);

  const gridCellLayer = new GridCellLayer({
    id: "grid-cells",
    data: cells,
    cellSize: cellSize,
    getPosition: d => d.position,
    getFillColor: [200, 200, 200, 100],
    getElevation: 0,
    pickable: false,
  });

  const userPinLayer = userPinCoords
    ? new ScatterplotLayer({
        id: "user-pin",
        data: [userPinCoords],
        getPosition: d => [d[0], d[1], -0.01],
        getFillColor: [0, 255, 0, 200],
        getRadius: 0.3,
        pickable: false,
      })
    : null;

  const textLayer = nearestPoints.length
    ? new TextLayer({
        id: "nearest-labels",
        data: nearestPoints.map((d, i) => ({
          position: [d.umap_x, d.umap_y, is3D ? 0.05 : 0],
          text: String(i + 1),
        })),
        getPosition: d => d.position,
        getText: d => d.text,
        getSize: is3D ? 0.1 : 16,
        sizeUnits: is3D ? "meters" : "pixels",
        getColor: [0, 0, 0],
        getTextAnchor: "middle",
        getAlignmentBaseline: "center",
      })
    : null;

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {viewState && (
        <DeckGL
          views={is3D ? new OrbitView() : new OrthographicView()}
          viewState={viewState}
          onViewStateChange={({ viewState: vs }) => setViewState(vs)}
          controller={{
            minRotationX: 5,
            maxRotationX: 90,
            minZoom: 4.0,
            maxZoom: 10.0,
          }}
          onClick={info => {
            if (is3D) return;
            if (info && info.coordinate) {
              const [x, y] = info.coordinate;
              setUserPinCoords([x, y]);

              const nearest = data
                .map(d => ({
                  ...d,
                  distance: Math.sqrt(
                    Math.pow(d.umap_x - x, 2) + Math.pow(d.umap_y - y, 2)
                  ),
                }))
                .sort((a, b) => a.distance - b.distance)
                .slice(0, 10);
              setNearestPoints(nearest);
            }
          }}
          layers={[
            gridCellLayer,
            new LineLayer({
              id: "grid-lines",
              data: gridLines,
              getSourcePosition: d => d.sourcePosition,
              getTargetPosition: d => d.targetPosition,
              getColor: [200, 200, 200, 120],
              getWidth: 0.5,
              pickable: false,
            }),
            mainLayer,
            userPinLayer,
            textLayer,
          ]}
        />
      )}

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
          <option value="">ー</option>
          <option value="ブドウ糖">ブドウ糖</option>
          <option value="リンゴ酸">リンゴ酸</option>
          <option value="総ポリフェノール">総ポリフェノール</option>
          <option value="Vanillin">Vanillin</option>
          <option value="Furfural">Furfural</option>
        </select>
      )}

      <button
        onClick={() => {
          const nextIs3D = !is3D;
          setIs3D(nextIs3D);
          setViewState(prev => ({
            ...(prev || {}),
            target: prev?.target || [0, 0, 0],
            rotationX: nextIs3D ? 30 : 0,
            rotationOrbit: nextIs3D ? 30 : 0,
            zoom: prev?.zoom || 5,
            minZoom: 4.0,
            maxZoom: 10.0,
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
        {is3D ? "2D表示" : "3D表示"}
      </button>

      <Drawer anchor="bottom" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
  <div ref={drawerContentRef} style={{ width: "100%", padding: 16 }}>
    <h3>近いワイン</h3>
    {nearestPoints.map((d, i) => (
      <div key={i} style={{ marginBottom: 8 }}>
        {i + 1}. {d.Name || d.JAN}
      </div>
    ))}
  </div>
</Drawer>

    </div>
  );
}

export default App;
