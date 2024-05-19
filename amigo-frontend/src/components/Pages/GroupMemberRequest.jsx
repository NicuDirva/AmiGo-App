import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../state';
import Auth from '../auth/Auth';
import Group from './Group';
import Navbar from '../Navbar';

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
        {loggin? (
            <div>
            <Navbar/>
            {memberRequestData.map(obj => (
                <div className="member-item" key={obj.account.account_id}>
                    <img className='avatar-profile' src={obj.profile.img_url} alt='avatar' onClick={() => handleClickContainer(obj.account.username)} />
                    <div className="member-info">
                        <p>Username: {obj.account.username}</p>
                    </div>
                    <p onClick={() => handleClickAcceptRequest(obj.account.account_id)}>Accept request!</p>
                    <p onClick={() => handleClickDeleteRequest(obj.account.account_id)}>Delete request!</p>
                </div>
            ))}
            </div>
        )
            :
            <div>
                <Navbar/>
                Nu esti conectat!
            </div>

        }
    </div>
  )
}

export default GroupMemberRequest
