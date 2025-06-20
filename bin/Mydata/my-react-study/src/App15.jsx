// useState 與事件處理 + 展開運算子...
import { useState } from "react"
function App() {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const handleInputChange = (e) => {
    //指的是 e.target.value 欄位的內容 只要欄位改變 就要改變input的值 
    //也能理解 target 就是input
    //少了這個 imputMessage 是不可變更 所以要onChange
    setInputMessage(e.target.value);
  }

  const handleAddMessage = () => {
    //concat 相連相加 相當於JAVA的+ 拚接
    //setMessages(messages.concat(inputMessage));

    //[原本的messages 加上inputMessage]
    setMessages([...messages, inputMessage]);
    setInputMessage('')
  }

  const handleKeyDown = (e) => {
    //因為onchange沒有提供按鍵監聽方法 所以我們要用onKeyDown
    if (e.key === 'Enter') {
      handleAddMessage();
    }
  }

  return (
    <>
      <h4>useState 與事件處理 + 展開運算子...</h4>
      {/* onChange 宣告我們在這欄位做修正 */}
      <input type="text" value={inputMessage} onChange={handleInputChange} onKeyDown={handleKeyDown} />
      <button onClick={handleAddMessage}>Send</button><p />
      {messages}
      <p />
      <ul>
        {
          messages.map((message, index) => (
            <li key={index}>{index} : {message}</li>
          ))
        }
      </ul>
      <p />--------------------------
    </>
  )
}
export default App