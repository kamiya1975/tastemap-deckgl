import React, { useEffect, useState } from "react";
import DeckGL from "@deck.gl/react";
import { OrthographicView } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";

const INITIAL_VIEW_STATE = {
  target: [0, 0, 0],
  zoom: 0,
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
    White: [0, 120, 255],   // 青
    Red: [255, 0, 0],       // 赤
    Rose: [255, 102, 204],  // ピンク
    Sparkling: [255, 255, 0], // 黄色
    Other: [150, 150, 150], // 灰色
  };

  const layers = [
    new ScatterplotLayer({
      id: "scatter",
      data,
      getPosition: (d) => [d.UMAP1, d.UMAP2],
      getFillColor: (d) => typeColorMap[d.Type] || typeColorMap.Other,
      getRadius: 5,   // 小さくする（例：5）
      pickable: true,
      radiusMinPixels: 2,
      radiusMaxPixels: 10,
    }),
  ];

  return (
    <DeckGL
      views={new OrthographicView()}
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
    />
  );
}

export default App;
