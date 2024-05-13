import React, { useEffect, useState } from 'react';
import Group from './Group';
import Auth from '../auth/Auth';
import { useGlobalState } from '../state';
import { useNavigate, useParams } from 'react-router-dom';
import GroupPostCard from '../card/GroupPostCard';
import Navbar from '../Navbar';
import { Navigate } from 'react-router-dom';

const MembershipPage = () => {
    const [memberData, setMemberData] = useState([]);
    const [defaultLoggin] = useGlobalState("loggin");
    const [defaultEmail] = useGlobalState("email");
    const [isCreatorGroup, setIsCreatorGroup] = useState(false);
    const [isAdminGroup, setIsAdminGroup] = useState(false);

    const { groupIdParm } = useParams();
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const currentId = await Auth.getIdByEmail(defaultEmail);
            const creatorStatus = await Group.checkCreatorGroup(currentId, groupIdParm);
            const adminStatus = await Group.checkAdminGroup(currentId, groupIdParm); // Verificați dacă utilizatorul este admin
            
            if (creatorStatus) {
                setIsCreatorGroup(true);
            }
            if (adminStatus) {
                setIsAdminGroup(true);
            }
            console.log("isCreator", isCreatorGroup, "isAdmin", isAdminGroup)

            const memberGroup = await Group.getMembershipsByGroupId(groupIdParm);
            const memberGroupWithProfile = await Promise.all(memberGroup.map(async (account) => {
                const profile = await Auth.getProfileByAccountId(account.account_id);
                let role;
                const isCreatorLocal = await Group.checkCreatorGroup(account.account_id, groupIdParm);
                const isAdminLocal = await Group.checkAdminGroup(account.account_id, groupIdParm);
                if (isCreatorLocal) {
                    role = "creator";
                } else {
                    if (isAdminLocal) {
                        role = "admin";
                    } else {
                        role = "member";
                    }
                }
                return {
                    account,
                    profile,
                    role
                };
            }));
            setMemberData(memberGroupWithProfile);

        } catch (error) {
            console.log("Error: ", error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // Asigurați-vă că efectul este apelat doar la încărcarea componentei

    const handleClickContainer = (usernameParm) => {
        navigate(`/profile/${usernameParm}`);
    };

    // Funcție pentru a elimina un membru
    const handleRemoveMember = async (accountId) => {
        try {
            await Group.deleteMembershipRelationship(accountId, groupIdParm);
            // Reîncărcați datele după ștergere
            fetchData();
        } catch (error) {
            console.log("Error: ", error.message);
        }
    };

    // Funcție pentru a da unui membru rol de administrator
    const handleGiveAdminRole = async (accountId) => {
        try {
            await Group.createAdminRelationship(accountId, groupIdParm);
            // Reîncărcați datele după actualizarea rolului
            fetchData();
        } catch (error) {
            console.log("Error: ", error.message);
        }
    };

    return (
        <div>
            {defaultLoggin ? (
                <div>
                    <Navbar />
                    {memberData.map(obj => (
                        <div className="member-item" key={obj.account.account_id}>
                            <img className='avatar-profile' src={obj.profile.img_url} alt='avatar' onClick={() => handleClickContainer(obj.account.username)} />
                            <div className="member-info">
                                <p>Username: {obj.account.username}</p>
                                <p>Role: {obj.role}</p>
                            </div>
                            {isCreatorGroup ? (
                                <div className="member-options">
                                    {defaultEmail !== obj.account.email && (
                                        <button onClick={() => handleRemoveMember(obj.account.account_id)}>Remove</button>
                                    )}
                                    {obj.role !== "admin" && defaultEmail !== obj.account.email && (
                                        <button onClick={() => handleGiveAdminRole(obj.account.account_id)}>Make Admin</button>
                                    )}
                                </div>
                            ) : isAdminGroup ? (
                                <div className="member-options">
                                    {defaultEmail !== obj.account.email && obj.role !== "creator" && obj.role !== "admin" && (
                                        <button onClick={() => handleRemoveMember(obj.account.account_id)}>Remove</button>
                                    )}
                                </div>
                            ) : null}


                        </div>
                    ))}
                </div>
            ) : (
                <div>You are not logged in!</div>
            )}
        </div>
    );
};

export default MembershipPage;
