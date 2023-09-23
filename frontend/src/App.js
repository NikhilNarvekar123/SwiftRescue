// import logo from './logo.svg';
import './App.css';
import Header from './Header';
import FeedCard from './FeedCards';
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {

  const [allCards, setAllCards] = useState([1, 2, 3])
  const [temp, setTemp] = useState([])
  const [isLocalToggle, setIsLocalToggle] = useState(true)

  // get alert data from tomorrow
  useEffect(() => {
    axios.get(``)
    .then(res => {
      const persons = res.data;
      this.setState({ persons });
    })
  }, [])

  // get disaster, news, and event data from firebase
  useEffect(() => {

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
