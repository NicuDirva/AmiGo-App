import React, { useState, useEffect } from 'react';
import Auth from './auth/Auth';
import Group from './Pages/Group';
import './SearchResult.css';
import { useNavigate } from 'react-router-dom';

const SearchResult = ({ searchText }) => {
  const [searchAccountResults, setSearchAccountResults] = useState([]);
  const [searchGroupResults, setSearchGroupResults] = useState([]);
  const [showAccounts, setShowAccounts] = useState(true);
  const navigate = useNavigate();

  const handleClickContainer = (usernameParm) => {
    navigate(`/profile/${usernameParm}`);
  }

  const handleClickContainerGroup = (groupIdParm) => {
    navigate(`/group/${groupIdParm}`);
  }

  useEffect(() => {
    if (searchText) {
      if (showAccounts) {
        searchAccounts();
      } else {
        searchGroups();
      }
    }
  }, [searchText, showAccounts]);

  const searchAccounts = async () => {
    try {
      const accounts = await Auth.getAllAccount();
      const filteredAccounts = accounts.filter(account =>
        account.username.toLowerCase().includes(searchText.toLowerCase())
      );
      const accountWithProfile = await Promise.all(filteredAccounts.map(async (account) => {
        const profile = await Auth.getProfileByAccountId(account.account_id);
        return {
          account,
          profile
        };
      }));
      setSearchAccountResults(accountWithProfile);
    } catch (error) {
      console.error("Error searching accounts:", error);
      setSearchAccountResults([]);
    }
  };

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
    <div>
      <div className="toggle-buttons">
        <button onClick={() => setShowAccounts(true)}>Accounts</button>
        <button onClick={() => setShowAccounts(false)}>Groups</button>
      </div>
      {showAccounts ? (
        <div>
          <p>Accounts</p>
          {searchAccountResults.length === 0 ? (
            <p>No accounts found.</p>
          ) : (
            <div>
              {searchAccountResults.map(account => (
                <div className="search-result-item" key={account.account.account_id}>
                  <img className='avatar-profile' src={account.profile.img_url} alt='avatar' onClick={() => handleClickContainer(account.account.username)} />
                  <p>{account.account.username}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>Groups</p>
          {searchGroupResults.length === 0 ? (
            <p>No groups found.</p>
          ) : (
            <div>
              {searchGroupResults.map(group => (
                <div className="search-result-item" key={group.group.group_id}>
                  <img className='avatar-profile' src={group.group.urlImg} alt='group-avatar' onClick={() => handleClickContainerGroup(group.group.group_id)}/>
                  <p>{group.group.name}</p>
                  <p>Access: {group.group.access}</p>
                  <p>Members: {group.membershipCount}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResult;
