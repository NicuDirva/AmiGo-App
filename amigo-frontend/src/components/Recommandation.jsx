import React, { useState, useEffect } from 'react';
import Auth from './auth/Auth';
import Profile from './Pages/Profile';
import { useGlobalState } from './state';
import { useNavigate } from 'react-router-dom';
import './css/Recommandation.css';

const urlBase = "http://localhost:8080/";

const Recommandation = () => {
    const [memberRecommand, setMemberRecommand] = useState([]);
    const [defaultEmail] = useGlobalState("email");
    const [accountIdParm, setAccountIdParm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const currentId = await Auth.getIdByEmail(defaultEmail);
        setAccountIdParm(currentId);

        const accounts = await Auth.getAllAccount();
        const currentProfile = await Profile.getProfileById(currentId);
        const currentAccountFriendships = await Profile.getFriendshipById(currentId);
        const currentAccountSentRequest = await Profile.getFriendRequestById(currentId);
        const friendRequestReceived = await Profile.FriendRequestReceivedById(currentId);
        const seenAccountIds = new Set();

        const accountsWithProfile = [];
        for (const member of accounts) {
            const isFriendship = checkIfIdIsInArray(member.account_id, currentAccountFriendships);
            const isSentRequestAlready = checkIfIdIsInArray(member.account_id, currentAccountSentRequest);
            const profile = await Profile.getProfileById(member.account_id);
            const dfAge = areDatesWithinFiveYears(profile.dob, currentProfile.dob);
            if ((dfAge || (profile.location === currentProfile.location && profile.location !== "No location selected"))
                && !isFriendship && !isSentRequestAlready && !seenAccountIds.has(member.account_id) && member.account_id !== currentId) {
                seenAccountIds.add(member.account_id);
                const receiveRequest = checkIfIdIsInArray(member.account_id, friendRequestReceived);
                const obj = {
                    account_id: profile.account_id,
                    avatar: profile.img_url,
                    username: member.username,
                    friendRequestReceive: receiveRequest,
                };
                accountsWithProfile.push(obj);
            }
        }

        const commonMembers = await getCommonMembersGroupByAccountId(currentId);

        for (const member of commonMembers) {
            const isFriendship = checkIfIdIsInArray(member.account_id, currentAccountFriendships);
            const isSentRequestAlready = checkIfIdIsInArray(member.account_id, currentAccountSentRequest);
            const profile = await Profile.getProfileById(member.account_id);
            if (!isFriendship && !isSentRequestAlready && !seenAccountIds.has(member.account_id) && member.account_id !== currentId) {
                seenAccountIds.add(member.account_id);
                const receiveRequest = checkIfIdIsInArray(member.account_id, friendRequestReceived);
                const obj = {
                    account_id: profile.account_id,
                    avatar: profile.img_url,
                    username: member.username,
                    friendRequestReceive: receiveRequest,
                };
                accountsWithProfile.push(obj);
                console.log(obj);
            }
        }

        // Shuffle the array and select up to 5 random accounts
        const shuffledAccounts = shuffleArray(accountsWithProfile);
        const selectedAccounts = shuffledAccounts.slice(0, 5);

        setMemberRecommand(selectedAccounts);
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const areDatesWithinFiveYears = (dob1, dob2) => {
        const date1 = new Date(dob1);
        const date2 = new Date(dob2);

        const yearDiff = Math.abs(date1.getFullYear() - date2.getFullYear());

        if (yearDiff > 5) {
            return false;
        } else if (yearDiff < 5) {
            return true;
        } else {
            const month1 = date1.getMonth();
            const month2 = date2.getMonth();

            if (month1 < month2) {
                return true;
            } else if (month1 > month2) {
                return false;
            } else {
                const day1 = date1.getDate();
                const day2 = date2.getDate();
                return day1 <= day2;
            }
        }
    };

    const checkIfIdIsInArray = (account_id, array) => {
        for (const elem of array) {
            if (elem.account_id == account_id) {
                return true;
            }
        }
        return false;
    };

    const handleClickContainer = (usernameParm) => {
        navigate(`/profile/${usernameParm}`);
    }

    return (
        <div>
            {defaultEmail ? (
                <div className="recommendation-container">
                    <div className='MaybeYouKnowContainer'>
                        <h2 className="recommendation-title">Maybe you know</h2>
                    </div>
                    {memberRecommand ? memberRecommand.map(member => (
                        <div key={member.account_id} className="recommendation-item">
                            <img src={member.avatar} alt={member.username} onClick={() => handleClickContainer(member.username)} />
                            <h3>{member.username}</h3>
                            <div className="action-buttons">
                                {member.friendRequestReceive ? (
                                    <>
                                        <div className="action-button" onClick={() => { handleAcceptRequest(member.account_id, accountIdParm); fetchData() }}>Accept</div>
                                        <div className="action-button" onClick={() => { handleIgnoreRequest(member.account_id, accountIdParm); fetchData() }}>Ignore</div>
                                    </>
                                ) : (
                                    <div className="action-button" onClick={() => { handleSendRequest(accountIdParm, member.account_id); fetchData() }}>Send Friend Request</div>
                                )}
                            </div>
                        </div>
                    )) : null}
                </div>
            ) : (
                <div>Nu esti conectat</div>
            )}
        </div>
    );
};

const handleSendRequest = async (senderId, receiverId) => {
    let response2 = await fetch(urlBase + "account/SEND_REQUEST", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId, receiverId })
    });

    if (!response2.ok) {
        throw new Error(`HTTP error! status: ${response2.status}`);
    }
};

const handleIgnoreRequest = async (senderId, receiverId) => {
    let response2 = await fetch(urlBase + "account/DELETE_SEND_REQUEST", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId, receiverId })
    });

    if (!response2.ok) {
        throw new Error(`HTTP error! status: ${response2.status}`);
    }
}

const handleAcceptRequest = async (senderId, receiverId) => {
    let response3 = await fetch(urlBase + "account/FRIENDSHIP", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId, receiverId })
    });

    if (!response3.ok) {
        throw new Error(`HTTP error! status: ${response3.status}`);
    }

    let response4 = await fetch(urlBase + "account/DELETE_SEND_REQUEST", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId, receiverId })
    });

    if (!response4.ok) {
        throw new Error(`HTTP error! status: ${response4.status}`);
    }
};

const getCommonMembersGroupByAccountId = async (account_id) => {
    try {
        const response = await fetch(urlBase + "group/getCommonMembersGroupByAccountId", {
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
        throw error;
    }
}

export default { Recommandation, getCommonMembersGroupByAccountId }
