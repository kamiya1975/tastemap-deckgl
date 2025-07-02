import React, { useEffect, useState } from "react";
import DeckGL from "@deck.gl/react";
import { Map } from "react-map-gl";   // ← StaticMap ではなく Map
import { ScatterplotLayer } from "@deck.gl/layers";

const MAPBOX_TOKEN = "";

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 0,
  zoom: 1.5,
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
    })
  ];

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
    >
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v9"
      />
    </DeckGL>
  );
}

export default App;
