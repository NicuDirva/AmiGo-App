import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGlobalState } from '../state';
import PostCard from '../card/PostCard';
import Profile from './Profile';
import Auth from '../auth/Auth';
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import styles from './css/GroupsAccount.module.css'
import Group from './Group';

const FriendshipsAccount = () => {
    const { accountIdParm} = useParams();
    const [searchUserAvatar, setSearchUserAvatar] = useState(null);
    const [searchUserUsername, setSearchUserUsername] = useState(null);
    const [searchAccountGroups, setSearchAccountGroups] = useState([]);
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
                const filteredGroups = await Group.getAllMemberGroupByAccountId(accountIdParm);
                const groupsWithMembershipCount = await Promise.all(filteredGroups.map(async (group) => {
                    const memberships = await Group.getMembershipsByGroupId(group.group_id);
                    return {
                      group,
                      membershipCount: memberships.length
                    };
                  }));
                setSearchAccountGroups(groupsWithMembershipCount);
            }
        } catch (error) {
            console.log("Error to fetch account friends: ", error)
        }
    }

    const handleClickContainer = (groupIdParm) => {
        navigate(`/group/${groupIdParm}`);
      }

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
                    <p className={styles.parText}>Groups</p>
                    </div>
                </div>
                {searchAccountGroups.length === 0 ? (
                    <p>No groups found.</p>
                ) : (
                    <div>
                    {searchAccountGroups.map(group => (
                        <div className={styles.searchResultItem} key={group.group.group_id}>
                        <img className={styles.avatarProfile} src={group.group.urlImg} alt='group-avatar' onClick={() => handleClickContainer(group.group.group_id)} />
                        <div>
                            <p className={styles.groupName}>{group.group.name}</p>
                            <div className={styles.groupDetails}>
                            <p className={styles.groupInfo}>Access: {group.group.access}</p>
                            <p className={styles.groupInfo}>Members: {group.membershipCount}</p>
                            </div>
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
