// src/pages/Transaction.jsx
import { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom"; //獲取路徑 獲取轉頁
export default function Transaction() {
  const { registrationId } = useParams();//:registrationId路徑
  const [remainingTime, setRemainingTime] = useState(null);
  const [expired, setExpired] = useState(false);
  const [showMessage, setShowMessage] = useState('');
  //跳頁物件
  const navigate = useNavigate();


  //======fetch
  //交易按鈕
  const handlerTransactional = async () => {
    if (expired) {  //當逾時發生 做個保護  雖然我底下的付款按鈕已經隱藏了 理論上按不到
      return
    }
    try {
      const res = await fetch(`http://localhost:8080/registration/${registrationId}`, {
        method: 'PATCH',
        credentials: 'include'
      })
      if (!res.ok) throw new Error('瀏覽器獲取API失敗');
      const resData = await res.json();
      console.log(resData.data);
      if (resData.status == 200 && resData.data) {
        //alert(`報名成功！報名編號：${resData.data}`);
        navigate('/paymentSuccess');
        //補reslut頁
      } else {
        setShowMessage(resData.message);
      }


    } catch (err) {
      alert('伺服器回應錯誤')
    }
  }


  //取消按鈕
  const handlerCancel = async () => {
    if (registrationId == null) {
      navigate('/');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/registration/${registrationId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (!res.ok) throw new Error('瀏覽器API獲取失敗');

      const resData = await res.json();
      if (resData.status == 200 && resData.data) {
        alert(resData.data);
        navigate('/');
      } else {
        alert(resData.message);
      }
    } catch (err) {
      alert('伺服器回應錯誤')

    }
  }

  useEffect(() => {
    //初始仔入 抓取報名表DTO 算出付款時間多久失效  最底下自調用
    const registrationFetch = async () => {
      try {
        const res = await fetch(`http://localhost:8080/registration/${registrationId}`, {
          method: 'GET',  //其實可以不寫 但我是菜鳥
        })
        if (!res.ok) throw new Error('瀏覽器API獲取失敗');
        const resData = await res.json();
        console.log("拿到的資料是")
        console.log(resData)
        if (resData.status == 200 && resData.data) {
          //計時器----------------------------------------------------
          const expireAt = new Date(resData.data.expireAt).getTime();
          const now = Date.now();
          let remainingMs = expireAt - now;
          if (remainingMs <= 0) {
            //如果一開始就逾時 就true
            setExpired(true);
          } else {
            setRemainingTime(Math.floor(remainingMs / 1000));   //看不懂floor
            const timer = setInterval(() => {
              setRemainingTime(prev => {
                if (prev <= 1) {    //循環中 最後一次if判斷就是1秒 下一次循環會直接進到remainingMs=0
                  clearInterval(timer);
                  setExpired(true);
                  return 0;  // 最後一次循環就是0
                }
                //每次1000毫秒 remainingMs -1
                return prev - 1;
              });
            }, 1000);

            // ⚠️ 清除倒數避免記憶體洩漏
            return () => clearInterval(timer);

          }



        } else {
          alert('報名逾時請重新報名');
          //歷史瀏覽有得回復時 才觸發上一步
          if (window.history.length > 1) {
            window.history.back();
          } else {
            //如果用戶瀏覽器一打開就是交易頁 那就回首頁
            navigate('/'); // 自訂一個較合理的回退頁
          }


        }

      } catch (err) {
        alert('伺服器回應錯誤');
      }
    }
    registrationFetch();
  }, []);

  return (
    <Container style={{ maxWidth: "600px", marginTop: "50px" }}>
      <Card className="shadow p-4">
        <h4 className="text-center mb-4">活動報名付款</h4>

        {/* 倒數區塊 */}
        <Alert variant="warning" className="text-center">
          <span id="countdown">{expired ? "報名已逾時請待通知信告知結果後再次報名" : `剩餘時間： ${remainingTime} 秒`}</span>
        </Alert>

        {/* 模擬付款說明 */}
        <p className="mt-4 text-muted text-center">
          請在時間內完成付款。
        </p>
        <p className="mb-4 text-danger text-center" style={{ color: 'Red' }}>
          {showMessage}
        </p>

        {/* 按鈕區塊 */}
        <Row className="justify-content-center">
          <Col xs="auto">
            {!expired &&
              <Button variant="outline-success" className="me-2" onClick={() => { handlerTransactional() }}>
                付款
              </Button>
            }
            <Button type="submit" variant="outline-secondary" className="me-2" onClick={() => { handlerCancel() }}>
              取消
            </Button>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}
