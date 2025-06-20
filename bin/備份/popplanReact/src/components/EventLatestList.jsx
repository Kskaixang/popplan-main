import { useState, useEffect, useRef } from "react";
import eventList from "../data/eventList"; // 假資料
import EventCard from "./EventCard";
import { Spinner } from "react-bootstrap";

function LatestEventList() {
  const [visibleEvents, setVisibleEvents] = useState([]); // 可見的事件
  const [loading, setLoading] = useState(true); // 加載中
  const [page, setPage] = useState(1); // 當前頁數
  const [hasMore, setHasMore] = useState(true); // 是否還有更多資料
  const observer = useRef(); // 用來監控底部元素

  // 加載更多事件
  const loadMoreEvents = () => {
    setLoading(true);
    // 模擬延遲加載，實際情況下會調用 API
    setTimeout(() => {
      const newEvents = eventList.slice((page - 1) * 6, page * 6);

      // 如果沒有更多的事件，設置 hasMore 為 false
      if (newEvents.length === 0) {
        setHasMore(false);
      } else {
        setVisibleEvents((prevEvents) => [...prevEvents, ...newEvents]);
        setPage((prevPage) => prevPage + 1);
      }

      setLoading(false);

    }, 1000);
  };

  useEffect(() => {
    // 初次載入時先顯示前 6 筆
    const newEvents = eventList.slice(0, 12);
    setVisibleEvents(newEvents);
    setLoading(false); // 初次加載完成，設置 loading 為 false
  }, []);  // 這裡確保只在組件加載時執行一次

  // 用 IntersectionObserver 監控底部元素
  const lastEventElementRef = (node) => {
    if (loading || !hasMore) return; // 如果在加載中或者已經沒有更多資料，則不觸發加載

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreEvents(); // 當滾動到接近底部時加載更多
      }
    });

    if (node) observer.current.observe(node);
  };

  return (
    <div>
      <h3>最新</h3>
      <div className="row">
        {visibleEvents.map((event) => (
          <div className="col-12 col-md-6 col-lg-4" key={event.id}>
            <EventCard event={event} />
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
