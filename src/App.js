import React, { useEffect, useState } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";

// 初期表示設定（Zoomなどは好みで）
const INITIAL_VIEW_STATE = {
  target: [0, 0, 0],   // 中心座標
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
      getPosition: d => [d.lng, d.lat],
      getFillColor: [255, 140, 0],
      getRadius: 500000,
      pickable: true,
      radiusMinPixels: 2,
      radiusMaxPixels: 20,
    }),
  ];

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={false}   // ここ重要：地図操作を無効化
      layers={layers}
    />
  );
}

export default App;
