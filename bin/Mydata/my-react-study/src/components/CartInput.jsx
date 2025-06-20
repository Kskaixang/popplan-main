
function CartInput({ product, handleInputChange, handleProductAdd }) {
  return (
    <div>
      <input type="text" name="productName" value={product.productName} onChange={handleInputChange} />商品名稱
      <p />
      <input type="text" name="price" value={product.price} onChange={handleInputChange} />商品價格
      <p />
      <button onClick={() => handleProductAdd(product.productName, product.price)}>添加</button>
    </div >
  )
}
export default CartInput
