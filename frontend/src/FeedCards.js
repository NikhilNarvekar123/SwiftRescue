import { Link } from "react-router-dom";
import { useEffect } from "react";

function FeedCard(props) {

    let badge = <></>

    if(props.type == 'alert') {
        badge = <span class="bg-yellow-100 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Alert</span>
    }
    if(props.type == 'disaster') {
        badge = <span class="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Disaster</span>
    }
    if(props.type == 'news') {
        badge = <span class="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">News</span>
    }
    if(props.type == 'event') {
        badge = <span class="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Event</span>
    }

  return (
    <>


        <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            
            {/* image with unsplash api */}
            <Link to=''>
            <img class="rounded-t-lg" src={props.image_link} alt="" />
            </Link>

            <div class="p-5">
                {badge}

                <a href="">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{props.title}</h5>
                </a>
                
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{props.description}</p>
                <a href={props.link} class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Read more
                    <svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                </a>
            </div>

        </div>

    
    
    
    </>
  );
}

export default FeedCard;
