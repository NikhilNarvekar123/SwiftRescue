import Header from "../Header";
import { db } from "../firebase";
import { onValue, ref } from "firebase/database";
import { useState, useEffect } from 'react';
import Map from '../Map';



function MapPage() {

    const [center, setCenter] = useState({ lat: 29.7174, lng: -95.4018 })
    const [users, setUsers] = useState([]);
    const [userMarkers, setUserMarkers] = useState([]);
    const [floodsLoaded, setFloodsLoaded] = useState(false);

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
        // findNearbyUsers(center)
        setFloodsLoaded(true)
      }
      // setUsers(mock)
      // findNearbyUsers(center)
      // console.log(users)
    });
  
  }, []);

  // useEffect(() => {
  //   findNearbyUsers(center)
  // }, [userMarkers])

  // const handleChange = (e) => {
  //   e.preventDefault();
  //   setSearchInput(e.target.value);
  // };

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
    for (var i = 0; i < 5000; i += 100) { // users.length but shortened
        var user = users[i]
        var dist = calculateDistance(param.lat, param.lng, user.location.lat, user.location.long)
        // console.log(user.)
        // console.log("lats", param.lat, param.lng, user.lat, user.lon)
        if (dist < 20) { // 200 km
                    // console.log("add marker")
                    markers.push({lat: user.location.lat, lng: user.location.long})
                    // console.log(markers)
                    // setFloodMarkers((prevMarkers) => [...prevMarkers, { lat: flood.lat, lng: flood.lon }]);
        }
        setUserMarkers(markers)
        // console.log("usr mark", userMarkers)
    }
  }

  // const geoCode = async () => {
  //   if (searchInput) {
  //       try {
  //           // console.log(searchInput)
  //           // const data = await (await fetch(`https://geocode.maps.co/search?q=` + searchInput)).json()
  //           // const latLng = {lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon)}
  //           // console.log(searchInput, latLng)
  //           findNearbyUsers(center)
  //           // setCenter(latLng)
  //           // setFloodMarkers(someMarkers)
  //       } catch (err) {
  //           console.log(err.message)
  //       }
  //   }
  //   setSearchInput("")
  //   setFloodsLoaded(true)
  // };

  console.log("center", center)
  console.log("markers", userMarkers)
  return (
    <div className="App">
        <Header/>

        {/* <input
   type="search"
   placeholder="Search here"
   onChange={handleChange} 
   value={searchInput}/>

   <button type="submit" onClick={geoCode}>
            Submit
          </button> */}
          <button type="submit" onClick={findNearbyUsers}>
            Find users
          </button>
    {!floodsLoaded ? 
    <h1>Finding Users</h1> :
    <Map center={center}
        markers={userMarkers}
      />
    }

    </div>
  );
}

export default MapPage;
