import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/event/1`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch((err) => console.error("載入活動失敗", err));
  }, [id]);

  if (!event) return <p>載入中...</p>;

  return (
    <div>
      <h1>{event.title}</h1>
      <img
        src={
          event.imageBase64?.startsWith('src/data/images/')
            ? event.imageBase64 // 當成本地路徑 URL 使用
            : `data:image/png;base64,${event.imageBase64}` // 當成 base64 使用
        }
        alt="活動圖片"
        width={300}
      />
      <p>{event.description}</p>
      <p>地點：{event.location}</p>
      <p>狀態：{event.status}</p>
      <p>價格：{event.price}</p>
      <p>標籤：{event.tags?.join("、")}</p>
      <p>時間：{new Date(event.startTime).toLocaleString()}</p>
    </div>
  );
}
