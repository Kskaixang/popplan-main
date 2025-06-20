import { useState, useEffect, useRef, useContext } from 'react';
import { SessionContext } from '../Provider/SessionProvider';
import { BsSendFill } from 'react-icons/bs';
import ChatBubble from './ChatBubble';
import { useGlobalWebSocket } from '../Provider/WebSocketProvider';
import { API_HOST } from '../UrlApi/urlapi';

const ChatComponent = ({ eventId, isLoggedIn, username }) => {
  const { client, connected } = useGlobalWebSocket(); // 全域 STOMP client
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const bottomRef = useRef(null);
  //token
  const { token } = useContext(SessionContext);
  // ✅useEffect1 API獲取歷史聊天室訊息
  useEffect(() => {
    if (!eventId) return;

    const loadHistory = async () => {
      console.log('有沒有主動fetch歷史?')
      try {
        setMessages([]); // ✅ 清空舊聊天室內容
        const res = await fetch(`${API_HOST}/api/chat/${eventId}/history`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        })
        if (!res.ok) throw new Error('瀏覽器獲取API失敗');
        const resData = await res.json();
        setMessages(resData); //我沒有用APIresponseEntity包 所以就直接取用

      } catch (err) {
        alert('伺服器回應錯誤')
      }
    };
    loadHistory(); //執行
  }, [eventId]);// 依賴項：只要聊天室 ID 改變就會重新載入

  // ✅useEffect2 訂閱聊天室訊息
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

      {!isLoggedIn && <span className="text-danger mt-1">⚠️ 請先登入加入聊天室</span>}
    </div>
  );
};

export default ChatComponent;
