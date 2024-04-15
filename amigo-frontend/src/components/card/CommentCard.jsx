import React, { useState } from 'react'
import { useGlobalState } from '../state';
import { useEffect } from 'react';
import Auth from '../auth/Auth';
import PostCard from './PostCard';
import './PostCard.css'

const urlBase = "http://localhost:8080/";

const CommentCard = ({post_id}) => {
    const [comments, setComments] = useState([]);
    const [defaultEmail] = useGlobalState("email");
    const [error, setError] = useState('');
    const [authorAvatarUrl, setAuthorAvatarUrl] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (defaultEmail) {
                const fetchedComments = await getAllComment(post_id);
                const account_id = await Auth.getIdByEmail(defaultEmail);
                setAuthorAvatarUrl(await PostCard.getAvatarProfileById(account_id));
                if (fetchedComments) {
                    setComments(fetchedComments);
                    console.log(comments);
                } else {
                    setError('Error fetching comments');
                }
            }
        };
        fetchData();
    }, [defaultEmail]);
  return (
    <div className="comment-container">
        {comments.map((comment, index) => (
            <div key={index} className="comment-card">
                <div className="avatar">
                    <img src={authorAvatarUrl} alt="Avatar" />
                </div>
                <div className="comment-content">
                    <p>{comment.content}</p>
                </div>
                <div>
                    {comment.created_date}
                </div>
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

export default CommentCard
