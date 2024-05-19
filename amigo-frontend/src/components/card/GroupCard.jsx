import React, { useEffect, useState } from 'react'
import './GroupCard.css'
import Group from '../Pages/Group';
import Auth from '../auth/Auth';
import GroupForm from '../GroupForm';
import GroupPostCard from './GroupPostCard';
import { useGlobalState } from '../state';
import Navbar from '../Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import PostForm from '../PostForm';
import { Navigate } from 'react-router-dom';
import Profile from '../Pages/Profile';

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
    const [action, setAction] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupImage, setNewGroupImage] = useState('');
    const [newGroupAccess, setNewGroupAccess] = useState('');
    const [memberGroup, setMemberGroup] = useState(null);
    const [adminGroup, setAdminGroup] = useState(null);
    const [ membershipCount, setMembershipCount] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        const currentGroup = await Group.getGroupById(groupIdParm);
        setMemberGroup(await Group.getMembershipsByGroupId(groupIdParm));
        setAdminGroup(await Group.getAdminByGroupId(groupIdParm));
        setGroup(currentGroup);
        const memberships = await Group.getMembershipsByGroupId(groupIdParm);
        setMembershipCount(memberships.length);
        const currentId = await Auth.getIdByEmail(defaultEmail);
        if(currentGroup.access == "private") {
            setGroupAccess("private");
        }
        else
        { 
            setGroupAccess("public");
        }
        let is_member = await fetch(urlBase+"group/checkMembershipByAccountId",{
          method:"POST",
          headers:{"Content-Type":"application/json"}, 
          body:JSON.stringify({account_id: currentId, group_id: groupIdParm})
        });
            
        if (!is_member.ok) {
          throw new Error(`HTTP error! status: ${is_member.status}`);
        }
        const is_member_json = await is_member.json(); // Parsați răspunsul JSON
        let isMemberBool;
        if(is_member_json == 0) {
          isMemberBool = false;
        }
        else {
          isMemberBool = true;
        }
        setIsGroupMember(isMemberBool);
        if(isGroupMember == false) {
            let sentRequestAlready = await fetch(urlBase+"group/checkRequestJoinByAccountId",{
                method:"POST",
                headers:{"Content-Type":"application/json"}, 
                body:JSON.stringify({account_id: currentId, group_id: groupIdParm})
                });
                    
            if (!sentRequestAlready.ok) {
            throw new Error(`HTTP error! status: ${sentRequestAlready.status}`);
            }
            const sentRequestAlreadyJson = await sentRequestAlready.json(); // Parsați răspunsul JSON
            let sentRequestAlreadyBool;
            if(sentRequestAlreadyJson == 0) {
                sentRequestAlreadyBool = false;
            }
            else {
                sentRequestAlreadyBool = true;
            }
            setSentRequest(sentRequestAlreadyBool);
        }
        let is_owner = await fetch(urlBase+"group/checkOwnerGroupByAccountId",{
            method:"POST",
            headers:{"Content-Type":"application/json"}, 
            body:JSON.stringify({account_id: currentId, group_id: groupIdParm})
          });
              
          if (!is_owner.ok) {
            throw new Error(`HTTP error! status: ${is_owner.status}`);
          }
          const is_owner_json = await is_owner.json(); // Parsați răspunsul JSON
          let isOwnerBool;
          if(is_owner_json == 0) {
            isOwnerBool = false;
          }
          else {
            isOwnerBool = true;
          }
          setIsOwner(isOwnerBool);

          let is_admin = await fetch(urlBase+"group/checkAdminGroupByAccountId",{
            method:"POST",
            headers:{"Content-Type":"application/json"}, 
            body:JSON.stringify({account_id: currentId, group_id: groupIdParm})
          });
              
          if (!is_admin.ok) {
            throw new Error(`HTTP error! status: ${is_admin.status}`);
          }
          const is_admin_json = await is_admin.json(); // Parsați răspunsul JSON
          let isAdminBool;
          if(is_admin_json == 0) {
            isAdminBool = false;
          }
          else {
            isAdminBool = true;
          }
          setIsAdmin(isAdminBool);
  
    }

    const convertImgBase64 = (e) => {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setNewGroupImage(reader.result);
      }
    }

    const handleJoin = async () => {
        const currentId = await Auth.getIdByEmail(defaultEmail);
        let response = await fetch(urlBase+"group/MEMBERSHIP",{
          method:"PATCH",
          headers:{"Content-Type":"application/json"}, 
          body:JSON.stringify({account_id: currentId, group_id: groupIdParm})
        });
            
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    }

    const handleJoinRequest = async () => {
        const currentId = await Auth.getIdByEmail(defaultEmail);
    
        let response = await fetch(urlBase+"group/MEMBERSHIP_REQUEST",{
          method:"PATCH",
          headers:{"Content-Type":"application/json"}, 
          body:JSON.stringify({account_id: currentId, group_id: groupIdParm})
        });
            
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const handleDeleteJoin = async () => {
        const currentId = await Auth.getIdByEmail(defaultEmail);
        let response = await fetch(urlBase+"group/DELETE_MEMBERSHIP",{
          method:"PATCH",
          headers:{"Content-Type":"application/json"}, 
          body:JSON.stringify({account_id: currentId, group_id: groupIdParm})
        });
            
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (isOwner) {
          await Group.deleteCreateGroupRelationship(currentId, groupIdParm);
          if (adminGroup.length !== 0) {
              console.log("Alege un admin random")
              // Select a random admin to be the new creator
              const randomAdmin = adminGroup[Math.floor(Math.random() * adminGroup.length)];
              await Group.deleteAdminRelationship(randomAdmin.account_id, groupIdParm);
              await Group.createCreateGroupRelationship(randomAdmin.account_id, groupIdParm);
              await handleGroupOwnership(randomAdmin.account_id);
              fetchData();
          } else if (memberGroup.length !== 0) {
            console.log("Alege un membru random")
              // Select a random member to be the new creator
              const randomMember = memberGroup[Math.floor(Math.random() * memberGroup.length)];
              await Group.createCreateGroupRelationship(randomMember.account_id, groupIdParm);
              await handleGroupOwnership(randomMember.account_id);
              fetchData();
          } else {
              await Group.deleteByGroupId(groupIdParm);
              navigate(`/group`);
          }
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
        const currentId = await Auth.getIdByEmail(defaultEmail);
    
        let response = await fetch(urlBase+"group/DELETE_MEMBERSHIP_REQUEST",{
          method:"PATCH",
          headers:{"Content-Type":"application/json"}, 
          body:JSON.stringify({account_id: currentId, group_id: groupIdParm})
        });
            
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
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

    const handleSaveChanges = async () => {
        setEditMode(false);
        if (defaultEmail) { 
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

          const response = await fetch(urlBase+"group/editGroup",{
            method:"POST",
            headers:{"Content-Type":"application/json"}, 
            body:JSON.stringify(group)
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        fetchData();
    }

    useEffect(() => {
        fetchData();
    });
  return (
    <div>
    <Navbar />
    {group && (
        <div className="group-info">
            <img className="group-image" src={group.urlImg} alt={group.name} />
            <h2 className="group-name">{group.name}</h2>


            {isOwner && (
                <button className="edit-group-button" onClick={handleEditGroup}>
                    {editMode ? 'Cancel' : 'Edit Group'}
                </button>
            )}
            {editMode && isOwner && (
                <div className="edit-group-fields">
                    <input
                        type="text"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="New Group Name"
                    />
                    <br/>
                    <div>
                    <label htmlFor="image">New image group:</label>
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
                    <br/>
                    <button onClick={handleSaveChanges}>Save Changes</button>
                </div>
            )}


            <div className="button-container">
                {isGroupMember ? (
                    isOwner ?
                        <button className="group-button" onClick={handleDeleteJoin}>
                            You are the owner!If you leave someone else will be the new owner!You want to exit?
                        </button>
                    :
                        <button className="group-button" onClick={handleDeleteJoin}>
                        Joined!You want to exit?
                </button>
                ): sentRequest ? (
                    <button className="group-button" onClick={handleDeleteJoinRequest}>
                        Join request sent!You want to cancell?
                    </button>
                ) : groupAccess === "public"?(
                    <button className="group-button" onClick={handleJoin}>
                        Join!
                    </button>
                ):
                    <button className="group-button" onClick={handleJoinRequest}>
                    Sent join request!
                    </button>
                }
            </div>
            {
              groupAccess === "public"?
              <p onClick={() => handleGroupMember(group.group_id)}>{membershipCount} members</p>
              :
              <p>{membershipCount} members</p>
            }
    
            {(isOwner || isAdmin) && (
                <p onClick={() => handleGroupMemberRequest(groupIdParm)}>Member request</p>
            )}
            {
              isOwner || isAdmin || isGroupMember?
                <PostForm group_id={groupIdParm} />
              :
              null
            }
            <GroupPostCard groupIdParm={groupIdParm} />
        </div>
    )}
</div>
  )
}

export default GroupCard
