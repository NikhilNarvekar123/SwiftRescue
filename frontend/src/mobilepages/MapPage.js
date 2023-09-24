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
    const [searchInput, setSearchInput] = useState("");
    // const [ids, setIds] = useState([])

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

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  const addNote = () => {
    // const updatedUserData = {
    //   notes: searchInput
    //   // Add other fields you want to update
    // };
    
    // // Update the user with ID "sd234" in the "users" database
    // const userId = "45888";
    // const userRef = ref(`users/${userId}`);

    // db.ref(`users/${userId}`).update(updatedUserData)
    //   .then(() => {
    //     console.log(`User with ID ${userId} updated successfully.`);
    //   })
    //   .catch((error) => {
    //     console.error(`Error updating user with ID ${userId}:`, error);
    //   });

    console.log(users[0])
    // firebase.database().ref('users/' + users[0].id).set({
    //   username: name,
    //   email: email,
    //   profile_picture : imageUrl
    // });
    users[0]["notes"] = searchInput
    console.log(users[0])
    setSearchInput("")
  }

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

  // console.log("center", center)
  // console.log("markers", userMarkers)
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

          <br/> 
          <div className='w-full grid grid-rows-2 px-2'>
                
            <div className='w-full'>
            <button
              type="submit"
              onClick={findNearbyUsers}
              class="w-full border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
            >Find Nearby Users</button>
            </div>

          <div>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input type="search" id="default-search" onChange={handleChange} value={searchInput} class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your own note!"/>
            <button type="submit" onClick={addNote} class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Note</button>
          </div>
          </div>
          </div>

    {!floodsLoaded ? 
    <h1>Finding Users</h1> :
    <Map center={center}
        markers={userMarkers}
        ForMobile={true}
      />
    }
    

    </div>
  );
}

export default MapPage;
