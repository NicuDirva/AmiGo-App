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
import { useParams } from 'react-router-dom';
import PostCard from './PostCard';
import Navbar from '../Navbar';

const urlBase = "http://localhost:8080/";

const SinglePostCard = () => {
    const [defaultEmail] = useGlobalState("email");
    const [defaultUsername] = useGlobalState("username");
    const [error, setError] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState('')
    const [usernameSearch, setUsernameSearch] = useState('')
    const [displayComments, setDisplayComment] = useState(false);
    const [friend, setFriend] = useState(false);
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [showLikePost, setShowLikePost] = useState('');
    const [showCommentPostId, setShowCommentPostId] = useState('');
    const [ currentUserId, setCurrentUserId] = useState('')
    const navigate = useNavigate();
    const { postIdParm} = useParams();
    const [currentPost, setCurrentPost] = useState(null);
    const [currentPostWithData, setCurrentPostWithData] = useState(null);

    const fetchData = async () => {
        const crtPost = await PostCard.getPost(postIdParm);
        setCurrentPost(crtPost);
        console.log("IN FUNCTIA SINGLEPOST AVEM ID UL", postIdParm)
        console.log("IN FUNCTIA SINGLEPOST AVEM POST UL", crtPost)
        if (defaultUsername == crtPost.account_id) {
            const account_id = await Auth.getIdByEmail(defaultEmail);
            setCurrentUserId(account_id);
            setAvatarUrl(await PostCard.getAvatarProfileById(account_id))
            setUsernameSearch(await Profile.getUsernameById(account_id))
            let alreadyLike = await fetch(urlBase+"account/CHECK_LIKE_POST",{
                method:"PATCH",
                headers:{"Content-Type":"application/json"}, 
                body:JSON.stringify({post_id:crtPost.post_id, account_id:account_id})
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
                body:JSON.stringify(crtPost.post_id)
            });
                
            if (!likePostArray.ok) {
                throw new Error(`HTTP error! status: ${likePostArray.status}`);
            }
            let likeProfile = []
            const likePostId = await likePostArray.json();
            const likeArray = likePostId;
            console.log("LikeArray in fetchData PostCard", likeArray);  

            for(const id of likeArray) {
                const username = await Auth.getUsernameById(id);
                const img_url = await PostCard.getAvatarProfileById(id);
                likeProfile.push({username, img_url});
            }
            setCurrentPostWithData({crtPost,like:alreadyLikeBool, likeProfile})
            setFriend(true);
        }
        else {
            const account_id = crtPost.account_id;
            const currentProfile = await Profile.getProfileById(account_id);
            let profilePublic = true;
            if(currentProfile.access == "private") {
                profilePublic = false;
                console.log("s a setat profilul la private")
            }
            const currentId = await Auth.getIdByEmail(defaultEmail);
            const friendships = await Profile.getFriendshipById(currentId);
            const isFriend = friendships.some(account => account.account_id == account_id);
            setAvatarUrl(await PostCard.getAvatarProfileById(account_id))
            setUsernameSearch(await Auth.getUsernameById(account_id))
            if (isFriend == true || profilePublic) {
                let alreadyLike = await fetch(urlBase+"account/CHECK_LIKE_POST",{
                    method:"PATCH",
                    headers:{"Content-Type":"application/json"}, 
                    body:JSON.stringify({post_id:crtPost.post_id, account_id:account_id})
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
                    body:JSON.stringify(crtPost.post_id)
                });
                    
                if (!likePostArray.ok) {
                    throw new Error(`HTTP error! status: ${likePostArray.status}`);
                }
                let likeProfile = []
                const likePostId = await likePostArray.json();
                const likeArray = likePostId;
                console.log("LikeArray in fetchData PostCard", likeArray);  
    
                for(const id of likeArray) {
                    const username = await Auth.getUsernameById(id);
                    const img_url = await PostCard.getAvatarProfileById(id);
                    likeProfile.push({username, img_url});
                }
                setCurrentPostWithData({crtPost,like:alreadyLikeBool, likeProfile})
                setFriend(true);
                console.log("Profile is public", profilePublic)
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const handleCommentButton = (post_id) => {
        if(!displayComments) {
            setShowCommentPostId(post_id);
            setDisplayComment(true);
        }
        else {
            setShowCommentPostId('');
            setDisplayComment(false);
        }
    }
    const handleDisplayLike = (post_id) => {
        if(!showLikesModal) {
            setShowLikesModal(true);
            setShowLikePost(post_id);
        }
        else {
            setShowLikesModal(false);
            setShowLikePost('');
        }
    }

    const handleClickContainer = (usernameParm) => {
        navigate(`/profile/${usernameParm}`);
      }
    const handleLikeButton = async (post_id, authorId) => {
        try {
            const account_id = await Auth.getIdByEmail(defaultEmail);
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
            <Navbar/>
            {
            currentPostWithData?
                <div key={currentPostWithData.crtPost.post_id} className="post-card">
                    <div className="top-row">
                        <div className="avatar">
                            <img src={avatarUrl} alt="Avatar" onClick={() => handleClickContainer(usernameSearch)}/>
                        </div>
                        <div className="username">
                            <h3>{usernameSearch}</h3>
                        </div>
                    </div>
                    <div className="middle-row">
                        {currentPostWithData.crtPost.urlImgPost && <img src={currentPostWithData.crtPost.urlImgPost} alt="Post" />}
                    </div>
                    <div className="content-row">
                        <div className="post-content">
                            <p>{currentPostWithData.crtPost.contentPost}</p>
                        </div>
                    </div>
                    <div className="bottom-row">
                        <div className='react-icons'>
                            {
                                currentPostWithData.like?
                                <img src={likeIcon} alt='Like' onClick={() => handleLikeButton(currentPostWithData.crtPost.post_id, currentPostWithData.crtPost.account_id)}/>
                                :
                                <img src={dislikeIcon} alt='Like' onClick={() => handleLikeButton(currentPostWithData.crtPost.post_id, currentPostWithData.crtPost.account_id)}/>
                            }
                        </div>
                        <p onClick={() => handleDisplayLike(currentPostWithData.crtPost.post_id)}>{currentPostWithData.likeProfile ? currentPostWithData.likeProfile.length : 0} like</p>
                        <div className='react-icons'>
                            <img src={commentIcon} alt='Comment' onClick={() => handleCommentButton(currentPostWithData.crtPost.post_id)}/>
                        </div>
                    </div>
                    <div>
                        {currentPostWithData.crtPost.post_date_created}
                    </div>
                    {
                    showLikesModal && currentPostWithData.crtPost.post_id === showLikePost && (
                        <div className="likes-modal">
                            {currentPostWithData.likeProfile.map((profile, index) => {
                                    return (
                                        <div className='search-result-item' key={index}>
                                            <img className='avatar-profile' src={profile.img_url} alt={profile.username} onClick={() => handleClickContainer(profile.username)}/>
                                            <p>{profile.username}</p>
                                        </div>
                                    ); 
                            })}
                        </div>
                    )
                    }
                    <CommentForm post_id={currentPostWithData.crtPost.post_id}/>
                    {displayComments && currentPostWithData.crtPost.post_id === showCommentPostId?<CommentCard.CommentCard post_id={currentPostWithData.crtPost.post_id}/>:<div></div>}
                    {(currentPostWithData.crtPost.account_id === currentUserId) && (
                        <button onClick={() => {
                            Group.deletePost(currentPostWithData.crtPost.post_id);
                            fetchData();
                        }}>Delete Post</button>
                         
                    )}
                </div>
            :
                friend?
                    <div>
                        <Navbar/>
                        No posts to display
                    </div>
                :
                    <div>
                        <Navbar/>
                        This profile is private
                    </div>
            }
        </div>
    );
};

export default SinglePostCard;
