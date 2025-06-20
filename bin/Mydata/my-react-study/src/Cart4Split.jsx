/* Cart 拆分模組練習
src/
├── componentsCart4/
│   ├── ProductSelector.jsx 商品下拉選單組件
│   ├── CartList.jsx        購物車清單組件(含刪除按鈕)
│   └── TotalAmount.jsx     顯示總金額組件
├── Cart4Split.jsx
├── App.css
*/

import './App.css'
import React, { useState, useEffect } from "react";
import ProductSelector from './componentsCart4/ProductSelector';
import CartList from './componentsCart4/CartList';
import TotalAmount from './componentsCart4/TotalAmount';
//元件載入後要做的行為 
function Cart() {

  //預設商品名稱與價格 我們要設定下拉框點選
  // const products = [
  //   { name: "蘋果", price: 50 }, { name: "香蕉", price: 30 }, { name: "芒果", price: 60 },
  //   { name: "葡萄", price: 70 }, { name: "西瓜", price: 90 }, { name: "柳丁", price: 80 }
  // ]
  //抓JSON
  const [products, setProducts] = useState([]);
  const [name, setName] = useState(products.name);
  const [price, setPrice] = useState(products.price);
  const [items, setItems] = useState([]);

  //當[]其中元素改變時 這個副加作用會執行
  //空陣列[]代表執行一次
  //陣列[name]代表當name改變時 就會重新執行此effect
  // useEffect(() => {} , [])
  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setName(data[0].name);
        setPrice(data[0].price);
      })
      .catch(err => {
        console.log("載入失敗", err);
      });
  }, [])




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

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('購物車是空的');
      return;
    }

    fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items,
        total,
        createdAt: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
      })
    })
      .then(res => res.json())
      .then(data => {
        alert("結帳成功");
        setItems([]); // 清空購物車
      })
      .catch(err => {
        console.log("結帳失敗:".err);
        alert("結帳失敗");
      });
  }

  return (
    <div>
      <h2>老師JSON SPLIT簡易購物車</h2>
      <ProductSelector products={products} handleSelectChange={handleSelectChange} />
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

      <CartList items={items} handleDelete={handleDelete} />
      <TotalAmount total={total} />
      <button onClick={handleCheckout}>結帳</button>
    </div>
  );
}

export default Cart;