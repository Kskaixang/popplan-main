import { Button, Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useState, useEffect, useContext } from "react";
import { SessionContext } from './components/Provider/SessionProvider';  //容器
import { useParams, useNavigate } from "react-router-dom"; //獲取路徑 獲取轉頁
import { API_HOST } from './components/UrlApi/urlapi';

import ChatWidget from './components/Chat/ChatWidget';

export default function EventDetail() {
  //打開全域容器
  const { user, isLoggedIn, token } = useContext(SessionContext); //設定容器與登入狀況 通常有登入才能通過由路器
  const username = isLoggedIn && user ? user.username : '';
  const { eventId } = useParams();//:eventId路徑
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  //跳頁物件
  const navigate = useNavigate();
  const [registrationStatus, setRegistrationStatus] = useState(null);
  //變數區----------------------------------------------------------------------






  //方法區----------------------------------------------------------------------
  const formatDateTimeReadable = (datetime) => {
    if (!datetime) return "無日期";

    // 把 SQL 時間變成 UTC 格式的 ISO 字串
    const date = new Date(datetime.replace(" ", "T") + "Z");

    if (isNaN(date)) return "格式錯誤";

    // 星期陣列（本地化）
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = weekdays[date.getDay()];
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${year}年${month}月${day}日（${weekday}） ${hour}:${minute}`;
  };





  const handlerBackHome = () => {
    // 可導向其他頁面，例如：
    navigate('/');
  }
  //fetch區 GET獲取行為 PUT報名行為----------------------------------------------------------------------
  //頁面本身的加載
  const EventDetailfetch = async () => {
    try {
      const res = await fetch(`${API_HOST}/event/${eventId}`, {
        method: 'GET',
        // credentials: 'include'
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      if (!res.ok) throw new Error('瀏覽器API獲取失敗');

      const resData = await res.json();

      if (resData.status == 200 && resData.data) {
        setEvent(resData.data);
      } else {
        alert(resData.message);  //拿拋例外的訊息
      }
    } catch (err) { //伺服器錯誤
      alert('瀏覽器API獲取失敗' + err);
    } finally {
      setIsLoading(false); //這裡其實跳頁就沒用了，但保留安全
    }
  }

  //handlerRegistration 報名PUT
  const handlerRegistration = async () => {
    if (isLoading) return; //防止連續點擊
    setIsLoading(true);

    try {
      const res = await fetch(`${API_HOST}/registration/${eventId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      if (!res.ok) throw new Error('瀏覽器API獲取失敗');

      const resData = await res.json();
      if (resData.status == 200 && resData.data) {
        if (event.price == 0) {
          navigate(`/paymentSuccess`);//如果是免費 就別進交易頁啦~
        } else {
          navigate(`/registration/${resData.data.registrationId}`);
        }
      } else {
        alert('請先登入' + resData.message);  //拿拋例外的訊息
      }
    } catch (err) { //伺服器錯誤
      alert(err);
    }
  }


  //Dto的加載
  const fetchRegistrationStatus = async () => {
    try {
      const res = await fetch(`${API_HOST}/registration/status/${eventId}`, {
        method: 'GET',
        credentials: 'include',

      });

      const resData = await res.json();
      if (resData.status === 200 && resData.data) {
        setRegistrationStatus(resData.data.status); // e.g. PENDING_PAYMENT
      } else {
        setRegistrationStatus(null); // 無報名資料
      }
    } catch (err) {
      console.error('無法載入報名狀態', err);
      setRegistrationStatus(null);
    }
  };
  //初始加載useEffect----------------------------------------------------------------------
  useEffect(() => {
    EventDetailfetch();
    fetchRegistrationStatus();
  }, [registrationStatus]);

  //初始加載阻止 避免底下太早讀參數----------------------------------------------------------------------
  // ⛔ 資料還沒回來，不要渲染 event.xxx
  if (!event) return <div>載入中...</div>;

  return (
    <Container className="mt-4 p-4 border border-gray bg-white shadow rounded">
      {/* 活動圖片 */}

      <div className="mb-3 d-flex justify-content-center">
        <Card.Img
          variant="top"
          src={event.image}
          style={{
            width: "100%",          // 滿版寬度
            height: "300px",        // 限制最大高度
            objectFit: "contain",   // 保留比例縮放，不裁切
            display: "block",
            margin: "0 auto",
          }}
        />
      </div>

      {/* 活動標題 */}
      <h2 className="mb-3">{event.title}</h2>

      {/* 創辦人 */}
      <p className="text-muted mb-2">舉辦人：{event.organizerName}</p>
      {/* 地點 */}
      <p className="text-muted mb-2">地點：{event.location}</p>

      {/* 活動描述 */}
      <p className="text-muted mb-2">描述 : </p>
      <Card className="mb-2">
        <Card.Body>
          <p style={{ minHeight: '120px', whiteSpace: 'pre-wrap' }}>{event.description}</p>
        </Card.Body>
      </Card>


      {/* 時間與價格 */}
      <h5>開始時間：</h5>
      <span>{formatDateTimeReadable(event.startTime)}</span><p />
      <span ><strong className='fs-5'>入場費:</strong>
        {
          event.price === 0 ?
            <span className="fs-3" style={{ color: " #008000" }}>免費</span> :
            <span className="fs-3" style={{ color: " #ca4d08" }}>{'$' + event.price}</span>
        }
      </span>

      <Row className="mt-2 mb-3">
        <Col xs={6} md={6}>
          {/* 報名狀態邏輯判斷 */}
          {(() => {
            if (registrationStatus === 'COMPLETED') {
              return (
                <Button
                  className="w-100"
                  variant="success"
                  disabled
                >
                  ✅報名成功
                </Button>
              );
            }

            if (registrationStatus === 'PENDING_PAYMENT') {
              return (
                <Button
                  className="w-100"
                  variant="warning"
                  onClick={handlerRegistration}
                >
                  待付款中
                </Button>
              );
            }

            if (registrationStatus === null) {
              return (
                <Button
                  className="w-100"
                  variant="outline-success"
                  onClick={handlerRegistration}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{' '}
                      報名中...
                    </>
                  ) : (
                    <>報名 👥 {event.currentParticipants} / {event.maxParticipants}</>
                  )}
                </Button>
              );
            }

          })()}

          {(event.status !== '參加' || event.currentParticipants >= event.maxParticipants) && registrationStatus === null && (
            <Button className="w-100" variant="outline-secondary" disabled>
              {event.status === '結束' ? '活動已結束' : '人數已滿'}
            </Button>
          )}
        </Col>
        <Col xs={6} md={6}>
          <Button className="w-100" variant="outline-secondary" onClick={handlerBackHome}>
            返回
          </Button>
        </Col>
      </Row>




      {/* 聊天室 */}
      <ChatWidget eventId={eventId} isLoggedIn={isLoggedIn} username={username} />
    </Container>
  );
}
