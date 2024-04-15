import React, { useState } from 'react';
import { useGlobalState } from './state';
import Auth from './auth/Auth';
const urlBase = "http://localhost:8080/";

const CommentForm = ({post_id}) => {
    const [commentContent, setCommentContent] = useState('');
    const [defaultEmail] = useGlobalState("email");

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Verificăm dacă comentariul nu este gol
        if (!commentContent.trim()) {
            alert('Please enter a comment.');
            return;
        }
        
        const account_id = await Auth.getIdByEmail(defaultEmail);
        let currentDate = new Date();
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth() + 1; // Adăugăm 1 pentru că lunile încep de la 0
        let day = currentDate.getDate();
        let created_date = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        let comment = {account_id, post_id, content: commentContent, created_date, commentArray:[]}
        console.log(comment);

        try {
            let response = await fetch(urlBase+"comment/add",{
                method:"POST",
                headers:{"Content-Type":"application/json"}, 
                body:JSON.stringify(comment)
            });
          
              if (!response.ok) {
                throw new Error('Failed to save comment');
              }
          
              setCommentContent('');
          
              console.log('Post saved successfully');
            } catch (error) {
              console.error('Error saving comment:', error.message);
            }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Add a comment..."
                rows="3"
            ></textarea>
            <button type="submit">Post Comment</button>
        </form>
    );
};

export default CommentForm;
