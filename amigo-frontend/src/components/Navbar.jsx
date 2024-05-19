import React, { useState } from 'react'
import { setGlobalState, useGlobalState } from './state';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'
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
      defaultLoggin?
        <div>
          <nav className='nav'>
            <h1 className="logo">AmiGo App</h1>
            <div className="nav-right">
              <div className="search-box">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search..."
                  className="search-input"
                />
                <button type="button" onClick={handleSearch} className='search-button'>
                  <img className='search_icon' src={search_icon} alt='search_icon' />
                </button>
              </div>

              <div className='dropdown'>
                <img onClick={handleFeedIcon} className='dropdown_icon' src={homeIcon} alt='home_icon' />
              </div>

              <div className='dropdown'>
                <img onClick={handleMessageIcon} className='dropdown_icon' src={messageIcon} alt='message_icon' />
              </div>

              <div className='dropdown'>
                <img onClick={handleFriendIcon} className='dropdown_icon' src={friendIcon} alt='friend_icon' />
              </div>

              <div className='dropdown'>
                <img onClick={handleGroupIcon} className='dropdown_icon' src={groupIcon} alt='group_icon' />
              </div>

              <div className='dropdown'>
                <img onClick={handleProfileIcon} className='dropdown_icon' src={profileIcon} alt='profile_icon' />
              </div>

              <div className='dropdown'>
                <img onClick={handleSignOutIcon} className='dropdown_icon' src={signOutIcon} alt='signout_icon' />
              </div>

            </div>
          </nav>
        </div>
        :
        <div>
        <nav className='nav'>
          <h1>Amigo App</h1>
        </nav>
        </div>
      }
    </div>
  );
}

export default Navbar
