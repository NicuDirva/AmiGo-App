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
import GroupMemberRequest from './components/Pages/GroupMemberRequest';
import MessagePage from './components/Pages/MessagePage';
import MessageCard from './components/card/MessageCard';
import SinglePostCard from './components/card/SinglePostCard';
import GroupsAccount from './components/Pages/GroupsAccount';
import FriendshipsAccount from './components/Pages/FriendshipsAccount';
import PlacePage from './components/Pages/PlacePage';

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
    path: `/message/:accountIdParm`,
    element: <MessageCard.MessageCard/>
  },
  {
    path: `/account/friendships/:accountIdParm`,
    element: <FriendshipsAccount/>
  },
  {
    path: `/account/groups/:accountIdParm`,
    element: <GroupsAccount/>
  },
  {
    path: `/post/:postIdParm`,
    element: <SinglePostCard/>
  },
  {
    path: `/place/:placeIdParm`,
    element: <PlacePage.PlacePage/>
  },
  {
    path: `/message`,
    element: <MessagePage/>
  },
  {
    path: `/groupMemberRequest/:groupIdParm`,
    element: <GroupMemberRequest/>
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
