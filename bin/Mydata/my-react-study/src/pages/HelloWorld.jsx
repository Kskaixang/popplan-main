import { useNavigate } from "react-router-dom";
function HelloWorld() {
  const navigate = useNavigate();
  return (
    <div>
      <h2>Hello, World! 👋</h2>
      <button onClick={() => navigate("/")}>回到頁面</button>
    </div>
  );
}

export default HelloWorld;
