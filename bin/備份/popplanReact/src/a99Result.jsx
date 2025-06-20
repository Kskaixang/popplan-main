import { useEffect, useState } from "react";

function Result() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const user = queryParams.get("username");
    setUsername(user);
  }, []);

  if (!username) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>驗證成功！</h2>
      <p>用戶 {username} 的 email 已通過驗證。</p>
      <a href="/">回首頁</a>
    </div>
  );
}

export default Result;
