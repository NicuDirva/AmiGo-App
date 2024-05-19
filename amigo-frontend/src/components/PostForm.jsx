import React from 'react'
import { useState } from 'react';
import { useGlobalState } from './state/index';
import Auth from './auth/Auth'
const urlBase = "http://localhost:8080/";

const PostForm = ({group_id}) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [defaultEmail] = useGlobalState("email");
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let account_id =await Auth.getIdByEmail(defaultEmail);
        let currentDate = new Date();
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth() + 1; // Adăugăm 1 pentru că lunile încep de la 0
        let day = currentDate.getDate();
        let account_date_created = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        let post;
        if(group_id) {
          post = {account_id, group_id: group_id, urlImgPost: image, contentPost:content, post_date_created:account_date_created};
        }
        else {
          post = {account_id, group_id: -1, urlImgPost: image, contentPost:content, post_date_created:account_date_created};
        }
        console.log(post);
        try {
        let response = await fetch(urlBase+"post/add",{
            method:"POST",
            headers:{"Content-Type":"application/json"}, 
            body:JSON.stringify(post)
        });
      
          if (!response.ok) {
            throw new Error('Failed to save post');
          }

        const response2 = await fetch(`${urlBase}post/HAS_POST`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(account_id),
        });

        if (!response2.ok) {
            throw new Error(`HTTP error! status: ${response2.status}`);
        }
      
          // Resetăm valorile câmpurilor
          setTitle('');
          setContent('');
          setImage(null);
      
          // Afișăm un mesaj de succes sau redirecționăm utilizatorul
          console.log('Post saved successfully');
        } catch (error) {
          console.error('Error saving post:', error.message);
        }
      };

      const convertImgBase64 = (e) => {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
          setImage(reader.result);
        }
      }
      
  
    return (
      <div>
        <h2>Create a Post</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="image">Image:</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={convertImgBase64}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
  
  export default PostForm;
