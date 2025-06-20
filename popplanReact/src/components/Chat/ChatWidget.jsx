import { useState } from 'react';
import { BsMessenger } from 'react-icons/bs';
import ChatComponent from './ChatComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ChatWidget.css';

const ChatWidget = ({ eventId, isLoggedIn, username }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Floating Button */}
      <button className="chat-toggle-btn" onClick={toggleChat}>
        <BsMessenger size={28} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-box card shadow" >
          <div className="card-header d-flex justify-content-between align-items-center" >
            <span>聊天室: 活動編號{eventId}</span>
            <button className="btn btn-sm btn-outline-secondary" onClick={toggleChat}>關閉</button>
          </div>
          <div className="card-body p-2">
            <ChatComponent eventId={eventId} isLoggedIn={isLoggedIn} username={username} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
