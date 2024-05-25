import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../state';
import Auth from '../auth/Auth';
import Group from './Group';
import Navbar from '../Navbar';
import styles from './css/GroupMemberRequest.module.css'

const GroupMemberRequest = () => {
    const { groupIdParm } = useParams();
    const [ defaultEmail] = useGlobalState("email");
    const [ loggin ] = useGlobalState("loggin")
    const [ memberRequestData, setMemberRequestData] = useState([]);
    const navigate = useNavigate();


    const fetchData = async () => {
        try {
            const currentId = await Auth.getIdByEmail(defaultEmail);
            const memberRequest = await Group.getMembershipRequestsByGroupId(groupIdParm);
            const memberRequestWithProfile = await Promise.all(memberRequest.map(async (account) => {
                const profile = await Auth.getProfileByAccountId(account.account_id);
                return {
                    account,
                    profile,
                };
            }));
            setMemberRequestData(memberRequestWithProfile);
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    useEffect(() => {
        fetchData();
    })

    const handleClickContainer = (usernameParm) => {
        navigate(`/profile/${usernameParm}`);
    };

    const handleClickDeleteRequest  = async (account_id) => {
        console.log('S a apelat delete')
        Group.handleDeleteJoinRequest(account_id, groupIdParm);
        fetchData();
    }
    const handleClickAcceptRequest  = async (account_id) => {
        console.log('S a apelat accept')
        Group.handleJoin(account_id, groupIdParm);
        Group.handleDeleteJoinRequest(account_id, groupIdParm);
        fetchData();
    }
    return (
        <div>
            {loggin ? (
                <div>
                    <Navbar />
                    <div className={styles.groupMemberRequestContainer}>
                    <h2>Members request</h2>
                    {memberRequestData.map(obj => (
                        <div className={styles.memberItem} key={obj.account.account_id}>
                            <img className={styles.avatarProfile} src={obj.profile.img_url} alt='avatar' onClick={() => handleClickContainer(obj.account.username)} />
                            <div className={styles.memberInfo}>
                                <p className={styles.username}>Username: {obj.account.username}</p>
                            </div>
                            <div className={styles.actionButtons}>
                                <button className={styles.acceptButton} onClick={() => handleClickAcceptRequest(obj.account.account_id)}>Accept request!</button>
                                <button className={styles.ignoreButton} onClick={() => handleClickDeleteRequest(obj.account.account_id)}>Delete request!</button>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            ) : (
                <div>
                    <Navbar />
                    <p>Nu esti conectat!</p>
                </div>
            )}
        </div>
    );
    
}

export default GroupMemberRequest
