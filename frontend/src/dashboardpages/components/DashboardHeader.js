import { Link } from 'react-router-dom';
import logo from '../../logo.png'
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

function DashboardHeader() {

  const [style, setStyle] = useState("hidden w-full md:block md:w-auto")

  const updateMenu = () => {
    if(style == "w-full md:block md:w-auto") {
        setStyle("hidden w-full md:block md:w-auto")
    } else {
        setStyle("w-full md:block md:w-auto")
    }
  }

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center">
            <img src={logo} className="h-8 mr-3" alt="Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">SwiftRescue</span>
        </Link>

        <button onClick={updateMenu} data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
        </button>

        <span className="self-center text-md font-bold whitespace-nowrap dark:text-white">Responder Dashboard</span>
        
        <div className={style} id="navbar-default">


        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
        
            <li>
            <NavLink activeStyle={{color: 'blue'}} to='/dashboard'>
            <p className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Home</p>
            </NavLink>
            </li>

            <li>
            <NavLink activeStyle={{color: 'blue'}} to='/dashboardmap'>
            <p className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Map</p>
            </NavLink>
            </li>

            {/* <li>
            <NavLink activeStyle={{color: 'blue'}} to='/eventfeed'>
            <p className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Notifications</p>
            </NavLink>
            </li> */}

            {/* <li>
            <NavLink activeStyle={{color: 'blue'}} to='/settings'>
            <p className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Settings</p>
            </NavLink>
            </li> */}

        </ul>
        </div>
    </div>
    </nav>
  );
}

export default DashboardHeader;
