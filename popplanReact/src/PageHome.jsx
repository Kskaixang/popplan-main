import { useState, useContext } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { BsSearch } from "react-icons/bs"
import TagFilterPanel from "./components/TagFilterPanel";
import UnifiedEventList from "./components/EventListView";
import "./components/css/button.css";
import { SessionContext } from './components/Provider/SessionProvider';  //容器
import ChatAiAgentWidget from './components/ChatAiAgent/ChatAiAgentWidget';


function Home() {
  const { user, isLoggedIn } = useContext(SessionContext); //設定容器與登入狀況 通常有登入才能通過由路器
  const username = isLoggedIn && user ? user.username : '';
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  //輸入
  const [searchInput, setSearchInput] = useState("");
  //要按放大鏡送出篩選的
  const [searchTerm, setSearchTerm] = useState("");

  const handleTagToggle = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  const handleClearTags = () => {
    setSelectedTags([]); // 清除所有選中的標籤
    setSearchInput("");  //清除搜索
    setSearchTerm("");
  };




  return (
    <>
      <Container className="mt-4 p-4 border border-gray bg-white shadow rounded">
        <Form className="d-flex mb-4" onSubmit={(e) => e.preventDefault()}>



          <Form.Control
            type="search"
            placeholder="搜尋活動或主辦人"
            className="me-2 rounded-pill shadow-sm"
            aria-label="Search"
            style={{ width: "400px", backgroundColor: "#f3f3f3" }}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // 防止表單送出重整
                setSearchTerm(searchInput); // 執行搜尋
              }
            }}
          />
          <Button
            variant="outline-secondary"
            onClick={() => setSearchTerm(searchInput)} // ✅ 只有按下按鈕才會觸發篩選
            className="ms-1 rounded-pill shadow-sm px-3 custom-clear-button"
          >
            <BsSearch />
          </Button>

        </Form>
        <Button
          variant="outline-secondary" // 保持按鈕的邊框樣式
          size="L"
          onClick={handleClearTags}
          className="me-2 mb-2 mt-2 rounded-pill shadow-sm px-3 custom-clear-button"

        >
          清除搜尋與篩選
        </Button>



        <p></p>

        <div>
          {/* 展開收合按鈕 */}
          <div className="mb-2">
            <Button
              variant="outline-secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="me-2 mb-2 mt-2 rounded-pill shadow-sm px-3 custom-clear-button"
            >
              {showFilters ? '收起標籤 ▲' : '展開標籤 ▼'}
            </Button>
          </div>

          {/* 篩選器組件區塊（可展開收合） */}
          {showFilters && (
            <div className="mb-4">
              <TagFilterPanel
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
                onClearTags={() => setSelectedTags([])}
              />
            </div>
          )}

          {/* 其他頁面內容 */}
          {/* ... */}
        </div>

        {/* {selectedTags.length === 0 ? (

          <LatestEventList />
        ) : (
          <EventList tags={selectedTags} />
        )} */}


        <UnifiedEventList tags={selectedTags} searchTerm={searchTerm} />
      </Container>
      {/* AI agent */}
      <ChatAiAgentWidget isLoggedIn={isLoggedIn} username={username} />
    </>
  );
}

export default Home;
