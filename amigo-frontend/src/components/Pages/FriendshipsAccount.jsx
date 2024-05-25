import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGlobalState } from '../state';
import PostCard from '../card/PostCard';
import Profile from './Profile';
import Auth from '../auth/Auth';
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import styles from './css/FriendshipsAccount.module.css'

const FriendshipsAccount = () => {
    const { accountIdParm} = useParams();
    const [searchUserAvatar, setSearchUserAvatar] = useState(null);
    const [searchUserUsername, setSearchUserUsername] = useState(null);
    const [searchAccountFriends, setSearchAccountFriends] = useState([]);
    const [defaultEmail] = useGlobalState("email");
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            if(defaultEmail) {
                console.log("ID user cautat", accountIdParm)
                const avatar = await PostCard.getAvatarProfileById(accountIdParm);
                const username = await Auth.getUsernameById(accountIdParm);
                setSearchUserUsername(username);
                setSearchUserAvatar(avatar);
                const searchAccountFriends = await Profile.getFriendshipById(accountIdParm);

                const currentId = await Auth.getIdByEmail(defaultEmail);
                const currentUserFriend = await Profile.getFriendshipById(currentId);

                const accountWithProfile = await Promise.all(searchAccountFriends.map(async (account) => {
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
            setSearchAccountFriends(accountWithProfile);

            }
        } catch (error) {
            console.log("Error to fetch account friends: ", error)
        }
    }

    const handleClickContainer = (usernameParm) => {
        navigate(`/profile/${usernameParm}`);
    };

    useEffect(() => {
        fetchData();
    })

  return (
    <div>
        {defaultEmail?
            <div>
            <Navbar/>
            <div className='containerParent'>
                <div className={styles.profileContainer}>
                    <img src={searchUserAvatar} alt="avatar" className={styles.profileAvatar} onClick={() => handleClickContainer(searchUserUsername)}/>
                    <div>
                    <h2>{searchUserUsername}</h2>
                    <p className={styles.parText}>Friends</p>
                    </div>
                </div>
                {searchAccountFriends.length === 0 ? (
                    <p>No friends found.</p>
                ) : (
                    <div>
                    {searchAccountFriends.map(account => (
                        <div className={styles.searchResultItem} key={account.account.account_id}>
                            <img className={styles.avatarProfile} src={account.profile.img_url} alt='avatar' onClick={() => handleClickContainer(account.account.username)} />
                            <div>
                                <p className={styles.username}>{account.account.username}</p>
                                <p className={styles.mutualFriends}>Mutual friends: {account.commonFriend === 0 ? 0 : account.commonFriend}</p>
                            </div>
                        </div>
                    ))}
                    </div>
                )}
                </div>
            </div>
        :
        <div>
            <Navbar/>
            You are not connected!
        </div>
        
        }
    </div>
  )
}

export default FriendshipsAccount
