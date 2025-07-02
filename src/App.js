import React, { useEffect, useState } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";

// UMAP座標系 (x,y) にあわせる
const INITIAL_VIEW_STATE = {
  target: [0, 0, 0],
  zoom: 2,
  minZoom: 0,
  maxZoom: 10,
  pitch: 0,
  bearing: 0
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

  const layers = [
    new ScatterplotLayer({
      id: "scatterplot-layer",
      data,
      getPosition: d => [d.x, d.y],
      getFillColor: [255, 140, 0],
      getRadius: 50,
      pickable: true,
      radiusMinPixels: 2,
      radiusMaxPixels: 10,
      coordinateSystem: 1 // COORDINATE_SYSTEM.IDENTITY
    })
  ];

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
    />
  );
}

export default App;
