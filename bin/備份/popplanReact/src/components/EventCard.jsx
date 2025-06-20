import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import Card from "react-bootstrap/Card";
import { Navigate } from "react-router-dom";

/* eslint-disable react/prop-types */

function EventCard({ event }) {
  const [liked, setLiked] = useState(false); // 判斷是否已收藏
  const [animateLike, setAnimateLike] = useState(false); // 動畫狀態

  const formatDate = (datetime) => {
    const date = new Date(datetime);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  const toggleLike = (e) => {
    e.preventDefault();
    const updatedLiked = !liked;
    setLiked(updatedLiked);
    setAnimateLike(true); // 觸發動畫
    setTimeout(() => setAnimateLike(false), 200); // 回復動畫

    // localStorage 邏輯，儲存用戶的收藏
    const savedLikes = JSON.parse(localStorage.getItem("likedEvents")) || [];
    if (updatedLiked) {
      localStorage.setItem("likedEvents", JSON.stringify([...savedLikes, event.id]));
    } else {
      localStorage.setItem(
        "likedEvents",
        JSON.stringify(savedLikes.filter((id) => id !== event.id))
      );
    }
  };

  // 設置每個狀態的底色
  const getStatusStyle = (status) => {
    switch (status) {
      case "報名":
        return { backgroundColor: "#28a745", color: "white", padding: "8px 13px", fontSize: "1.2rem", borderRadius: "20px", fontWeight: "bold" };
      case "結束":
        return { backgroundColor: "#6c757d", color: "white", padding: "8px 13px", fontSize: "1.2rem", borderRadius: "20px", fontWeight: "bold" };
      case "取消":
        return { backgroundColor: "#dc3545", color: "white", padding: "8px 13px", fontSize: "1.2rem", borderRadius: "20px", fontWeight: "bold" };
      default:
        return { backgroundColor: "#007bff", color: "white", padding: "8px 13px", fontSize: "1.2rem", borderRadius: "20px", fontWeight: "bold" }; // 默認藍色
    }
  };

  //發送給8080的請求
  const handleClick = () => {
    fetch(`http://localhost:8080/event/${event.id}`)
      .then(() => {
        console.log("已送出請求");
        Navigate(`/event/${event.id}`); // 然後切換頁面
      });
  };

  return (
    <a href={`/event/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>

      <Card style={{ margin: "0.5rem 0", position: "relative", border: "1px solid #ddd" }}>
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
              width: "36px",
              height: "36px",
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
              size={24}
            />
          </div>
        </div>

        <Card.Body>
          <Card.Title style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
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
            }}
          >
            {event.description}
          </Card.Text>
          <div className="d-flex justify-content-between text-muted mt-2" style={{ fontSize: "0.9rem" }}>
            <span>📅 {formatDate(event.start_time)}</span>
            <span>👥 0 / {event.max_participants}</span>
            <span style={getStatusStyle(event.status)}>{event.status}</span>
          </div>
        </Card.Body>
      </Card>
    </a>
  );
}

export default EventCard;
