import React, { useState } from 'react';
import './css/MessageForm.css';

const urlBase = "http://localhost:8080/";

const MessageForm = ({ sender_id, receiver_id, onMessageSent }) => {
  const [content, setContent] = useState('');

  const handleSendMessage = async () => {
    const currentTime = getCurrentDateTime();
    const message = { sender_id, receiver_id: parseInt(receiver_id, 10), content, timeSent: currentTime };
    console.log(message);
    const message_created = await sentMessage(message);
    await createSentMessage(sender_id, message_created.message_id);
    await createReceiveMessage(parseInt(receiver_id, 10), message_created.message_id);
    setContent('');
    onMessageSent();
  };

  return (
    <div className="message-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your message..."
        rows="4"
        cols="50"
        className="message-textarea"
      />
      <div className="send-button" onClick={handleSendMessage}>
        Send
      </div>
    </div>
  );
};

const sentMessage = async (message) => {
  const response = await fetch(urlBase + "message/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  let current_message_create;
  try {
    current_message_create = await response.json();
    console.log("Message created:", current_message_create);
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
  return current_message_create;  
};

const createSentMessage = async (account_id, message_id) => {
  const response = await fetch(urlBase + "message/SENT_MESSAGE", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account_id, message_id })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

const createReceiveMessage = async (account_id, message_id) => {
  const response = await fetch(urlBase + "message/RECEIVED_MESSAGE", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account_id, message_id })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

const getCurrentDateTime = () => {
  const currentDate = new Date();
  const dateOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  const formattedDate = currentDate.toLocaleDateString(undefined, dateOptions);
  const formattedTime = currentDate.toLocaleTimeString(undefined, timeOptions);

  return `${formattedDate} ${formattedTime}`;
};

export default MessageForm;
