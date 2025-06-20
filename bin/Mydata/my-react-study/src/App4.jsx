// 變數應用
function App() { 
  const test = 'Hello React';
  return (
    <>
      <h1>{test}</h1>
      <h1>{test.toUpperCase()}</h1> <h1>{test}</h1>
      {/* 要下CSS 要雙層 {{}} */}
      <h1 style={{backgroundColor: 'red'}}>{test}</h1>
      <form >
        Text: <input type="text" value={test} />
      </form>
    </>
  )
}
export default App
