import React, { useState, useEffect } from 'react';
import { useGlobalState } from '../state';
import Auth from '../auth/Auth';
import Profile from '../Pages/Profile';
import './PostCard.css';
import likeIcon from '../Assets/heart_7469375.png'
import dislikeIcon from '../Assets/broken-heart_9195088.png'
import commentIcon from '../Assets/messenger_1370907.png'
import CommentCard from './CommentCard';
import CommentForm from '../CommentForm';
import { useNavigate } from 'react-router-dom';
import Group from '../Pages/Group';
import PostCard from './PostCard';

const urlBase = "http://localhost:8080/";

const GroupPostCard = ({groupIdParm}) => {
    const [posts, setPosts] = useState([]);
    const [defaultEmail] = useGlobalState("email");
    const [defaultUsername] = useGlobalState("username");
    const [error, setError] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [displayComments, setDisplayComment] = useState(false);
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [currentUserRoleNumber, setCurrentUserRoleNumber] = useState(0);
    const [currentUserId, setCurrentUserId] = useState('');
    const navigate = useNavigate();

    const fetchData = async () => {
        if(defaultEmail) {
            const fetchedPosts = await Group.getPostsByGroupId(groupIdParm);
            const currentId = await Auth.getIdByEmail(defaultEmail);
            setCurrentUserId(currentId);
            const creatorStatus = await Group.checkCreatorGroup(currentId, groupIdParm);
            const adminStatus = await Group.checkAdminGroup(currentId, groupIdParm); // Verificați dacă utilizatorul este admin
            
            if (creatorStatus) {
                setCurrentUserRoleNumber(2);
            }
            if (adminStatus) {
                setCurrentUserRoleNumber(1);
            }
                let fetchedPostWithIcon = []
                for (const post of fetchedPosts) {
                        const currentUsername = await Auth.getUsernameById(post.account_id);
                        const img_url = await PostCard.getAvatarProfileById(post.account_id);           
                        let alreadyLike = await fetch(urlBase+"account/CHECK_LIKE_POST",{
                            method:"PATCH",
                            headers:{"Content-Type":"application/json"}, 
                            body:JSON.stringify({post_id:post.post_id, account_id:currentId})
                        });
                            
                        if (!alreadyLike.ok) {
                            throw new Error(`HTTP error! status: ${alreadyLike.status}`);
                        }
                        const alreadyLikeResponse = await alreadyLike.json(); // Parsați răspunsul JSON
                        let alreadyLikeBool
                        if( alreadyLikeResponse == 0) {
                            alreadyLikeBool = false;
                        }
                        else {
                            alreadyLikeBool = true;
                        }
                        let likePostArray = await fetch(urlBase+"account/getLikeAccount",{
                            method:"PATCH",
                            headers:{"Content-Type":"application/json"}, 
                            body:JSON.stringify(post.post_id)
                        });
                            
                        if (!likePostArray.ok) {
                            throw new Error(`HTTP error! status: ${likePostArray.status}`);
                        }
                        let likeProfile = []
                        const likePostId = await likePostArray.json();
                        const likeArray = likePostId;
                        for(const id of likeArray) {
                            const username = await Auth.getUsernameById(id);
                            const img_url = await PostCard.getAvatarProfileById(id);
                            likeProfile.push({username, img_url});
                        }
                        let role;
                        const isCreatorLocal = await Group.checkCreatorGroup(post.account_id, groupIdParm);
                        const isAdminLocal = await Group.checkAdminGroup(post.account_id, groupIdParm);
                        if (isCreatorLocal) {
                            role = 2;
                        } else {
                            if (isAdminLocal) {
                                role = 1;
                            } else {
                                role = 0;
                            }
                        }
                        fetchedPostWithIcon.push({post,like:alreadyLikeBool, likeProfile, username: currentUsername, img_url, role})
                }
                setPosts(fetchedPostWithIcon);
        }else {
                setError('Error fetching posts');
            }
    
    };

    useEffect(() => {
        fetchData();
    }, [displayComments, defaultEmail]);


    const handleCommentButton = () => {
        if(!displayComments) {
            setDisplayComment(true);
        }
        else {
            setDisplayComment(false);
        }
    }
    const handleDisplayLike = () => {
        setShowLikesModal(true);
    }

    const handleClickContainer = (usernameParm) => {
        navigate(`/profile/${usernameParm}`);
      }
    const handleLikeButton = async (post_id, authorId) => {
        try {
            const account_id = await Auth.getIdByEmail(defaultEmail);
            console.log("In Like function avem account_id", account_id,"si post_id", post_id)
            let alreadyLike = await fetch(urlBase+"account/CHECK_LIKE_POST",{
                method:"PATCH",
                headers:{"Content-Type":"application/json"}, 
                body:JSON.stringify({post_id, account_id})
              });
                  
              if (!alreadyLike.ok) {
                throw new Error(`HTTP error! status: ${alreadyLike.status}`);
              }
              const alreadyLikeResponse = await alreadyLike.json();
              let alreadyLikeBool
              if( alreadyLikeResponse == 0) {
                alreadyLikeBool = false;
              }
              else {
                alreadyLikeBool = true;
              }
            if( alreadyLikeBool){
                const response = await fetch(`${urlBase}account/DELETE_LIKE`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ post_id, account_id }),
                });
        
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                console.log("Deja e dat like")
            }
            else {
            
            const response = await fetch(`${urlBase}account/LIKE_POST`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ post_id, authorId: account_id }),
            });
    
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            console.log("Nu a dat like")
            }
            fetchData();
        } catch (error) {
            console.error("Error adding like:", error);
        }
    }

    return (
        <div>
            {posts?posts.map((pst, index) => (
                <div key={index} className="post-card">
                    <div className="top-row">
                        <div className="avatar">
                            <img src={pst.img_url} alt="Avatar" />
                        </div>
                        <div className="username">
                            <h3>{pst.username}</h3>
                        </div>
                    </div>
                    <div className="middle-row">
                        {pst.post.urlImgPost && <img src={pst.post.urlImgPost} alt="Post" />}
                    </div>
                    <div className="content-row">
                        <div className="post-content">
                            <p>{pst.post.contentPost}</p>
                        </div>
                    </div>
                    <div className="bottom-row">
                        <div className='react-icons'>
                            {
                                pst.like?
                                <img src={likeIcon} alt='Like' onClick={() => handleLikeButton(pst.post.post_id, pst.post.account_id)}/>
                                :
                                <img src={dislikeIcon} alt='Like' onClick={() => handleLikeButton(pst.post.post_id, pst.post.account_id)}/>
                            }
                        </div>
                        <p onClick={handleDisplayLike}>{pst.likeProfile?pst.likeProfile.length:0} like</p>
                        <div className='react-icons'>
                            <img src={commentIcon} alt='Comment' onClick={handleCommentButton}/>
                        </div>
                    </div>
                    <div>
                        {pst.post.post_date_created}
                    </div>
                    {
                    showLikesModal && (
                    <div className="likes-modal">
                        <h2>Likes</h2>
                            {pst.likeProfile.map((profile, index) => (
                                    <div className='search-result-item'>
                                        <img className='avatar-profile' src={profile.img_url} alt={profile.username} onClick={() => handleClickContainer(profile.username)}/>
                                        <p>{profile.username}</p>
                                    </div>
                            ))}
                        <button onClick={() => setShowLikesModal(false)}>Close</button>
                    </div>)
                    }
                    <CommentForm post_id={pst.post.post_id}/>
                    {displayComments?<CommentCard post_id={pst.post.post_id}/>:<div></div>}
                    {(pst.post.account_id === currentUserId || pst.role < currentUserRoleNumber) && (
                        <button onClick={() => {
                            Group.deletePost(pst.post.post_id);
                            fetchData();
                        }}>Delete Post</button>
                         
                    )}
                </div>
            )):
            <div>No posts to display!</div>}
        </div>
    );
};


export default GroupPostCard
