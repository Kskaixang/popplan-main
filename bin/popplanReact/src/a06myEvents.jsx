import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { BsSearch } from "react-icons/bs"
import "./components/css/button.css";
import EventListViewOneMission from "./components/EventListViewOneMission";


function MyEvents() {
  //輸入
  const [searchInput, setSearchInput] = useState("");
  //要按放大鏡送出篩選的
  const [searchTerm, setSearchTerm] = useState("");

  const [isLoading, setIsLoading] = useState(true); // 新增
  const EventURL = 'http://localhost:8080/event/myCreatedEvents';
  const [myEvents, setMyEvents] = useState([]);
  const fetchEvent = async () => {
    try {
      const res = await fetch(EventURL, {
        method: 'GET',  //默認是GET 但我想寫
        credentials: 'include' //允許session 這裡 有顯示收藏狀態的需求
      })
      if (!res.ok) throw new Error('瀏覽器API失敗'); //提早拋出 因為後端都是ok回應

      const resData = await res.json(); //獲取ResponseEntity
      console.log(resData)
      if (resData.status == 200 && resData.data) { //查詢成功 由後端提取session 用回應送回來
        setMyEvents(resData.data);
      } else { //非200 就維持  業務層錯誤
        setMyEvents([]);
      }
    } catch (err) { //瀏覽器錯誤 網路層錯誤
      setMyEvents([]);
      console.log('瀏覽器發生錯誤' + err)
    } finally {
      setIsLoading(false); // 最後要標記為載入完成
    }

  }

  const handleClearTags = () => {
    setSearchInput("");  //清除搜索
    setSearchTerm("");
  };


  useEffect(() => {
    fetchEvent();
  }, []);



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
          className="me-2 mb-4 mt-2 rounded-pill shadow-sm px-3 custom-clear-button"

        >
          清除搜尋
        </Button>


        {/* {selectedTags.length === 0 ? (

          <LatestEventList />
        ) : (
          <EventList tags={selectedTags} />
        )} */}


        {/* <UnifiedEventList events={myEvents ?? []} searchTerm={searchTerm} /> */}
        <EventListViewOneMission events={myEvents} searchTerm={searchTerm} />

      </Container>

    </>
  );
}

export default MyEvents;
