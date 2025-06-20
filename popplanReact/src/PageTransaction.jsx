// src/pages/Transaction.jsx
import { useEffect, useState, useContext } from "react";
import { SessionContext } from './components/Provider/SessionProvider';
import { Container, Card, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom"; //獲取路徑 獲取轉頁
import { API_HOST } from './components/UrlApi/urlapi';
import Swal from 'sweetalert2';

export default function Transaction() {

  const { registrationId } = useParams();//:registrationId路徑
  const [remainingTime, setRemainingTime] = useState(null);
  const [expired, setExpired] = useState(false);
  const [showMessage, setShowMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  //token
  const { token } = useContext(SessionContext);
  //跳頁物件
  const navigate = useNavigate();


  //======fetch
  //交易按鈕
  const handlerTransactional = async () => {
    if (isLoading) return; //防止連續點擊
    setIsLoading(true);

    if (expired) {  //當逾時發生 做個保護  雖然我底下的付款按鈕已經隱藏了 理論上按不到
      return
    }
    try {
      const res = await fetch(`${API_HOST}/registration/${registrationId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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
      const res = await fetch(`${API_HOST}/registration/staging/${registrationId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (!res.ok) throw new Error('瀏覽器API獲取失敗');

      const resData = await res.json();
      if (resData.status === 200 && resData.data) {
        await Swal.fire({
          title: '成功',
          text: resData.data,
          icon: 'success',
          confirmButtonText: '回首頁'
        });
        navigate('/');
      } else {
        await Swal.fire({
          title: '操作失敗',
          text: resData.message,
          icon: 'error',
          confirmButtonText: '了解'
        });
      }
    } catch (err) {
      alert('伺服器回應錯誤')

    }
  }

  useEffect(() => {
    //初始仔入 抓取報名表DTO 算出付款時間多久失效  最底下自調用
    const registrationFetch = async () => {
      try {
        const res = await fetch(`${API_HOST}/registration/${registrationId}`, {
          method: 'GET',  //其實可以不寫 但我是菜鳥
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        })
        if (!res.ok) throw new Error('瀏覽器API獲取失敗');
        const resData = await res.json();
        console.log("拿到的資料是")
        console.log(resData)



        // 如果報名是免費的，直接跳轉到成功頁面，不進入交易頁面
        if (resData.status === 200 && resData.data) {
          if (resData.data.status == "COMPLETED") {
            // 直接跳轉到成功頁面（例如："/registration/success"）
            navigate(`/paymentSuccess`);
            return; // 免費報名，直接返回，避免後續代碼執行
          }

          // 計時器邏輯處理：如果是付費報名，則進行倒數計時
          const expireAt = new Date(resData.data.expireAt).getTime();
          const now = Date.now();
          let remainingMs = expireAt - now;

          if (remainingMs <= 0) {
            // 如果一開始就逾時，設定 expired 為 true
            setExpired(true);
          } else {
            // 設定剩餘時間並啟動倒數計時器
            setRemainingTime(Math.floor(remainingMs / 1000));   // Math.floor 用來將時間向下取整（整秒顯示）

            const timer = setInterval(() => {
              setRemainingTime(prev => {
                if (prev <= 1) {    // 如果剩餘時間小於等於 1 秒，則倒數結束
                  clearInterval(timer);
                  setExpired(true);
                  return 0;  // 最後一秒直接設為 0
                }
                return prev - 1;  // 每次倒數 1 秒
              });
            }, 1000);

            // ⚠️ 清除計時器，防止記憶體洩漏
            return () => clearInterval(timer);
          }
        } else {
          // 報名失敗或已逾時，回到上一頁或首頁
          alert('報名逾時請重新報名');

          if (window.history.length > 1) {
            window.history.back();  // 返回上一頁
          } else {
            navigate('/');  // 返回首頁
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
              <Button
                variant="outline-success"
                className="me-2"
                onClick={() => { handlerTransactional() }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      aria-hidden="true"
                    />{' '}
                    交易中...
                  </>
                ) : (
                  <>付款</>
                )}
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
