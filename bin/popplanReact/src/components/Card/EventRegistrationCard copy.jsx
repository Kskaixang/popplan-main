import { Card, Button, Row, Col } from "react-bootstrap";
import './EventCard.css'

/**
 * RegistrationCard 組件
 * 
 * props:
 *  - registration: 報名資料物件，包含
 *      - registrationId
 *      - type ("fake" | "real")
 *      - eventId
 *      - status (PENDING_PAYMENT | COMPLETED | TIMEOUT | CANCELLED)
 *      - paidAmount
 *      - title
 *      - startTime
 *  - onCancel: function (取消成功時回呼，帶回 registrationId)
 */
function RegistrationCard({ registration, onCancel }) {
  console.log('卡片端的資料是?', registration);

  // 判斷付款狀態的輔助函數（根據 enum 狀態）
  const isPaid = registration.status === "COMPLETED";

  const formatDate = (datetime) => {
    if (!datetime) return "無日期";
    const isoDate = datetime.replace(" ", "T");
    const date = new Date(isoDate);
    if (isNaN(date)) return "格式錯誤";
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  // 取消報名按鈕點擊事件
  const handlerCancel = async () => {
    if (!window.confirm("確定要取消報名嗎？")) return;

    let deleteUrl = "";

    if (registration.type === "fake") {
      // TODO: 依你的後端 API 規範填寫假表刪除路徑
      deleteUrl = `http://localhost:8080/registration/fake/${registration.registrationId}`;
    } else if (registration.type === "real") {
      // TODO: 依你的後端 API 規範填寫真表刪除路徑
      deleteUrl = `http://localhost:8080/registration/real/${registration.registrationId}`;
    } else {
      alert("未知的報名類型，無法取消");
      return;
    }

    try {
      const res = await fetch(deleteUrl, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('瀏覽器API獲取失敗');

      const resData = await res.json();

      if (resData.status === 200) {
        alert(resData.data || "取消成功");
        if (onCancel) onCancel(registration.registrationId);
      } else {
        alert(resData.message || "取消失敗");
      }
    } catch (err) {
      alert('伺服器回應錯誤: ' + err.message);
    }
  };

  return (
    <a href={`/event/${registration.eventId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card className="p-2 shadow-sm hover-lift w-100 border-0 rounded-2 bg-light">
        <Row className="g-3 align-items-center">

          {/* 活動標題 */}
          <Col md={8} xs={12}>
            <h5 className="mb-1 text-truncate" title={registration.title}>{registration.title}</h5>
            <div className="text-muted small">
              📅 {formatDate(registration.startTime)}
            </div>
          </Col>

          {/* 價格顯示 */}
          <Col md={2} xs={4} className="text-end pe-4">
            <div className="fw-bold">
              {registration.paidAmount === 0 ? (
                <span className="text-success">Free</span>
              ) : (
                <span className="text-danger">NT$ {registration.paidAmount}</span>
              )}
            </div>
          </Col>

          {/* 按鈕群組 */}
          <Col
            md={2}
            xs={8}
            className="d-flex align-items-center justify-content-md-end justify-content-start gap-2"
          >
            <Button
              className="rounded-pill shadow-sm px-3 flex-grow-1"
              variant={isPaid ? "success" : "warning"}
              size="sm"
              disabled
            >
              {(() => {
                switch (registration.status) {
                  case "PENDING_PAYMENT": return "待付款中";
                  case "COMPLETED": return "完成報名";
                  case "TIMEOUT": return "逾期未付款";
                  case "CANCELLED": return "已取消";
                  default: return "未知狀態";
                }
              })()}
            </Button>
            {registration.status !== "CANCELLED" && (
              <Button
                className="rounded-pill shadow-sm px-3 flex-grow-1"
                variant="outline-danger"
                size="sm"
                onClick={handlerCancel}
              >
                取消報名
              </Button>
            )}
          </Col>

        </Row>
      </Card>
    </a>
  );
}

export default RegistrationCard;
