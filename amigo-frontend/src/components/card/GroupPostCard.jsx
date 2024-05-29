import React, { useState, useEffect } from 'react';
import { useGlobalState } from '../state';
import Auth from '../auth/Auth';
import styles from './css/GroupPostCard.module.css';
import likeIcon from '../Assets/heart_7469375.png'
import dislikeIcon from '../Assets/broken-heart_9195088.png'
import commentIcon from '../Assets/chat_4663336.png';
import CommentCard from './CommentCard';
import CommentForm from '../forms/CommentForm';
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
    const [showLikePost, setShowLikePost] = useState('');
    const [showCommentPostId, setShowCommentPostId] = useState('');
    const [ userAvatar, setUserAvatar] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        if(defaultEmail) {
            const fetchedPosts = await Group.getPostsByGroupId(groupIdParm);
            const currentId = await Auth.getIdByEmail(defaultEmail);
            const currentAvatar = await PostCard.getAvatarProfileById(currentId);
            setUserAvatar(currentAvatar);
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
                        const post_id = post.post_id
                        const response3 = await fetch(urlBase + "place/getPlaceByPostId", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(post_id)
                        });

                        if (!response3.ok) {
                            throw new Error(`HTTP error! status: ${response3.status}`);
                        }
                        let postMentionedPlace;
                        try {
                            postMentionedPlace = await response3.json();
                        } catch (error) {
                            console.error('Error parsing JSON getPlace:', error);
                        }

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
                        fetchedPostWithIcon.push({post,like:alreadyLikeBool, likeProfile, username: currentUsername, img_url, role, postMentionedPlace})
                }
                setPosts(fetchedPostWithIcon);
        }else {
                setError('Error fetching posts');
            }
    };

    const handleCommentFetch = () => {
      fetchData();
    }

    const handleDeletePost = (post_id) => {
      Group.deletePost(post_id);
      fetchData();
    }

    useEffect(() => {
        fetchData();
    }, [displayComments, defaultEmail]);

    const handleClickContainerPlace = (placeIdParm) => {
      navigate(`/place/${placeIdParm}`);
    }

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
        <div className={styles.postContainer}>
          {posts ? posts.map((pst, index) => (
            <div key={index} className={styles.postCard}>
              <div className={styles.topRow}>
                <div className={styles.avatar}>
                  <img
                    src={pst.img_url}
                    alt="Avatar"
                    className={styles.avatarImg}
                    onClick={() => handleClickContainer(pst.username)}
                  />
                </div>
                <div className={styles.username}>
                  <h3 className={styles.usernameH3}>{pst.username}</h3>
                </div>
                {pst.postMentionedPlace ?
                    <div className={styles.mentioned}>
                        <p>Mentioned{' '}
                            <span className={`${styles.highlight} ${styles.word}`} onClick={() => handleClickContainerPlace(pst.postMentionedPlace.place_id)}>{pst.postMentionedPlace.placeName} </span> 
                            {' '}from{' '}
                            <span className={`${styles.highlight} ${styles.word}`}>{pst.postMentionedPlace.county}</span>
                        </p>
                    </div>
                    :
                    null
                }
                {(pst.post.account_id === currentUserId || pst.role < currentUserRoleNumber) && (
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeletePost(pst.post.post_id)}
                  >
                    Delete Post
                  </button>
                )}
              </div>
              <div className={styles.middleRow}>
                {pst.post.urlImgPost && <img src={pst.post.urlImgPost} alt="Post" className={styles.middleRowImg} />}
              </div>
              <div className={styles.contentRow}>
                <div className={styles.postContent}>
                  <p className={styles.postContentP}>{pst.post.contentPost}</p>
                </div>
              </div>
              <div className={styles.bottomRow}>
                <div className={styles.likeComment}>
                  <img
                    src={pst.like ? likeIcon : dislikeIcon}
                    alt="Like"
                    className={styles.likeCommentImg}
                    onClick={() => handleLikeButton(pst.post.post_id, pst.post.account_id)}
                  />
                  <p onClick={() => handleDisplayLike(pst.post.post_id)}>
                    {pst.likeProfile ? pst.likeProfile.length : 0} like
                  </p>
                </div>
                <div className={styles.likeComment}>
                  <img
                    src={commentIcon}
                    alt="Comment"
                    className={styles.likeCommentImg}
                    onClick={() => handleCommentButton(pst.post.post_id)}
                  />
                </div>
              </div>
              <div className={styles.postDate}>
                {pst.post.post_date_created}
              </div>
              {showLikesModal && pst.post.post_id === showLikePost && (
                <div className="likes-modal">
                  {pst.likeProfile.map((profile, index) => (
                    <div className={styles.searchResultItem} key={index}>
                      <img
                        src={profile.img_url}
                        alt={profile.username}
                        className={styles.avatarProfile}
                        onClick={() => handleClickContainer(profile.username)}
                      />
                      <p>{profile.username}</p>
                    </div>
                  ))}
                </div>
              )}
              <CommentForm post_id={pst.post.post_id} userAvatar={userAvatar} onComment={handleCommentFetch}/>

              {displayComments && pst.post.post_id === showCommentPostId ?
               <CommentCard.CommentCard post_id={pst.post.post_id} /> :
                <div></div>}    
            </div>
          )) : (
            <div>No posts to display!</div>
          )}
        </div>
      );
    
};


export default GroupPostCard
