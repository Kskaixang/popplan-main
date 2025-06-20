import { useState, useEffect, useRef, useContext } from "react";
//import eventList from "../data/eventList"; // 假資料
import { EventContext } from "./EventProvider"; //////////
import EventCard from "./EventCard";
import { Spinner } from "react-bootstrap";
//首頁加載
function LatestEventList() {
  const [visibleEvents, setVisibleEvents] = useState([]); // 可見的事件
  const [loading, setLoading] = useState(true); // 加載中
  // 當前頁數 初始化加載已經載了2頁 所以這邊從3開始  eventList.slice((page - 1) * 6, page * 6);
  const [page, setPage] = useState(3);
  const [hasMore, setHasMore] = useState(true); // 是否還有更多資料
  const observer = useRef(); // 用來監控底部元素
  const { events } = useContext(EventContext);

  // 加載更多事件
  const loadMoreEvents = () => {
    setLoading(true);
    // 模擬延遲加載，實際情況下會調用 API
    setTimeout(() => {
      //slice(開始索引,結束索引) 比方第一次觸發加載 3-1=2 得出你已經有兩頁了 跳過這兩頁
      const newEvents = events.slice((page - 1) * 6, page * 6);
      // 如果沒有更多的事件，設置 hasMore 為 false
      if (newEvents.length === 0) {
        setHasMore(false);
      } else {
        // 將 slice() 取得的新事件資料合併進現有的 visibleEvents 中
        //函式用法（叫 updater function） set自帶的陣列更新  「狀態依賴前一個值」
        //如果是這樣寫 setVisibleEvents(newEvents); // 完全替換成新資料
        //如果是updater 那就是展開舊陣列 拼接 新陣列
        setVisibleEvents((prevEvents) => [...prevEvents, ...newEvents]);
        setPage((prevPage) => prevPage + 1);
      }

      setLoading(false);

    }, 800);
  };

  // useEffect(() => {
  //   // 初次載入時先顯示前12筆
  //   const newEvents = events.slice(0, 12);
  //   setVisibleEvents(newEvents);
  //   setLoading(false); // 初次加載完成，設置 loading 為 false
  // }, []);  // 這裡確保只在組件加載時執行一次

  useEffect(() => {
    if (events.length === 0) return;
    const newEvents = events.slice(0, 12);
    setVisibleEvents(newEvents);
    setLoading(false);
  }, [events]); // 依賴 events，資料變動時自動更新


  // 用 IntersectionObserver 監控底部元素
  // 建立一個回呼函式，傳入參數 node（即我們想要監控的 DOM 元素）
  const lastEventElementRef = (node) => {
    // 如果正在 loading 或是資料已經全部加載完了，就直接 return，不執行下面的邏輯
    if (loading || !hasMore) return;

    // 如果之前已經有一個 observer 實例存在，就先取消觀察，避免重複監控
    if (observer.current) observer.current.disconnect();

    // 創建一個新的 IntersectionObserver 實例
    observer.current = new IntersectionObserver((entries) => {
      // entries 是一個陣列，包含所有被監控的元素的可見狀態
      // 這裡只取第一個元素，如果它出現在視口中（isIntersecting 為 true），就觸發加載更多事件
      if (entries[0].isIntersecting) {
        loadMoreEvents(); // 呼叫載入更多事件的函式
      }
    });

    // 如果傳入的 DOM 節點存在，就開始監控它是否進入畫面
    if (node) observer.current.observe(node);
  };

  return (
    <div>
      <h3>最新</h3>
      <div className="row">
        {visibleEvents.map((event) => (
          <div className="col-12 col-md-6 col-lg-4" key={event.eventId}>
            <EventCard event={event} />
            {/* <pre>{JSON.stringify(event, null, 2)}</pre>
            console.log("事件資料：", event); */}
          </div>
        ))}
      </div>

      {/* 當滾動到最底部時顯示「加載中」 */}
      {loading && (
        <div className="d-flex justify-content-center mt-3">
          <Spinner animation="border" />
        </div>
      )}

      {/* 顯示 "沒有更多資料" 的提示 */}
      {!hasMore && !loading && (
        <div className="d-flex justify-content-center mt-3">
          <p>已經沒有更多資料</p>
        </div>
      )}

      {/* 底部的 "加載更多" 被監控 */}
      <div ref={lastEventElementRef} />
    </div>
  );
}

export default LatestEventList;
