import { Card, Row, Col } from "react-bootstrap";
import './EventCard.css'
import { useState, useContext, useEffect } from "react";
//為了要觸發已讀時 主動更新navbar數字
import { SessionContext } from '../Provider/SessionProvider';
import { useNavigate } from 'react-router-dom';
import { API_HOST } from '../UrlApi/urlapi';

function RegistrationCard({ notification, allAsRead }) {
  const [read, setRead] = useState(notification.read)
  //token
  const { token } = useContext(SessionContext);
  const navigate = useNavigate();
  //如果第一層案下了全部已讀 那麼map出來的 都重新渲染
  useEffect(() => {
    if (allAsRead === true) {
      setRead(true);
    }
  }, [allAsRead]);
  //為了要觸發已讀時 主動更新navbar數字
  const { fetchSession } = useContext(SessionContext);
  const formatDate = (datetime) => {
    if (!datetime) return "無日期";

    // 把 SQL 字串轉成 ISO 格式
    const isoDate = datetime.replace(" ", "T");
    const date = new Date(isoDate);

    if (isNaN(date)) return "格式錯誤";

    // 取得年月日時分秒
    // const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // 月份從 0 開始
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mi = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    return `${mm}-${dd} ${hh}:${mi}:${ss}`;
  };

  const handleMarkAsRead = async () => {
    if (read) return; // 如果已經讀了就不用再送

    try {
      const res = await fetch(`${API_HOST}/notification/${notification.notificationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!res.ok) throw new Error('API失敗');

      const resData = await res.json();

      if (resData.status === 200) {
        setRead(true); // 即時更新
        fetchSession(); //才重新撈session favoriteCount
      } else {
        alert(resData.message || '操作失敗');
      }
    } catch (err) {
      console.error(err);
      alert('伺服器錯誤');
    }
  };

  const handleClick = (e) => {
    e.preventDefault(); // 防止 a 的預設跳轉
    navigate(notification.url); // 單頁導頁
  };
  //notification.isRead
  return (
    <Card
      className={`p-2 shadow-sm hover-lift w-100 border-0 rounded-2 ${read ? 'bg-light' : 'bg-info bg-opacity-25'}`}
      onClick={handleMarkAsRead}
      style={{ cursor: 'pointer' }}
    >
      <Row className="g-3 align-items-center">

        <Col md={2} xs={2}>
          {!read && <span className="badge bg-secondary ms-2">未讀</span>}
        </Col>
        <Col md={6} xs={6}>
          {/* 通知訊息 */}
          <div className="text-muted small">

            {notification.message}
            {/* 連結是否存在 有的話印出 */}
            {notification.url && (
              <a href={notification.url} onClick={handleClick} className="ms-2">
                前往
              </a>
            )}
          </div>
        </Col>
        <Col md={4} xs={4}>
          {/* 通知時間 */}
          <div className="text-muted small">
            {formatDate(notification.createdAt)}
          </div>
        </Col>
      </Row>
    </Card>
  );
}


export default RegistrationCard;
