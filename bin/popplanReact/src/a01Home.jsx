import { useState, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { BsSearch } from "react-icons/bs"
import TagFilterPanel from "./components/TagFilterPanel";
import UnifiedEventList from "./components/EventListView";
import "./components/css/button.css";


function Home() {
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
  /*
  {selectedTags.length > 0 && (
        <div className="mb-3 text-end">
          <Button variant="outline-danger" size="sm" onClick={onClearTags}>
            +++++++++清除全部標籤+++++++++
          </Button>
        </div>
      )}
  */




  return (
    <>
      <Container className="mt-4 p-4 border border-gray bg-white shadow rounded">
        <Form className="d-flex mb-4" onSubmit={(e) => e.preventDefault()}>



          <Form.Control
            type="search"
            placeholder="搜尋活動"
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

        <div className="mb-4">
          <TagFilterPanel
            // 傳遞標籤群組
            selectedTags={selectedTags} // 目前選中的標籤
            onTagToggle={handleTagToggle} // 處理選擇標籤的邏輯
            onClearTags={() => setSelectedTags([])}
          />
        </div>

        {/* {selectedTags.length === 0 ? (

          <LatestEventList />
        ) : (
          <EventList tags={selectedTags} />
        )} */}


        <UnifiedEventList tags={selectedTags} searchTerm={searchTerm} />
      </Container>

    </>
  );
}

export default Home;
