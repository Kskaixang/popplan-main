// 陣列
function App() { 
  const items1 = ['Apple','Banana','Orange']
  const items2 = [
    //key 是幫助React 來識別每個元素的唯一性
    <li key='1'>Apple</li>,
    <li key='2'>Banana</li>,
    <li key='3'>Orange</li>
  ]
  const items3 = items1.map((item,index) => (   
    <li key={index}>{index}-{item}</li>
  ))
  return (
    <>
      {items1}
      <p/>
      {items2}
      <p/>
      {items3}
    </>
  )
}
export default App
