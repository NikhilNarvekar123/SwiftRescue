// import logo from './logo.svg';
import '../App.css';
import DashboardHeader from './components/DashboardHeader';
import Map from '../Map';

const center = { lat: 29.7174, lng: -95.4018 }
const markers = [
  { lat: 29.7174, lng: -95.3918 },
  { lat: 29.7074, lng: -95.4018 },
  { lat: 29.7274, lng: -95.4015 },
];

function MapResponder() {

  return (
    <div className="MapResponder">
      <DashboardHeader/>
      <Map center={center}
        markers={markers}
      />
    </div>
  );
}

export default MapResponder;
