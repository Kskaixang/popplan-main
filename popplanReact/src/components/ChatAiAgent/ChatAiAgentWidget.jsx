import { useState } from 'react';
import { BsMessenger } from 'react-icons/bs';
import ChatAiAgentComponent from './ChatAiAgentComponent';
import TypingIndicator from './TypingIndicator';
import './ChatAiAgentWidget.css'

const ChatWidget = ({ isLoggedIn, username }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // 新增控制輸入動畫

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div>
      <button className="chat-toggle-btn" onClick={toggleChat} style={{ backgroundColor: '#00CACA' }} >
        <span>AI</span> <BsMessenger size={28} />
      </button>

      {isOpen && (
        <div className="chat-box card shadow" style={{ maxHeight: '80vh' }} >
          <div className="card-header d-flex justify-content-between align-items-center">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              AI助理
              {/* 只有第一筆訊息後，且 AI 還在回覆時才顯示 */}
              {isTyping && <TypingIndicator />}
            </span>
            <button className="btn btn-sm btn-outline-secondary" onClick={toggleChat}>關閉</button>
          </div>

          <div className="card-body p-2">
            <ChatAiAgentComponent
              isLoggedIn={isLoggedIn}
              username={username}
              setIsTyping={setIsTyping}  // 傳入控制函式
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
