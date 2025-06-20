// 事件處理
function App() { 
  const handleClick2 = function(){
    alert('2OK');
  } 
  const handleClick3 = (e) => {
    alert('3OK');
    console.log(e);
  }
  return (
    <>
      <button onClick={  function(){{alert('1ok')}}  }>我是按鈕 1</button>
      <button onClick={  handleClick2  }>我是按鈕 2</button>
      <button onClick={  handleClick3  }>我是按鈕 3</button>
    </>
  )
}
export default App
