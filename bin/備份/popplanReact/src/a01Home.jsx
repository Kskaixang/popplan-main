import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import TagFilterPanel from "./components/TagFilterPanel";
import LatestEventList from "./components/EventLatestList";
import EventList from "./components/EventList";
import "./components/css/button.css";


function Home() {
  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagToggle = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  const handleClearTags = () => {
    setSelectedTags([]); // 清除所有選中的標籤
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
        <Button
          variant="outline-secondary" // 保持按鈕的邊框樣式
          size="sm"
          onClick={handleClearTags}
          className="me-2 mb-2 rounded-pill shadow-sm px-3 custom-clear-button"
        >
          清除選中標籤
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

        {selectedTags.length === 0 ? (

          <LatestEventList />
        ) : (
          <EventList tags={selectedTags} />
        )}
      </Container>
    </>
  );
}

export default Home;
