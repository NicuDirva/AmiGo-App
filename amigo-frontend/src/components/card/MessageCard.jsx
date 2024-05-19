import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGlobalState } from '../state';
import Auth from '../auth/Auth';
import MessageForm from '../MessageForm';
import Navbar from '../Navbar';
import Profile from '../Pages/Profile';
import PostCard from './PostCard';
import './MessageCard.css'
import { useNavigate } from 'react-router-dom';

const urlBase = "http://localhost:8080/";

const MessageCard = () => {
    const { accountIdParm} = useParams();
    const [currentId, setCurrentId] = useState('');
    const [ currentAccountAvatar, setCurrentAccountAvatar] = useState('');
    const [ currentAccountUsername, setCurrentAccountUsername] = useState('');
    const [ friendAccountAvatar, setFriendAccountAvatar] = useState('');
    const [ friendAccountUsername, setFriendAccountUsername] = useState('');
    const [ defaultEmail] = useGlobalState("email");
    const [ messages, setMessages] = useState([]);
    const navigate = useNavigate();

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
        // Sortează mesajele în ordine cronologică
        allMessages.sort((a, b) => new Date(a.timeSent) - new Date(b.timeSent));
        setMessages(allMessages);
    }

    useEffect(() => {
        fetchData();
    }, [])

    const handleClickContainer = (username) => {
        navigate(`/profile/${username}`);
    }

    const handleMessageSent = () => {
        fetchData();
    };
  return (
    <div>
        {defaultEmail?
            <div>
                <Navbar/>
                <div className="messages-wrapper">
                        <div className="message-container">
                            {messages.map(message => (
                                <div key={message.message_id} className={`message ${message.sender_id === currentId ? 'sent' : 'received'}`}>
                                    <img src={message.sender_id === currentId ? currentAccountAvatar : friendAccountAvatar} alt="avatar" onClick={() => handleClickContainer(message.sender_id === currentId ? currentAccountUsername : friendAccountUsername)}/>
                                    <span>{message.sender_id === currentId ? currentAccountUsername : friendAccountUsername}</span>
                                    <div>
                                        <p>{message.content}</p>
                                        <p>{new Date(message.timeSent).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="message-form-container">
                            <MessageForm sender_id={currentId} receiver_id={accountIdParm} onMessageSent={handleMessageSent} />
                        </div>
                    </div>
            </div>
            :
            <div>You are not connected</div>
        }
    </div>
  )
}

const getSentMessageByAccountId = async (sender_id, receiver_id) => {
    const response = await fetch(urlBase+"message/getSentMessageByAccountId",{
        method:"PATCH",
        headers:{"Content-Type":"application/json"}, 
        body:JSON.stringify({sender_id, receiver_id})
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const messages = await response.json(); // Parsează răspunsul JSON
      return messages;
}

const getReceivedMessageByAccountId = async (receiver_id, sender_id) => {
    const response = await fetch(urlBase+"message/getReceivedMessageByAccountId",{
        method:"PATCH",
        headers:{"Content-Type":"application/json"}, 
        body:JSON.stringify({receiver_id, sender_id})
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const messages = await response.json(); // Parsează răspunsul JSON
      return messages;
}

const getSentMessageById = async (sender_id) => {
    const response = await fetch(urlBase+"message/getSentMessageById",{
        method:"PATCH",
        headers:{"Content-Type":"application/json"}, 
        body:JSON.stringify(sender_id)
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const messages = await response.json(); // Parsează răspunsul JSON
      return messages;
}

const getReceivedMessageById = async (receiver_id) => {
    const response = await fetch(urlBase+"message/getReceivedMessageById",{
        method:"PATCH",
        headers:{"Content-Type":"application/json"}, 
        body:JSON.stringify(receiver_id)
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const messages = await response.json(); // Parsează răspunsul JSON
      return messages;
}

export default  { MessageCard, getReceivedMessageByAccountId, getSentMessageByAccountId, getReceivedMessageById, getSentMessageById}
