import React from "react";
import DataChart from "./components/DataChart";
import "./App.css";
import useMap from "./hooks/useMap";

const App = () => {
  const { mapRef, diagramData } = useMap();

  return (
    <div className="flex-container">
      <div className="map-container" ref={mapRef} />
      <DataChart diagramData={diagramData} />
    </div>
  );
};

export default App;
