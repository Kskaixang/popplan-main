import './App.css'
import React, { useState, useEffect } from "react";
//元件載入後要做的行為 
function Cart() {

  //預設商品名稱與價格 我們要設定下拉框點選
  const products = [
    { name: "蘋果", price: 50 }, { name: "香蕉", price: 30 }, { name: "芒果", price: 60 },
    { name: "葡萄", price: 70 }, { name: "西瓜", price: 90 }, { name: "柳丁", price: 80 }
  ]

  const [name, setName] = useState(products[0].name);
  const [price, setPrice] = useState(products[0].price);
  const [items, setItems] = useState([]);

  const handleAdd = () => {
    const newItem = { name, price: Number(price) };
    setItems([...items, newItem]);
    setName("");
    setPrice("");
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handleDelete = (index) => {
    //setItems(items.filter((item, i) => i != index));
    //底線代表沒使用到 因為這次案例 物件中並沒有 id 可以使用 所以要用filter提供的索引
    setItems(items.filter((_, i) => i != index));
  }

  const handleSelectChange = (e) => {
    const selectedName = e.target.value;
    const selectedProduct = products.find(p => p.name === selectedName);
    setName(selectedProduct.name);
    setPrice(selectedProduct.price);
  }

  return (
    <div>
      <h2>老師的簡易購物車</h2>
      <select onChange={handleSelectChange}>
        {
          products.map((p, index) => (
            <option key={index} value={p.name}>{p.name} ${p.price}</option>
          ))
        }
      </select>
      <br />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="商品名稱"
      />
      <br />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="價格"
      />
      <p />
      <button onClick={handleAdd}>新增</button>

      <h3>購物車內容:</h3>
      <ul>
        {items.length === 0 ? (<li>無商品</li>) : (
          items.map((item, index) => (
            <li key={index}>
              {index + 1}. {item.name} - ${item.price}
              <button onClick={() => handleDelete(index)}>刪除</button>
            </li>
          )))}
      </ul>

      <h3>總金額: {total}</h3>
    </div>
  );
}

export default Cart;