import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import fetchBarData from "../api/fetchBarData";
import { generateRandomFeature } from "../api/generateRandomFeature";
import Popup from '../components/Popup';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const useMap = () => {
  const mapRef = useRef(null);
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 10 }));
  const [diagramData, setDiagramData] = useState({});
  const markersRef = useRef([]); // Keep track of markers

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [30, 50],
      zoom: 3.3,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", async () => {
      try {
        // Initial marker addition
        await addRandomMarkers(map);
        setDiagramData(fetchBarData);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    });

    const addRandomMarkers = async (mapInstance) => {
      // Remove old markers
      if (markersRef.current.length > 0) {
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
      }

      const { lng, lat } = mapInstance.getCenter();
      const results = await generateRandomFeature({ longitude: lng, latitude: lat });

      results.features.forEach((marker) => {
        const el = createMarkerElement(marker);
        const mapMarker = new mapboxgl.Marker(el)
          .setLngLat(marker.geometry.coordinates)
          .setPopup(createPopup(marker))
          .addTo(mapInstance);

        // Store marker in ref
        markersRef.current.push(mapMarker);
      });
    };

    const createMarkerElement = (marker) => {
      const el = document.createElement("div");
      el.className = "marker";
      return el;
    };

    const createPopup = (marker) => {
      const popup = new mapboxgl.Popup({ offset: 10 });

      const popupContainer = document.createElement("div");

      const title = document.createElement("h3");
      const titleLink = document.createElement("a");
      titleLink.href = "#";
      titleLink.textContent = marker.properties.title;
      title.appendChild(titleLink);

      const description = document.createElement("p");
      description.textContent = marker.properties.description;

      const learnMoreButton = document.createElement("button");
      learnMoreButton.textContent = "Learn More";
      learnMoreButton.addEventListener("click", () => {
        alert(`Clicked on "${marker.properties.title}"`);
      });

      popupContainer.appendChild(title);
      popupContainer.appendChild(description);
      popupContainer.appendChild(learnMoreButton);

      popup.setDOMContent(popupContainer);

      popupContainer.classList.add("custom-popup");
      title.classList.add("popup-title");
      description.classList.add("popup-description");

      return popup;
    };

    const setMapCursor = (cursor) => {
      map.getCanvas().style.cursor = cursor;
    };

    map.on("mouseenter", "random-points-data", (e) => {
      if (e.features.length) {
        setMapCursor("pointer");
      }
    });

    map.on("mouseleave", "random-points-data", () => {
      setMapCursor("");
    });

    map.on("click", "random-points-data", (e) => {
      if (e.features.length) {
        const feature = e.features[0];

        const popupNode = document.createElement("div");
        ReactDOM.render(<Popup feature={feature} />, popupNode);

        popUpRef.current
          .setLngLat(feature.geometry.coordinates)
          .setDOMContent(popupNode)
          .addTo(map);
      }
    });

    // Add button to regenerate markers
    const regenerateButton = document.createElement("button");
    regenerateButton.textContent = "Regenerate Markers";
    regenerateButton.style.position = "absolute";
    regenerateButton.style.top = "10px";
    regenerateButton.style.left = "10px";
    regenerateButton.style.zIndex = 1;
    regenerateButton.addEventListener("click", () => addRandomMarkers(map));

    map.getContainer().appendChild(regenerateButton);

    return () => map.remove();
  }, []);

  return {
    mapRef,
    diagramData
  };
};

export default useMap;
