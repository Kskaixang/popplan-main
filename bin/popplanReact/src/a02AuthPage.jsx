import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Image } from 'react-bootstrap';
import "./components/css/button.css";
import { SessionContext } from './components/Provider/SessionProvider';
function AuthPage() {
  const { setUser, setIsLoggedIn } = useContext(SessionContext); //設定容器與登入狀況
  // 控制目前是登入或註冊
  const [mode, setMode] = useState('login');

  // 表單欄位狀態
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('wss07715@gmail.com');
  const [password, setPassword] = useState('abc');
  const [authcode, setAuthcode] = useState('');
  //跳頁物件
  const navigate = useNavigate();




  // 切換登入 / 註冊模式
  const toggleMode = (newMode) => {
    setMode(newMode);
    // 清空表單
    setUsername('凱Ks');
    setEmail('wss07715@gmail.com');
    setPassword('abc');
    setAuthcode('');
  };

  // 提交處理（可接 API）
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = mode === 'login' ? '/user/login' : '/user/register';

    // 組裝要送出的資料
    const payload = mode === 'login'
      ? { email, password, authcode }
      : { email, password, username };

    try {
      const response = await fetch('http://localhost:8080' + url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },

        credentials: "include",//🔥 這個一定要帶上才能保留 session/cookie
        body: JSON.stringify(payload)
      });
      console.log(response)
      const resdata = await response.json();
      console.log('後端回傳資料:', resdata.data);
      if (resdata.status == 200) {
        alert(`${mode === 'login' ? '登入:' : '註冊:'}  ${resdata.message}`);

        // 清空表單
        setMode('login');
        setUsername('');
        setEmail('');
        setPassword('');
        setAuthcode('');
        //處理容器
        setUser(resdata.data);
        setIsLoggedIn(true);

        // 可導向其他頁面，例如：
        navigate('/');
        window.location.reload()
      } else {
        alert(resdata.message || '操作失敗');
        setAuthcode('');
        window.location.reload()
      }

    } catch (error) {
      console.error('錯誤:', error);
      alert('連線錯誤，請稍後再試');
    }
  };


  return (
    <Container className="mt-4 p-4 border border-gray bg-white shadow rounded" style={{ maxWidth: '400px' }}>
      {/* 頁首：登入 / 註冊切換按鈕 */}
      <Row className="mb-3 text-center">
        <Col>
          <Button
            variant="outline-secondary"
            className={`w-100 me-2 mb-2 rounded-pill shadow-sm px-3 custom-clear-button ${mode === 'login' ? 'selected-mode' : ''
              }`}
            onClick={() => toggleMode('login')}
          >
            登入
          </Button>
        </Col>

        <Col>
          <Button
            variant="outline-secondary"
            className={`w-100 me-2 mb-2 rounded-pill shadow-sm px-3 custom-clear-button ${mode === 'register' ? 'selected-mode' : ''
              }`}
            onClick={() => toggleMode('register')}
          >
            註冊
          </Button>
        </Col>
      </Row>

      {/* 表單區塊 */}
      {mode !== 'login' && (
        <Form.Group className="mb-3">
          <Form.Label>使用者名稱：</Form.Label>
          <Form.Control
            type="text"
            placeholder="請輸入使用者名稱"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
      )}
      <Form onSubmit={handleSubmit}>
        {/* 信箱欄位 */}
        <Form.Group className="mb-3">
          <Form.Label>信箱：</Form.Label>
          <Form.Control
            type="email"
            placeholder="請輸入信箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        {/* 密碼欄位 */}
        <Form.Group className="mb-3">
          <Form.Label>密碼：</Form.Label>
          <Form.Control
            type="password"
            placeholder="請輸入密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        {/* 驗證碼欄位：僅登入模式顯示 */}



        {/* 驗證碼欄位：僅登入模式顯示 */}
        {mode === 'login' && (
          <Form.Group className="mb-3">
            <Form.Label>驗證碼：</Form.Label>
            <Row className="align-items-center">
              <Col xs={5}>
                <Form.Control
                  type="text"
                  placeholder="請輸入驗證碼"
                  value={authcode}
                  onChange={(e) => setAuthcode(e.target.value)}
                  required
                />
              </Col>
              <Col xs="auto">
                <Image
                  src="http://localhost:8080/user/authcode" // 為了避免快取，點擊按鈕時刷新
                  alt="驗證碼"
                  fluid
                  style={{ maxHeight: '40px' }} // 控制高度，看起來更整齊
                // 🔄 加上 key，每次刷新時強制 React 重新渲染
                />
              </Col>
              <Col xs="auto">
                <Button
                  variant="outline-primary"
                  onClick={() => window.location.reload()} // 點擊刷新圖像
                >
                  重新產生
                </Button>
              </Col>
            </Row>
          </Form.Group>
        )}

        {/* 提交 / 取消按鈕 */}
        <div className="d-flex justify-content-between">
          <Button
            className="w-100 me-2 mb-2 rounded-pill shadow-sm px-3 "
            type="submit" variant="outline-secondary">
            {mode === 'login' ? '確認' : '註冊'}
          </Button>
          <Button
            className="w-100 me-2 mb-2 rounded-pill shadow-sm px-3 "
            variant="outline-secondary" type="button"
            href='/'>
            取消
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default AuthPage;
