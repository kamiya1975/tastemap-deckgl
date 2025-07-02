import React, { useEffect, useState } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { COORDINATE_SYSTEM } from "@deck.gl/core";

// 初期ビュー設定
const INITIAL_VIEW_STATE = {
  target: [0, 0, 0],
  zoom: 0,
  pitch: 0,
  bearing: 0,
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
      id: "scatter",
      data,
      getPosition: d => [d.x, d.y, 0],   // ←ここ
      coordinateSystem: COORDINATE_SYSTEM.IDENTITY, // ←ここ
      getFillColor: [255, 140, 0],
      getRadius: 0.1,
      pickable: true,
      radiusMinPixels: 2,
      radiusMaxPixels: 10,
    }),
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
