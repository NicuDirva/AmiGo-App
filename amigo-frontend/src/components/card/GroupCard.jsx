import React, { useEffect, useState, useCallback } from 'react';
import Group from '../Pages/Group';
import Auth from '../auth/Auth';
import GroupPostCard from './GroupPostCard';
import { useGlobalState } from '../state';
import Navbar from '../Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import PostForm from '../forms/PostForm';
import PostCard from './PostCard';
import styles from './css/GroupCard.module.css'
import membersGroupIcon from '../Assets/group_members.png'
import membersRequestGroupIcon from '../Assets/members_request.png'
import editGroupIcon from '../Assets/edit_group.png'
import newGroupImg from '../Assets/groupIcon.png';
import exitGroupIcon from '../Assets/exit_group.png'
import joinGroupIcon from '../Assets/join.png'

const urlBase = "http://localhost:8080/";

const GroupCard = () => {
    const [defaultEmail] = useGlobalState("email");
    const [error, setError] = useState(null);
    const [group, setGroup] = useState(null);
    const [isGroupMember, setIsGroupMember] = useState(false);
    const [sentRequest, setSentRequest] = useState(false);
    const { groupIdParm } = useParams();
    const [groupAccess, setGroupAccess] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupImage, setNewGroupImage] = useState('');
    const [newGroupAccess, setNewGroupAccess] = useState('');
    const [memberGroup, setMemberGroup] = useState(null);
    const [adminGroup, setAdminGroup] = useState(null);
    const [membershipCount, setMembershipCount] = useState(null);
    const [userAvatar, setUserAvatar] = useState(null);
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        try {
            const currentGroup = await Group.getGroupById(groupIdParm);
            const memberships = await Group.getMembershipsByGroupId(groupIdParm);
            const admins = await Group.getAdminByGroupId(groupIdParm);
            const currentId = await Auth.getIdByEmail(defaultEmail);
            const avatar = await PostCard.getAvatarProfileById(currentId);

            setGroup(currentGroup);
            setMemberGroup(memberships);
            setAdminGroup(admins);
            setMembershipCount(memberships.length);
            setUserAvatar(avatar);
            setGroupAccess(currentGroup.access);

            const is_member_response = await fetch(urlBase + "group/checkMembershipByAccountId", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ account_id: currentId, group_id: groupIdParm })
            });
            const is_member_json = await is_member_response.json();
            setIsGroupMember(is_member_json !== 0);

            if (!is_member_json) {
                const sentRequest_response = await fetch(urlBase + "group/checkRequestJoinByAccountId", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ account_id: currentId, group_id: groupIdParm })
                });
                const sentRequest_json = await sentRequest_response.json();
                setSentRequest(sentRequest_json !== 0);
            }

            const is_owner_response = await fetch(urlBase + "group/checkOwnerGroupByAccountId", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ account_id: currentId, group_id: groupIdParm })
            });
            const is_owner_json = await is_owner_response.json();
            setIsOwner(is_owner_json !== 0);

            const is_admin_response = await fetch(urlBase + "group/checkAdminGroupByAccountId", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ account_id: currentId, group_id: groupIdParm })
            });
            const is_admin_json = await is_admin_response.json();
            setIsAdmin(is_admin_json !== 0);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [groupIdParm, defaultEmail]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const convertImgBase64 = (e) => {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setNewGroupImage(reader.result);
        }
    }

    const handleJoin = async () => {
        try {
            const currentId = await Auth.getIdByEmail(defaultEmail);
            const response = await fetch(urlBase + "group/MEMBERSHIP", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ account_id: currentId, group_id: groupIdParm })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            fetchData();
        } catch (error) {
            console.error('Error joining group:', error);
        }
    }

    const handleJoinRequest = async () => {
        try {
            const currentId = await Auth.getIdByEmail(defaultEmail);
            const response = await fetch(urlBase + "group/MEMBERSHIP_REQUEST", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ account_id: currentId, group_id: groupIdParm })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            fetchData();
        } catch (error) {
            console.error('Error requesting to join group:', error);
        }
    }

    const handleDeleteJoin = async () => {
        try {
            const currentId = await Auth.getIdByEmail(defaultEmail);
            const response = await fetch(urlBase + "group/DELETE_MEMBERSHIP", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ account_id: currentId, group_id: groupIdParm })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (isOwner) {
                const members = await Group.getAdminByGroupId(groupIdParm);
                const admins = await Group.getMembershipsByGroupId(groupIdParm);
                console.log("Membrii:", members);
                console.log("Admins:", admins);
                if(!members.length && !admins.length) {
                    const groupDeletedPost = await Group.getPostsByGroupId(groupIdParm);
                    await Group.deletePostByGroupId(groupIdParm);
                    await Group.deleteByGroupId(groupIdParm);
                    console.log("Postari sterse", groupDeletedPost);
                    for(const post of groupDeletedPost) {
                        await Group.deleteCommentByPostId(post.post_id);
                    }
                    console.log("GRUP STERSSSSSSSSSS!");
                }
                else {
                    await Group.deleteCreateGroupRelationship(currentId, groupIdParm);
                    if (adminGroup.length !== 0) {
                        const randomAdmin = adminGroup[Math.floor(Math.random() * adminGroup.length)];
                        await Group.deleteAdminRelationship(randomAdmin.account_id, groupIdParm);
                        await Group.createCreateGroupRelationship(randomAdmin.account_id, groupIdParm);
                        await handleGroupOwnership(randomAdmin.account_id);
                    } else if (memberGroup.length !== 0) {
                        const randomMember = memberGroup[Math.floor(Math.random() * memberGroup.length)];
                        await Group.createCreateGroupRelationship(randomMember.account_id, groupIdParm);
                        await handleGroupOwnership(randomMember.account_id);
                    } else {
                        await Group.deleteByGroupId(groupIdParm);
                    }
                }
                navigate(`/group`);
            }
            fetchData();
        } catch (error) {
            console.error('Error deleting join:', error);
        }
    }

    const handleGroupOwnership = async (newCreatorId) => {
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

    const handleDeleteJoinRequest = async () => {
        try {
            const currentId = await Auth.getIdByEmail(defaultEmail);
            const response = await fetch(urlBase + "group/DELETE_MEMBERSHIP_REQUEST", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ account_id: currentId, group_id: groupIdParm })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            fetchData();
        } catch (error) {
            console.error('Error deleting join request:', error);
        }
    }

    const handleGroupMember = (groupIdParm) => {
        navigate(`/member/${groupIdParm}`);
    }

    const handleGroupMemberRequest = (groupIdParm) => {
        navigate(`/groupMemberRequest/${groupIdParm}`);
    }

    const handleEditGroup = () => {
        setEditMode(!editMode); // Toggle editMode
    }

    const handleOnComment = () => {
        fetchData();
    }

    const handleCancelSave = () => {
        setEditMode(false);
        setNewGroupAccess(groupAccess);
        setNewGroupImage('');
        setNewGroupName('');
        fetchData();
    }
    const handleSaveChanges = async () => {
        setEditMode(false);
        try {
            const group = await Group.getGroupById(groupIdParm);
            if (newGroupName) {
                group.name = newGroupName;
            }
            if (newGroupAccess) {
                group.access = newGroupAccess;
            }
            if (newGroupImage) {
                group.urlImg = newGroupImage;
            }

            const response = await fetch(urlBase + "group/editGroup", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(group)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setNewGroupAccess(groupAccess);
            setNewGroupImage('');
            setNewGroupName('');
            fetchData();
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    }

    return (
        <div>
            {defaultEmail?
                <div>
                    <Navbar />
                    {group && (
                        <div className={styles.groupInfo}>
                            <img className={styles.groupImage} src={group.urlImg} alt={group.name} />
                            <div className={styles.groupContainer}>
                                <div className={styles.groupName}>
                                    <h1>{group.name}</h1>
                                </div>
                            </div>
            
                            <div className={styles.buttonContainer}>
                                {(groupAccess === 'public' || isGroupMember) && (
                                    <div>
                                        <img className={styles.iconImage} onClick={() => handleGroupMember(group.group_id)} src={membersGroupIcon} alt="Members" />
                                        <p>{membershipCount} members</p>
                                    </div>
                                )}
                                {(isOwner || isAdmin) && groupAccess === 'private' && (
                                    <div>
                                        <img className={styles.iconImage} onClick={() => handleGroupMemberRequest(groupIdParm)} src={membersRequestGroupIcon} alt="Member Requests" />
                                        <p>Requested members</p>
                                    </div>
                                )}
                                {isOwner && (
                                    <div className={styles.editGroupButton}>
                                        <img onClick={handleEditGroup} className={styles.iconImage} src={editGroupIcon} alt="Edit Group" />
                                        <p>{editMode ? 'Cancel' : 'Edit Group'}</p>
                                    </div>
                                )}

                                <div className={styles.joinButtonContainer}>
                                {isGroupMember ? (
                                    isOwner ? (
                                        <div className={styles.exitGroupButton} onClick={handleDeleteJoin}>
                                            <img className={styles.exitIcon} src={exitGroupIcon} alt="Exit Group" />
                                            <p>You are the owner! Leave the group?</p>
                                        </div>
                                    ) : (
                                        <div className={styles.exitGroupButton} onClick={handleDeleteJoin}>
                                            <img className={styles.exitIcon} src={exitGroupIcon} alt="Exit Group" />
                                            <p>Joined! Leave the group?</p>
                                        </div>
                                    )
                                ) : sentRequest ? (
                                    <button className={`${styles.groupButton} ${styles.exitButton}`} onClick={handleDeleteJoinRequest}>
                                        Join request sent! Do you want to cancel?
                                    </button>
                                ) : groupAccess === "public" ? (
                                    <div className={styles.joinGroupButton} onClick={handleJoin}>
                                        <img className={styles.joinIcon} src={joinGroupIcon} alt="Join Group" />
                                        <p>Join!</p>
                                    </div>
                                ) : (
                                    <div className={styles.joinGroupButton} onClick={handleJoinRequest}>
                                        <img className={styles.joinIcon} src={joinGroupIcon} alt="Join Request" />
                                        <p>Join request!</p>
                                    </div>
                                    
                                )}
                                </div>
                            </div>
            
                            {editMode && isOwner && (
                                <div className={styles.editGroupFields}>
                                    <input
                                        type="text"
                                        value={newGroupName}
                                        onChange={(e) => setNewGroupName(e.target.value)}
                                        placeholder="New Group Name"
                                    />
                                    <br />
                                    <div className={styles.ChangeImgGroup}>
                                        <label htmlFor="image">
                                            <img className={styles.newImageIcon} src={newGroupImg} alt="New Group" />
                                        </label>
                                        <input
                                            type="file"
                                            id="image"
                                            accept="image/*"
                                            onChange={convertImgBase64}
                                            required
                                        />
                                    </div>
                                    <select
                                        value={newGroupAccess}
                                        onChange={(e) => setNewGroupAccess(e.target.value)}
                                    >
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                    </select>
                                    <br />
                                    <button className={styles.saveButton} onClick={() => handleSaveChanges()}>Save Changes</button>
                                    <button className={styles.saveButton} onClick={() => handleCancelSave()}>Cancel</button>
                                </div>
                            )}
            
                            
                            {(isOwner || isAdmin || isGroupMember) && (
                                <div>
                                    <PostForm group_id={groupIdParm} userAvatar={userAvatar}/>
                                    <GroupPostCard groupIdParm={groupIdParm}/>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                :
                <div>
                    <Navbar/>
                    <p>Nu esti conectat la cont</p>
                </div>
            }
        </div>
    );
    
}    

export default GroupCard;
