import React, {useRef,useEffect} from "react";
import { loadGoogleMaps } from '../../util/loadGoogleMaps';

import './Map.css';

const Map = props =>{
    const mapRef = useRef();

    const { center,zoom} = props;

useEffect(() => {
  loadGoogleMaps(process.env.REACT_APP_GOOGLE_API_KEY, 'DEMO_MAP_ID')
    .then(() => {
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapId: 'DEMO_MAP_ID'
      });

      if (window.google?.maps?.marker?.AdvancedMarkerElement) {
        new window.google.maps.marker.AdvancedMarkerElement({
          position: center,
          map
        });
      } else {
        console.error("AdvancedMarkerElement is not available.");
      }
    })
    .catch(err => {
      console.error("Failed to load Google Maps script:", err);
    });
}, [center, zoom]);



    return <div ref = {mapRef} className={`map ${props.className}`} style = {props.style}></div>;
};

export default Map; 