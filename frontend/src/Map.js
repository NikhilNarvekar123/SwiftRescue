// import logo from './logo.svg';
// import Header from './Header';
// import {
//     // withScriptjs,
//     withGoogleMap,
//     GoogleMap,
//     Marker,
// } from "react-google-maps";
import { useMemo } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import "./App.css";

// const MapComponent = withScriptjs(
//     withGoogleMap((props) => 
//     (
//         <GoogleMap defaultZoom={3} center={props.center}>
//             {props.markers.map((value, index) => {
//                 return <h1>{value.lat}</h1>
//             })}
//             {props.markers.map((value, index) => {
//                 return <Marker key={index} position={{ lat: parseFloat(value.lat), lng: parseFloat(value.lng) }}
//                     icon="https://www.robotwoods.com/dev/misc/bluecircle.png" />
//             })}
//         </GoogleMap>
//     )
//     );
// );

// AIzaSyBLidBefVNHdhbWqWNPeQtFOB2N5tRxj7s

function Map(props) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
      });
    //   const center = useMemo(() => ({ lat: 18.52043, lng: 73.856743 }), []);
  return (
    <div className="Map">
            {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          center={props.center}
          zoom={10}
        />
      )}
    </div>
  );
}

export default Map;
