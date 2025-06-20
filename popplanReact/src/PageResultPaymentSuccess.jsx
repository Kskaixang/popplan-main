import { Container, Card, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
function PaymentSuccess() {
  const [imageUrl, setImageUrl] = useState();
  const [eventId, setEventId] = useState();
  const [haveParams, setHaveParams] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    console.log(queryParams)
    if (queryParams.size === 0) {
      return
    }
    const encodedUrl = queryParams.get("url");
    setImageUrl(decodeURIComponent(encodedUrl));
    const eventId = queryParams.get("eventId");
    setEventId(eventId);
    setHaveParams(true);

  }, []);


  return (
    <Container style={{ marginTop: "80px", maxWidth: "500px" }}>
      {haveParams ?
        <Card className="text-center p-4 shadow">
          <h4 className="mt-3">編號{eventId}活動 報名成功</h4>
          <img src={imageUrl} />
          <h4 className="mb-4">🎉 加入獲得更多資訊!</h4>
          <Button variant="outline-secondary" href="/" className="custom-clear-button">
            回首頁
          </Button>
        </Card> :
        <Card className="text-center p-4 shadow">
          <h4 className="mb-3">🎉 報名成功</h4>
          <h4 className="mb-4">感謝你的報名，活動資訊與QRcode已寄送至你的信箱。</h4>
          <Button variant="outline-secondary" href="/" className="custom-clear-button">
            回首頁
          </Button>
        </Card>
      }
    </Container>
  );
}

export default PaymentSuccess;
