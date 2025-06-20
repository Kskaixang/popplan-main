import { Form, Button, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

function LoginForm({ onClose }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // 模擬登入成功
    console.log('登入成功（模擬）');
    onClose(); // 👈 關閉登入框（回首頁）
  };

  return (
    <>
      {/* 背景遮罩 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 2, // 放在表單下面
        }}
        onClick={onClose} // 點擊遮罩關閉登入表單
      />
      {/* 登入表單 */}
      <Card
        style={{
          position: 'fixed', // 固定位置
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)', // 居中
          maxWidth: '400px',
          width: '100%',
          borderColor: '#90caf9',
          zIndex: 2, // 保證在遮罩上面
        }}
        className="shadow-sm border-2"
      >
        <Card.Body>
          <h4 className="text-primary mb-4">登入 PopPlan</h4>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="輸入 Email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>密碼</Form.Label>
              <Form.Control type="password" placeholder="輸入密碼" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCaptcha">
              <Form.Label>驗證碼</Form.Label>
              <Form.Control type="text" placeholder="請輸入驗證碼" />
              這是驗證碼區塊
              {/* 🔧 日後你可以加圖片或發送 email */}
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="primary" type="submit">
                登入
              </Button>
              <Button variant="outline-secondary" onClick={onClose}>
                取消
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}

LoginForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default LoginForm;
