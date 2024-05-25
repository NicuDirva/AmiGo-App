import React, { useState, useEffect } from 'react'
import { useGlobalState, setGlobalState } from '../state';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import Auth from '../auth/Auth'
import styles from './css/Profile.module.css'
import PostCard from '../card/PostCard';
import settingsIcon from '../Assets/options_3574375.png'
import saveIcon from '../Assets/save.png'
import avatarIcon from '../Assets/groupIcon.png'
import acceptFriendIcon from '../Assets/follow.png'
import ignoreFriendIcon from '../Assets/delete.png'
import UnfriendIcon from '../Assets/unfriend.png'
import UnsendFriendRequestIcon from '../Assets/unsend.png'
import friendsIconProfile from '../Assets/FriendsIconProfile.png'
import groupsIconProfile from '../Assets/groupsIconProfile.png'
import messageIconProfile from '../Assets/messageIconProfile.png'
import Group from './Group';
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
    const [location, setLocation] = useState('')
    const [newDob, setNewDob] = useState('')
    const [error, setError] = useState('');
    const [action, setAction] = useState('connected');
    const [accountId, setAccountId] = useState('');
    const [currentUsernameView, setCurrentUsernameView] = useState(null);
    const [newAvatar, setNewAvatar] = useState('');
    const [friendStatus, setFriendStatus] = useState(false);
    const [sendedFriendRequest, setSendedFriendRequest] = useState(false);
    const [receivedFriendRequest, setReceivedFriendRequest] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const judete = [
      "ALBA", "ARAD", "ARGES", "BACAU", "BIHOR", "BISTRITA-NASAUD", "BOTOSANI",
      "BRASOV", "BRAILA", "BUZAU", "CARAS-SEVERIN", "CALARASI", "CLUJ", "CONSTANTA",
      "COVASNA", "DAMBOVITA", "DOLJ", "GALATI", "GIURGIU", "GORJ", "HARGHITA", "HUNEDOARA",
      "IALOMITA", "IASI", "ILFOV", "MARAMURES", "MEHEDINTI", "MURES", "NEAMT", "OLT", "PRAHOVA",
      "SATU MARE", "SALAJ", "SIBIU", "SUCEAVA", "TELEORMAN", "TIMIS", "TULCEA", "VASLUI",
      "VALCEA", "VRANCEA", "BUCURESTI"
  ];
    const navigate = useNavigate();
  
    const fetchData = async () => {
      if (defaultUsername==usernameParm) {
          const account_id = await Auth.getIdByEmail(defaultEmail);
          const currentUsernameSerch = await Auth.getUsernameByEmail(defaultEmail);
          setCurrentUsernameView(currentUsernameSerch);
          setAccountId(account_id)
          const profile = await getProfileById(account_id);
          if (profile) {
              setDescription(profile.description);
              setImgUrl(profile.img_url);
              setGender(profile.gender);
              setDob(profile.dob);
              setAccess(profile.access);
              if(profile.location) {
                setLocation(profile.location);
              }
              else {
                setLocation("No location selected")
              }
          } else {
              setError('Profile not found in displayProfile');
          }
      }
      else {
        const account_id_visit = await Auth.getIdByUsername(usernameParm);
        const currentUsernameSerch = await Auth.getUsernameById(account_id_visit);
        setCurrentUsernameView(currentUsernameSerch);
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
        }
        const profile = await getProfileById(account_id_visit);
        if (profile) {
            setDescription(profile.description);
            setImgUrl(profile.img_url);
            setGender(profile.gender);
            setDob(profile.dob);
            setAccess(profile.access);
            if(profile.location) {
              setLocation(profile.location);
            }
            else {
              setLocation("No location selected")
            }
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

  const handleLocationChange = async (e) => {
    const selectedLocation = e.target.value;
    try {
        const profile = await getProfileById(accountId);
        profile.location = selectedLocation;
        const response = await fetch(urlBase + "profile/editLocation", {
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
    const currentId = await Auth.getEmailByUsername(defaultEmail);
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
    setFriendStatus(false);
        
    if (!response2.ok) {
      throw new Error(`HTTP error! status: ${response2.status}`);
    }
    setFriendStatus(false);
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
    setSendedFriendRequest(false);
    fetchData();
  }

  const handleSentMessage = (accountIdParm) => {
    navigate(`/message/${accountIdParm}`);
  }

  const handleAccountGroups = (accountIdParm) => {
    navigate(`/account/groups/${accountIdParm}`);
  }

  const handleAccountFriends = (accountIdParm) => {
    navigate(`/account/friendships/${accountIdParm}`);
  }

  const handleSignOut = () => {
    setGlobalState("email", "");
    setGlobalState("loggin", false);
    setGlobalState("username", "");
    navigate("/");
  };

  const handleSaveChange = () => {
    setNewAvatar('');
    setNewDescription('');
    setNewDob('');
    setAction('connected')
    setEmailInput('');
    setEmailVerified(false);
    fetchData();
  } 

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmailInput(email);
    setEmailVerified(email === defaultEmail);
  };

  const handleDeleteAccount = async () => {
    handleSignOut();
    await handleDeleteAccountById(accountId);
  }


  return (
    <div>
      {defaultLoggin && defaultUsername === usernameParm ? (
        <div className={styles.containerParent}>
          <Navbar />
          <div className={styles.parentOf2}>
            <div className={styles.leftContainer}>
              <div className={styles.profileDetails}>
                {imgUrl && <img className={styles.avatarProfile} src={imgUrl} alt="Profile" />}
                <h2 className={styles.username}>{currentUsernameView}</h2>
                <div className={styles.settingsButton}>
                  {action === 'connected' ? (
                    <img src={settingsIcon} className={styles.settingsIcon} onClick={() => { setAction('editProfile') }} />
                  ) : null}
                </div>
              </div>
              {action === 'editProfile' && (
                <div className={styles.uploadAvatar}>
                  <label htmlFor="image" className={styles.uploadLabel}>
                    <img src={avatarIcon} alt="New Group" className={styles.settingsIcon} />
                  </label>
                  <div className={styles.uploadInput}>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={convertImgBase64}
                      required
                    />
                    <button onClick={handleAvatarChange} className={styles.uploadButton}>Upload</button>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.detailsContainer}>
              <div className={styles.detail}>
                <p>Description: {description}</p>
                {action === "editProfile" ? (
                  <div className={styles.editField}>
                    <input
                      type='text'
                      placeholder='New Description'
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className={styles.input}
                    />
                    <button onClick={handleDescriptionChange} className={styles.saveButton}>Change Description</button>
                  </div>
                ) : null}
              </div>
              <div className={styles.detail}>
                <p>Gender: {gender}</p>
                {action === "editProfile" ? (
                  <div className={styles.editField}>
                    <select value={gender} onChange={(e) => handleGenderChange(e.target.value)} className={styles.select}>
                      <option value={genderType.MALE}>Male</option>
                      <option value={genderType.FEMALE}>Female</option>
                      <option value={genderType.OTHER}>Other</option>
                    </select>
                  </div>
                ) : null}
              </div>
              <div className={styles.detail}>
                <p>Date of Birth: {dob}</p>
                {action === "editProfile" ? (
                  <div className={styles.editField}>
                    <input
                      type='date'
                      value={newDob}
                      onChange={(e) => setNewDob(e.target.value)}
                      className={styles.input}
                    />
                    <button onClick={handleDOBChange} className={styles.saveButton}>Change DOB</button>
                  </div>
                ) : null}
              </div>
              <div className={styles.detail}>
                {action === "editProfile" ? (
                  <div className={styles.editField}>
                    <label htmlFor="access">Access:</label>
                    <select
                      id="access"
                      value={access}
                      onChange={handleAccessChange}
                      className={styles.select}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                ) : (
                  <p>Profile: {access}</p>
                )}
              </div>
              <div className={styles.detail}>
                {action === "editProfile" ? (
                  <div className={styles.editField}>
                    <form onChange={handleLocationChange}>
                      <select name="location" defaultValue={location} className={styles.select}>
                        <option value="">Select County</option>
                        {judete.map((judet, index) => (
                          <option key={index} value={judet}>{judet}</option>
                        ))}
                      </select>
                    </form>
                  </div>
                ) : (
                  <p>From: {location}</p>
                )}
              </div>
              {action === 'editProfile' && (
                <div className={styles.deleteAccountContainer}>
                  <input
                    type="email"
                    placeholder="Enter your email to delete"
                    value={emailInput}
                    onChange={handleEmailChange}
                    className={styles.input}
                  />
                  <button
                    className={emailVerified ? styles.deleteButton : styles.deleteButtonDisabled}
                    onClick={() => handleDeleteAccount()}
                    disabled={!emailVerified}
                  >
                    Delete Account
                  </button>
                </div>
              )}
              {action === 'editProfile' && (
                <div className={styles.actionButtons}>
                  <img src={saveIcon} className={styles.saveIcon} onClick={() => handleSaveChange()} />
                  <img src={UnsendFriendRequestIcon} className={styles.settingsIcon} onClick={() => handleSaveChange()} />
                </div>
              )}
            </div>
          </div>
          <PostCard.PostCard usernameParm={usernameParm} />
        </div>
      ) : defaultLoggin ? (
        <div className={styles.containerParent}>
          <Navbar />
          <div className={styles.parentOf2}>
            <div className={styles.leftContainer}>
              <div className={styles.profileDetails}>
                {imgUrl && <img className={styles.avatarProfile} src={imgUrl} alt="Profile" />}
                <h2 className={styles.username}>{currentUsernameView}</h2>
              </div>
            </div>
            <div className={styles.detailsContainer}>
              <div className={styles.detail}>
                <p>Description: {description}</p>
              </div>
              <div className={styles.detail}>
                <p>Gender: {gender}</p>
              </div>
              <div className={styles.detail}>
                <p>Date of Birth: {dob}</p>
              </div>
              <div className={styles.detail}>
                {location && <p>From: {location}</p>}
              </div>
              <div>
                <p>Profile: {access}</p>
              </div>
            </div>
          </div>
          <div className={styles.friendshipButtons}>
            {friendStatus ? (
              <>
                <div className={styles.friendOption} onClick={() => handleUnfriend()}>
                  <img src={acceptFriendIcon} alt='accept-friend' />
                  <p>Unfriend</p>
                </div>
              </>
            ) : (
              <>
                {sendedFriendRequest ? (
                  <div className={styles.friendOption} onClick={() => handleUnsentSentRequest()}>
                    <img src={UnsendFriendRequestIcon} alt='accept-friend' />
                    <p>Unsend</p>
                  </div>
                ) : (
                  <>
                    {receivedFriendRequest ? (
                      <>
                        <div className={styles.friendOption} onClick={() => handleAcceptRequest()}>
                          <img src={acceptFriendIcon} alt='accept-friend' />
                          <p>Accept</p>
                        </div>
                        <div className={styles.friendOption} onClick={() => handleIgnoreRequest()}>
                          <img src={ignoreFriendIcon} alt='ignore-friend' />
                          <p>Ignore</p>
                        </div>
                      </>
                    ) : (
                      <div className={styles.friendOption} onClick={() => handleSendRequest()}>
                        <img src={acceptFriendIcon} alt='accept-friend' />
                        <p>Add Friend</p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            <div className={styles.friendOption} onClick={() => handleAccountFriends(accountId)}>
              <img src={friendsIconProfile} alt='friends' />
              <p>Friends</p>
            </div>
            <div className={styles.friendOption} onClick={() => handleAccountGroups(accountId)}>
              <img src={groupsIconProfile} alt='groups' />
              <p>Groups</p>
            </div>
            <div className={styles.friendOption} onClick={() => handleSentMessage(accountId)}>
              <img src={messageIconProfile} alt='message' />
              <p>Send message</p>
            </div>
          </div>
          <PostCard.PostCard usernameParm={usernameParm} />
        </div>
      ) : (
        <div>
          <Navbar />
          <p>You are not logged in!</p>
        </div>
      )}
    </div>
);
  
  
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

    return response.json();
  } catch (error) {
    console.error("Error fetching friendship data:", error);
    throw error; // Aruncă eroarea mai departe pentru a fi gestionată în altă parte
  }
};

const getCommonFriendBy2AccountId = async (accountId1, accountId2) => {
  try {
    const response = await fetch(urlBase + "account/getCommonFriendBy2AccountId", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({accountId1, accountId2})
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
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

const getPostByAccountId = async (account_id) => {
  return fetch(`${urlBase}post/getAccountPost?account_id=${account_id}`, {
      method: "GET",
  }).then(response => {
      if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
      }
      return response.json();
  }).then(data => {
      return data;
  }).catch(error => {
      console.error("Error getting post:", error);
      return [];
  });
};

const handleGroupOwnership = async (group ,newCreatorId) => {
  try {
      const groupCopy = { ...group, creator_id: newCreatorId };
      const response = await fetch(urlBase + "group/editGroupCreator", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(groupCopy)
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
  } catch (error) {
      console.error("Error updating group creator:", error);
  }
};

const handleDeleteAccountById = async (accountId) => {
  try {
    const groupsCreator = await Group.getGroupByCreatorId(accountId);
    
    for(const group of groupsCreator) {

        const response = await fetch(urlBase + "group/DELETE_MEMBERSHIP", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ account_id: accountId, group_id: group.group_id })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const members = await Group.getAdminByGroupId(group.group_id);
        const admins = await Group.getMembershipsByGroupId(group.group_id);
        if(members.length == 0 && admins.length == 0) {
            const groupDeletedPost = await Group.getPostsByGroupId(group.group_id);
            await Group.deletePostByGroupId(group.group_id);
            await Group.deleteByGroupId(group.group_id);
            for(const post of groupDeletedPost) {
                await Group.deleteCommentByPostId(post.post_id);
            }
          }
          else {
            await Group.deleteCreateGroupRelationship(accountId, group.group_id);
            if (admins.length !== 0) {
                const randomAdmin = admins[Math.floor(Math.random() * admins.length)];
                await Group.deleteAdminRelationship(randomAdmin.account_id, group.group_id);
                await Group.createCreateGroupRelationship(randomAdmin.account_id, group.group_id);
                await handleGroupOwnership(group, randomAdmin.account_id);
            } else if (members.length !== 0) {
                const randomMember = members[Math.floor(Math.random() * members.length)];
                await Group.createCreateGroupRelationship(randomMember.account_id, group.group_id);
                await handleGroupOwnership(group, randomMember.account_id);
            } else {
                await Group.deleteByGroupId(group.group_id);
            }
          }
      }

      const currentUserPosts = await PostCard.getAllPostsFromDB();
      for(const post of currentUserPosts) {
        await Group.deleteCommentByPostId(post.post_id);
      }
      await Group.deletePostByAccountId(accountId);
      await deleteAllMessageByAccountId(accountId);
      await deleteProfileByAccountId(accountId);
      await deleteAccountById(accountId);
  } catch (error) {
    console.error('Error deleting join:', error);
  }
}

const deleteAllMessageByAccountId = async (account_id) => {
  try {
    const response = await fetch(urlBase + "message/deleteAllMessagesByAccountId", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(account_id)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting messages:", error);
    throw error; // Aruncă eroarea mai departe pentru a fi gestionată în altă parte
  }
};

const deleteAccountById = async (account_id) => {
  try {
    const response = await fetch(urlBase + "account/deleteAccountById", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(account_id)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error; // Aruncă eroarea mai departe pentru a fi gestionată în altă parte
  }
};

const deleteProfileByAccountId = async (account_id) => {
  try {
    const response = await fetch(urlBase + "profile/deleteProfileByAccountId", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(account_id)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting profile:", error);
    throw error; // Aruncă eroarea mai departe pentru a fi gestionată în altă parte
  }
}


export default { Profile,getPostByAccountId, deleteAccountById, handleGroupOwnership, deleteProfileByAccountId,  handleDeleteAccountById,  getCommonFriendBy2AccountId, deleteAllMessageByAccountId,  getAllFriendRequest,getFriendshipById, getFriendRequestById, FriendRequestReceivedById, getProfileById}
