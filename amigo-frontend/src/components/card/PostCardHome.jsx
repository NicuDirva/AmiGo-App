import React, { useState, useEffect } from 'react'
import { useGlobalState } from '../state';
import { useNavigate } from 'react-router-dom';
import Profile from '../Pages/Profile';
import Auth from '../auth/Auth';
import PostCard from './PostCard';
import likeIcon from '../Assets/heart_7469375.png';
import commentIcon from '../Assets/chat_4663336.png';
import CommentCard from './CommentCard';
import CommentForm from '../forms/CommentForm';
import dislikeIcon from '../Assets/broken-heart_9195088.png';
import styles from './css/GroupPostCard.module.css'

const urlBase = "http://localhost:8080/";

const PostCardHome = () => {
    const [posts, setPosts] = useState([]);
    const [defaultEmail] = useGlobalState("email");
    const [defaultUsername] = useGlobalState("username");
    const [error, setError] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [displayComments, setDisplayComment] = useState(false);
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [currentUserId, setCurrentUserId] = useState('');
    const [showLikePost, setShowLikePost] = useState('');
    const [showCommentPostId, setShowCommentPostId] = useState('');
    const [firstRandom, setFirstRandom] = useState(true);
    const [ userAvatar, setUserAvatar] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        if (defaultUsername) {
            const account_id = await Auth.getIdByEmail(defaultEmail);
            const currentAvatar = await PostCard.getAvatarProfileById(account_id);
            setUserAvatar(currentAvatar);
            setCurrentUserId(account_id);
            const friends = await Profile.getFriendshipById(account_id);
            let fetchedPostWithIcon = []
            for (const account of friends) {
                const img_url = await PostCard.getAvatarProfileById(account.account_id);
                const currentUsername = await Auth.getUsernameById(account.account_id);
                const currentFriendPosts = await PostCard.getAllPost(account.account_id);
                console.log("Postarile unui prieten", currentFriendPosts)
                for (const post of currentFriendPosts) {
                    if (post.group_id === -1) {
                        let alreadyLike = await fetch(urlBase + "account/CHECK_LIKE_POST", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ post_id: post.post_id, account_id: account_id })
                        });

                        if (!alreadyLike.ok) {
                            throw new Error(`HTTP error! status: ${alreadyLike.status}`);
                        }
                        const alreadyLikeResponse = await alreadyLike.json(); // Parsați răspunsul JSON
                        let alreadyLikeBool = alreadyLikeResponse !== 0;

                        let likePostArray = await fetch(urlBase + "account/getLikeAccount", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(post.post_id)
                        });

                        if (!likePostArray.ok) {
                            throw new Error(`HTTP error! status: ${likePostArray.status}`);
                        }
                        let likeProfile = [];
                        const likePostId = await likePostArray.json();
                        const likeArray = likePostId;
                        for (const id of likeArray) {
                            const username = await Auth.getUsernameById(id);
                            const img_url = await PostCard.getAvatarProfileById(id);
                            likeProfile.push({ username, img_url });
                        }
                        fetchedPostWithIcon.push({ post, like: alreadyLikeBool, likeProfile, img_url, username: currentUsername });
                    }
                }
            }
            
            // Amestecăm postările doar la prima randare
            if (firstRandom) {
                fetchedPostWithIcon.sort(() => Math.random() - 0.5);
                setFirstRandom(false);
                setPosts(fetchedPostWithIcon);
            } else {
                // Actualizăm postările păstrând ordinea
                const updatedPosts = posts.map(oldPost => {
                    const updatedPost = fetchedPostWithIcon.find(newPost => newPost.post.post_id === oldPost.post.post_id);
                    return updatedPost ? updatedPost : oldPost;
                });
                setPosts(updatedPosts);
            }
        } else {
            setError('Error fetching posts');
        }
    };

    useEffect(() => {
        fetchData();
    }, [defaultEmail]);

    const handleCommentButton = (post_id) => {
        if (!displayComments) {
            setShowCommentPostId(post_id);
            setDisplayComment(true);
        } else {
            setShowCommentPostId('');
            setDisplayComment(false);
        }
    }

    const handleDisplayLike = (post_id) => {
        if (!showLikesModal) {
            setShowLikesModal(true);
            setShowLikePost(post_id);
        } else {
            setShowLikesModal(false);
            setShowLikePost('');
        }
    }

    const handleClickContainer = (usernameParm) => {
        navigate(`/profile/${usernameParm}`);
    }

    const handleCommentFetch = () => {
        fetchData();
      }

    const handleLikeButton = async (post_id, authorId) => {
        try {
            const account_id = await Auth.getIdByEmail(defaultEmail);
            console.log("In Like function avem account_id", account_id, "si post_id", post_id)
            let alreadyLike = await fetch(urlBase + "account/CHECK_LIKE_POST", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ post_id, account_id })
            });

            if (!alreadyLike.ok) {
                throw new Error(`HTTP error! status: ${alreadyLike.status}`);
            }
            const alreadyLikeResponse = await alreadyLike.json();
            let alreadyLikeBool = alreadyLikeResponse !== 0;

            if (alreadyLikeBool) {
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
            } else {

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
                            <img src={pst.img_url} alt="Avatar" className={styles.avatarImg} onClick={() => handleClickContainer(pst.username)} />
                        </div>
                            <div className={styles.username}>
                                <h3 className={styles.usernameH3}>{pst.username}</h3>
                            </div>
                    </div>
                    <div className={styles.middleRow}>
                        {pst.post.urlImgPost && <img src={pst.post.urlImgPost} className={styles.middleRowImg} alt="Post" />}
                    </div>
                    <div className={styles.contentRow}>
                        <div className={styles.postContent}>
                            <p className={styles.postContentP}>{pst.post.contentPost}</p>
                        </div>
                    </div>
                    <div className={styles.bottomRow}>
                        <div className={styles.likeComment}>
                            <img className={styles.likeCommentImg} src={pst.like ? likeIcon : dislikeIcon} alt='Like' onClick={() => handleLikeButton(pst.post.post_id, pst.post.account_id)} />
                            <p onClick={() => handleDisplayLike(pst.post.post_id)}>{pst.likeProfile ? pst.likeProfile.length : 0} like</p>
                        </div>
                        <div className={styles.likeComment}>
                            <img className={styles.likeCommentImg} src={commentIcon} alt='Comment' onClick={() => handleCommentButton(pst.post.post_id)} />
                        </div>
                    </div>
                    <div>
                    <p className={styles.postDate}>{pst.post.post_date_created}</p>
                    </div>
                    {
                        showLikesModal && pst.post.post_id === showLikePost && (
                            <div className="likes-modal">
                                {pst.likeProfile.map((profile, index) => {
                                    return (
                                        <div className={styles.searchResultItem} key={index}>
                                            <img className={styles.avatarProfile} src={profile.img_url} alt={profile.username} onClick={() => handleClickContainer(profile.username)} />
                                            <p>{profile.username}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    }
                    <CommentForm post_id={pst.post.post_id} userAvatar={userAvatar} onComment={handleCommentFetch}/>
                    {displayComments && pst.post.post_id === showCommentPostId ? <CommentCard.CommentCard post_id={pst.post.post_id} /> : <div></div>}
                </div>
            )) :
                <div>You are not connected!</div>}
        </div>
    );
}

export default PostCardHome;
