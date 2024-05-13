import React, { useState } from 'react'
import { useEffect } from 'react';
import { useGlobalState } from '../state';
import { useNavigate } from 'react-router-dom';
import Profile from '../Pages/Profile';
import Auth from '../auth/Auth';
import PostCard from './PostCard';
import './PostCard.css'
import likeIcon from '../Assets/heart_7469375.png'
import commentIcon from '../Assets/chat_4663336.png'
import CommentCard from './CommentCard';
import CommentForm from '../CommentForm';
import dislikeIcon from '../Assets/broken-heart_9195088.png'
import Group from '../Pages/Group';

const urlBase = "http://localhost:8080/";

const PostCardHome = () => {
    const [posts, setPosts] = useState([]);
    const [defaultEmail] = useGlobalState("email");
    const [defaultUsername] = useGlobalState("username");
    const [error, setError] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState('')
    const [displayComments, setDisplayComment] = useState(false);
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [ currentUserId, setCurrentUserId] = useState('')
    const navigate = useNavigate();

    const fetchData = async () => {
        if (defaultUsername) {
            const account_id = await Auth.getIdByEmail(defaultEmail);
            setCurrentUserId(account_id);
            const friends = await Profile.getFriendshipById(account_id);
            console.log("Prieteni::::::", friends);
            let fetchedPostWithIcon = []
            for(const account of friends) {
                const img_url = await PostCard.getAvatarProfileById(account.account_id);
                const currentUsername = await Auth.getUsernameById(account.account_id);
                const currentFriendPosts = await PostCard.getAllPost(account.account_id);
                console.log("Postarile unui prieten", currentFriendPosts)
                for (const post of currentFriendPosts) {
                    if(post.group_id == -1) {   
                        let alreadyLike = await fetch(urlBase+"account/CHECK_LIKE_POST",{
                            method:"PATCH",
                            headers:{"Content-Type":"application/json"}, 
                            body:JSON.stringify({post_id:post.post_id, account_id:account_id})
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
                        fetchedPostWithIcon.push({post,like:alreadyLikeBool, likeProfile, img_url, username: currentUsername})
                    }
                }
            }
                console.log("Postarii::::::", fetchedPostWithIcon);
                setPosts(fetchedPostWithIcon);
            } else {
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
                    {(pst.post.account_id === currentUserId) && (
                        <button onClick={() => {
                            Group.deletePost(pst.post.post_id);
                            fetchData();
                        }}>Delete Post</button>
                         
                    )}
                </div>
            )):
            <div>You are not connected!</div>}
        </div>
    );
}

export default PostCardHome
