import React, { useState, useEffect } from 'react'
import { useGlobalState, setGlobalState } from '../state';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import Auth from '../auth/Auth'
import './Profile.css'
import PostCard from '../card/PostCard';
const urlBase = "http://localhost:8080/";

const Profile = () => {

  const { usernameParm } = useParams();

    const genderType = {
        MALE: 'MALE',
        FEMALE: 'FEMALE',
        OTHER: 'OTHER'
    };
    const [defaultLoggin] = useGlobalState("loggin");
    const [defaultEmail] = useGlobalState("email");
    const [defaultUsername] = useGlobalState("username");
    const [imgUrl, setImgUrl] = useState('');
    const [description, setDescription] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [gender, setGender] = useState(genderType.OTHER);
    const [dob, setDob] = useState('')
    const [access, setAccess] = useState('')
    const [newAccess, setNewAccess] = useState('')
    const [newDob, setNewDob] = useState('')
    const [error, setError] = useState('');
    const [action, setAction] = useState('connected');
    const [accountId, setAccountId] = useState('');
    const [newAvatar, setNewAvatar] = useState('');
    const [friendStatus, setFriendStatus] = useState(false);
    const [sendedFriendRequest, setSendedFriendRequest] = useState(false);
    const [receivedFriendRequest, setReceivedFriendRequest] = useState(false);
  
    const fetchData = async () => {
      if (defaultUsername==usernameParm) {
          const account_id = await Auth.getIdByEmail(defaultEmail);
          setAccountId(account_id)
          const profile = await getProfileById(account_id);
          if (profile) {
              setDescription(profile.description);
              setImgUrl(profile.img_url);
              setGender(profile.gender);
              setDob(profile.dob);
              setAccess(profile.access);
          } else {
              setError('Profile not found in displayProfile');
          }
      }
      else {
        const account_id_visit = await Auth.getIdByUsername(usernameParm);
        setAccountId(account_id_visit);
        const currentAccountId = await Auth.getIdByEmail(defaultEmail)
        const friendList = await getFriendshipById(currentAccountId);
        friendList.forEach(account => {
          if (account.account_id == account_id_visit) {
            setFriendStatus(true);
          }
        });
        if(!friendStatus) {
          const friendRequestSent = await getFriendRequestById(currentAccountId);
          console.log("Friend request sent", friendRequestSent);
          friendRequestSent.forEach(account => {
            if( account.account_id == account_id_visit) {
                setSendedFriendRequest(true);
            }
          });

          const friendRequestReceived = await getFriendRequestById(account_id_visit);
          console.log("Friend request received", friendRequestReceived);
          friendRequestReceived.forEach(account => {
            if( account.account_id == currentAccountId) {
              setReceivedFriendRequest(true);
            }
          });
          console.log("Friendship status", friendStatus);
          console.log("SendFriendRequest status", sendedFriendRequest);
          console.log("ReceiverFriendRequest status", receivedFriendRequest);
        }
        const profile = await getProfileById(account_id_visit);
        if (profile) {
            setDescription(profile.description);
            setImgUrl(profile.img_url);
            setGender(profile.gender);
            setDob(profile.dob);
            setAccess(profile.access);
        } else {
            setError('Profile not found in displayProfile');
        }
      }
  };

    useEffect(() => {
      fetchData();
  }, [defaultEmail, friendStatus, sendedFriendRequest, receivedFriendRequest]);

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
    fetchData();
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
    fetchData();
  }

  const handleAccessChange = async (e) => {
      const selectedAccess = e.target.value;
      try {
          const profile = await getProfileById(accountId);
          profile.access = selectedAccess;
          const response = await fetch(urlBase + "profile/editAccess", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(profile)
          });

          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
      } catch (error) {
          console.error('Error:', error);
      }
      fetchData();
  };

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
    fetchData();
  }

  const convertImgBase64 = (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setNewAvatar(reader.result);
    }
  }

  const handleAvatarChange = async (e) => {
    console.log("Noul AVATAR:" + newAvatar)
    if(newAvatar != imgUrl && newAvatar != '') {
      const profile = await getProfileById(accountId);
      profile.img_url = newAvatar;

      const response = await fetch(urlBase+"profile/editAvatar",{
      method:"POST",
      headers:{"Content-Type":"application/json"}, 
      body:JSON.stringify(profile)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("New avatar sent")
    }
    fetchData();
  }

  const handleSendRequest = async () => {
    const senderId = await Auth.getIdByUsername(defaultUsername);
    const receiverId = await Auth.getIdByUsername(usernameParm);

    let response2 = await fetch(urlBase+"account/SEND_REQUEST",{
      method:"PATCH",
      headers:{"Content-Type":"application/json"}, 
      body:JSON.stringify({senderId, receiverId})
    });
        
    if (!response2.ok) {
      throw new Error(`HTTP error! status: ${response2.status}`);
    }
    fetchData();
  };

  const handleAcceptRequest = async () => {
    const receiverId = await Auth.getIdByUsername(defaultUsername);
    const senderId = await Auth.getIdByUsername(usernameParm);

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
    fetchData();

  };

  const handleUnfriend = async () => {
    const accountId1 = await Auth.getIdByUsername(defaultUsername);
    const accountId2 = await Auth.getIdByUsername(usernameParm);

    let response2 = await fetch(urlBase+"account/DELETE_FRIENDSHIP",{
      method:"PATCH",
      headers:{"Content-Type":"application/json"}, 
      body:JSON.stringify({accountId1, accountId2})
    });
        
    if (!response2.ok) {
      throw new Error(`HTTP error! status: ${response2.status}`);
    }
    fetchData();
  }

  const handleIgnoreRequest = async () => {
    const receiverId = await Auth.getIdByUsername(defaultUsername);
    const senderId = await Auth.getIdByUsername(usernameParm);

    let response2 = await fetch(urlBase+"account/DELETE_SEND_REQUEST",{
      method:"PATCH",
      headers:{"Content-Type":"application/json"}, 
      body:JSON.stringify({senderId, receiverId})
    });
        
    if (!response2.ok) {
      throw new Error(`HTTP error! status: ${response2.status}`);
    }
    fetchData();
  }

  const handleUnsentSentRequest = async () => {
    const senderId = await Auth.getIdByUsername(defaultUsername);
    const receiverId = await Auth.getIdByUsername(usernameParm);

    let response2 = await fetch(urlBase+"account/DELETE_SEND_REQUEST",{
      method:"PATCH",
      headers:{"Content-Type":"application/json"}, 
      body:JSON.stringify({senderId, receiverId})
    });
        
    if (!response2.ok) {
      throw new Error(`HTTP error! status: ${response2.status}`);
    }
    fetchData();
  }
      

  return (
    <div>
        {defaultLoggin&&defaultUsername===usernameParm?
            <div>
              <Navbar/>
              <div>
              <div className='avatar-profile-container'>
                  {imgUrl && <img className='avatar-profile' src={imgUrl} alt="Profile" />}
                  {action === 'editProfile' ? (
                      <div className="upload-avatar">
                          <label htmlFor="image" className="upload-label">New avatar:</label>
                          <div className="upload-input">
                              <input
                                  type="file"
                                  id="image"
                                  accept="image/*"
                                  onChange={convertImgBase64}
                                  required
                              />
                              <button onClick={handleAvatarChange} className="upload-button">Upload</button>
                          </div>
                      </div>
                  ) : null}
              </div>
                {action==='connected'?
                <p onClick={(e) => {setAction('editProfile')}}>Edit profile</p>
                :<div></div>}
                <div>
                <div>
                  <p>Description: {description}</p>
                  {action==="editProfile"?<div><input type='text' placeholder='New Description' value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                  <button onClick={handleDescriptionChange}>Change Description</button></div>
                  :<div></div>}
                </div>
                <div>
                  <p>Gender: {gender}</p>
                  {action==="editProfile"?
                  <div><select value={gender} onChange={(e) => handleGenderChange(e.target.value)}>
                    <option value={genderType.MALE}>Male</option>
                    <option value={genderType.FEMALE}>Female</option>
                    <option value={genderType.OTHER}>Other</option>
                    </select>
                  </div>
                  :<div></div>}
                </div>
                <div>
                  <p>Date of Birth: {dob}</p>
                  {action==="editProfile"?<div>
                  <input type='date' value={newDob} onChange={(e) => setNewDob(e.target.value)} />
                  <button onClick={handleDOBChange}>Change DOB</button></div>
                  :<div></div>}
                </div>

                {action === "editProfile" ? (
                <div>
                    <label htmlFor="access">Access:</label>
                    <select
                        id="access"
                        value={access}
                        onChange={handleAccessChange}
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>
                ) : (
                <div>
                    <p>Access: {access}</p>
                </div>
                )}

                </div>
                {action==='editProfile'?
                <p onClick={(e) => {setAction('connected')}}>Save profile</p>
                :<div></div>}
                <div>
              </div>
              </div>
              <PostCard.PostCard usernameParm={usernameParm}/>
            </div>
        : defaultLoggin?
            <div>
              <Navbar/>
                <div className='avatar-profile-container'>
                    {imgUrl && <img className='avatar-profile' src={imgUrl} alt="Profile" />}
                </div>
                <div className="friendship-buttons">
                  {friendStatus && <button>You are friends</button> && (
                    <>
                      <button onClick={handleUnfriend}>Unfriend</button>
                    </>
                  )}
                  {!friendStatus && sendedFriendRequest && <button onClick={handleUnsentSentRequest}>Friend request sent</button>}
                  {!friendStatus && receivedFriendRequest && (
                    <>
                      <button onClick={handleAcceptRequest}>Accept friend request</button>
                      <button onClick={handleIgnoreRequest}>Ignore friend request</button>
                    </>
                  )}
                  {!friendStatus && !sendedFriendRequest && !receivedFriendRequest && (
                    <button onClick={handleSendRequest}>Send friend request</button>
                  )}
                </div>
                <div>
                  <p>Description: {description}</p>
                </div>
                <div>
                  <p>Gender: {gender}</p>
                </div>
                <div>
                  <p>Date of Birth: {dob}</p>
                </div>
                <PostCard.PostCard usernameParm={usernameParm}/>
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

const getFriendshipById = async (account_id) => {
  try {
    const response = await fetch(urlBase + "account/getFriendshipById", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(account_id)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Extrage și parsează conținutul JSON din răspuns
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching friendship data:", error);
    throw error; // Aruncă eroarea mai departe pentru a fi gestionată în altă parte
  }
};

const getFriendRequestById = async (account_id) => {
  try {
    const response = await fetch(urlBase + "account/getFriendRequestById", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(account_id)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Extrage și parsează conținutul JSON din răspuns
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching friendRequest data:", error);
    throw error; // Aruncă eroarea mai departe pentru a fi gestionată în altă parte
  }
};

const FriendRequestReceivedById = async (account_id) => {
  try {
    const response = await fetch(urlBase + "account/FriendRequestReceivedById", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(account_id)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Extrage și parsează conținutul JSON din răspuns
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching friendRequestReceived data:", error);
    throw error; // Aruncă eroarea mai departe pentru a fi gestionată în altă parte
  }
};


const getAllFriendRequest = () => {
  return fetch(urlBase+"friendRequest/getAll", {
      method: "GET",
  }).then(response => {
      if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
      }
      return response.json();
  }).then(data => {
      return data;
  }).catch(error => {
      console.error("Error getting friend request:", error);
      return [];
  });
}

export default { Profile, getAllFriendRequest,getFriendshipById, getFriendRequestById, FriendRequestReceivedById, getProfileById}
