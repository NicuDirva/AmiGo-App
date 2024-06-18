import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../state';
import Auth from '../auth/Auth';
import MessageForm from '../forms/MessageForm';
import Navbar from '../Navbar';
import PostCard from './PostCard';
import styles from './css/MessageCard.module.css';

const urlBase = "http://localhost:8080/";

const MessageCard = () => {
  const { accountIdParm } = useParams();
  const [defaultEmail] = useGlobalState("email");
  const [currentId, setCurrentId] = useState('');
  const [currentAccountAvatar, setCurrentAccountAvatar] = useState('');
  const [currentAccountUsername, setCurrentAccountUsername] = useState('');
  const [friendAccountAvatar, setFriendAccountAvatar] = useState('');
  const [friendAccountUsername, setFriendAccountUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null); // Referință pentru a face scroll la ultimul mesaj

  const fetchData = async () => {
    const currentAccountId = await Auth.getIdByEmail(defaultEmail);
    setCurrentId(currentAccountId);
    setCurrentAccountAvatar(await PostCard.getAvatarProfileById(currentAccountId));
    setCurrentAccountUsername(await Auth.getUsernameById(currentAccountId));
    setFriendAccountAvatar(await PostCard.getAvatarProfileById(accountIdParm));
    setFriendAccountUsername(await Auth.getUsernameById(accountIdParm));
    const sentMessages = await getSentMessageByAccountId(currentAccountId, accountIdParm);
    const receivedMessages = await getReceivedMessageByAccountId(currentAccountId, accountIdParm);
    const allMessages = [...sentMessages, ...receivedMessages];
    allMessages.sort((a, b) => new Date(a.timeSent) - new Date(b.timeSent));
    setMessages(allMessages);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClickContainer = (username) => {
    navigate(`/profile/${username}`);
  };

  const handleMessageSent = () => {
    fetchData();
  };

  return (
    <div>
      {defaultEmail ? (
        <div>
          <Navbar />
          <div className={styles.messagesWrapper}>
            <div className={styles.topRow} onClick={() => handleClickContainer(friendAccountUsername)}>
              <div className={styles.topAvatar}>
                <img src={friendAccountAvatar} alt="Avatar" />
              </div>
              <p className={styles.topParagraf}>{friendAccountUsername}</p>
            </div>
            <div className={styles.messageContainer}>
                <p className={styles.startPar}>Beginning of the conversation</p>
              {messages.map(message => (
                <div
                  key={message.message_id}
                  className={`${styles.message} ${message.sender_id === currentId ? styles.sent : styles.received}`}
                >
                  <div className={styles.messageHeader}>
                    <img
                      src={message.sender_id === currentId ? currentAccountAvatar : friendAccountAvatar}
                      alt="avatar"
                      onClick={() => handleClickContainer(message.sender_id === currentId ? currentAccountUsername : friendAccountUsername)}
                    />
                    <span>{message.sender_id === currentId ? currentAccountUsername : friendAccountUsername}</span>
                  </div>
                  <div className={styles.messageContent}>
                    <p>{message.content}</p>
                    <p className={styles.messageDate}>{new Date(message.timeSent).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* Referința pentru ultimul mesaj */}
            </div>
            <div className={styles.messageFormContainer}>
              <MessageForm sender_id={currentId} receiver_id={accountIdParm} onMessageSent={handleMessageSent} />
            </div>
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

const getSentMessageByAccountId = async (sender_id, receiver_id) => {
  const response = await fetch(urlBase + "message/getSentMessageByAccountId", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender_id, receiver_id })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const messages = await response.json();
  return messages;
};

const getReceivedMessageByAccountId = async (receiver_id, sender_id) => {
  const response = await fetch(urlBase + "message/getReceivedMessageByAccountId", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ receiver_id, sender_id })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const messages = await response.json();
  return messages;
};

const getSentMessageById = async (sender_id) => {
  const response = await fetch(urlBase + "message/getSentMessageById", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sender_id)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const messages = await response.json();
  return messages;
};

const getReceivedMessageById = async (receiver_id) => {
  const response = await fetch(urlBase + "message/getReceivedMessageById", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(receiver_id)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const messages = await response.json();
  return messages;
};

export default { MessageCard, getReceivedMessageByAccountId, getSentMessageByAccountId, getReceivedMessageById, getSentMessageById };
