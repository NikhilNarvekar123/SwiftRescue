// import logo from './logo.svg';
import './App.css';
import Header from './Header';
import Map from './Map';

const center = { lat: 48.8584, lng: 2.2945 }

function App() {
  return (
    <div className="App">
      <Header/>
      <Map currentCenter={center}
        locations={[]}
      />
    </div>
  );
}

export default App;
