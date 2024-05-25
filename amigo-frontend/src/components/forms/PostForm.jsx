import React, { useState } from 'react';
import { useGlobalState } from '../state/index';
import Auth from '../auth/Auth';
import addImageIcon from '../Assets/postIcon.png';
import PostCard from '../card/PostCard';
import { useNavigate } from 'react-router-dom';
import styles from './css/PostForm.module.css';

const urlBase = "http://localhost:8080/";

const PostForm = ({ group_id, userAvatar }) => {
  const [username, setUsername] = useState(null);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [defaultEmail] = useGlobalState("email");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let account_id = await Auth.getIdByEmail(defaultEmail);
    const currentUsername = await Auth.getUsernameById(account_id);
    setUsername(currentUsername);
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();
    let account_date_created = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    let post;
    if (group_id) {
      post = { account_id, group_id: group_id, urlImgPost: image, contentPost: content, post_date_created: account_date_created };
    } else {
      post = { account_id, group_id: -1, urlImgPost: image, contentPost: content, post_date_created: account_date_created };
    }
    console.log(post);
    try {
      let response = await fetch(urlBase + "post/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post)
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
      setContent('');
      setImage(null);

      // Afișăm un mesaj de succes sau redirecționăm utilizatorul
      console.log('Post saved successfully');
    } catch (error) {
      console.error('Error saving post:', error.message);
    }

  };

  const handleClickContainer = (usernameParm) => {
    navigate(`/profile/${usernameParm}`);
  }

  const convertImgBase64 = (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setImage(reader.result);
    }
  }

  return (
    <div className={styles.postFormContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.textareaContainer}>
          <div className={styles.avatar} onClick={() => handleClickContainer(username)}>
            <img src={userAvatar} alt="Avatar" />
          </div>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a post"
            required
          />
        </div>
        <div className={styles.iconContainer}>
            <label htmlFor="image">
                <img className={styles.imageIcon} src={addImageIcon} alt="Add Image" />
            </label>
            <input
                type="file"
                id="image"
                accept="image/*"
                onChange={convertImgBase64}
                required
            />
        </div>


          <div
            className={`${styles.submitText} ${content ? 'enabled' : ''}`}
            onClick={content ? handleSubmit : null}
          >
            Submit
          </div>

      </form>
    </div>
  );
}

export default PostForm;
