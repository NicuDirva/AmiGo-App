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
  const navigate = useNavigate();

  const handleSignOutIcon = () => {
    setGlobalState("email", "");
    setGlobalState("loggin", false);
    setGlobalState("username", "");
    navigate("/");
  };

  const handleProfileIcon = () => {
    navigate(`/profile/${defaultUsername}`);
  }
  const handleMessageIcon = () => {
    navigate(`/message`);
  }

  const handleFeedIcon = () => {
    navigate("/home");
  }

  const handleSearch = async () => {
    navigate(`/searchResult/${searchText}`)
  }
  const handleFriendIcon = async () => {
    navigate(`/friend`)
  }
  const handleGroupIcon = () => {
    navigate(`/group`)
  }

  
  return (
    <div>
      {
        defaultLoggin ? (
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
                  />
                  <button type="button" onClick={handleSearch} className={styles.searchButton}>
                    <img className={styles.searchIcon} src={search_icon} alt='search_icon' />
                  </button>
                </div>
                <div className={styles.dropdown}>
                  <img onClick={handleFeedIcon} className={styles.dropdownIcon} src={homeIcon} alt='home_icon' />
                </div>
                <div className={styles.dropdown}>
                  <img onClick={handleMessageIcon} className={styles.dropdownIcon} src={messageIcon} alt='message_icon' />
                </div>
                <div className={styles.dropdown}>
                  <img onClick={handleFriendIcon} className={styles.dropdownIcon} src={friendIcon} alt='friend_icon' />
                </div>
                <div className={styles.dropdown}>
                  <img onClick={handleGroupIcon} className={styles.dropdownIcon} src={groupIcon} alt='group_icon' />
                </div>
                <div className={styles.dropdown}>
                  <img onClick={handleProfileIcon} className={styles.dropdownIcon} src={profileIcon} alt='profile_icon' />
                </div>
                <div className={styles.dropdown}>
                  <img onClick={handleSignOutIcon} className={styles.dropdownIcon} src={signOutIcon} alt='signout_icon' />
                </div>
                <div className={styles.dropdown}>
                  <button onClick={handleSignOutIcon} className={styles.dropdownIcon}/>
                </div>
              </div>
            </nav>
          </div>
        ) : (
          <div>
            <nav className={styles.nav}>
              <h1 className={styles.logo}>AmiGo App</h1>
            </nav>
          </div>
        )
      }
    </div>
  );
}

export default Navbar
