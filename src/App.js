import React, { useEffect, useState, useMemo, useRef } from "react";
import DeckGL from "@deck.gl/react";
import { OrbitView, OrthographicView } from "@deck.gl/core";
import { ScatterplotLayer, ColumnLayer, LineLayer, TextLayer } from "@deck.gl/layers";
import Drawer from "@mui/material/Drawer";

function App() {
  const [data, setData] = useState([]);
  const [is3D, setIs3D] = useState(false); // デフォルト2D
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

  // グリッド線
  const gridLines = useMemo(() => {
    const startX = -100;
    const endX = +100;
    const startY = -100;
    const endY = +100;
    const spacing = 1;

    const lines = [];

    for (let x = startX; x <= endX; x += spacing) {
      const isHighlight = nearestPoints.some(
        p => Math.abs(p.umap_x - x) < spacing / 2
      );
      lines.push({
        sourcePosition: [x, startY, 0],
        targetPosition: [x, endY, 0],
        isHighlight
      });
    }

    for (let y = startY; y <= endY; y += spacing) {
      const isHighlight = nearestPoints.some(
        p => Math.abs(p.umap_y - y) < spacing / 2
      );
      lines.push({
        sourcePosition: [startX, y, 0],
        targetPosition: [endX, y, 0],
        isHighlight
      });
    }
    return lines;
  }, [nearestPoints]);

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
        getElevation: d => {
          if (!zMetric) return 0;
          return Number(d[zMetric]) || 0;
        },
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
            new LineLayer({
              id: "grid-lines",
              data: gridLines,
              getSourcePosition: d => d.sourcePosition,
              getTargetPosition: d => d.targetPosition,
              getColor: d =>
                d.isHighlight
                  ? [120, 120, 120, 200]
                  : [200, 200, 200, 100],
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

      <Drawer
        anchor="bottom"
        open={isDrawerOpen}
        variant="persistent"
        hideBackdrop
        PaperProps={{
          style: { height: "50%" }
        }}
      >
        <div
          ref={drawerContentRef}
          style={{
            padding: "16px",
            overflowY: "auto",
            height: "100%",
          }}
        >
          <button
            onClick={() => setIsDrawerOpen(false)}
            style={{
              display: "block",
              marginBottom: "8px",
              background: "#eee",
              border: "none",
              padding: "8px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            閉じる
          </button>
          <h3>最近傍ワインリスト</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {nearestPoints.map((item, idx) => (
              <li
                key={idx}
                onClick={() => {
                  setViewState(prev => ({
                    ...(prev || {}),
                    target: [item.umap_x, item.umap_y, 0],
                  }));
                }}
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                }}
              >
                <strong>{idx + 1}.</strong> {item.Name || "（名称不明）"}
                <br />
                <small>
                  Type: {item.Type || "不明"} / 距離: {item.distance.toFixed(2)}
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
