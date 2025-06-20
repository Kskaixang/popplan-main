
function CartList(products, handleProductDelete) {
  return (
    <ul>
      {
        products.map((product) => (
          <li key={product.id} >編號:{product.id} 名稱:{product.productName} 價格: {product.price}
            <button onClick={() => handleProductDelete(product.id)}>  Delete</button>
          </li>
        ))
      }
    </ul>
  )
}
export default CartList;
