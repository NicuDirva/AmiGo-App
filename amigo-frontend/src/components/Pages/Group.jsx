import React, { useEffect, useState } from 'react'
import { useGlobalState } from '../state';
import Auth from '../auth/Auth';
import Navbar from '../Navbar';
import GroupForm from '../forms/GroupForm';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from './css/GroupPage.module.css'

const urlBase = "http://localhost:8080/";

const Group = () => {
    const [groupData, setGroupData] = useState([]);
    const [defaultEmail] = useGlobalState("email");
    const navigate = useNavigate();
    const fetchData = async () => {
        try {
            const currentId = await Auth.getIdByEmail(defaultEmail);
            const groups = await getAllMemberGroupByAccountId(currentId);
            const groupsWithMembershipCount = await Promise.all(groups.map(async (group) => {
              const memberships = await getMembershipsByGroupId(group.group_id);
              return {
                group,
                membershipCount: memberships.length
              };
            }));
            setGroupData(groupsWithMembershipCount);
          } catch (error) {
            console.error("Error searching groups:", error);
            setGroupData([]);
          }
    }

    useEffect(() => {
        fetchData();
    })

    const handleClickMembers = (groupIdParm) => {
      navigate(`/member/${groupIdParm}`);
    }

    const handleClickContainerGroup = (groupIdParm) => {
        navigate(`/group/${groupIdParm}`);
      }

      return (
        <div>
          {defaultEmail ?
            <div>
              <Navbar />
              <div className={styles.content}>
                <GroupForm />
                <div>
                  <h2 className={styles.h2Text}>Your Groups</h2>
                  {groupData.length === 0 ? (
                    <p>No groups found.</p>
                  ) : (
                    <div>
                      {groupData.map(group => (
                        <div className={styles.searchResultItem} key={group.group.group_id}>
                          <img className={styles.avatarProfile} src={group.group.urlImg} alt='group-avatar' onClick={() => handleClickContainerGroup(group.group.group_id)} />
                          <div className={styles.groupInfo}>
                            <p className={styles.groupName}>{group.group.name}</p>
                            <p className={styles.groupAccess}>Access: {group.group.access}</p>
                            <p className={styles.groupMembers} onClick={() => handleClickMembers(group.group.group_id)}>Members: {group.membershipCount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            :
            <div>
              <Navbar />
              <p>You are not connected!</p>
            </div>
          }
        </div>
      );
      
}

const getGroupByCreatorId = async (creator_id) => {
  try {
      const response = await fetch(urlBase + "group/getGroupByCreatorId", {
          method: "POST", // Vom folosi POST pentru a trimite creator_id către backend
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(creator_id) // Trimiterea creator_id către backend în corpul cererii
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error("Error getting group:", error);
      return [];
  }
}

const getMembershipsByGroupId = async (group_id) => {
  try {
      const response = await fetch(urlBase + "group/getMembersByGroupId", {
          method: "POST", // Vom folosi POST pentru a trimite creator_id către backend
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(group_id) // Trimiterea creator_id către backend în corpul cererii
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error("Error getting group:", error);
      return [];
  }
}


const getAdminByGroupId = async (group_id) => {
  try {
      const response = await fetch(urlBase + "group/getAdminByGroupId", {
          method: "POST", // Vom folosi POST pentru a trimite creator_id către backend
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(group_id) // Trimiterea creator_id către backend în corpul cererii
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error("Error getting group:", error);
      return [];
  }
}
const deleteByGroupId = async (group_id) => {
  try {
      const response = await fetch(urlBase + "group/deleteByGroupId", {
          method: "POST", // Vom folosi POST pentru a trimite creator_id către backend
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(group_id) // Trimiterea creator_id către backend în corpul cererii
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
      }
  } catch (error) {
      console.error("Error getting group:", error);
  }
}

const deletePostByGroupId = async (group_id) => {
  try {
      const response = await fetch(urlBase + "post/DELETE_POST_BY_GROUP_ID", {
          method: "POST", // Vom folosi POST pentru a trimite creator_id către backend
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(group_id) // Trimiterea creator_id către backend în corpul cererii
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
      }
  } catch (error) {
      console.error("Error getting group:", error);
  }
}

const deletePostByAccountId = async (account_id) => {
  try {
      const response = await fetch(urlBase + "post/DELETE_POST_BY_ACCOUNT_ID", {
          method: "POST", // Vom folosi POST pentru a trimite creator_id către backend
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(account_id) // Trimiterea creator_id către backend în corpul cererii
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
      }
  } catch (error) {
      console.error("Error getting group:", error);
  }
}

const deleteCommentByPostId = async (post_id) => {
  try {
      const response = await fetch(urlBase + "comment/DELETE_COMMENT_BY_POST_ID", {
          method: "POST", // Vom folosi POST pentru a trimite creator_id către backend
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(post_id) // Trimiterea creator_id către backend în corpul cererii
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
      }
  } catch (error) {
      console.error("Error getting group:", error);
  }
}

const getMembershipRequestsByGroupId = async (group_id) => {
  try {
      const response = await fetch(urlBase + "group/getMembersRequestByGroupId", {
          method: "POST", // Vom folosi POST pentru a trimite creator_id către backend
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(group_id) // Trimiterea creator_id către backend în corpul cererii
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error("Error getting group:", error);
      return [];
  }
}

const getAllGroup = async () => {
    return fetch(urlBase+"group/getAll", {
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

const getAllPlaces = async () => {
  return fetch(urlBase+"place/getAll", {
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

const getGroupById = async (group_id) => {
  try {
    const groups = await getAllGroup();
    const searchGroup = groups.find(group => group.group_id == group_id);
    if (searchGroup) {
      return searchGroup;
    } else {
        throw new Error("Account not found");
    }
    } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

const getPostsByGroupId = async (group_id) => {
  return fetch(`${urlBase}post/getPostsByGroupId?group_id=${group_id}`, {
      method: "GET",
  }).then(response => {
      if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
      }
      return response.json();
  }).then(data => {
      return data;
  }).catch(error => {
      console.error("Error getting posts:", error);
      return [];
  });
};

const getAllMemberGroupByAccountId = async (account_id) => {
    try {
        const response = await fetch(urlBase + "group/getAllMemberGroupByAccountId", {
            method: "POST", // Vom folosi POST pentru a trimite creator_id către backend
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(account_id) // Trimiterea creator_id către backend în corpul cererii
        });
  
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
  
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting group:", error);
        return [];
    }
}

const checkCreatorGroup = async (account_id, group_id) => {
  try {
      const response = await fetch(urlBase + "group/checkOwnerGroupByAccountId", {
          method: "POST", // Vom folosi POST pentru a trimite creator_id către backend
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({account_id, group_id}) // Trimiterea creator_id către backend în corpul cererii
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error("Error getting group:", error);
      return [];
  }
}

const checkAdminGroup = async (account_id, group_id) => {
  try {
      const response = await fetch(urlBase + "group/checkAdminGroupByAccountId", {
          method: "POST", // Vom folosi POST pentru a trimite creator_id către backend
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({account_id, group_id}) // Trimiterea creator_id către backend în corpul cererii
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error("Error getting group:", error);
      return [];
  }
}

const createAdminRelationship = async (account_id, group_id) => {
    let response = await fetch(urlBase+"group/ADMIN",{
      method:"PATCH",
      headers:{"Content-Type":"application/json"}, 
      body:JSON.stringify({account_id, group_id})
    });
        
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
}

const deleteAdminRelationship = async (account_id, group_id) => {
  let response = await fetch(urlBase+"group/DELETE_ADMIN",{
    method:"PATCH",
    headers:{"Content-Type":"application/json"}, 
    body:JSON.stringify({account_id, group_id})
  });
      
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

const handleDeleteJoinRequest = async ( account_id, group_id) => {
  let response = await fetch(urlBase+"group/DELETE_MEMBERSHIP_REQUEST",{
    method:"PATCH",
    headers:{"Content-Type":"application/json"}, 
    body:JSON.stringify({account_id, group_id})
  });
      
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

const deleteMembershipRelationship = async (account_id, group_id) => {
  let response = await fetch(urlBase+"group/DELETE_MEMBERSHIP",{
    method:"PATCH",
    headers:{"Content-Type":"application/json"}, 
    body:JSON.stringify({account_id, group_id})
  });
      
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

const deletePost = async (post_id) => {
  let response = await fetch(urlBase+"post/DELETE_POST",{
    method:"POST",
    headers:{"Content-Type":"application/json"}, 
    body:JSON.stringify(post_id)
  });
      
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

const deleteComment = async (comment_id) => {
  let response = await fetch(urlBase+"comment/DELETE_COMMENT",{
    method:"POST",
    headers:{"Content-Type":"application/json"}, 
    body:JSON.stringify(comment_id)
  });
      
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

const handleJoin = async (account_id, group_id) => {
  let response = await fetch(urlBase+"group/MEMBERSHIP",{
    method:"PATCH",
    headers:{"Content-Type":"application/json"}, 
    body:JSON.stringify({account_id, group_id})
  });
      
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

const createCreateGroupRelationship = async (creator_id, group_id) => {
  const response2 = await fetch(`${urlBase}group/CREATE`, {
    method: "PATCH",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ creator_id, group_id}),
  });

  if (!response2.ok) {
    throw new Error(`HTTP error! status: ${response2.status}`);
  }
}

const deleteCreateGroupRelationship = async (creator_id, group_id) => {
  const response2 = await fetch(`${urlBase}group/DELETE_CREATE_GROUP_RELATIONSHIP`, {
    method: "PATCH",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ creator_id, group_id}),
  });

  if (!response2.ok) {
    throw new Error(`HTTP error! status: ${response2.status}`);
  }
}

const countPostInGroup = async (group_id) => {
  try {
      const response2 = await fetch(`${urlBase}group/countPostInGroup`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(group_id),
      });

      if (!response2.ok) {
        throw new Error(`HTTP error! status: ${response2.status}`);
      }

      const data = await response2.json();
      return data;
  } catch (error) {
      console.error("Error getting group:", error);
      return [];
  }
}

export default  { Group, countPostInGroup, deletePostByGroupId, getAllPlaces, deletePostByAccountId, deleteCommentByPostId, getMembershipRequestsByGroupId, deleteCreateGroupRelationship, createCreateGroupRelationship, deleteByGroupId, getAdminByGroupId, handleJoin, handleDeleteJoinRequest, deletePost, deleteComment, createAdminRelationship, deleteAdminRelationship, deleteMembershipRelationship, getAllGroup, checkAdminGroup, checkCreatorGroup, getGroupByCreatorId, getMembershipsByGroupId, getGroupById, getPostsByGroupId, getAllMemberGroupByAccountId } 
