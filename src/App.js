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

  const drawerContentRef = useRef(null);

  useEffect(() => {
    fetch("umap_data.json")
      .then((res) => res.json())
      .then((d) => {
        console.log("データ読み込み完了:", d.length, "件");
        setData(
          d.map((item) => ({
            ...item,
            Name: item["商品名"],
          }))
        );
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
    setIsDrawerOpen(nearestPoints.length > 0);
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

  const gridInterval = 0.2;
  const cellSize = 0.2;

  const gridLines = useMemo(() => {
    const startX = -100;
    const endX = +100;
    const startY = -100;
    const endY = +100;
    const spacing = gridInterval;

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
  }, [gridInterval]);

  const cells = useMemo(() => {
    const map = new Map();
    data.forEach((d) => {
      const x = Math.floor(d.umap_x / cellSize) * cellSize;
      const y = Math.floor(d.umap_y / cellSize) * cellSize;
      const key = `${x},${y}`;
      if (!map.has(key)) {
        map.set(key, { position: [x, y], count: 0, hasRating: false });
      }
      const jan = d.JAN;
      if (userRatings[jan]) {
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
        getPosition: (d) => [d.umap_x, d.umap_y],
        getElevation: (d) => {
          if (!zMetric) return 0;
          const val = Number(d[zMetric]);
          return isNaN(val) ? 0 : val;
        },
        getFillColor: (d) => typeColorMap[d.Type] || typeColorMap.Other,
        pickable: true,
        onClick: (info) => {
          if (info && info.object) {
            const { umap_x, umap_y } = info.object;
            setViewState((prev) => ({
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
        getPosition: (d) => [d.umap_x, d.umap_y, 0],
        getFillColor: (d) => typeColorMap[d.Type] || typeColorMap.Other,
        getRadius: 0.05,
        sizeUnits: "common",
        pickable: true,
        onClick: (info) => {
          if (info && info.object) {
            const { umap_x, umap_y } = info.object;
            setViewState((prev) => ({
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
    getPosition: (d) => d.position,
    getFillColor: (d) =>
      d.hasRating ? [180, 100, 50, 150] : [200, 200, 200, 80],
    getElevation: 0,
    pickable: false,
  });

  const ratingLayer = new ScatterplotLayer({
    id: "rating-bubbles",
    data: data.filter((d) => userRatings[d.JAN]),
    getPosition: (d) => [d.umap_x, d.umap_y, 0],
    getFillColor: [255, 165, 0, 180],
    getRadius: (d) => userRatings[d.JAN] * 0.1,
    sizeUnits: "common",
    pickable: false,
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
            d.umap_x,
            d.umap_y,
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
          // 🎯ここが重要: 空白もクリックできる
          onClick={(info) => {
            if (is3D) return;
            if (info && info.coordinate) {
              const [x, y] = info.coordinate;
              setUserPinCoords([x, y]);

              const nearest = data
                .map((d) => ({
                  ...d,
                  distance: Math.hypot(d.umap_x - x, d.umap_y - y),
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
          ]}
        />
      )}

      {/* 3D切り替えボタンやDrawerはそのまま */}
    </div>
  );
}

export default App;
