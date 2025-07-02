import React, { useEffect, useState } from "react";
import DeckGL, { OrthographicView } from "@deck.gl/react";
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

  const layers = [
    new ScatterplotLayer({
      id: "scatter",
      data,
      getPosition: d => [d.x, d.y],  // d.lng, d.lat ではなく x, y にする
      getFillColor: [255, 140, 0],
      getRadius: 10,
      pickable: true,
      radiusMinPixels: 2,
      radiusMaxPixels: 20,
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
