import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MapPage from './mobilepages/MapPage';
import Notification from './mobilepages/Notification';
import Settings from './mobilepages/Settings';
import Landing from './Landing';
import Dashboard from './dashboardpages/Dashboard';
import MapResponder from './dashboardpages/MapResponder';
import CardFullPage from './mobilepages/CardFullPage'
import AccountCreationPage from './mobilepages/AccountCreationPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing/>
  },
  {
    path: "/app",
    element: <App/>
  },
  {
    path: "/map",
    element: <MapPage/>
  },
  {
    path: "/notification",
    element: <Notification/>
  },
  {
    path: "/settings",
    element: <Settings/>
  },
  {
    path: "/dashboard",
    element: <Dashboard/>
  },
  {
    path: "/dashboardmap",
    element: <MapResponder/>
  },
  {
    path: "/card/:id",
    element: <CardFullPage/>
  },
  {
    path: '/accountcreation',
    element: <AccountCreationPage/>
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router}/>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
