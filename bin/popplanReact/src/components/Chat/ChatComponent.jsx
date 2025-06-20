import { useState, useEffect, useRef } from 'react';
import { BsSendFill } from 'react-icons/bs';
import ChatBubble from './ChatBubble';
import { useGlobalWebSocket } from '../Provider/WebSocketProvider';

const ChatComponent = ({ eventId, isLoggedIn, username }) => {
  const { client, connected } = useGlobalWebSocket(); // 全域 STOMP client
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const bottomRef = useRef(null);

  // ✅ 訂閱聊天室訊息
  useEffect(() => {
    if (!client || !connected || !eventId) return;

    const subscription = client.subscribe(`/topic/messages/${eventId}`, (message) => {
      const msg = JSON.parse(message.body);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      subscription.unsubscribe(); // 清除訂閱
    };
  }, [client, connected, eventId]);

  // ✅ 發送訊息
  const sendMessage = () => {
    if (!client || !connected) {
      console.warn('尚未連線到 STOMP 伺服器');
      return;
    }

    const message = {
      from: username,
      content,
      timestamp: new Date().toISOString(),
    };

    client.publish({
      destination: `/app/chat/${eventId}`,
      body: JSON.stringify(message),
    });

    setContent('');
  };

  // ✅ 滾到底部
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="d-flex flex-column" style={{ height: '420px' }}>
      <div className="flex-grow-1 overflow-auto p-2 border rounded bg-light">
        {messages.map((msg, index) => {
          const time = msg.timestamp
            ? new Date(msg.timestamp).toLocaleTimeString('zh-TW', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })
            : '--:--';

          return (
            <ChatBubble
              key={index}
              message={msg}
              username={username}
              isSelf={msg.from === username}
              time={time}
            />
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="d-flex mt-2">
        <input
          className="form-control me-2"
          type="text"
          placeholder="輸入訊息"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!isLoggedIn}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          className="btn btn-primary"
          onClick={sendMessage}
          disabled={!isLoggedIn || !content.trim()}
        >
          <BsSendFill size={18} />
        </button>
      </div>

      {!isLoggedIn && <span className="text-danger mt-1">⚠️ 請先登入才能留言</span>}
    </div>
  );
};

export default ChatComponent;
