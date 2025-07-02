import React, { useEffect, useState } from "react";
import DeckGL from "@deck.gl/react";
import { OrbitView } from "@deck.gl/core";
import { ScatterplotLayer, GridCellLayer } from "@deck.gl/layers";

const INITIAL_VIEW_STATE = {
  target: [0, 0, 0],
  rotationX: 45,
  rotationOrbit: 30,
  zoom: 0,
  minZoom: 0,
  maxZoom: 100,
};

function App() {
  const [data, setData] = useState([]);

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

  const scatterLayer = new ScatterplotLayer({
    id: "scatter",
    data,
    getPosition: d => [d.umap_x, d.umap_y, 0],
    getFillColor: d => typeColorMap[d.Type] || typeColorMap.Other,
    getRadius: 0.1,
    pickable: true,
  });

  const gridCellLayer = new GridCellLayer({
    id: "gridcell",
    data,
    getPosition: d => [d.umap_x, d.umap_y],
    cellSize: 1.0,
    elevationScale: 50,
    getElevation: d => d.甘味 ?? 0,
    getFillColor: d => [255, 140, 0, 150],
    pickable: true,
  });

  return (
    <DeckGL
      views={new OrbitView()}
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={[gridCellLayer, scatterLayer]}
    />
  );
}

export default App;
