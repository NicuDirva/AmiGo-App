import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Home from './components/Pages/Home';
import Profile from './components/Pages/Profile';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import SearchPage from './components/Pages/SearchPage';
import Friend from './components/Pages/Friend';
import Group from './components/Pages/Group';
import GroupCard from './components/card/GroupCard';
import MembershipPage from './components/Pages/MembershipPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    element: <Home/>
  },
  {
    path: `/profile/:usernameParm`,
    element: <Profile.Profile/>
  },
  {
    path: `/group/:groupIdParm`,
    element: <GroupCard/>
  },
  {
    path: `/member/:groupIdParm`,
    element: <MembershipPage/>
  },
  {
    path: `/searchResult/:searchText?`,
    element: <SearchPage/>
  },
  {
    path: `/friend`,
    element: <Friend/>
  },
  {
    path: `/group`,
    element: <Group.Group/>
  },

]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
