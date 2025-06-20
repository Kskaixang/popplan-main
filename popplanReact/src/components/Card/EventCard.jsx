import { useState, useContext, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import { SessionContext } from '../Provider/SessionProvider';
import PropTypes from 'prop-types';
import './eventCard.css'
import { API_HOST } from '../UrlApi/urlapi';

EventCard.propTypes = {
  event: PropTypes.object.isRequired,
};

function EventCard({ event }) {
  const { fetchSession, isLoggedIn, token } = useContext(SessionContext);
  const [liked, setLiked] = useState(event.isFavorited); // 判斷是否已收藏
  const [animateLike, setAnimateLike] = useState(false); // 動畫狀態
  //跳頁物件
  const navigate = useNavigate();

  // 在你的 EventCard 裡加：
  useEffect(() => {
    if (isLoggedIn) {
      setLiked(event.isFavorited);
    } else {
      setLiked(false);  // 登出就取消愛心
    }
  }, [isLoggedIn, event.isFavorited]);

  const formatDate = (datetime) => {
    if (!datetime) return "無日期";

    // 將資料庫的時間字串解析為 Date，預設是當作本地時間
    const date = new Date(datetime.replace(" ", "T") + "Z"); // 加 Z → 當作 UTC 解析

    if (isNaN(date)) return "格式錯誤";

    // 調整成台灣時間（UTC+8）------------------------------
    const localDate = new Date(date.getTime());

    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };


  //愛心請求
  const favoriteURL = `${API_HOST}/favorite/${event.eventId}`
  //請求
  const toggleFavorite = async () => {
    console.log('************TOKEN到底有沒有東西' + token)
    try {
      const res = await fetch(favoriteURL, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      console.log('***結束****TOKEN到底有沒有東西' + token)
      if (!res.ok) throw new Error('瀏覽器API失敗');
      console.log('收藏回應' + res)

    } catch (err) { //瀏覽器錯誤
      console.log('瀏覽器發生錯誤' + err)
    }
  }


  const toggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();  // <-- 阻止冒泡！ 
    if (!isLoggedIn) {
      alert('請先登入')
      navigate('/login');
    } else {
      const updatedLiked = !liked;
      setLiked(updatedLiked);
      setAnimateLike(true); // 觸發動畫
      setTimeout(() => setAnimateLike(false), 200); // 回復動畫
      await toggleFavorite(); //等待 SQL家好資料
      fetchSession(); //才重新撈session favoriteCount
    }
  };
  return (
    <a href={`/event/${event.eventId}`} style={{ textDecoration: 'none', color: 'inherit' }}>

      <Card className="shadow-sm hover-lift" style={{ margin: "0.5rem 0", position: "relative", border: "1px solid #ddd" }}>
        <div style={{ position: "relative" }}>
          <Card.Img
            variant="top"
            src={event.image}
            style={{ height: "180px", objectFit: "cover" }}
          />

          {/* 愛心圖示 */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "white",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
              cursor: "pointer",
              transform: animateLike ? "scale(1.3)" : "scale(1)",
              transition: "transform 0.2s ease",
            }}
            onClick={toggleLike}
          >
            <FaHeart
              color={liked ? "#FF5151" : "gray"} // 根據收藏狀態變換顏色
              size={36}
            />
          </div>
        </div>

        <Card.Body>
          <Card.Title style={{
            fontSize: "1.2rem",
            fontWeight: "bold",

            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: "2.3em" // 撐住兩行高度（視字體大小可微調）
          }}
          >
            {event.title}
          </Card.Title>
          <Card.Text
            style={{
              maxHeight: "3em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              minHeight: "2.3em"// 撐住兩行高度（視字體大小可微調）
            }}
          >
            {event.description}
          </Card.Text>
          <div className="d-flex justify-content-between text-muted mt-2" style={{ fontSize: "1rem" }}>
            <span>📅 {formatDate(event.startTime)}</span>
            <span>👥 {event.currentParticipants} / {event.maxParticipants}</span>
            {
              event.price === 0 ?
                <span className="fs-3" style={{ color: " #008000" }}>Free</span> :
                <span className="fs-3" style={{ color: " #ca4d08" }}>{'$' + event.price}</span>
            }

          </div>
        </Card.Body>
      </Card>
    </a>
  );
}

export default EventCard;
