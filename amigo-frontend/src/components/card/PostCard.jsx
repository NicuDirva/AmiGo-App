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

const urlBase = "http://localhost:8080/";

const PostCard = ({usernameParm}) => {
    const [posts, setPosts] = useState([]);
    const [defaultEmail] = useGlobalState("email");
    const [defaultUsername] = useGlobalState("username");
    const [error, setError] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState('')
    const [displayComments, setDisplayComment] = useState(false);
    const [friend, setFriend] = useState(false);
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [ currentUserId, setCurrentUserId] = useState('')
    const navigate = useNavigate();

    const fetchData = async () => {
        if (defaultUsername == usernameParm) {
            const account_id = await Auth.getIdByEmail(defaultEmail);
            setCurrentUserId(account_id);
            const fetchedPosts = await getAllPost(account_id);
            setAvatarUrl(await getAvatarProfileById(account_id))
            if (fetchedPosts) {
                let fetchedPostWithIcon = []
                for (const post of fetchedPosts) {   
                    if(post.group_id == -1) {    
                        console.log("Post_id:", post.post_id);

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
                        console.log("LikeArray in fetchData PostCard", likeArray);  

                        for(const id of likeArray) {
                            const username = await Auth.getUsernameById(id);
                            const img_url = await getAvatarProfileById(id);
                            likeProfile.push({username, img_url});
                        }
                        fetchedPostWithIcon.push({post,like:alreadyLikeBool, likeProfile})
                    }
                }
                setPosts(fetchedPostWithIcon);
            } else {
                setError('Error fetching posts');
            }
            setFriend(true);
        }
        else {
            const searchEmail = await Auth.getEmailByUsername(usernameParm)
            const account_id = await Auth.getIdByEmail(searchEmail);
            const currentProfile = await Profile.getProfileById(account_id);
            let profilePublic;
            console.log("Profilul de cautat access", currentProfile)
            if(currentProfile.access == "private") {
                profilePublic = false;
                console.log("s a setat profilul la private")
            }
            const fetchedPosts = await getAllPost(account_id);
            const currentId = await Auth.getIdByEmail(defaultEmail);
            console.log("In PostCard currentId = ", currentId)
            const friendships = await Profile.getFriendshipById(currentId);
            const isFriend = friendships.some(account => account.account_id == account_id);
            setAvatarUrl(await getAvatarProfileById(account_id))
            if (isFriend == true || profilePublic) {
                let fetchedPostWithIcon = []
                for (const post of fetchedPosts) {    
                    if(post.group_id == -1) {          
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
                            const img_url = await getAvatarProfileById(id);
                            likeProfile.push({username, img_url});
                        }
                        fetchedPostWithIcon.push({post,like:alreadyLikeBool, likeProfile})
                    }
                }
                setPosts(fetchedPostWithIcon);
                setFriend(true);
                console.log("Profile is public", profilePublic)
            } else {
                setError('Error fetching posts');
            }
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
            {
            posts?posts.map((pst, index) => (
                <div key={index} className="post-card">
                    <div className="top-row">
                        <div className="avatar">
                            <img src={avatarUrl} alt="Avatar" />
                        </div>
                        <div className="username">
                            <h3>{usernameParm}</h3>
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
                friend?
                    <div>No posts to display</div>
                :
                    <div>This profile is private</div>
            }
        </div>
    );
};

const getAllPost = async (account_id) => {
    return fetch(`${urlBase}post/getAccountPost?account_id=${account_id}`, {
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

const getPost = async (post_id) => {
    return fetch(`${urlBase}post/getPost?post_id=${post_id}`, {
        method: "GET",
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        return data;
    }).catch(error => {
        console.error("Error getting post:", error);
        return [];
    });
};

const getAvatarProfileById = async (account_id) => {
    return fetch(`${urlBase}profile/getAvatarById?account_id=${account_id}`, {
        method: "GET",
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.text(); // Returnăm răspunsul ca text, nu JSON
    }).then(data => {
        return data; // Returnăm direct URL-ul imaginii
    }).catch(error => {
        console.error("Error getting avatar:", error);
        return null;
    });
}


export default { PostCard, getAllPost, getAvatarProfileById, getPost};
