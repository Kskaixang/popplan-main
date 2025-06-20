import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>這是首頁</h2>
      <button onClick={() => navigate("/hello")}>前往 Hello World 頁面</button>
    </div>
  );
}

export default Home;
