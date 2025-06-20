import { useEffect, useState } from "react";
import { Container, Card, Button, Spinner } from "react-bootstrap";

function Result() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const user = queryParams.get("username");
    setUsername(user);
  }, []);

  if (!username) {
    return (
      <Container style={{ marginTop: "80px" }}>
        <Card className="text-center p-4 shadow">
          <Spinner animation="border" variant="secondary" className="mb-3" />
          <p>驗證中，請稍候...</p>
        </Card>
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: "80px", maxWidth: "500px" }}>
      <Card className="text-center p-4 shadow">
        <h4 className="mb-3">✅ 驗證成功！</h4>
        <p className="mb-4">用戶 <strong>{username}</strong> 的 Email 已通過驗證。</p>
        <Button variant="outline-secondary" href="/" className="custom-clear-button">
          回首頁
        </Button>
      </Card>
    </Container>
  );
}

export default Result;
