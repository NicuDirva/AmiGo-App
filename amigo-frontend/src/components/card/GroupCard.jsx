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
    const navigate = useNavigate();

    const fetchData = async () => {
        const currentGroup = await Group.getGroupById(groupIdParm);
        setGroup(currentGroup);
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
    }

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
            <p onClick={() => handleGroupMember(group.group_id)}>See members</p>
            <PostForm group_id={groupIdParm} />
            <GroupPostCard groupIdParm={groupIdParm} />
        </div>
    )}
</div>
  )
}

export default GroupCard
