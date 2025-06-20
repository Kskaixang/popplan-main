import './App.css'
import React, { useState } from "react";

function Cart() {
  const [name, setName] = useState("蘋果");
  const [price, setPrice] = useState("50");
  const [items, setItems] = useState([]);

  const handleAdd = () => {
    const newItem = { name, price: Number(price) };
    setItems([...items, newItem]);
    setName("蘋果");
    setPrice("50");
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handleDelete = (index) => {
    //setItems(items.filter((item, i) => i != index));
    //底線代表沒使用到 因為這次案例 物件中並沒有 id 可以使用 所以要用filter提供的索引
    setItems(items.filter((_, i) => i != index));
  }

  return (
    <div>
      <h2>老師的簡易購物車</h2>
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