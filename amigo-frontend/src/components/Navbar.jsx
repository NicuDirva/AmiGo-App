import React, { useState } from 'react'
import { setGlobalState, useGlobalState } from './state';
import { useNavigate } from 'react-router-dom';
import styles from './css/Navbar.module.css'
import search_icon from './Assets/search_1251856.png'
import friendIcon from './Assets/add-group_2521833.png'
import groupIcon from './Assets/consultation_7346382.png'
import profileIcon from './Assets/profile_7368494.png'
import homeIcon from './Assets/house_13313258.png'
import signOutIcon from './Assets/logout_13313199.png'
import messageIcon from './Assets/real_message.png'

function Navbar() {
  const [defaultLoggin] = useGlobalState("loggin");
  const [defaultUsername] = useGlobalState("username");
  const [searchText, setSearchText] = useState('')
  const [tooltipText, setTooltipText] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();

  const handleSignOutIcon = () => {
    setTooltipText('Sign Out')
    setGlobalState("email", "");
    setGlobalState("loggin", false);
    setGlobalState("username", "");
    navigate("/");
  };

  const handleProfileIcon = () => {
    setTooltipText('Profile')
    navigate(`/profile/${defaultUsername}`);
  }
  const handleMessageIcon = () => {
    setTooltipText('Message')
    navigate(`/message`);
  }

  const handleFeedIcon = () => {
    setTooltipText('Home')
    navigate("/home");
  }

  const handleSearch = async () => {
    navigate(`/searchResult/${searchText}`)
  }
  const handleFriendIcon = async () => {
    setTooltipText('Friend')
    navigate(`/friend`)
  }
  const handleGroupIcon = () => {
    setTooltipText('Group')
    navigate(`/group`)
  }

  const handleMouseEnter = (text) => {
    setTooltipText(text);
    setShowTooltip(true);
  };
  
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  
  return (
    <div>
      {defaultLoggin ? (
        <div>
          <nav className={styles.nav}>
            <h1 className={styles.logo}>AmiGo App</h1>
            <div className={styles.navRight}>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search..."
                  className={styles.searchInput}
                  onc
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className={styles.searchButton}
                >
                  <img
                    className={styles.searchIcon}
                    src={search_icon}
                    alt="search_icon"
                  />
                </button>
              </div>
              <div className={styles.dropdown}>
                <img
                  onMouseEnter={() => handleMouseEnter('Home')}
                  onMouseLeave={handleMouseLeave}
                  className={styles.dropdownIcon}
                  onClick={handleFeedIcon}
                  src={homeIcon}
                  alt="home_icon"
                />
              </div>
              <div className={styles.dropdown}>
                <img
                  onMouseEnter={() => handleMouseEnter('Message')}
                  onMouseLeave={handleMouseLeave}
                  className={styles.dropdownIcon}
                  onClick={handleMessageIcon}
                  src={messageIcon}
                  alt="message_icon"
                />
              </div>
              <div className={styles.dropdown}>
                <img
                  onMouseEnter={() => handleMouseEnter('Friend')}
                  onMouseLeave={handleMouseLeave}
                  className={styles.dropdownIcon}
                  onClick={handleFriendIcon}
                  src={friendIcon}
                  alt="friend_icon"
                />
              </div>
              <div className={styles.dropdown}>
                <img
                  onMouseEnter={() => handleMouseEnter('Group')}
                  onMouseLeave={handleMouseLeave}
                  className={styles.dropdownIcon}
                  onClick={handleGroupIcon}
                  src={groupIcon}
                  alt="group_icon"
                />
              </div>
              <div className={styles.dropdown}>
                <img
                  onMouseEnter={() => handleMouseEnter('Profile')}
                  onMouseLeave={handleMouseLeave}
                  className={styles.dropdownIcon}
                  onClick={handleProfileIcon}
                  src={profileIcon}
                  alt="profile_icon"
                />
              </div>
              <div className={styles.dropdown}>
                <img
                  onMouseEnter={() => handleMouseEnter('Sign Out')}
                  onMouseLeave={handleMouseLeave}
                  className={styles.dropdownIcon}
                  onClick={handleSignOutIcon}
                  src={signOutIcon}
                  alt="signout_icon"
                />
              </div>
              <div>
                <button></button>
              </div>
            </div>
          </nav>
          {showTooltip && (
            <div className={styles.tooltip}>
              {tooltipText}
            </div>
          )}
        </div>
      ) : (
        <div>
          <nav className={styles.nav}>
            <h1 className={styles.logo}>AmiGo App</h1>
          </nav>
        </div>
      )}
    </div>
  );
}

export default Navbar
