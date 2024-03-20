import React from 'react'
import { setGlobalState, useGlobalState } from './state';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'

function Navbar() {
  const [defaultLoggin] = useGlobalState("loggin");
  const [defaultEmail] = useGlobalState("email");
  const [defaultUsername] = useGlobalState("username");
  const navigate = useNavigate();

  const SignOut = () => {
    setGlobalState("email", "");
    setGlobalState("loggin", false);
    setGlobalState("username", "");
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
  }

  const handleHome = () => {
    navigate("/home");
  }

  return (
    <div>
      {defaultLoggin ?
        <div>
          <nav className='nav'>
            <h1>AmiGo App</h1>
            <ul>
              <li>Hi {defaultUsername}</li>
              <li><a onClick={handleHome}>Home</a></li>
              <li><a onClick={handleProfile}>Profile</a></li>
              <li><a onClick={SignOut}>Sign Out</a></li>
            </ul>
          </nav>
        </div>
        :
        <div>
          <nav className='nav'>
            <h1>Amigo App</h1>
          </nav>
        </div>}
    </div>
  );
}

export default Navbar