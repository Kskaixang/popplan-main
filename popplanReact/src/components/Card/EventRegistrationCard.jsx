import { Card, Button, Row, Col } from "react-bootstrap";
import './EventCard.css'
import { toast } from 'react-toastify'; //通知框
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { SessionContext } from '../Provider/SessionProvider';
import Swal from 'sweetalert2';
import { API_HOST } from '../UrlApi/urlapi';

function RegistrationCard({ registration, fetchEvent }) { //, onCancel
  //token
  const { token } = useContext(SessionContext);

  // 判斷付款狀態的輔助函數（根據 enum 狀態）
  const isPaid = registration.status === "COMPLETED";
  const navigate = useNavigate();
  const formatDate = (datetime) => {
    if (!datetime) return "無日期";

    // 將資料庫的時間字串解析為 Date，預設是當作本地時間
    const date = new Date(datetime.replace(" ", "T") + "Z"); // 加 Z → 當作 UTC 解析

    if (isNaN(date)) return "格式錯誤";

    // 調整成台灣時間（UTC+8）------------------------------
    const localDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);

    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // 取消報名按鈕點擊事件
  const handlerCancel = async () => {

    //if (!window.confirm("確定要取消報名嗎？")) return;
    const result = await Swal.fire({
      title: '確定要取消報名嗎？',
      text: '取消會釋出報名位置',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '確認',
      cancelButtonText: '取消',
    });
    if (!result.isConfirmed) {  //這是由Swal回傳的boolean物件
      // 用戶取消了，什麼都不做
      return;
    }

    let deleteUrl = "";

    if (registration.type === "staging") {
      // TODO: 依你的後端 API 規範填寫假表刪除路徑
      console.log('本次觸發了staging')
      deleteUrl = `${API_HOST}/registration/staging/${registration.registrationId}`;
    } else if (registration.type === "real") {
      // TODO: 依你的後端 API 規範填寫真表刪除路徑
      console.log('本次觸發了real')
      deleteUrl = `${API_HOST}/registration/real/${registration.registrationId}`;
    } else {
      alert("未知的報名類型，無法取消");
      return;
    }

    try {
      const res = await fetch(deleteUrl, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      console.log(res)
      if (!res.ok) throw new Error('瀏覽器API獲取失敗');

      const resData = await res.json();

      if (resData.status === 200) {
        Swal.fire('成功', '報名已取消', 'success');
        await fetchEvent();
        // window.location.reload();  我不希望把我的通知洗掉 有沒有辦法重讀 重新渲染

      } else {
        toast.info(resData.data)
      }
    } catch (err) {
      toast.info('伺服器回應錯誤: ' + err.message);
    }
  };
  //重回報名頁
  const handlerToPayment = async () => {
    try {
      const res = await fetch(`${API_HOST}/registration/${registration.eventId}`, {
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
        navigate(`/registration/${resData.data.registrationId}`);
      } else {
        Swal.fire('錯誤', `${resData.message || "無法創建事件(也無收到 JSON)"}`, 'error');
      }
    } catch (err) { //伺服器錯誤
      alert(err);
    }
  }


  return (
    <div onClick={() => navigate(`/event/${registration.eventId}`)} style={{ cursor: 'pointer' }}>
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
              onClick={(e) => {

                if (registration.status === "PENDING_PAYMENT") {
                  e.stopPropagation();
                  handlerToPayment();
                }
              }}
            >
              {(() => {
                switch (registration.status) {
                  case "PENDING_PAYMENT": return "待付款中";
                  case "COMPLETED": return "報名成功";
                  case "TIMEOUT": return "逾期未付款";
                  case "CANCELLED": return "已取消";
                  default: return "未知狀態";
                }
              })()}
            </Button>

            {(registration.status === "COMPLETED" || registration.status === "PENDING_PAYMENT") && (
              <Button
                className="rounded-pill shadow-sm px-3 flex-grow-1"
                variant="outline-danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handlerCancel(e);
                }}>
                取消報名
              </Button>
            )}
          </Col>

        </Row>
      </Card>
    </div>
  );
}

export default RegistrationCard;
