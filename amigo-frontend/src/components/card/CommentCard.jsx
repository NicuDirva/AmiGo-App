import React, { useState } from 'react'
import { useGlobalState } from '../state';
import { useEffect } from 'react';
import Auth from '../auth/Auth';
import PostCard from './PostCard';
import './PostCard.css'
import Group from '../Pages/Group';
import { useNavigate } from 'react-router-dom';

const urlBase = "http://localhost:8080/";

const CommentCard = ({post_id}) => {
    const [comments, setComments] = useState([]);
    const [defaultEmail] = useGlobalState("email");
    const [error, setError] = useState('');
    const [currentUserRoleNumber, setCurrentUserRoleNumber] = useState(0);
    const [currentUserId, setCurrentUserId] = useState('');
    const navigate = useNavigate();


    const fetchData = async () => {
        if (defaultEmail) {
            const currentId = await Auth.getIdByEmail(defaultEmail);
            setCurrentUserId(currentId);
            const fetchedComments = await getAllComment(post_id);
            const currentPost = await PostCard.getPost(post_id);
            console.log("Postarea curenta", currentPost);
            const fetchCommentsWithAvatar = [];
        
            if(currentPost.group_id != -1) {
                const creatorStatus = await Group.checkCreatorGroup(currentId, currentPost.group_id);
                const adminStatus = await Group.checkAdminGroup(currentId, currentPost.group_id); // Verificați dacă utilizatorul este admin
                
                if (creatorStatus) {
                    setCurrentUserRoleNumber(2);
                }
                if (adminStatus) {
                    setCurrentUserRoleNumber(1);
                }
                for (const element of fetchedComments) {
                    let role;
                    const isCreatorLocal = await Group.checkCreatorGroup(element.account_id, currentPost.group_id);
                    const isAdminLocal = await Group.checkAdminGroup(element.account_id, currentPost.group_id);                        
                    if (isCreatorLocal) {
                        role = 2;
                    } else {
                        if (isAdminLocal) {
                            role = 1;
                        } else {
                            role = 0;
                        }
                    }

                    const currentElemId = await PostCard.getAvatarProfileById(element.account_id);
                    const commentUsername = await Auth.getUsernameById(element.account_id);
                    fetchCommentsWithAvatar.push({ comment:element, authorAvatarUrl: currentElemId, role, commentUsername });
                }
                console.log("userul current are rolul nu nr", currentUserRoleNumber)
            }   
            else {
                for (const element of fetchedComments) {
                    const currentElemId = await PostCard.getAvatarProfileById(element.account_id);
                    const commentUsername = await Auth.getUsernameById(element.account_id);
                    fetchCommentsWithAvatar.push({ comment:element, authorAvatarUrl: currentElemId, role:0, commentUsername });
                }
            }
        
            if (fetchCommentsWithAvatar.length > 0) {
                setComments(fetchCommentsWithAvatar);
            } else {
                setError('Error fetching comments');
            }
        }
        
    };

    const handleClickContainer = (username) => {
        navigate(`/profile/${username}`);
    }
    
    
    useEffect(() => {
        fetchData();
    }, []);
  return (
    <div className="comment-container">
        {comments.map((comment, index) => (
            <div key={index} className="comment-card">
                <div className="avatar">
                    <img src={comment.authorAvatarUrl} alt="Avatar" />
                </div>
                <div>
                    <p onClick={() => handleClickContainer(comment.commentUsername)}>{comment.commentUsername}</p>
                </div>
                <div className="comment-content">
                    <p>{comment.comment.content}</p>
                </div>
                <div>
                    {comment.comment.created_date}
                </div>
                {(comment.comment.account_id === currentUserId || comment.role < currentUserRoleNumber) && (
                        <button onClick={() => {
                            Group.deleteComment(comment.comment.comment_id);
                            fetchData();
                        }}>Delete Comment</button>
                         
                    )}
            </div>
        ))}
    </div>
  )
}

const getAllComment = async (post_id) => {
    return fetch(`${urlBase}comment/getAllPostCommentById?post_id=${post_id}`, {
        method: "GET",
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        return data;
    }).catch(error => {
        console.error("Error getting comment:", error);
        return null;
    });
}

export default { CommentCard, getAllComment}
