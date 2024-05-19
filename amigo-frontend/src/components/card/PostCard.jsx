import React, { useState, useEffect } from 'react';
import { useGlobalState } from '../state';
import Auth from '../auth/Auth';
import Profile from '../Pages/Profile';
import './PostCard.css';
import { useNavigate } from 'react-router-dom';

const urlBase = "http://localhost:8080/";

const PostCard = ({usernameParm}) => {
    const [posts, setPosts] = useState([]);
    const [defaultEmail] = useGlobalState("email");
    const [defaultUsername] = useGlobalState("username");
    const [error, setError] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState('')
    const [friend, setFriend] = useState(false);
    const [ currentUserId, setCurrentUserId] = useState('')
    const navigate = useNavigate();

    const fetchData = async () => {
        if (defaultUsername == usernameParm) {
            const account_id = await Auth.getIdByEmail(defaultEmail);
            setCurrentUserId(account_id);
            const fetchedPosts = await getAllPost(account_id);
            console.log("Postarile luate din functie", fetchedPosts)
            setAvatarUrl(await getAvatarProfileById(account_id))
            setPosts(fetchedPosts);
            setFriend(true);
        }
        else {
            const searchEmail = await Auth.getEmailByUsername(usernameParm)
            const account_id = await Auth.getIdByEmail(searchEmail);
            const currentProfile = await Profile.getProfileById(account_id);
            let profilePublic = true;
            if(currentProfile.access == "private") {
                profilePublic = false;
            }
            const fetchedPosts = await getAllPost(account_id);
            const currentId = await Auth.getIdByEmail(defaultEmail);
            const friendships = await Profile.getFriendshipById(currentId);
            const isFriend = friendships.some(account => account.account_id == account_id);
            setAvatarUrl(await getAvatarProfileById(account_id))
            if (isFriend == true || profilePublic) {
                setPosts(fetchedPosts);
                setFriend(true);
                console.log("Profile is public", profilePublic)
            } else {
                setError('Error fetching posts');
            }
        }
        console.log("IN FUNCTIA POSTCARD POSTARILE SUNT", posts)
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleViewPost = (postIdParm) => {
        navigate(`/post/${postIdParm}`);
    }
    return (
        <div>
            {
            posts?posts.map((post, index) => (
                <div key={index} className="post-card" onClick={() => handleViewPost(post.post_id)}>
                    <div className="middle-row">
                        {post.urlImgPost && <img src={post.urlImgPost} alt="Post" />}
                    </div>
                    <div className="content-row">
                        <div className="post-content">
                            <p>{post.contentPost}</p>
                        </div>
                    </div>
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
