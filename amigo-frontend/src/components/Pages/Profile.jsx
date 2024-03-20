import React, { useState, useEffect } from 'react'
import { useGlobalState, setGlobalState } from '../state';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Auth from '../auth/Auth'
import './Profile.css'
const urlBase = "http://localhost:8080/";

const Profile = () => {

    const genderType = {
        MALE: 'MALE',
        FEMALE: 'FEMALE',
        OTHER: 'OTHER'
    };
    const [defaultLoggin] = useGlobalState("loggin");
    const [defaultEmail] = useGlobalState("email");
    const [imgUrl, setImgUrl] = useState('');
    const [description, setDescription] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [gender, setGender] = useState(genderType.OTHER);
    const [username, setUsername] = useState('');
    const [dob, setDob] = useState('')
    const [newDob, setNewDob] = useState('')
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [action, setAction] = useState('connected');
    const [accountId, setAccountId] = useState('');

    useEffect(() => {
      const fetchData = async () => {
          if (defaultEmail) {
              const account_id = await Auth.getIdByEmail(defaultEmail);
              setAccountId(account_id)
              const profile = await getProfileById(account_id);
              const username = await Auth.getUsernameByEmail(defaultEmail);
              if (profile) {
                  setDescription(profile.description);
                  setImgUrl(profile.img_url);
                  setGender(profile.gender);
                  setDob(profile.dob);
              } else {
                  setError('Profile not found in displayProfile');
              }
          }
      };
      fetchData();
  }, [defaultEmail]);

  const handleDescriptionChange = async (e) => {
    e.preventDefault();
    if(defaultEmail) { 
        const profile = await getProfileById(accountId);
        profile.description = newDescription;

        const response = await fetch(urlBase+"profile/editDescription",{
        method:"POST",
        headers:{"Content-Type":"application/json"}, 
        body:JSON.stringify(profile)
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("New DEscription sent")
      setDescription(newDescription);
      setNewDescription('');
    }
  }

  const handleGenderChange = async (selectedGender) => {
    if (defaultEmail) {
      const profile = await getProfileById(accountId);
      profile.gender = selectedGender;

      const response = await fetch(urlBase+"profile/editGender",{
        method:"POST",
        headers:{"Content-Type":"application/json"}, 
        body:JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setGender(selectedGender);
    }
  }

  const handleDOBChange = async (e) => {
    e.preventDefault();
    if (defaultEmail) { 
      const profile = await getProfileById(accountId);
      profile.dob = newDob;

      const response = await fetch(urlBase+"profile/editDob",{
        method:"POST",
        headers:{"Content-Type":"application/json"}, 
        body:JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setDob(newDob);
      setNewDob('');
    }
  }
      

  return (
    <div>
        {defaultLoggin?
            <div>
              <Navbar/>
              <div>
                <div className='avatar-profile-container'>
                  {<img className='avatar-profile' src={imgUrl} alt="Profile" />}
                </div>
                {action==='connected'?
                <p onClick={(e) => {setAction('editProfile')}}>Edit profile</p>
                :<div></div>}
                <div>
                <div>
                  <p>Description: {description}</p>
                  <input type='text' placeholder='New Description' value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                  <button onClick={handleDescriptionChange}>Change Description</button>
                </div>
                <div>
                  <p>Gender: {gender}</p>
                  <select value={gender} onChange={(e) => handleGenderChange(e.target.value)}>
                    <option value={genderType.MALE}>Male</option>
                    <option value={genderType.FEMALE}>Female</option>
                    <option value={genderType.OTHER}>Other</option>
                  </select>
                </div>
                <div>
                  <p>Date of Birth: {dob}</p>
                  <input type='date' value={newDob} onChange={(e) => setNewDob(e.target.value)} />
                  <button onClick={handleDOBChange}>Change DOB</button>
                </div>
                </div>
                {action==='editProfile'?
                <p onClick={(e) => {setAction('connected')}}>Save profile</p>
                :<div></div>}
                <div>
              </div>
              </div>
            </div>
        :
        <div>
            <Navbar/>
            Nu esti conectat la cont
        </div>}
    </div>
  )
}

const getAllProfile = () => {
  return fetch("http://localhost:8080/profile/getAll", {
      method: "GET",
  }).then(response => {
      if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
      }
      return response.json();
  }).then(data => {
      return data;
  }).catch(error => {
      console.error("Error getting accounts:", error);
      return [];
  });
}

const getProfileById = async (account_id) => {
  try {
    const profiles = await getAllProfile();
    const profile = profiles.find(profile => profile.account_id === account_id);
    if (profile) {
      return profile;
    } else {
      throw new Error("Profile not found");
    }
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
};

export default Profile
