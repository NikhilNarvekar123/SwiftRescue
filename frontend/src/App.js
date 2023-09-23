// import logo from './logo.svg';
import './App.css';
import Header from './Header';
import Map from './Map';

const center = { lat: 29.7174, lng: -95.4018 }
const markers = [
  { lat: 29.7174, lng: -95.4018 },
  { lat: 29.8174, lng: -95.4118 },
  { lat: 29.9174, lng: -95.4218 },
];

function App() {

  return (
    <div className="App">
      <Header/>
      <Map center={center}
        markers={markers}
      />
    </div>
  );
}

export default App;
