import { useState } from "react";

function App() {
  //狀態驅動寫法
  //[設定一個count變數 ,  設定變更count的方法] = 將count的預設為0  代碼更簡潔
  const [count, setCount] = useState(0);
  function handleClick() {
    setCount(count + 1);
  }



  //沒有useState的寫法  *冗長 整天在document.getElementById 整個沒完
  // let count = 0;
  // function handleClick() {
  //   count++;  // 更新 count 相當於serCount
  //   document.getElementById('count').textContent = count;
  // }

  return (
    <>
      <h4>APP13 元素內容的狀態 : count++ 是不會讓 React 重新 render 我們要理解 狀態驅動</h4>
      <div>{count}</div>
      {/* <div id="count">0</div>  沒有useState的寫法 */}
      <button onClick={handleClick}>按我一下count+1</button>
    </>
  )
}
export default App
