import React, { useState } from 'react';
import { useGlobalState } from '../state';
import Auth from '../auth/Auth';
import styles from './css/CommentForm.module.css';

const urlBase = "http://localhost:8080/";

const CommentForm = ({ post_id, userAvatar, onComment }) => {
    const [commentContent, setCommentContent] = useState('');
    const [defaultEmail] = useGlobalState("email");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!commentContent.trim()) {
            alert('Please enter a comment.');
            return;
        }

        const account_id = await Auth.getIdByEmail(defaultEmail);
        let currentDate = new Date();
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth() + 1;
        let day = currentDate.getDate();
        let created_date = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        let comment = { account_id, post_id, content: commentContent, created_date, commentArray: [] };
        console.log(comment);

        try {
            let response = await fetch(urlBase + "comment/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(comment)
            });

            if (!response.ok) {
                throw new Error('Failed to save comment');
            }

            const response2 = await fetch(`${urlBase}comment/HAS_COMMENT`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(post_id),
            });

            if (!response2.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const response3 = await fetch(`${urlBase}comment/HAS_POST`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(account_id),
            });

            if (!response3.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setCommentContent('');

            console.log('Comment saved successfully');
        } catch (error) {
            console.error('Error saving comment:', error.message);
        }
        onComment();
    };

    return (
        <div className={styles.commentFormContainer}>
          <div className={styles.avatar}>
            <img src={userAvatar} alt="Avatar" />
          </div>
          <form onSubmit={handleSubmit}>
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Add a comment..."
              rows="3"
              className={styles.textarea}
            ></textarea>
            <div
              className={`${styles.submitText} ${commentContent.trim() ? styles.enabled : ''}`}
              onClick={commentContent.trim() ? handleSubmit : null}
            >
              Post Comment
            </div>
          </form>
        </div>
      );
};

export default CommentForm;
