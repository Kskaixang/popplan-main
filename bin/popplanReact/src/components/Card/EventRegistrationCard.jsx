import { Card, Button, Row, Col, Container } from "react-bootstrap";
import './EventCard.css'
function RegistrationCard({ registration }) {
  /*
  1-{registrationId: 7, status: 'TIMEOUT', paidAmount: 500, eventId: 1, title: '新北市三重區'}
  2-{registrationId: 6, status: 'TIMEOUT', paidAmount: 500, eventId: 1, title: '新北市三重區'}
  3-{registrationId: 5, status: 'COMPLETED', paidAmount: 10, eventId: 5, title: '這是一個默認的假活動標題這是一個默認的假活動標題'}
  4-{registrationId: 4, status: 'TIMEOUT', paidAmount: 10, eventId: 5, title: '這是一個默認的假活動標題這是一個默認的假活動標題'}
  5-{registrationId: 3, status: 'COMPLETED', paidAmount: 100, eventId: 12, title: 'KTV活動'}
  6-{registrationId: 1, status: 'COMPLETED', paidAmount: 0, eventId: 10, title: '這是一個默認的假活動標題這是一個默認的假活動標題這是一個默認的假活動標題這是一個默認的假活動標題這是一個默認的假活動標題這是一個默認的假活動標題'}
  length-7
  */
  console.log('卡片端的資料是?', registration)

  const isPaid = true;
  const formatDate = (datetime) => {
    if (!datetime) return "無日期";
    //把SQL 轉換成 JS可讀的格式
    const isoDate = datetime.replace(" ", "T");
    const date = new Date(isoDate);
    if (isNaN(date)) return "格式錯誤";
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  //取消按鈕
  const handlerCancel = async () => {
    try {
      const res = await fetch(`http://localhost:8080/registration/${registrationId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('瀏覽器API獲取失敗');

      const resData = await res.json();
      if (resData.status == 200 && resData.data) {
        alert(resData.data);
      } else {
        alert(resData.message);
      }
    } catch (err) {
      alert('伺服器回應錯誤')

    }
  }

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
              {isPaid ? "完成報名" : "待付款中"}
            </Button>
            <Button
              className="rounded-pill shadow-sm px-3 flex-grow-1"
              variant="outline-danger"
              size="sm"
              type="submit"
            >
              取消報名
            </Button>
          </Col>

        </Row>
      </Card>
    </a>
  );
}


export default RegistrationCard;
