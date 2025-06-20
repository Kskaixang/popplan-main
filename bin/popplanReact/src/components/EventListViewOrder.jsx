
import EventRegistrationCard from "./Card/EventRegistrationCard";

function EventListViewOneMission({ registrations = [], searchTerm = "" }) {
  console.log('View端的資料是?', registrations)
  // 先處理無資料狀況
  if (!registrations || registrations.length === 0) {
    return <p className="text-muted text-center mt-4">目前沒有任何報名紀錄。</p>;
  }

  // 搜尋篩選：標題 或 描述 包含關鍵字（不分大小寫）
  const searchFilteredEvents = registrations.filter(event =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 若搜尋後也沒結果
  if (searchFilteredEvents.length === 0) {
    return <p className="text-muted text-center mt-4">找不到符合的報名紀錄。</p>;
  }

  return (
    <div className="row">
      {searchFilteredEvents.map(registration => (
        <div key={`${registration.type}-${registration.registrationId}`}>
          <EventRegistrationCard event={registration} />
        </div>
      ))}
    </div>
  );
}

export default EventListViewOneMission;
