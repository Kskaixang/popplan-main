import { useState, useEffect, useRef, useContext } from 'react';
import { BsSendFill } from 'react-icons/bs';
import ChatAiBubble from './ChatAiBubble';
import { AGENT_HOST } from '../UrlApi/urlapi';
import { SessionContext } from '../Provider/SessionProvider';

const ChatComponent = ({ isLoggedIn, username, setIsTyping }) => {
  const { token } = useContext(SessionContext);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const bottomRef = useRef(null);

  // ✅ 滾到底部
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // ✅useEffect1 API獲取歷史聊天室訊息
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    console.log('1用戶這個瞬間登出了嗎?' + username)
    const loadHistory = async () => {
      console.log('有沒有主動fetch歷史?')
      try {
        setMessages([]); // ✅ 清空舊聊天室內容
        const res = await fetch(`${AGENT_HOST}/aiagent/history`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        })

        console.log('2用戶這個瞬間登出了嗎?' + username)
        if (!res.ok) throw new Error('瀏覽器獲取API失敗');
        const resData = await res.json();
        setMessages(resData); //我沒有用APIresponseEntity包 所以就直接取用
        console.log(resData)
      } catch (err) {
        alert('伺服器回應錯誤')
      }
    };

    console.log('3用戶這個瞬間登出了嗎?' + username)
    loadHistory(); //執行
    console.log('4用戶這個瞬間登出了嗎?' + username)
  }, [isLoggedIn]);// 依賴項：只要聊天室 ID 改變就會重新載入

  // ✅ 發送訊息並呼叫 AI Agent
  const sendMessage = async () => {
    console.log('5用戶這個瞬間登出了嗎?' + username)
    if (!content.trim()) return;
    console.log('6用戶這個瞬間登出了嗎?' + username)
    const userMsg = {
      from: username,
      content,
      timestamp: new Date().toISOString(),
    };
    console.log('7用戶這個瞬間登出了嗎?' + username)
    setMessages(prev => [...prev, userMsg]);
    setContent('');

    // 使用者訊息送出，開始 AI 打字動畫
    setIsTyping(true);
    console.log('8用戶這個瞬間登出了嗎?' + username)
    try {
      const encoded = encodeURIComponent(content);
      const response = await fetch(`${AGENT_HOST}/agent?q=${encoded}`, {
        //credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('9用戶這個瞬間登出了嗎?' + username)
      const result = await response.text();

      const aiMsg = {
        from: 'AI',
        content: result,
        timestamp: new Date().toISOString(),
      };
      console.log('10用戶這個瞬間登出了嗎?' + username)
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Agent 回應失敗:', error);
      setMessages(prev => [
        ...prev,
        {
          from: 'AI',
          content: '⚠️ 無法取得回應，請稍後再試。',
          timestamp: new Date().toISOString(),
        },
      ]);
      console.log('11用戶這個瞬間登出了嗎?' + username)
    } finally {
      // AI 回覆完成，關閉打字動畫
      setIsTyping(false);
      console.log('12用戶這個瞬間登出了嗎?' + username)
    }
  };

  return (
    <div className="d-flex flex-column" style={{ maxHeight: '68vh', minHeight: '300px' }}>
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
            <ChatAiBubble
              key={index}
              message={msg}
              username={username}
              isSelf={msg.from === 'AI'}
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
          style={{ backgroundColor: '#00CACA', borderColor: '#00CACA' }}
        >
          <BsSendFill size={18} />
        </button>
      </div>

      {!isLoggedIn && <span className="text-danger mt-1">⚠️ 請先登入加入聊天室</span>}
    </div>
  );
};

export default ChatComponent;
