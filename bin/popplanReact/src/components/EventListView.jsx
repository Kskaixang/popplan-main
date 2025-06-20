//EventListView 整合後的首頁 List
// 匯入 React 基本 Hooks 與工具
import { useState, useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";
import { Spinner } from "react-bootstrap";
import { EventContext } from "./Provider/EventProvider"; // 全域事件資料來源
import EventCard from "./Card/EventCard"; // 每個活動卡片的 UI 元件

// 定義主組件：統一的活動清單，根據是否有 tags 來切換行為
//增設搜索框
function UnifiedEventList({ tags = [], searchTerm = "" }) {
  // 從全域 Context 拿取事件資料
  const { events } = useContext(EventContext);
  // 若沒從 props 傳入，就用全域 context 當 fallback  有的話 比如 我的活動 收藏報名就替換

  // 狀態：可見事件、當前頁數、載入狀態、是否還有更多資料
  const [visibleEvents, setVisibleEvents] = useState([]);
  const [page, setPage] = useState(3); // 初始頁數
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  // 儲存 IntersectionObserver 實例的參考
  const observer = useRef();

  // 根據是否有傳入 tags 來篩選事件
  const filteredEvents = tags.length === 0
    ? events // 沒有選擇標籤，顯示全部
    : events.filter(event =>
      tags.every(tag => event.tags?.includes(tag)) // 所有標籤都要包含
    );

  // 或是模糊搜尋（大小寫不敏感）
  const searchFilteredEvents = filteredEvents.filter(event =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );




  // 初始化載入：每次 tags 或 events 改變就重新切片資料
  useEffect(() => {
    const initialEvents = searchFilteredEvents.slice(0, 12); // 初始 12 筆
    setVisibleEvents(initialEvents); // 設定可見活動
    setHasMore(true); // 重設還有資料的旗標
    setLoading(false); // 結束初始載入

    //eslint-解除缺失警報註解
    //原因是 filteredEvents 是 在組件內部計算出來的變數，而不是 useState 或 props。
    // 如果你把它加進依賴陣列，會導致 useEffect 每次 render 都觸發一次，造成 無限迴圈 re-render。
    //這裡 filteredEvents 是由 events 和 tags 衍生的，所以只要這兩個變就會導致重新計算，加這兩個就夠了。

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags, events, searchTerm]);

  // 滾動觸發的加載更多資料邏輯
  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      const moreEvents = searchFilteredEvents.slice((page - 1) * 6, page * 6); // 每頁 6 筆
      if (moreEvents.length === 0) {
        setHasMore(false); // 沒有更多資料
      } else {
        setVisibleEvents(prev => [...prev, ...moreEvents]); // 加到現有陣列後面
        setPage(prev => prev + 1); // 頁數加一
      }
      setLoading(false); // 結束載入狀態
    }, 800); // 模擬延遲，可改為實際 API 延遲
  };

  // 使用 IntersectionObserver 來監測頁面底部是否可見
  const lastEventElementRef = (node) => {
    if (loading || !hasMore) return; // 載入中或沒資料就不監控

    if (observer.current) observer.current.disconnect(); // 清除舊觀察器

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadMore(); // 一進入畫面就觸發加載
    });

    if (node) observer.current.observe(node); // 開始監控底部元素
  };

  return (
    <div>
      {/* 根據是否有篩選標籤，變換標題 */}
      {/* <h3>{tags.length === 0 && searchTerm ? "最新活動" : "篩選結果"}</h3> */}

      {/* 活動清單 */}
      <div className="row">
        {visibleEvents.map((event, index) => (
          <div
            className="col-12 col-md-6 col-lg-4"
            key={event.eventId}
            // 監控最後一筆元素觸底觸發
            ref={index === visibleEvents.length - 1 ? lastEventElementRef : null}
          >
            <EventCard event={event} />
          </div>
        ))}
      </div>

      {/* 載入中動畫 */}
      {loading && (
        <div className="d-flex justify-content-center mt-3">
          <Spinner animation="border" />
        </div>
      )}

      {/* 已無更多資料提示 */}
      {!hasMore && !loading && (
        <div className="d-flex justify-content-center mt-3">
          <p>已經沒有更多資料</p>
        </div>
      )}
      {/* 給 我的活動 收藏報名  用的顯示 */}
      {visibleEvents.length === 0 && !loading && (
        <div className="text-center mt-4">
          <p className="text-muted">目前沒有符合條件的活動。</p>
        </div>
      )}

      {/* 保留底部監控元素 */}
      <div ref={lastEventElementRef} />
    </div>
  );
}

// 定義 props 驗證，tags 是可選的字串陣列
UnifiedEventList.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
};

export default UnifiedEventList;
