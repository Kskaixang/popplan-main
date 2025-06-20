import EventCard from "./EventCard";


function EventListViewOneMission({ events = [], searchTerm = "" }) {
  // 先處理無資料狀況
  if (!events || events.length === 0) {
    return <p className="text-muted text-center mt-4">目前沒有任何收藏的活動。</p>;
  }

  // 搜尋篩選：標題 或 描述 包含關鍵字（不分大小寫）
  const searchFilteredEvents = events.filter(event =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 若搜尋後也沒結果
  if (searchFilteredEvents.length === 0) {
    return <p className="text-muted text-center mt-4">找不到符合的活動。</p>;
  }

  return (
    <div className="row">
      {searchFilteredEvents.map(event => (
        <div key={event.eventId} className="col-12 col-md-6 col-lg-4 mb-4">
          <EventCard event={event} />
        </div>
      ))}
    </div>
  );
}

export default EventListViewOneMission;
