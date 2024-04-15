import React, { useState, useEffect } from 'react';
import { useGlobalState } from '../state';
import Auth from '../auth/Auth';
import './PostCard.css';
import emptyHeartIcon from '../Assets/love_8647296.png'
import commentIcon from '../Assets/messenger_1370907.png'
import CommentCard from './CommentCard';
import CommentForm from '../CommentForm';

const urlBase = "http://localhost:8080/";

const PostCard = () => {
    const [posts, setPosts] = useState([]);
    const [defaultEmail] = useGlobalState("email");
    const [defaultUsername] = useGlobalState("username");
    const [error, setError] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState('')
    const [displayComments, setDisplayComment] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (defaultEmail) {
                const account_id = await Auth.getIdByEmail(defaultEmail);
                const fetchedPosts = await getAllPost(account_id);
                setAvatarUrl(await getAvatarProfileById(account_id))
                if (fetchedPosts) {
                    setPosts(fetchedPosts);
                    console.log(posts);
                } else {
                    setError('Error fetching posts');
                }
            }
        };
        fetchData();
    }, [displayComments, defaultEmail]);

    const handleCommentButton = () => {
        setDisplayComment(true);
    }
    const handleLikeButton = async (post_id) => {
        try {
            const account_id = await Auth.getIdByEmail(defaultEmail);
            const current_post = await getPost(post_id);
            let alreadyLike = current_post.likePostArray.some(id => id === account_id);
            if(alreadyLike){
                return;
            }
            const response = await fetch(`${urlBase}post/addLike`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ post_id, account_id }),
            });
    
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
    
            const updatedPosts = await getAllPost(account_id);
            setPosts(updatedPosts);
    
        } catch (error) {
            console.error("Error adding like:", error);
        }
    }

    return (
        <div>
            {posts.map((post, index) => (
                <div key={index} className="post-card">
                    <div className="top-row">
                        <div className="avatar">
                            <img src={avatarUrl} alt="Avatar" />
                        </div>
                        <div className="username">
                            <h3>{defaultUsername}</h3>
                        </div>
                    </div>
                    <div className="middle-row">
                        {post.urlImgPost && <img src={post.urlImgPost} alt="Post" />}
                    </div>
                    <div className="content-row">
                        <div className="post-content">
                            <p>{post.contentPost}</p>
                        </div>
                    </div>
                    <div className="bottom-row">
                        <div className='react-icons'>
                            <img src={emptyHeartIcon} alt='Like' onClick={() => handleLikeButton(post.post_id)}/>
                        </div>
                        <p>{post.likePostArray?post.likePostArray.length:0} people liked this post!</p>
                        <div className='react-icons'>
                            <img src={commentIcon} alt='Comment' onClick={handleCommentButton}/>
                        </div>
                    </div>
                    <div>
                        {post.post_date_created}
                    </div>
                    <CommentForm post_id={post.post_id}/>
                    {displayComments?<CommentCard post_id={post.post_id}/>:<div></div>}
                </div>
            ))}
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


export default { PostCard, getAllPost, getAvatarProfileById};
