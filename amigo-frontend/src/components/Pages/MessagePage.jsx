import React, { useState, useEffect } from 'react';
import Auth from '../auth/Auth';
import { useGlobalState } from '../state';
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import MessageCard from '../card/MessageCard';
import PostCard from '../card/PostCard'; // Assuming this is where getAvatarProfileById is located
import './MessagePage.css'

const urlBase = "http://localhost:8080/";

const MessagePage = () => {
  const [defaultEmail] = useGlobalState("email");
  const [messages, setMessages] = useState([]);
  const [userConversations, setUserConversations] = useState([]);
  const navigate = useNavigate();
  const [currentId, setCurrentId] = useState('');

  const fetchData = async () => {
    const currentAccountId = await Auth.getIdByEmail(defaultEmail);
    setCurrentId(currentAccountId);
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

    setUserConversations(userConversationsData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClickContainer = (userId) => {
    navigate(`/message/${userId}`);
  };

  return (
    <div>
      {
        defaultEmail ?
          <div>
            <Navbar />
            <div className="conversations-container">
              {userConversations.map(conversation => (
                <div key={conversation.userId} className="conversation" onClick={() => handleClickContainer(conversation.userId)}>
                  <img src={conversation.avatarUrl} alt="avatar" />
                  <div className="conversation-info">
                    <span>{conversation.username}</span>
                    <p>{conversation.latestMessage.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          :
          <div>
            <p>Nu esti conectat</p>
          </div>
      }
    </div>
  );
};

export default MessagePage;
