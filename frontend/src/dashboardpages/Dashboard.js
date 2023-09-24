import DashboardHeader from './components/DashboardHeader';
import { db } from "../firebase";
import { onValue, ref } from "firebase/database";
import { useMemo, useState, useEffect } from 'react';
import Map from '../Map';



function Dashboard() {

    const [center, setCenter] = useState({ lat: 29.7174, lng: -95.4018 })
    const [floods, setFloods] = useState([]);
    const [floodMarkers, setFloodMarkers] = useState([]);
    const [floodsLoaded, setFloodsLoaded] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const [someMarkers, setSomeMarkers] = useState([]);

  useEffect(() => {
    const query = ref(db, "dashboard_floods");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists()) {
        Object.values(data).map((flood) => {
          setFloods((floods) => [...floods, flood]);
        //   setFloodMarkers((floodMarkers) => [...floodMarkers, {lat: flood.lat, lng: flood.lon}]);
        });
        // setFloodsLoaded(true)
      }
    });
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

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

  const findNearbyFloods = (param) => {
    setFloodsLoaded(false)
    setFloodMarkers([])
    console.log("coords", param)
    var markers = []
    for (var i = 0; i < floods.length; i++) {
        var flood = floods[i]
        var dist = calculateDistance(param.lat, param.lng, flood.lat, flood.lon)
        if (dist < 500) {
                    console.log("add marker")
                    markers.push({lat: flood.lat, lng: flood.lon})
                    // setFloodMarkers((prevMarkers) => [...prevMarkers, { lat: flood.lat, lng: flood.lon }]);
        }
        setFloodMarkers(markers)
    }
    // const query = ref(db, "dashboard_floods");
    // return onValue(query, (snapshot) => {
    //   const data = snapshot.val();
    //     var markers = []
    //   if (snapshot.exists()) {
    //     Object.values(data).map((flood) => {
    //         var dist = calculateDistance(param.lat, param.lng, flood.lat, flood.lon)
    //       if (dist < 500) {
    //         console.log("add marker")
    //         markers.push({lat: flood.lat, lng: flood.lon})
    //         // setFloodMarkers((floodMarkers) => [...floodMarkers, {lat: flood.lat, lng: flood.lon}]);
    //       }
    //     //   setFloodMarkers((floodMarkers) => [...floodMarkers, {lat: flood.lat, lng: flood.lon}]);
    //     });
    //     // setFloodsLoaded(true)
    //   }
    // //   setSomeMarkers(markers)
    // setFloodMarkers(markers)
    // });
  }

//   useEffect(() => {

// const mapz = useMemo(() =>
//  {
//    return (<Map center={center}
//         markers={floodMarkers}
//       />)

// })

// const mapz = useMemo(() => {
//     return (<Map center={center}
//         markers={floodMarkers}
//       />)
// }, [floodMarkers])

  const geoCode = async () => {
    if (searchInput) {
        try {
            console.log(searchInput)
            const data = await (await fetch(`https://geocode.maps.co/search?q=` + searchInput)).json()
            const latLng = {lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon)}
            console.log(searchInput, latLng)
            findNearbyFloods(latLng)
            setCenter(latLng)
            // setFloodMarkers(someMarkers)
        } catch (err) {
            console.log(err.message)
        }
    }
    setSearchInput("")
    setFloodsLoaded(true)
  };

  console.log("center", center)
  console.log("markers", floodMarkers)
  return (
    <div className="App">
        <DashboardHeader/>

        <input
   type="search"
   placeholder="Search here"
   onChange={handleChange} 
   value={searchInput}/>

   <button type="submit" onClick={geoCode}>
            Submit
          </button>
          {/* <div>{console.log({mapz})}</div> */}
    {!floodsLoaded ? 
    <h1>Finding Floods</h1> :
    <Map center={center}
        markers={floodMarkers}
      />
    // {mapz}
    }

    </div>
  );
}

export default Dashboard;
