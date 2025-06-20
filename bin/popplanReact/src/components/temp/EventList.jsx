import { useState, useEffect, useRef } from "react";
//import eventList from "../data/eventList"; // 假資料
import { EventContext } from "./EventProvider"; //////////
import EventCard from "./Card/EventCard";
import { Spinner } from "react-bootstrap";
import PropTypes from 'prop-types';



//這一頁要等 tags 修好 才能開始弄






//改善型別未知的紅字提示 是先定義子組件傳入參數時 應該是什麼內容 不加也能執行 但有寫更嚴謹
/* props 缺少驗證 的警告比較常見在 複雜型別（例如陣列、物件、函數）
PropTypes.arrayOf(PropTypes.number)   // 陣列內元素是數字
PropTypes.arrayOf(PropTypes.bool)     // 陣列內元素是布林值
PropTypes.arrayOf(PropTypes.object)   // 陣列內元素是物件
PropTypes.arrayOf(PropTypes.shape({   // 陣列內元素是特定物件型態
  id: PropTypes.number,
  name: PropTypes.string
}))

.isRequired  表示該 prop 是必填的，若父元件沒傳入，會在開發時拋出警告。
*/
EventList.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,  // tags 是字串陣列且必須有
};

function EventList({ tags }) {
  const [visibleEvents, setVisibleEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(3);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const { events } = useContext(EventContext);

  // 根據多個標籤進行篩選，確保活動的標籤包含所有選中的 tags
  const filteredEvents = events.filter((event) =>
    //every代表函式中都要符合每個tag條件 才能式true
    // ?. 是 Optional Chaining（選擇性鏈接） 的寫法，
    // 意思是：如果 event.tags 是 undefined 或 null，就不會報錯，而是直接回傳 false。
    //Optional Chaining (?.): 保護程式避免讀取 undefined 屬性造成錯誤
    //「只有當 event.tags 存在時，才去呼叫 .includes()，不然就直接跳過。」
    //如果確定「資料結構永遠沒問題」，可以不用 Optional Chaining，但為了穩健和維護方便，建議還是保留。
    //是一種「防禦式編程」的好習慣

    //你可以這樣想：
    // 「Java 用 Optional 告訴我：『你拿到這東西時，先檢查有沒有值』。
    // JavaScript 用 ?. 告訴我：『你讀屬性時，先幫你檢查一下這個東西是不是 null 或 undefined』。」
    tags.every((tag) => event.tags?.includes(tag)) // 確保每個活動包含所有選中的標籤
  );

  const loadMoreEvents = () => {
    setLoading(true);
    setTimeout(() => {
      const newEvents = filteredEvents.slice((page - 1) * 6, page * 6);

      if (newEvents.length === 0) {
        setHasMore(false);
      } else {
        setVisibleEvents((prevEvents) => [...prevEvents, ...newEvents]);
        setPage((prevPage) => prevPage + 1);
      }

      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    //局部變數重新定義filteredEvents 讓[tags] 有依據
    //未來想優化再來考慮用 useMemo
    const filteredEvents = events.filter((event) =>
      tags.every((tag) => event.tags?.includes(tag))
    );
    // 每次 tags 改變都要重設資料
    const initialEvents = filteredEvents.slice(0, 12);
    setVisibleEvents(initialEvents);
    setHasMore(true);
    setLoading(false);
  }, [tags]); // 依照選擇的標籤進行重新載入

  const lastEventElementRef = (node) => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreEvents();
      }
    });

    if (node) observer.current.observe(node);
  };

  return (
    <div>
      <div className="row">
        {visibleEvents.map((event, index) => (
          <div
            className="col-12 col-md-6 col-lg-4"
            key={event.id}
            ref={index === visibleEvents.length - 1 ? lastEventElementRef : null}
          >
            <EventCard event={event} />
          </div>
        ))}
      </div>

      {loading && (
        <div className="d-flex justify-content-center mt-3">
          <Spinner animation="border" />
        </div>
      )}

      {!hasMore && !loading && (
        <div className="d-flex justify-content-center mt-3">
          <p>已經沒有更多資料</p>
        </div>
      )}

      <div ref={lastEventElementRef} />
    </div>
  );
}

export default EventList;
