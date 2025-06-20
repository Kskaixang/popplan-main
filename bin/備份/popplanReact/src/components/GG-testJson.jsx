import { useState, useEffect } from "react";

function JsonViewer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/myjson")
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  if (data === null) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>測試資料</h2>
      <p>名字：{data.name}</p>
      <p>性別：{data.gender}</p>
    </div>
  );
}

export default JsonViewer;
