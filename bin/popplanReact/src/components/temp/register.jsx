import { Form } from "react-bootstrap";

function register() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // 模擬登入成功
    console.log('登入成功（模擬）');
    onClose(); // 👈 關閉登入框（回首頁）
  };
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="輸入 Email" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>密碼</Form.Label>
          <Form.Control type="password" placeholder="輸入密碼" />
        </Form.Group>
      </Form>
      <div className="d-flex justify-content-between">
        <Button variant="primary" type="submit">
          登入
        </Button>
        <Button variant="outline-secondary" onClick={onClose}>
          取消
        </Button>
      </div>
    </>
  )

}
export default register