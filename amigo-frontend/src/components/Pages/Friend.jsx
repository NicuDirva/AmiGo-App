import React, { useState, useEffect } from 'react';
import { useGlobalState } from '../state';
import Auth from '../auth/Auth';
import Profile from './Profile';
import PostCard from '../card/PostCard';
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import styles from './css/FriendPage.module.css';

const urlBase = "http://localhost:8080/";

const Friend = () => {
  const [defaultEmail] = useGlobalState("email");
  const [defaultLoggin] = useGlobalState("loggin");
  const [friendList, setFriendList] = useState([]);
  const [friendRequestList, setFriendRequestList] = useState([]);
  const [friendRequestSendList, setFriendRequestSendList] = useState([]);
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('friends'); // Starea pentru tab-ul selectat

  const fetchData = async () => {
    const currentId = await Auth.getIdByEmail(defaultEmail);
    const friendListAccount = await Profile.getFriendshipById(currentId);
    const friendRequestListAccount = await Profile.FriendRequestReceivedById(currentId);
    const friendRequestSent = await Profile.getFriendRequestById(currentId);
    const sentRequestWithProfile = [];

    for (const frnd of friendRequestSent) {
      const profile = await Profile.getProfileById(frnd.account_id);
      const commonFriend = await Profile.getCommonFriendBy2AccountId(currentId, frnd.account_id);
      sentRequestWithProfile.push({ username: frnd.username, profile, commonFriendCount: commonFriend.length });
    }
    setFriendRequestSendList(sentRequestWithProfile);

    let friend = [];
    let friendRequest = [];

    for (const frnd of friendListAccount) {
      const profile = await Profile.getProfileById(frnd.account_id);
      const commonFriend = await Profile.getCommonFriendBy2AccountId(currentId, frnd.account_id);
      friend.push({ username: frnd.username, profile, commonFriendCount: commonFriend.length });
    }

    for (const frnd of friendRequestListAccount) {
      const profile = await Profile.getProfileById(frnd.account_id);
      const commonFriend = await Profile.getCommonFriendBy2AccountId(currentId, frnd.account_id);
      friendRequest.push({ username: frnd.username, profile, commonFriendCount: commonFriend.length });
    }

    setFriendList(friend);
    setFriendRequestList(friendRequest);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClickContainer = (usernameParm) => {
    navigate(`/profile/${usernameParm}`);
  }

  const handleAcceptRequest = async (account_id) => {
    const receiverId = await Auth.getIdByEmail(defaultEmail);
    const senderId = account_id;

    let response3 = await fetch(urlBase + "account/FRIENDSHIP", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId, receiverId })
    });

    if (!response3.ok) {
      throw new Error(`HTTP error! status: ${response3.status}`);
    }

    let response4 = await fetch(urlBase + "account/DELETE_SEND_REQUEST", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId, receiverId })
    });

    if (!response4.ok) {
      throw new Error(`HTTP error! status: ${response4.status}`);
    }
    fetchData();
  };

  const handleIgnoreRequest = async (account_id) => {
    const receiverId = await Auth.getIdByEmail(defaultEmail);
    const senderId = account_id;

    let response2 = await fetch(urlBase + "account/DELETE_SEND_REQUEST", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId, receiverId })
    });

    if (!response2.ok) {
      throw new Error(`HTTP error! status: ${response2.status}`);
    }
    fetchData();
  }

  const handleUnsend = async (account_id) => {
    const senderId = await Auth.getIdByEmail(defaultEmail);
    const receiverId = account_id;

    let response2 = await fetch(urlBase + "account/DELETE_SEND_REQUEST", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId, receiverId })
    });

    if (!response2.ok) {
      throw new Error(`HTTP error! status: ${response2.status}`);
    }
    fetchData();
  }

  const handleUnfriend = async (account_id) => {
    const accountId1 = await Auth.getIdByEmail(defaultEmail);
    const accountId2 = account_id;

    let response2 = await fetch(urlBase + "account/DELETE_FRIENDSHIP", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId1, accountId2 })
    });

    if (!response2.ok) {
      throw new Error(`HTTP error! status: ${response2.status}`);
    }
    fetchData();
  }

  return (
    <div>
      {defaultLoggin ?
        <div>
          <Navbar />
          <div className={styles.friendContainer}>
            <div className={styles.tabButtons}>
              <button className={selectedTab === 'friends' ? styles.selectedTab : styles.tabButton} onClick={() => setSelectedTab('friends')}>
                Friends
              </button>
              <button className={selectedTab === 'sentRequests' ? styles.selectedTab : styles.tabButton} onClick={() => setSelectedTab('sentRequests')}>
                Sent Requests
              </button>
              <button className={selectedTab === 'receivedRequests' ? styles.selectedTab : styles.tabButton} onClick={() => setSelectedTab('receivedRequests')}>
                Received Requests
              </button>
            </div>
  
            {selectedTab === 'friends' && (
              <div className={styles.friendListContainer}>
                <h2>Friends</h2>
                {friendList.map((obj, index) => (
                  <div className={styles.friendItem} key={index}>
                    <img className={styles.avatarProfile} src={obj.profile.img_url} alt='avatar' onClick={() => handleClickContainer(obj.username)} />
                    <div className={styles.friendInfo}>
                      <p className={styles.boldParag}>{obj.username}</p>
                      <p>Mutual friends: {obj.commonFriendCount}</p>
                    </div>
                    <div className={styles.actionButtons}>
                      <button className={styles.unfriend} onClick={() => handleUnfriend(obj.profile.account_id)}>Unfriend</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
  
            {selectedTab === 'sentRequests' && (
              <div className={styles.friendListContainer}>
                <h2>Friend Requests Sent</h2>
                {friendRequestSendList.map((obj, index) => (
                  <div className={styles.friendItem} key={index}>
                    <img className={styles.avatarProfile} src={obj.profile.img_url} alt='avatar' onClick={() => handleClickContainer(obj.username)} />
                    <div className={styles.friendInfo}>
                      <p className={styles.boldParag}>{obj.username}</p>
                      <p>Mutual friends: {obj.commonFriendCount}</p>
                    </div>
                    <div className={styles.actionButtons}>
                      <button className={styles.unsend} onClick={() => handleUnsend(obj.profile.account_id)}>Unsend</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
  
            {selectedTab === 'receivedRequests' && (
              <div className={styles.friendListContainer}>
                <h2>Friend Requests Received</h2>
                {friendRequestList.map((obj, index) => (
                  <div className={styles.friendItem} key={index}>
                    <img className={styles.avatarProfile} src={obj.profile.img_url} alt='avatar' onClick={() => handleClickContainer(obj.username)} />
                    <div className={styles.friendInfo}>
                      <p className={styles.boldParag}>{obj.username}</p>
                      <p>Mutual friends: {obj.commonFriendCount}</p>
                    </div>
                    <div className={styles.actionButtons}>
                      <button className={styles.accept} onClick={() => handleAcceptRequest(obj.profile.account_id)}>Accept</button>
                      <button className={styles.ignore} onClick={() => handleIgnoreRequest(obj.profile.account_id)}>Ignore</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        :
        <div>
          <Navbar />
          <p>Nu esti conectat la cont!</p>
        </div>
      }
    </div>
  );
}

export default Friend;
