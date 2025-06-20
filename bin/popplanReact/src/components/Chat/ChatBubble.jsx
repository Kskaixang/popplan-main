import React from 'react';
import './ChatBubble.css';

const ChatBubble = ({ message, isSelf, time, username }) => {
  return (
    <div className={`chat-bubble ${isSelf ? 'self' : 'other'}`}>
      <div className="bubble-content">
        <strong>{message.from}</strong>：{message.content}
      </div>
      <div className="bubble-time">{time}</div>
    </div>
  );
};

export default ChatBubble;
