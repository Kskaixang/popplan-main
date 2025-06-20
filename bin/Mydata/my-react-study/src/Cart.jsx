/* TodoList 拆分模組練習
src/
├── components/
│   ├── CartInput.jsx
│   ├── CartItem.jsx
│   └── CartList.jsx
├── Cart.jsx
├── App.css
*/
import './App.css'
import { useState } from 'react';
import CartInput from './components/CartInput';

function App() {


  const [products, setProducts] = useState([
    { id: 1, productName: '蘋果', price: 50 },
    { id: 2, productName: '香蕉', price: 30 }
  ])

  const [product, setProduct] = useState({ productName: '', price: '' });

  const totalPrice = products.reduce((sum, e) => sum + Number(e.price), 0);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev, // 保留先前的資料
      [name]: value // 動態設置對應欄位
    }));
  };

  const handleProductAdd = (productName, price) => {
    const newId = products.length > 0 ? Math.max(...products.map((e) => e.id)) + 1 : 1;
    const newProduct = { id: newId, productName: productName, price: price };
    setProducts([...products, newProduct]);
    setProduct({ productName: '', price: '' });

  }

  const handleProductDelete = (id) => {
    // 利用 filter 來過濾不需要的資料
    setProducts(products.filter((product) => product.id !== id));
  }

  return (
    <>
      <h1>Cart</h1>
      {/* [輸入框: 商品名稱] [輸入框: 商品價格] [新增按鈕]  */}
      {/* <div>
        <input type="text" name="productName" value={product.productName} onChange={handleInputChange} />商品名稱
        <p />
        <input type="text" name="price" value={product.price} onChange={handleInputChange} />商品價格
        <p />
        <button onClick={() => handleProductAdd(product.productName, product.price)}>添加</button>
      </div > */}
      <CartInput product={product} handleInputChange={handleInputChange} handleProductAdd={handleProductAdd} />


      {/* <CartList products={products} handleProductDelete={handleProductDelete} /> */}
      <ul>
        {
          products.map((product) => (
            <li key={product.id}>
              -編號: {product.id}
              <span name="editName">-名稱: {product.productName}</span>
              -價格: {product.price}
              <button onClick={() => handleProductDelete(product.id)}>  Delete</button>
            </li>
          ))
        }
      </ul>

      <span>商品總價: $ {totalPrice}</span>




    </>
  )
}

export default App
