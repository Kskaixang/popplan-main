import { useState, useEffect, useContext } from 'react';
import { Row, Col } from 'react-bootstrap'; // 加入 Bootstrap 排版元件
import 'rsuite/dist/rsuite.min.css';
import './calenderCss.css';
import '../Card/EventCard.css';
import { Calendar as RsCalendar, Badge, List } from 'rsuite';
import { API_HOST } from '../UrlApi/urlapi';
import { SessionContext } from '../Provider/SessionProvider';
import { useNavigate } from "react-router-dom";

export default function CalendarWithSchedule() {
  //token
  //跳頁物件
  const navigate = useNavigate();
  const { token } = useContext(SessionContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [scheduleData, setScheduleData] = useState({});

  const fetchScheduleData = async () => {
    try {
      const res = await fetch(`${API_HOST}/user/schedule`, {
        method: 'GET',  //默認是GET 但我想寫
        credentials: 'include', //允許session 這裡 有顯示收藏狀態的需求
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (!res.ok) throw new Error('瀏覽器API失敗'); //提早拋出 因為後端都是ok回應

      const resData = await res.json(); //獲取ResponseEntity
      console.log(resData)
      if (resData.status == 200 && resData.data) { //查詢成功 由後端提取session 用回應送回來
        setScheduleData(resData.data);
        console.log('到了' + resData)
      } else { //非200 就維持  業務層錯誤
        setScheduleData([]);
      }
    } catch (err) { //瀏覽器錯誤 網路層錯誤
      setScheduleData([]);
      console.log('瀏覽器發生錯誤' + err)
    }

  }

  useEffect(() => {
    fetchScheduleData();
  }, [])


  function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function onSelect(date) {
    setSelectedDate(date);
  }

  const todoList = selectedDate ? scheduleData[formatDate(selectedDate)] || [] : [];

  function renderCell(date) {
    return (scheduleData[formatDate(date)]?.length ?? 0) > 0 ? <Badge /> : null;
  }

  return (
    <Row>
      {/* 左側：日曆（xs: 12, lg: 6） */}
      <Col xs={12} lg={4} className="mb-4">
        <RsCalendar
          onSelect={onSelect}
          renderCell={renderCell}
          style={{ width: '100%', borderRadius: 15 }}
          className="custom-calendar"

        />
      </Col>

      {/* 右側：行程詳情 */}
      <Col xs={12} lg={8}>
        {selectedDate ? (
          todoList.length === 0 ? (
            <List bordered>
              <List.Item >該日無行程</List.Item>
            </List>
          ) : (
            <List bordered>
              {todoList.map((event, index) => (
                <List.Item
                  className='hover-lift'
                  key={event.id || index}
                  onClick={() => navigate(`/event/${event.eventId}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <strong>{event.time}</strong> — {event.title}
                </List.Item>
              ))}
            </List>
          )
        ) : (
          <List bordered>
            <List.Item >請點選日期以查看行程</List.Item>
          </List>

        )}
      </Col>
    </Row>
  );
}
