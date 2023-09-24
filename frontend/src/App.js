// import logo from './logo.svg';
import './App.css';
import Header from './Header';
import FeedCard from './FeedCards';
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ref, set, push, update, child, onValue } from "firebase/database";
import { db } from "./firebase";

import queryString from 'query-string';
import moment from 'moment';
import { getDistance } from 'geolib';

function App() {

  const [user, setUser] = useState({})
  const [all_disasters, setAllDisasters] = useState([])
  const [loc_disasters, setLocDisasters] = useState([])
  const [feed, setFeed] = useState([])
  const [weather, setWeather] = useState([])

  const [isLocalToggle, setIsLocalToggle] = useState(true)



  // get user from fb
  useEffect( () => {
    const FetchData = async () => {
      // do for first user in list
      const vref = ref(db, 'users');
      let loc = [];
      await onValue(vref, (snapshot) => {
        const data = Object.values(snapshot.val());
        loc[0] = data[0]['location']['lat']
        loc[1] = data[0]['location']['long']
        setUser(data[0])
      });
    }
    FetchData()
  }, [])

  // get mock/flood data
  useEffect(() => {
    const FetchData = async () => {
      if(Object.keys(user).length !== 0) {

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
          let loc_dist_temp = []
          for (const item of data) {
            all_dist_temp.push(item)
            let dist = getDistance({latitude: item['lat'], longitude: item['lon']},
              {latitude: user['location']['lat'], longitude: user['location']['long']});
            if (dist < 80467) { // change back TODO
              loc_dist_temp.push(item)
            }
          }
          setLocDisasters(loc_dist_temp)
          setAllDisasters(all_dist_temp)
        });
      }
    }

    FetchData();
  }, [user])

  // get weather 
  useEffect(() => {
    const GetData = async() => {
      if(Object.keys(user).length !== 0) {
        // get data from tomorrow
        const getTimelineURL = "https://api.tomorrow.io/v4/timelines";
        const apikey = ['uUCcNwTXpst3ab0MUXl8G83bgRN9uOLU'];
        let loc = [user['location']['lat'], user['location']['long']]
        let location = loc.join(",");
        const fields = ["precipitationIntensity", "windSpeed", "temperature"];
        const units = "imperial";
        const timesteps = ["current"];
        const now = moment.utc();
        const startTime = moment.utc(now).add(0, "minutes").toISOString();
        const timezone = "America/Chicago";
        const getTimelineParameters = queryString.stringify(
        {
          apikey,
          location,
          fields,
          units,
          timesteps,
          startTime,
          timezone,
        });
    
        await axios.get(getTimelineURL + '?' + getTimelineParameters).then(res => {
          setWeather(res.data)
        }).catch((e) => console.log(e))
      }
    }

    const FetchData = async () => {
      if(Object.keys(user).length !== 0) {
        // get mock feed data
        const bref = ref(db, 'weather');
        await onValue(bref, (snapshot) => {
          const data = Object.values(snapshot.val());
          setWeather(data)
        });
      }
    }

    FetchData();
  }, [user])

  console.log(user)
  console.log(feed)
  console.log(weather)

  // update the feed whenever toggle is pressed
  useEffect(() => {
    // console.log('updanpmted')
  }, [isLocalToggle])


  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-500">
      <Header/>

      <div class="text-sm font-medium text-center text-gray-500">
        <ul class="flex justify-center">
            <li class="mr-2">
                {isLocalToggle && 
                <a onClick={() => setIsLocalToggle(true)} class="inline-block p-4 rounded-t-lg text-white border-b-2 border-white">Local</a>
                }
                {!isLocalToggle && 
                <a onClick={() => setIsLocalToggle(true)} class="inline-block p-4 border-b-2 border-transparent rounded-t-lg">Local</a>
                }
            </li>
            <li class="mr-2">
                {!isLocalToggle && 
                <a onClick={() => setIsLocalToggle(false)} class="inline-block p-4 rounded-t-lg text-white border-b-2 border-white">Global</a>
                }
                {isLocalToggle && 
                <a onClick={() => setIsLocalToggle(false)} class="inline-block p-4 border-b-2 border-transparent rounded-t-lg">Global</a>
                }
            </li>
        </ul>
      </div>

      <br/>

      <div className='w-full flex justify-center'>
        <InfiniteScroll
            dataLength={100000}
            hasMore={false}
            className=''
          >
            {!isLocalToggle && all_disasters.map((obj, i) => (
              <>
              <FeedCard
              image_link='https://i.natgeofe.com/k/1de5cea7-d299-4684-9ab0-b14c84600136/Palm-Trees_Hurricane-Update_KIDS_0822_square.jpg'
              key={i}
              type={'disaster'}
              title={'Flood Severity: ' + obj['estimated_severity']}
              description={'A flood warning occuring in the' + obj['country']}
              ></FeedCard>
              <br/>
              </>
            ))}
            {isLocalToggle && loc_disasters.map((obj, i) => (
              <>
              <FeedCard
              image_link='https://i.natgeofe.com/k/1de5cea7-d299-4684-9ab0-b14c84600136/Palm-Trees_Hurricane-Update_KIDS_0822_square.jpg'
              key={i}
              type={'disaster'}
              title={'Predicted Flood'}
              description={'A severity ' + obj['estimated_severity']+ ' flood warning occuring in the ' + obj['country']}
              ></FeedCard>
              <br/>
              </>
            ))
            }

            {isLocalToggle && feed.map((obj, i) => (
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

            {isLocalToggle && weather.map((obj, i) => (
              <>
              <FeedCard
              image_link={obj['image']}
              key={i}
              type={obj['type']}
              title={obj['title']}
              description={obj['description']}
              ></FeedCard>
              <br/>
              </>
            ))}

          </InfiniteScroll>
      </div>
    </div>
  );
}

export default App;
