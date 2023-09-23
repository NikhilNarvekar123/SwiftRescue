// import logo from './logo.svg';
// import Header from './Header';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
} from "react-google-maps";

const MapComponent = withScriptjs(
    withGoogleMap((props) => (
        <GoogleMap defaultZoom={3} center={props.center}>
            {props.markers.map((value, index) => {
                return <h1>{value.lat}</h1>
            })}
            {props.markers.map((value, index) => {
                return <Marker key={index} position={{ lat: parseFloat(value.lat), lng: parseFloat(value.lng) }}
                    icon="https://www.robotwoods.com/dev/misc/bluecircle.png" />
            })}
        </GoogleMap>
    ))
);


function Map(props) {
  return (
    <div className="Map">
      {/* <Header/> */}
      <MapComponent
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBLidBefVNHdhbWqWNPeQtFOB2N5tRxj7s=initMap.exp"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `100vh` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                center={props.currentCenter}
                markers={props.locations}
            />
    </div>
  );
}

export default Map;
