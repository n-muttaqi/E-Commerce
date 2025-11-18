import React, { useEffect, useState } from "react";
import axios from "axios";
import { getBaseURL } from "../apiConfig";
import "./ShoppingCart.scss";

const ShoppingCart = (props) => {
  const [cartProducts, setCartProducts] = useState(props.cartProducts);
  const customerId = sessionStorage.getItem("customerId");

  useEffect(() => {
    axios
      .get(`${getBaseURL()}api/cart/${customerId}`)
      .then((res) => setCartProducts(res.data))
      .catch(() => console.log("Error occurred"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.cartProducts]);

  return (
    <>
      {cartProducts?.length > 0 ? (
        <>
          <h1>Shopping Cart</h1>

          <div>
            {/* The table matches the updated SCSS */}
            <table className="shopping-cart-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Remove</th>
                </tr>
              </thead>

              <tbody>
                {cartProducts.map((product) => (
                  <tr key={product.productId}>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>{product.price * product.quantity}</td>
                    <td>
                      <button onClick={() => props.removeProduct(product.productId)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Address + buy */}
            <div className="address-container">
              <input
                type="text"
                className="address-input"
                placeholder="Address"
                value={props.address}
                onChange={(e) => props.updateAddress(e.target.value)}
              />

              <button className="buy-button" onClick={props.buyProducts}>
                Buy
              </button>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default ShoppingCart;
