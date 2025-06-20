import React, { useEffect, useState } from 'react';

function CheckSession() {
  const [sessionData, setSessionData] = useState(null);
  useEffect(() => {
    fetch('http://localhost:8080/user/login/session', {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error("Session not found or server error");
        return res.json();
      })
      .then(data => {
        setSessionData(data);
        console.log("Session Data:", data);
      })
      .catch(err => {
        console.error(err);
        setSessionData(null);
      });
  }, []); // ✅ 只執行一次（掛載時）

  return (
    <>
      <h1>檢查登入 Session</h1>
      {sessionData ? (
        <pre>{JSON.stringify(sessionData, null, 2)}</pre> // 美化顯示 session
      ) : (
        <p>尚未登入或無 session 資料</p>
      )}
    </>
  );
}

export default CheckSession;