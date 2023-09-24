import { GoogleMap, Marker, useLoadScript, useJsApiLoader } from "@react-google-maps/api";
import "./App.css";
import React from 'react'
import { useEffect } from "react";

const containerStyle = {
    height: '700px',
    width: '700px',
    marginTop: '50px',
    marginRight: 'auto',
    marginLeft:'auto',
  };
  
function Map(props) {
      const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
      })
    
      const [map, setMap] = React.useState(null)
      const onLoad = React.useCallback(function callback(map) {
        const infowindow = new window.google.maps.InfoWindow({
            // content: "Hi",
            ariaLabel: "Uluru",
          });

        const bounds = new window.google.maps.LatLngBounds(props.center);

        map.fitBounds(bounds);
        // map.setZoom(10)
          console.log("props center", props.center)
          console.log("props", props)
        for (var i = 0; i < props.markers.length; i++) {
            console.log(props.markers[i].lat)
            var prop = props.markers[i]
            var lat = prop.lat
            var lng = prop.lng
            var latLng = {lat: lat, lng: lng}
            // Creating a marker and putting it on the map
            console.log("latling")
            var marker = new window.google.maps.Marker({
                position: latLng,
                map: map,
                title: prop.notes
            });
            window.google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
                return function() {
                    infowindow.setContent(content);
                    infowindow.open(map,marker);
                };
            })(marker, prop.notes,infowindow));  
            // marker.addListener("click", () => {
            //     infowindow.setContent("Hi");
            //     infowindow.open({
            //       anchor: marker,
            //       map,
            //     });
            //   });

              bounds.extend(latLng)

        }
    
        setMap(map)
      }, [])
    
      const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
      }, [])

      useEffect(() => {
        if (map) {
          const bounds = new window.google.maps.LatLngBounds(props.center);
          props.markers.map(marker => {
            bounds.extend({
              lat: marker.lat,
              lng: marker.lng,
            });
          });
          map.fitBounds(bounds);
          map.setZoom(10)
        }
      }, [map, props.markers]);

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
        {props.markers.map(({ lat, lng }) => (
            <Marker position={{ lat, lng }} />
          ))}
        <></>
      </GoogleMap>
      )}
    </div>
  );
}

export default Map;
