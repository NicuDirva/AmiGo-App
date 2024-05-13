import React, { useState, useEffect } from 'react'
import { useGlobalState } from '../state';
import Auth from '../auth/Auth';
import Profile from './Profile';
import PostCard from '../card/PostCard';
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';

const urlBase = "http://localhost:8080/";

const Friend = () => {
    const [defaultEmail] = useGlobalState("email");
    const [defaultLoggin] = useGlobalState("loggin");
    const [friendList, setFriendList] = useState([]);
    const [friendRequestList, setFriendRequestList] = useState([]);
    const navigate = useNavigate();

    const handleClickContainer = (usernameParm) => {
        navigate(`/profile/${usernameParm}`);
      }

    const fetchData = async () => {
        const currentId = await Auth.getIdByEmail(defaultEmail);
        const friendListAccount  = await Profile.getFriendshipById(currentId);
        const friendRequestListAccount = await Profile.FriendRequestReceivedById(currentId);
        let friend = [];
        let friendRequest = [];
        for (const frnd of friendListAccount) {
            const profile = await Profile.getProfileById(frnd.account_id);
            friend.push({username:frnd.username, profile});
        }

        for (const frnd of friendRequestListAccount) {
            const profile = await Profile.getProfileById(frnd.account_id);
            friendRequest.push({username:frnd.username, profile});
        }
        setFriendList(friend);
        setFriendRequestList(friendRequest);
    }
    useEffect(() => {
        fetchData();
    },[friendList, friendRequestList]);

    const handleAcceptRequest = async (account_id) => {
        const receiverId = await Auth.getIdByEmail(defaultEmail);
        const senderId = account_id;
    
        let response3 = await fetch(urlBase+"account/FRIENDSHIP",{
          method:"PATCH",
          headers:{"Content-Type":"application/json"}, 
          body:JSON.stringify({senderId, receiverId})
        });
            
        if (!response3.ok) {
          throw new Error(`HTTP error! status: ${response3.status}`);
        }
    
        let response4 = await fetch(urlBase+"account/DELETE_SEND_REQUEST",{
          method:"PATCH",
          headers:{"Content-Type":"application/json"}, 
          body:JSON.stringify({senderId, receiverId})
        });
            
        if (!response4.ok) {
          throw new Error(`HTTP error! status: ${response4.status}`);
        }
    
    
      };

      const handleIgnoreRequest = async (account_id) => {
        const receiverId = await Auth.getIdByEmail(defaultEmail);
        const senderId = account_id;
    
        let response2 = await fetch(urlBase+"account/DELETE_SEND_REQUEST",{
          method:"PATCH",
          headers:{"Content-Type":"application/json"}, 
          body:JSON.stringify({senderId, receiverId})
        });
            
        if (!response2.ok) {
          throw new Error(`HTTP error! status: ${response2.status}`);
        }
      }

  return (
    <div>
        {defaultLoggin?
        <div>
            <Navbar/>
            <div className="friend-container">
                <div className="friend-request-container">
                <h2>Friend Requests</h2>
                {friendRequestList.map((obj, index) => (
                    <div className="friend-request-item" key={index}>
                    <img className='avatar-profile' src={obj.profile.img_url} alt='avatar' onClick={() => handleClickContainer(obj.username)}/>
                    <p>{obj.username}</p>
                    <div>
                        <button onClick={() => handleAcceptRequest(obj.profile.account_id)}>Accept</button>
                        <button onClick={() => handleIgnoreRequest(obj.profile.account_id)}>Ignore</button>
                    </div>
                    </div>
                ))}
                </div>
                <div className="friend-list-container">
                <h2>Friends</h2>
                {friendList.map((obj, index) => (
                    <div className="friend-item" key={index}>
                    <img className='avatar-profile' src={obj.profile.img_url} alt='avatar' onClick={() => handleClickContainer(obj.username)}/>
                    <p>{obj.username}</p>
                    </div>
                ))}
                </div>
            </div>
        </div>
        :
        <div>
            <Navbar/>
            Nu esti conectat la cont!
        </div>
        }
    </div>
  )
}

export default Friend
