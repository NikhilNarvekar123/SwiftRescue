import Header from '../Header';
import Map from '../Map';
import logo from '../logo.png'
import { Link } from 'react-router-dom';
import { useState } from 'react';

import { db } from "../firebase";
import { ref, set, push, update, child } from "firebase/database";


function AccountCreationPage() {

  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [phone, setPhone] = useState('')
  const [pw, setPW] = useState('')
  const [loc, setLoc] = useState([0, 0])


  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLoc([latitude, longitude])
  }
  
  function error() {
    console.log("Unable to retrieve your location");
  }

  function submit() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        console.log("Geolocation not supported");
    }

    const obj = {
        name: name,
        age: age,
        phone: phone,
        pw: pw,
        location: {
            lat: loc[0],
            long: loc[1],
        },
        notes: ''
    }

    const newPostKey = push(child(ref(db), 'users')).key;

    const updates = {};
    updates['/users/' + newPostKey] = obj;
    update(ref(db), updates).then(() => {
        console.log('done')
      }).catch((error) => {
        console.log('fail')
      });
  }

  return (
    <div>
        <section class="bg-gray-50 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <Link to="/" className="flex items-center mb-6 ">
                <img src={logo} className="h-8 mr-3" alt="Logo" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">SwiftRescue</span>
            </Link>

            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Create an account
                    </h1>
                    <div class="space-y-4 md:space-y-6">
                        <div>
                            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                            <input onChange={(e) => setName(e.target.value)} type="name" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Snow" required=""/>
                        </div>
                        <div>
                            <label for="age" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Age</label>
                            <input onChange={(e) => setAge(e.target.value)} type="age" name="age" id="age" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="22" required=""/>
                        </div>
                        <div>
                            <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your phone number</label>
                            <input onChange={(e) => setPhone(e.target.value)} type="phone" name="phone" id="phone" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="123-456-7890" required=""/>
                        </div>
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input onChange={(e) => setPW(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                        </div>

                        <button onClick={submit} type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>

                        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                            Already have an account? <a href="#" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </section>
    </div>
  );
}

export default AccountCreationPage;
