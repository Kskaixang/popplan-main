import NotificationCard from "./Card/NotificationCard";

function EventListViewNotification({ notifications = [], searchTerm = "", allAsRead = false }) {
  // 無資料
  if (!notifications || notifications.length === 0) {
    return <p className="text-muted text-center mt-4">目前沒有任何通知。</p>;
  }

  // 搜尋篩選
  const searchFilteredNotifications = notifications.filter(notification =>
    notification.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 搜尋後也沒結果
  if (searchFilteredNotifications.length === 0) {
    return <p className="text-muted text-center mt-4">找不到通知。</p>;
  }

  return (
    <div className="row">
      {searchFilteredNotifications.map(notification => (
        <div key={notification.notificationId}>
          <NotificationCard notification={notification} allAsRead={allAsRead} />
        </div>
      ))}
    </div>
  );
}

export default EventListViewNotification;
