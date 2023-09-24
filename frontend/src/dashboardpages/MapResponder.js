// import logo from './logo.svg';
import '../App.css';
import DashboardHeader from './components/DashboardHeader';
import MapRoute from './components/MapRoute';
import Map from '../Map';
import { db } from "../firebase";
import { onValue, ref } from "firebase/database";
import { useState, useEffect } from 'react';
import Toggle from 'react-toggle'
import axios from 'axios';


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
    const [clusters, setClusters] = useState([])
    const [route_waypoints, setWaypoints] = useState([])
    const [route, setRoute] = useState([])
    const [route_length, setLength] = useState(0)
    const [foundRoute, setFoundRoute] = useState(false)

//     const customRoute = [
//         // { lat: 29.7174, lng: -95.3918 },
// //   { lat: 29.7074, lng: -95.4018 },
// //   { lat: 29.7274, lng: -95.4015 },
//         { location: { lat: 29.7174, lng: -95.3918 }, stopover: true }, // Start point
//         { location: { lat: 29.7074, lng: -95.4018 }, stopover: true }, // Waypoint 1
//         { location: { lat: 29.7274, lng: -95.4015 }, stopover: true }, // Waypoint 2
//       ];

    const customRoute = [
        {
          location: { lat: 29.61833694775288, lng: -95.17666382886463 },
          stopover: true,
        },
        {
          location: { lat: 29.61833694775288, lng: -95.17666382886463 },
          stopover: true,
        },
        {
          location: { lat: 29.61833694775288, lng: -95.17666382886463 },
          stopover: true,
        },
        {
          location: { lat: 29.61833694775288, lng: -95.17666382886463 },
          stopover: true,
        },
        {
          location: { lat: 29.61833694775288, lng: -95.17666382886463 },
          stopover: true,
        },
        {
          location: { lat: 29.61833694775288, lng: -95.17666382886463 },
          stopover: true,
        },
        {
          location: { lat: 29.61833694775288, lng: -95.17666382886463 },
          stopover: true,
        },
        {
          location: { lat: 29.61833694775288, lng: -95.17666382886463 },
          stopover: true,
        },
      ]
      

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

      useEffect(() => {

        const FetchData = async () => {
          let coordinates = []
          for (const user of users) {
            coordinates.push([user['location']['lat'], user['location']['long']])
          }

          let data = [];
          axios.post('https://shreyj1729--swift-rescue-compute-clusters.modal.run', {
            "coordinates": coordinates,
            "k": 7
          })
          .then(function (response) {
            data = response;
            setClusters(data['data']['cluster_locations'])
          })
          .catch(function (error) {
            console.log(error);
          });

        }

        if (users.length != 0) {
          FetchData();
        }

      }, [users])  

      useEffect(() => {
        const FetchData = async () => {

          let data = [];
          axios.post('https://shreyj1729--swift-rescue-find-shortest-path.modal.run', {
            "cluster_coordinates": clusters,
            "start_coord": [clusters[0][0], clusters[0][1]]
          })
          .then(function (response) {
            data = response;
            console.log(data['data'])
            setWaypoints(data['data']['shortest_path'])
            setLength(data['data']['shortest_path_length'])
          })
          .catch(function (error) {
            console.log(error);
          });

        }

        if (users.length != 0 && clusters.length != 0) {
          FetchData();
        }
      }, [users, clusters])

      useEffect(() => {
        if (!foundRoute) {
            calcRoute();
            setFoundRoute(false)
        }
      }, [route_waypoints]);

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

      const calcRoute = () => {
        var mock = []
        if (route_waypoints.length > 0) {
            for (var i = 0; i < route_waypoints.length; i += 1) {
                // format
                // { location: { lat: 29.7174, lng: -95.3918 }, stopover: true }
                console.log("latlng", route_waypoints[i][0], route_waypoints[i][1])
                mock.push({location: { lat: route_waypoints[i][0], lng: route_waypoints[i][1]}, stopover: true})
                // setRoute((route) => [...route, {location: { lat: route_waypoints[i][0], lng: route_waypoints[i][1]}, stopover: true}])
            }
            setRoute(mock)
            console.log("pls", route)
        }

      }
      console.log("cluster", clusters)
      console.log("waypoint", route_waypoints)

  return (
    <div className="App">
      <DashboardHeader/>
      <div>
          <button type="submit" onClick={findNearbyUsers}>
            Find users
          </button>
          </div>

          <div>{console.log("route here", route)}</div>
          <div>{console.log("custom here", customRoute)}</div>
      {!floodsLoaded ? 
    <h1>Finding Users</h1> :
    <div>
        {/* <Map 
        center={center}
        markers={userMarkers}
      /> */}
    {userMap ? (
  <Map 
    center={center}
    markers={userMarkers}
  />
) : (
  <MapRoute
    center={center}
    markers={userMarkers}
    route={route}
  />
)}
<Toggle
  defaultChecked={userMap}
  onChange={() => setUserMap(!userMap)} // Use a function to set the state
/>
       {/* <Map 
        center={center}
        markers={userMarkers}
      />
      <MapRoute
        center={center}
        markers={userMarkers}
        route={customRoute}
      /> */}
      </div>
    }
    </div>
  );
}

export default MapResponder;
