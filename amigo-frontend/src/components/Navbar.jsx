import React, { useState } from 'react'
import { setGlobalState, useGlobalState } from './state';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'
import search_icon from './Assets/search_1251856.png'
import menu_icon from './Assets/hamburger_13313335.png'
import friendIcon from './Assets/add-group_2521833.png'
import groupIcon from './Assets/consultation_7346382.png'
import SearchBar from './SearchResult';

function Navbar() {
  const [defaultLoggin] = useGlobalState("loggin");
  const [defaultUsername] = useGlobalState("username");
  const [searchText, setSearchText] = useState('')
  const [showMenu, setShowMenu] = useState(false);
  const [showFriendOption, setShowFriendOption] = useState(false);
  const [showGroupOption, setShowGroupOption] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    setGlobalState("email", "");
    setGlobalState("loggin", false);
    setGlobalState("username", "");
    navigate("/");
  };

  const handleProfile = () => {
    navigate(`/profile/${defaultUsername}`);
  }

  const handleHome = () => {
    navigate("/home");
  }

  const handleSearch = async () => {
    navigate(`/searchResult/${searchText}`)
  }
  const handleFriend = async () => {
    navigate(`/friend`)
  }
  const handleGroup = () => {
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
                <img onClick={() => setShowMenu(!showFriendOption)} className='dropdown_icon' src={friendIcon} alt='friend_icon' />
                  {showMenu && (
                    <div className="dropdown-content">
                      <a onClick={handleFriend}>Friends</a>
                    </div>
                  )}
              </div>
              <div className='dropdown'>
                <img onClick={() => setShowGroupOption(!showGroupOption)} className='dropdown_icon' src={groupIcon} alt='group_icon' />
                  {showMenu && (
                    <div className="dropdown-content">
                      <a onClick={handleGroup}>Groups</a>
                    </div>
                  )}
              </div>
              <div className="dropdown">
                  <img onClick={() => setShowMenu(!showMenu)} className='dropdown_icon' src={menu_icon} alt='menu_icon' />
                {showMenu && (
                  <div className="dropdown-content">
                    <a onClick={handleHome}>Home</a>
                    <a onClick={handleProfile}>Profile</a>
                    <a onClick={handleFriend}>Friend</a>
                    <a onClick={handleSignOut}>Sign Out</a>
                  </div>
                )}
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