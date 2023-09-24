// import logo from './logo.svg';
import '../App.css';
import DashboardHeader from './components/DashboardHeader';
import MapRoute from './components/MapRoute';
import Map from '../Map';
import { db } from "../firebase";
import { onValue, ref } from "firebase/database";
import { useState, useEffect } from 'react';
import Toggle from 'react-toggle'

const center = { lat: 29.7174, lng: -95.4018 }
// const markers = [
//   { lat: 29.7174, lng: -95.3918 },
//   { lat: 29.7074, lng: -95.4018 },
//   { lat: 29.7274, lng: -95.4015 },
// ];

function MapResponder() {

    const [users, setUsers] = useState([]);
    const [userMarkers, setUserMarkers] = useState([]);
    const [floodsLoaded, setFloodsLoaded] = useState(false);
    const [userMap, setUserMap] = useState(true)

    const customRoute = [
        // { lat: 29.7174, lng: -95.3918 },
//   { lat: 29.7074, lng: -95.4018 },
//   { lat: 29.7274, lng: -95.4015 },
        { location: { lat: 29.7174, lng: -95.3918 }, stopover: true }, // Start point
        { location: { lat: 29.7074, lng: -95.4018 }, stopover: true }, // Waypoint 1
        { location: { lat: 29.7274, lng: -95.4015 }, stopover: true }, // Waypoint 2
      ];

    useEffect(() => {
        const query = ref(db, "users");
        return onValue(query, (snapshot) => {
          const data = snapshot.val();
          // var mock = []
          if (snapshot.exists()) {
            Object.values(data).map((user) => {
              setUsers((users) => [...users, user]);
              // mock.push(user)
            });
            // findNearbyUsers(center))
            setFloodsLoaded(true)
          }
        });
      
      }, []);

      const calculateDistance = (lat_1, long_1, lat_2, long_2) => {
      
        const toRadian = n => (n * Math.PI) / 180
        
            let lat2 = lat_2
            let lon2 = long_2
            let lat1 = lat_1
            let lon1 = long_1
        
            let R = 6371  // km
            let x1 = lat2 - lat1
            let dLat = toRadian(x1)
            let x2 = lon2 - lon1
            let dLon = toRadian(x2)
            let a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            let d = R * c
          //   console.log("distance==?",d)
            return d 
        }

      const findNearbyUsers = () => {
        // setFloodsLoaded(false)
        setUserMarkers([])
        var param = center
        // console.log("coords", param)
        var markers = []
        for (var i = 0; i < 50; i += 1) { // users.length but shortened
            var user = users[i]
            var dist = calculateDistance(param.lat, param.lng, user.location.lat, user.location.long)
            // console.log(user.)
            // console.log("lats", param.lat, param.lng, user.lat, user.lon)
            if (dist < 20) { // 200 km
                        // console.log("add marker")
                        markers.push({lat: user.location.lat, lng: user.location.long, notes: user.notes})
                        // console.log(markers)
                        // setFloodMarkers((prevMarkers) => [...prevMarkers, { lat: flood.lat, lng: flood.lon }]);
            }
            setUserMarkers(markers)
            console.log("usr mark", userMarkers)
        }
      }

  return (
    <div className="App">
      <DashboardHeader/>
      <div>
          <button type="submit" onClick={findNearbyUsers}>
            Find users
          </button>
          </div>
      {!floodsLoaded ? 
    <h1>Finding Users</h1> :
    <div>
        {/* <Map 
        center={center}
        markers={userMarkers}
      /> */}
    {/* {userMap ? <Map 
        center={center}
        markers={userMarkers}
      /> : 
      <MapRoute
        center={center}
        markers={userMarkers}
        route={customRoute}
      />}
      <Toggle
      defaultChecked={userMap}
      onChange={setUserMap(false)}
      /> */}
       <Map 
        center={center}
        markers={userMarkers}
      />
      <MapRoute
        center={center}
        markers={userMarkers}
        route={customRoute}
      />
      </div>
    }
    </div>
  );
}

export default MapResponder;
