import React, { useState, useEffect } from 'react';
import Auth from './auth/Auth';
import Group from './Pages/Group';
import './css/SearchResult.css';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from './state';
import Profile from './Pages/Profile';

const SearchResult = ({ searchText }) => {
  const [searchAccountResults, setSearchAccountResults] = useState([]);
  const [searchGroupResults, setSearchGroupResults] = useState([]);
  const [searchPlaceResults, setSearchPlaceResults] = useState([]);
  const [showAccounts, setShowAccounts] = useState(true);
  const [showPlaces, setShowPlaces] = useState(false);
  const [ defaultEmail] = useGlobalState("email");
  const [ currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();
  const [toShortText, setToShortText] = useState(false);

  const handleClickContainer = (usernameParm) => {
    navigate(`/profile/${usernameParm}`);
  }

  const handleClickContainerGroup = (groupIdParm) => {
    navigate(`/group/${groupIdParm}`);
  }

  const handleClickContainerPlace = (placeIdParm) => {
    navigate(`/place/${placeIdParm}`);
  }

  useEffect(() => {
    if (searchText) {
      if (showAccounts) {
        searchAccounts();
      } else if (showPlaces) {
        searchPlace(); // Adăugarea funcției de căutare pentru locuri
      } else {
        searchGroups();
      }
    }
    if(searchText.length < 3) {
      setToShortText(true);
    }
    else {
      setToShortText(false);
    }
  }, [searchText, showAccounts, showPlaces, toShortText]);

  const searchAccounts = async () => {
    try {
      const currentId = await Auth.getIdByEmail(defaultEmail);
      setCurrentUserId(currentId);
      const currentUserFriend = await Profile.getFriendshipById(currentId);
      const accounts = await Auth.getAllAccount();
      const filteredAccounts = accounts.filter(account =>
        account.username.toLowerCase().includes(searchText.toLowerCase())
      );
      const accountWithProfile = await Promise.all(filteredAccounts.map(async (account) => {
        const profile = await Auth.getProfileByAccountId(account.account_id);
        const memberFriends = await Profile.getFriendshipById(account.account_id);
        let cnt = 0;
        for(const currentMemberFriend of currentUserFriend) {
          for(const searchMemberFriend of memberFriends) {
            if((currentMemberFriend.account_id == searchMemberFriend.account_id) && currentMemberFriend.account_id != currentId) {
              cnt += 1;
            }
          }
        }
        return {
          account,
          profile,
          commonFriend: cnt,
        };
      }));
      setSearchAccountResults(accountWithProfile);
    } catch (error) {
      console.error("Error searching accounts:", error);
      setSearchAccountResults([]);
    }
  };

  const searchPlace = async () => {
    try {
      const places = await Group.getAllPlaces();
      const filteredPlace = places.filter(place =>
        place.placeName.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchPlaceResults(filteredPlace);
    } catch (error) {
      console.error("Error searching places:", error);
    }
  }

  const searchGroups = async () => {
    try {
      const groups = await Group.getAllGroup();
      const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchText.toLowerCase())
      );
      const groupsWithMembershipCount = await Promise.all(filteredGroups.map(async (group) => {
        const memberships = await Group.getMembershipsByGroupId(group.group_id);
        return {
          group,
          membershipCount: memberships.length
        };
      }));
      setSearchGroupResults(groupsWithMembershipCount);
    } catch (error) {
      console.error("Error searching groups:", error);
      setSearchGroupResults([]);
    }
  };

  return (
    <div className="search-container">
      <div className="toggle-buttons">
        <button className={showAccounts ? 'active' : ''} onClick={() => { setShowAccounts(true); setShowPlaces(false); }}>Accounts</button>
        <button className={!showAccounts && !showPlaces ? 'active' : ''} onClick={() => { setShowAccounts(false); setShowPlaces(false); }}>Groups</button>
        <button className={!showAccounts && showPlaces ? 'active' : ''} onClick={() => { setShowAccounts(false); setShowPlaces(true); }}>Places</button>
      </div>
      {toShortText ? (
        <div>
          <span>The text entered is too short.</span>
        </div>
      ) : (
        <>
          {showAccounts ? (
            <div>
              <h2 className="search-category">Accounts</h2>
              {searchAccountResults.length === 0 ? (
                <p>No accounts found.</p>
              ) : (
                <div>
                  {searchAccountResults.map(account => (
                    <div className="search-result-item" key={account.account.account_id}>
                      <img className='avatar-profile' src={account.profile.img_url} alt='avatar' onClick={() => handleClickContainer(account.account.username)} />
                      <div>
                        <p className="username">{account.account.username}</p>
                        <p className="mutual-friends">Mutual friends: {account.commonFriend === 0 ? 0 : account.commonFriend}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : showPlaces ? (
            <div>
              <h2 className="search-category">Places</h2>
              {searchPlaceResults.length === 0 ? (
                <p>No places found.</p>
              ) : (
                <div>
                  {searchPlaceResults.map(postMentionedPlace => (
                    <div className="search-result-item" key={postMentionedPlace.place_id} onClick={() => handleClickContainerPlace(postMentionedPlace.place_id)}>
                      <div>
                        <p>
                          <span className='highlight'>{postMentionedPlace.placeName},</span> 
                          {'        '}County:{' '}
                          <span className='highlight'>{postMentionedPlace.county},</span>
                          {'        '}Visitors:{' '}
                          <span className='highlight'>{postMentionedPlace.mentionsNumber}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="search-category">Groups</h2>
              {searchGroupResults.length === 0 ? (
                <p>No groups found.</p>
              ) : (
                <div>
                  {searchGroupResults.map(group => (
                    <div className="search-result-item" key={group.group.group_id}>
                      <img className='avatar-profile' src={group.group.urlImg} alt='group-avatar' onClick={() => handleClickContainerGroup(group.group.group_id)} />
                      <div>
                        <p className="group-name">{group.group.name}</p>
                        <div className="group-details">
                          <p className="group-info">Access: {group.group.access}</p>
                          <p className="group-info">Members: {group.membershipCount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
  
};

export default SearchResult;
