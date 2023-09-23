import { GoogleMap, Marker, useLoadScript, useJsApiLoader } from "@react-google-maps/api";
import "./App.css";
import React from 'react'

const containerStyle = {
    height: '600px',
    width: '600px',
    marginRight: 'auto',
    marginLeft:'auto',
  };
  
function Map(props) {
    // const { isLoaded } = useLoadScript({
    //     googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    //   });
    console.log(props)
      const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
      })
    
      const [map, setMap] = React.useState(null)
      const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(props.center);
        map.fitBounds(bounds);
        for (var i = 0; i < props.markers.length; i++) {
            var latLng = props.markers[i]
            bounds.extend(latLng)
            // Creating a marker and putting it on the map
            var marker = new window.google.maps.Marker({
                position: latLng,
                map: map,
            });

        }
    
        setMap(map)
      }, [])
    
      const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
      }, [])

  return (
    <div className="Map">
            {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
        mapContainerStyle={containerStyle}
        center={props.center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* {markers.map(({ lat, lng }) => (
            <Marker position={{ lat, lng }} />
          ))} */}
        <></>
      </GoogleMap>
      )}
    </div>
  );
}

export default Map;
