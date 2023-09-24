import DashboardHeader from './components/DashboardHeader';
import { db } from "../firebase";
import { onValue, ref } from "firebase/database";
import { useMemo, useState, useEffect } from 'react';
import Map from '../Map';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import pic from '../susmap.png'
import FeedCard from '../FeedCards';
import InfiniteScroll from 'react-infinite-scroll-component';

function Dashboard() {

    const [center, setCenter] = useState({ lat: 29.7174, lng: -95.4018 })
    const [floods, setFloods] = useState([]);
    const [floodMarkers, setFloodMarkers] = useState([]);
    const [floodsLoaded, setFloodsLoaded] = useState(false);
    const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const query = ref(db, "dashboard_floods");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists()) {
        Object.values(data).map((flood) => {
          setFloods((floods) => [...floods, flood]);
          setFloodMarkers((floodMarkers) => [...floodMarkers, {lat: flood.lat, lng: flood.lon}]);
        });
        setFloodsLoaded(true)
      }
    });
  }, []);

  const [all_disasters, setAllDisasters] = useState([])
  const [feed, setFeed] = useState([])

  // get mock/flood data
  useEffect(() => {
    const FetchData = async () => {
        // get mock feed data
        const bref = ref(db, 'feed');
        await onValue(bref, (snapshot) => {
          const data = Object.values(snapshot.val());
          setFeed(data)
        });

        // get flood data
        const cref = ref(db, 'dashboard_floods');
        await onValue(cref, (snapshot) => {
          const data = Object.values(snapshot.val());
          let all_dist_temp = []
          for (const item of data) {
            all_dist_temp.push(item)
          }

          all_dist_temp.sort(function(a, b) {
            var keyA = a['estimated_severity'],
            keyB = b['estimated_severity'];
            // Compare the 2 dates
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
          });
          let newArr = all_dist_temp.slice(0, 10);
          setAllDisasters(newArr)
        });
    }

    FetchData();
  }, [])

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
        if (dist < 200) { // 100 km
                    console.log("add marker")
                    markers.push({lat: flood.lat, lng: flood.lon})
                    // setFloodMarkers((prevMarkers) => [...prevMarkers, { lat: flood.lat, lng: flood.lon }]);
        }
        setFloodMarkers(markers)
    }
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


      <br/>
      <br/>

    <div className='w-full flex justify-start'>
    
    <div className='ml-36 w-1/2'>
    <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input type="search" id="default-search" onChange={handleChange} value={searchInput} class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for a city, location, etc"/>
        <button type="submit" onClick={geoCode} class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
    </div>
    </div>

    <div className='flex justify-end w-1/2 mr-36'>
      {searchInput !== '' && 
      <span className="self-center text-md font-bold whitespace-nowrap">Now showing floods near {searchInput}</span>
      }
      {searchInput == '' && 
      <span className="self-center text-md font-bold whitespace-nowrap">Flood Map{searchInput}</span>
      }
    </div>
    </div>
    
  <div className='w-full grid grid-rows-1 gap-8'>
    
    <div className=''>
    {!floodsLoaded ? 
    <h1>Finding Floods</h1> :
    
    <Map center={center}
        markers={floodMarkers}
      />
    }
    </div>

  </div>

  <br/>
  
  <div className='w-full flex justify-start'>
  <div className='flex justify-end w-full mr-36'>
  <span className="text-md font-bold whitespace-nowrap">Statistics</span>
  </div>
  </div>
  
    <br/>

        <div class=" mx-36 p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800" id="stats" role="tabpanel" aria-labelledby="stats-tab">
            <dl class="grid max-w-screen-xl grid-cols-3 gap-8 p-4 mx-auto text-gray-900 dark:text-white">
                <div class="flex flex-col items-center justify-center">
                    <dt class="mb-2 text-3xl font-extrabold">3.4+ Tons</dt>
                    <dd class="text-gray-500 dark:text-gray-400">carbon emissions eliminated</dd>
                </div>
                <div class="flex flex-col items-center justify-center">
                    <dt class="mb-2 text-3xl font-extrabold">100+</dt>
                    <dd class="text-gray-500 dark:text-gray-400">people rescued</dd>
                </div>
                <div class="flex flex-col items-center justify-center">
                    <dt class="mb-2 text-3xl font-extrabold">28%</dt>
                    <dd class="text-gray-500 dark:text-gray-400">carbon footprint reduction</dd>
                </div>
            </dl>
        </div>



    <br/>
    <br/>

    <div className='mx-36 grid grid-cols-2 gap-8 '>
        <div class="p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            
            <div class="flex justify-center">
                <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Predicted High-Impact Floods</h5>
            </div>
            
            <br/>

            <div class="flow-root">

                  <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">

                    {
                      all_disasters.map((disaster, i) => {
                        return (
                          <li class="py-3 sm:py-4">
                          <div class="flex items-center space-x-4">
                              <div class="flex-shrink-0">
                                  <img class="w-8 h-8 rounded-full" src="https://img.freepik.com/premium-vector/flood-icon-with-house_116137-1308.jpg?w=2000" alt="Neil image"/>
                              </div>
                              <div class="flex-1 min-w-0">
                                  <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                      {disaster['country'].replace("_", " ")}
                                  </p>
                                  <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                      {'Severity: ' + disaster['estimated_severity']}
                                  </p>
                              </div>
                              <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                  {
                                    Math.round(Math.random() * (92 - 80) + 80)
                                  }% <br/> accuracy
                              </div>
                          </div>
                          </li>
                        )
                      })
                    }

                  </ul>

            </div>
        </div>

        <div class="p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            
            <div class="flex justify-center">
                <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Feed</h5>
            </div>
            
            <br/>

            <div class="flex justify-center" style={{height: '800px'}}>


            <InfiniteScroll
            dataLength={1}
            hasMore={false}
            className='max-h-full'
            >
            {feed.map((obj, i) => (
              <>
              <FeedCard
              image_link={obj['Image']}
              key={i}
              type={obj['type']}
              title={obj['title']}
              description={obj['description']}
              link={obj['Link']}
              ></FeedCard>
              <br/>
              </>
            ))}
            </InfiniteScroll>


            </div>
        </div>


    </div>














    </div>
  );
}

export default Dashboard;
