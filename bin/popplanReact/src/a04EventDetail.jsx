import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useState, useEffect, useContext } from "react";
import { SessionContext } from './components/Provider/SessionProvider';  //容器
import { useParams, useNavigate } from "react-router-dom"; //獲取路徑 獲取轉頁
import { BsMessenger } from 'react-icons/bs'
import ChatComponent from './components/Chat/ChatComponent';
import ChatWidget from './components/Chat/ChatWidget';

export default function EventDetail() {
  //打開全域容器
  const { user, isLoggedIn } = useContext(SessionContext); //設定容器與登入狀況 通常有登入才能通過由路器
  const username = isLoggedIn && user ? user.username : '';
  const { eventId } = useParams();//:eventId路徑
  const [event, setEvent] = useState(null);
  //跳頁物件
  const navigate = useNavigate();
  const [registrationStatus, setRegistrationStatus] = useState(null);
  //變數區----------------------------------------------------------------------

  //方法區----------------------------------------------------------------------
  const formatDateTimeReadable = (datetime) => {
    if (!datetime) return "無日期";

    const isoDate = datetime.replace(" ", "T");
    const date = new Date(isoDate);

    if (isNaN(date)) return "格式錯誤";

    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = weekdays[date.getDay()];

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const isAM = hours < 12;
    const period = isAM ? "上午" : "下午";

    // 把 24 小時制轉成 12 小時制（12點要特別處理）
    hours = hours % 12;
    if (hours === 0) hours = 12;

    return `${year}年${month}月${day}日（${weekday}） ${period}${hours}:${minutes}`;
  };

  const handlerBackHome = () => {
    // 可導向其他頁面，例如：
    navigate('/');
  }
  //fetch區 GET獲取行為 PUT報名行為----------------------------------------------------------------------
  const EventDetailfetch = async () => {
    try {
      const res = await fetch(`http://localhost:8080/event/${eventId}`, {
        method: 'GET',
        // credentials: 'include'
      })
      if (!res.ok) throw new Error('瀏覽器API獲取失敗');

      const resData = await res.json();
      console.log(resData)
      if (resData.status == 200 && resData.data) {
        setEvent(resData.data);
      } else {
        alert(resData.message);  //拿拋例外的訊息
      }
    } catch (err) { //伺服器錯誤
      alert('瀏覽器API獲取失敗' + err);
    }
  }

  //handlerRegistration 報名PUT
  const handlerRegistration = async () => {
    try {
      const res = await fetch(`http://localhost:8080/registration/${eventId}`, {
        method: 'PUT',
        credentials: 'include'
      })
      if (!res.ok) throw new Error('瀏覽器API獲取失敗');

      const resData = await res.json();
      console.log(resData)
      if (resData.status == 200 && resData.data) {
        if (resData.data.isConfirmed) {
          // 這邊可能要發送QRcode
          navigate(`/paymentSuccess`);//如果室免費 直接結果
        } else {
          navigate(`/registration/${resData.data.registrationId}`);
        }
      } else {
        alert(resData.message);  //拿拋例外的訊息
      }
    } catch (err) { //伺服器錯誤
      alert(err);
    }
  }
  const fetchRegistrationStatus = async () => {
    try {
      const res = await fetch(`http://localhost:8080/registration/status/${eventId}`, {
        method: 'GET',
        credentials: 'include'
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
  }, []);

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
      <p className="text-muted mb-2">舉辦人：{event.organizerName} +追蹤</p>
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


      {/* 返回與報名按鈕 */}
      {/* <Row className="mt-2 mb-3">
        <Col xs={6} md={6}>{event.status === '參加' && event.currentParticipants < event.maxParticipants ?
          (<Button className="w-100" variant="outline-success" onClick={() => { handlerRegistration() }}> 報名 👥 {event.currentParticipants} / {event.maxParticipants} </Button>) :
          (<Button className="w-100" variant="outline-secondary" disabled> {event.status === '結束' ? '活動已結束' : '人數已滿'} </Button>
          )}</Col>
        <Col xs={6} md={6}><Button className="w-100 " variant="outline-secondary" onClick={() => { handlerBackHome() }}>返回</Button></Col>
      </Row> */}
      <Row className="mt-2 mb-3">
        <Col xs={6} md={6}>
          {/* 報名狀態邏輯判斷 */}
          {registrationStatus === null && event.status === '參加' && event.currentParticipants < event.maxParticipants && (
            <Button className="w-100" variant="outline-success" onClick={handlerRegistration}>
              報名 👥 {event.currentParticipants} / {event.maxParticipants}
            </Button>
          )}

          {registrationStatus === 'PENDING_PAYMENT' && (
            <Button className="w-100" variant="outline-warning" onClick={() => {
              // TODO: 導向付款頁或呼叫付款API
              navigate(`/registration/payment/${eventId}`);
            }}>
              去付款 💳
            </Button>
          )}

          {registrationStatus === 'COMPLETED' && (
            <Button className="w-100" variant="outline-secondary" disabled>
              已完成 ✅
            </Button>
          )}

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
