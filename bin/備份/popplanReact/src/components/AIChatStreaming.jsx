import { useState, useRef, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';

function ChatStreaming({ setDescription, aiChatStreaming }) {
  // 使用者輸入的問題
  const [question, setQuestion] = useState('');

  // AI 回應的逐字內容，會動態更新顯示
  const [response, setResponse] = useState('');

  // 控制按鈕狀態（送出中 / 可按）
  const [loading, setLoading] = useState(false);
  //給父組件用的文字拼接
  const fullTextRef = useRef('');

  // 儲存 EventSource 連線物件（SSE），不會因畫面重渲染被重置
  const eventSourceRef = useRef(null);

  useEffect(() => {
    setQuestion(aiChatStreaming || '');
  }, [aiChatStreaming]);

  // 使用者點擊送出按鈕後執行的函式
  const handleClick = () => {
    fullTextRef.current = '';
    // 若使用者沒輸入內容，不發送
    if (!question.trim()) return;

    // 顯示送出中狀態、清空回應內容
    setLoading(true);
    setResponse('');

    // 如果已有開啟的 SSE 連線，先關閉
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // 將問題文字編碼成 URL 格式（避免中文字或符號出錯）
    const encoded = encodeURIComponent(question);

    // 建立要請求的後端 URL（對應 Spring Boot @GetMapping("/chat/ask2")）
    const url = `http://localhost:8080/chat/ask3?q=${encoded}`;

    // 建立 SSE 連線（Server-Sent Events）
    const eventSource = new EventSource(url);

    // 將連線物件儲存起來，方便之後關閉
    eventSourceRef.current = eventSource;

    // 監聽 SSE 回傳的每一筆資料
    eventSource.onmessage = (event) => {
      // 每次收到一段資料，就加到畫面上（模擬逐字輸出）
      //setDescription((prev) => prev + event.data);
      fullTextRef.current += event.data;
      setDescription(fullTextRef.current);
    };

    // 若 SSE 出現錯誤（結束、超時、伺服器中斷等）
    eventSource.onerror = () => {
      // 顯示完成提示
      setDescription((prev) => prev + '\n\n(以上為生成結果)');

      // 關閉連線
      eventSource.close();

      // 重置 loading 狀態，讓按鈕可再次點擊
      setLoading(false);
    };
  };

  return (
    <div>
      <Row className="mb-3">
        <Col>
          {/* 使用者輸入問題的輸入框 */}
          <textarea
            style={{ backgroundColor: "#D1E9E9" }}
            className="form-control"
            rows="3"
            cols="60"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="請輸入問題"
          />
        </Col>
      </Row>

      {/* 點擊送出問題的按鈕 */}
      <div>
        <Button
          variant="outline-secondary"
          className="custom-clear-button"
          onClick={handleClick}
          disabled={loading}>
          {loading ? '送出中...' : 'AI生成活動介紹'}
        </Button>
      </div>

      {/* 顯示逐字 AI 回應內容的區域 */}
      {/* <div
        style={{
          whiteSpace: 'pre-wrap',        // 保留換行與空格
          marginTop: '20px',
          border: '1px solid #ccc',
          padding: '10px',
          minHeight: '80px'
        }}
      >
        
        {response || '等待回覆...'}
      </div> */}

    </div>
  );
}

export default ChatStreaming;
