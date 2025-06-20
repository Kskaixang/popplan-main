// 要留意順序  最後才export default Appfu
// 子組件
function Hellow(){
  return (
    <h1>Hellow zi</h1>
  )
}
// 子組件 函數式寫法
const World = () => {
  return (
    <h1>World zi</h1>
  )
}
// 父組件
function Appfu(){
  return (
    <>
      <Hellow/>
      <World/>
    </>
  )
}
export default Appfu