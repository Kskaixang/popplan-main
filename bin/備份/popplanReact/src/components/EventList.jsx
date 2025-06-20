import { useState, useEffect, useRef } from "react";
import eventList from "../data/eventList"; // 假資料
import EventCard from "./EventCard";
import { Spinner } from "react-bootstrap";

function EventList({ tags }) {
  const [visibleEvents, setVisibleEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // 根據多個標籤進行篩選，確保活動的標籤包含所有選中的 tags
  const filteredEvents = eventList.filter((event) =>
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
    // 每次 tags 改變都要重設資料
    const initialEvents = filteredEvents.slice(0, 12);
    setVisibleEvents(initialEvents);
    setPage(2);
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
