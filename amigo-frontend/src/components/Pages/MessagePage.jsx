import React, { useState, useEffect } from 'react';
import Auth from '../auth/Auth';
import { useGlobalState } from '../state';
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import MessageCard from '../card/MessageCard';
import PostCard from '../card/PostCard'; // Assuming this is where getAvatarProfileById is located
import styles from './css/MessagePage.module.css'

const urlBase = "http://localhost:8080/";

const MessagePage = () => {
  const [defaultEmail] = useGlobalState("email");
  const [messages, setMessages] = useState([]);
  const [userConversations, setUserConversations] = useState([]);
  const navigate = useNavigate();
  const [currentId, setCurrentId] = useState('');
  const [currentUsername, setCurrentUsername] = useState(null);
  const [currentAvatar, setCurrentAvatar] = useState(null);
  const [selectedTab, setSelectedTab] = useState('friends');

  const fetchData = async () => {
    const currentAccountId = await Auth.getIdByEmail(defaultEmail);
    setCurrentId(currentAccountId);
    const username = await Auth.getUsernameById(currentAccountId);
    setCurrentUsername(username);
    const avatar = await PostCard.getAvatarProfileById(currentAccountId);
    setCurrentAvatar(avatar);
    const sentMessages = await MessageCard.getSentMessageById(currentAccountId);
    const receivedMessages = await MessageCard.getReceivedMessageById(currentAccountId);
    const allMessages = [...sentMessages, ...receivedMessages];
    allMessages.sort((a, b) => new Date(a.timeSent) - new Date(b.timeSent));

    const userMessagesMap = new Map();

    // Group messages by user
    for (const message of allMessages) {
      const userId = message.sender_id === currentAccountId ? message.receiver_id : message.sender_id;
      if (!userMessagesMap.has(userId)) {
        userMessagesMap.set(userId, []);
      }
      userMessagesMap.get(userId).push(message);
    }

    const userConversationsData = [];
    for (const [userId, userMessages] of userMessagesMap.entries()) {
      userMessages.sort((a, b) => new Date(b.timeSent) - new Date(a.timeSent)); // Sort by latest message
      const latestMessage = userMessages[0];
      const username = await Auth.getUsernameById(userId);
      const avatarUrl = await PostCard.getAvatarProfileById(userId);
      userConversationsData.push({ userId, username, avatarUrl, latestMessage });
    }

    // Sort conversations by the time of the latest message
    userConversationsData.sort((a, b) => new Date(b.latestMessage.timeSent) - new Date(a.latestMessage.timeSent));

    setUserConversations(userConversationsData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClickContainer = (userId) => {
    navigate(`/message/${userId}`);
  };

  const handleClickContainerImg = (usernameParm) => {
    navigate(`/profile/${usernameParm}`);
  };

  return (
    <div>
      {defaultEmail ? (
        <div>
          <Navbar />
          <div className={styles.profileContainer}>
            <img src={currentAvatar} alt="avatar" className={styles.profileAvatar} onClick={() => handleClickContainerImg(currentUsername)}/>
            <div>
              <h2>{currentUsername}</h2>
              <p className={styles.parText}>Your conversations</p>
            </div>
          </div>
          <div className={styles.conversationsContainer}>
            {userConversations.map(conversation => (
              <div
                key={conversation.userId}
                className={styles.conversation}
                onClick={() => handleClickContainer(conversation.userId)}
              >
                <img src={conversation.avatarUrl} alt="avatar" className={styles.conversationAvatar} onClick={() => handleClickContainerImg(conversation.username)}/>
                <div className={styles.conversationInfo}>
                  <span>{conversation.username}</span>
                  <p>{conversation.latestMessage.content}</p>
                  <p>{new Date(conversation.latestMessage.timeSent).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <Navbar/>
          <p>You are not connected!</p>
        </div>
      )}
    </div>
  );
};

export default MessagePage;
