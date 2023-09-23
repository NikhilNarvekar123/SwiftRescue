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

function App() {

  const [allCards, setAllCards] = useState([1, 2, 3])
  const [allData, setAllData] = useState([])
  const [isLocalToggle, setIsLocalToggle] = useState(true)

  // get disaster, news, and event data from firebase
  useEffect(() => {
    
    // do for first user in list
    const vref = ref(db, 'users');
    let user = [];
    let loc = [];
    onValue(vref, (snapshot) => {
      const data = Object.values(snapshot.val());
      user = data[0];
      loc[0] = user['location']['lat']
      loc[1] = user['location']['long']
    });

    // get data from tomorrow
    const getTimelineURL = "https://api.tomorrow.io/v4/timelines";
    const apikey = ['uUCcNwTXpst3ab0MUXl8G83bgRN9uOLU'];
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

    let tomorrowdata = []
    axios.get(getTimelineURL + '?' + getTimelineParameters).then(res => {
      tomorrowdata = res.data;
    }).catch((e) => console.log(e))

    // get mock feed data
    const bref = ref(db, 'feed');
    let mockdata = [];
    onValue(bref, (snapshot) => {
      const data = Object.values(snapshot.val());
      mockdata = data;
    });

    // get flood data
    const cref = ref(db, 'dashboard_floods');
    let flooddata = [];
    onValue(cref, (snapshot) => {
      const data = Object.values(snapshot.val());
      flooddata = data;
    });

    console.log(mockdata)
    console.log(flooddata)
  }, [])

  // update the feed whenever toggle is pressed
  useEffect(() => {
    console.log('updated')
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
            dataLength={allCards.length}
            hasMore={false}
            className=''
          >
            {allCards.map((i, index) => (
              <>
              <FeedCard
              image_link='https://i.natgeofe.com/k/1de5cea7-d299-4684-9ab0-b14c84600136/Palm-Trees_Hurricane-Update_KIDS_0822_square.jpg'
              key={index}
              type={'event'}
              title={'Sample Title'}
              description={'Lorem Ipsum'}
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
