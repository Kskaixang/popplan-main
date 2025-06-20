//React 組件間的參數傳遞


//子組件
function CircleArea({ r }) {
  const pi = 3.1415926;
  const area = r * r * pi;
  return (<div>{area}</div>)
}

//子組件函數寫法
const CircleArea2 = ({ r }) => {
  const pi = 3.1415926;
  const area = r * r * pi;
  return (<div>{area}</div>)
}

const Fruit = ({ fruit_name, fruit_price }) => {
  //通常的寫法 一個參數對一個參數
  return (<div>水果名稱:{fruit_name} 水果價格{fruit_price}</div>)
}

const Fruit2 = (props) => {
  //進階的寫法 props參數
  return (<div>水果名稱:{props.fruitName} 水果價格{props.fruitPrice}</div>)
}

const Fruit3 = (props) => {
  //這裡只是說明 props也能調用console.log 並在App父組件中 調用時使用
  props.printLog();
  return (<div>水果名稱:{props.fruitName} 水果價格{props.fruitPrice}</div>)
}

//父組件
function App() {
  return (
    <>
      <h4>APP12-組件間的參數傳遞</h4>
      <CircleArea r="10" />
      <CircleArea2 r="20" />
      <h4>APP12-props參數集合</h4>
      <Fruit fruit_name="Apple" fruit_price="50" />
      <Fruit2 fruitName="Apple" fruitPrice="50" />
      <Fruit3 fruitName="Orange" fruitPrice="40" printLog={() => { console.log('柳丁') }} />
    </>
  )
}
export default App
