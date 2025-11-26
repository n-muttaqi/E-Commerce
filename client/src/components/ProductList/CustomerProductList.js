import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { getBaseURL } from "../apiConfig";
import {
  FiShoppingCart,
  FiPackage,
  FiPlus,
  FiRefreshCw,
  FiAlertTriangle,
  FiX,
  FiTrash2,
  FiMapPin,
  FiCheckCircle,
} from "react-icons/fi";
import "./CustomerProductList.scss";

const ProductListCustomer = (props) => {
  const [productList, setProductList] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const customerId = sessionStorage.getItem("customerId");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [error, setError] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  const cartRef = useRef(null);

  // Close cart when clicking outside
  useEffect(() => {
    const onClickOutside = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setCartOpen(false);
      }
    };
    if (cartOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [cartOpen]);

  // Load products + cart (unchanged API logic)
  const fetchData = () => {
    if (!customerId) return;
    setLoading(true);
    setError("");

    axios
      .get(`${getBaseURL()}api/products`)
      .then((res) => {
        res.data.forEach((product) => {
          product.quantity = 0;
        });

        axios
          .get(`${getBaseURL()}api/cart/${customerId}`)
          .then((responseCart) => {
            let productsInCart = responseCart.data;
            setCartProducts(productsInCart);
            setProductList(res.data);
          })
          .catch((err) => {
            console.log("Error occurred");
            setError("Could not load cart. Please try again.");
          });
      })
      .catch((err) => {
        console.log("Error");
        setError("Could not load products. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add to cart (unchanged API shape)
  const addToCart = (product) => {
    if (product.quantity > 0) {
      setAddingId(product.productId);
      setError("");

      let updatedCartList = [...cartProducts];
      let existingProductIndex = updatedCartList.findIndex(
        (p) => p.productId === product.productId
      );

      if (existingProductIndex !== -1) {
        updatedCartList[existingProductIndex].quantity =
          updatedCartList[existingProductIndex].quantity + product.quantity;
      } else {
        updatedCartList.push({ ...product });
      }

      axios
        .post(`${getBaseURL()}api/cart/add`, {
          customerId,
          productId: product.productId,
          quantity: product.quantity,
          isPresent: existingProductIndex !== -1,
        })
        .then((res) => {
          setCartProducts(updatedCartList);
          const updatedProductList = productList.map((p) => ({
            ...p,
            quantity: 0,
          }));
          setProductList(updatedProductList);
        })
        .catch((error) => {
          console.log("Error adding to cart:", error);
          setError("Could not add product to cart. Please try again.");
        })
        .finally(() => {
          setAddingId(null);
        });
    }
  };

  // Remove from cart (unchanged API)
  const removeProduct = (productId) => {
    axios
      .delete(`${getBaseURL()}api/cart/remove/${productId}/${customerId}`)
      .then((res) => {
        console.log("Deleted successfully");
        let updatedCartList = cartProducts.filter((product) => {
          return product.productId !== productId;
        });
        setCartProducts(updatedCartList);
      })
      .catch((err) => {
        console.log("Error occurred");
        setError("Could not remove product from cart. Please try again.");
      });
  };

  // Update quantity (front-end only)
  const updateProductQuantity = (e, productId) => {
    const updatedList = productList.map((product) => {
      if (product.productId === productId) {
        const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
        product.quantity = isNaN(val) || val < 0 ? 0 : val;
      }
      return product;
    });
    setProductList(updatedList);
  };

  // Buy (unchanged API logic & headers)
  const buyProducts = () => {
    const token = sessionStorage.getItem("jwt_token");

    if (!token) {
      alert("Authorization token is missing");
      return;
    }

    if (address !== "") {
      let customerPayload = { address };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      axios
        .post(`${getBaseURL()}api/cart/buy/${customerId}`, { ...customerPayload }, config)
        .then((res) => {
          setCartProducts([]);
          setAddress("");
          setCartOpen(false);
          alert("Order placed successfully");
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            alert("Authorization failed. Please log in again.");
          } else {
            console.error("Error:", error);
            setError("Could not place order. Please try again.");
          }
        });
    } else {
      alert("Please enter your address");
    }
  };

  const refreshProducts = () => {
    fetchData();
  };

  const totalCartItems = cartProducts.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const cartTotal = cartProducts.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 0),
    0
  );

  return (
    <>
      <div className="customer-products-container">
        <div className="customer-products-header">
          <div className="title-block">
            <h1>
              <FiPackage size={22} />
              <span>Shop Products</span>
            </h1>
            <p>Browse items and add them to your cart.</p>
          </div>

          <div className="header-actions">
            {/* <button
              className="ghost-btn"
              onClick={refreshProducts}
              disabled={loading}
              aria-label="Refresh products"
            >
              <FiRefreshCw className={loading ? "spin-icon" : ""} size={18} />
              <span>{loading ? "Refreshing..." : "Refresh"}</span>
            </button> */}

            {/* Cart button (top-right) */}
            <div className="cart-wrapper" ref={cartRef}>
              <button
                className={`cart-btn ${cartOpen ? "active" : ""}`}
                onClick={() => setCartOpen((v) => !v)}
                aria-expanded={cartOpen}
                aria-controls="cart-panel"
                aria-label="Open cart"
              >
                <FiShoppingCart size={18} />
                {totalCartItems > 0 && (
                  <span className="cart-badge" aria-label={`${totalCartItems} items in cart`}>
                    {totalCartItems}
                  </span>
                )}
              </button>

              {/* Slide-down cart panel */}
              <div
                id="cart-panel"
                className={`cart-panel ${cartOpen ? "open" : ""}`}
                role="dialog"
                aria-modal="true"
              >
                <div className="cart-panel-header">
                  <div className="cart-title">
                    <FiShoppingCart size={18} />
                    <span>Your Cart</span>
                  </div>
                  <button className="icon-ghost" onClick={() => setCartOpen(false)} aria-label="Close cart">
                    <FiX size={18} />
                  </button>
                </div>

                {cartProducts.length === 0 ? (
                  <div className="cart-empty">
                    <p>Your cart is empty.</p>
                    <p className="muted-text">Add items from the product list.</p>
                  </div>
                ) : (
                  <>
                    <ul className="cart-list">
                      {cartProducts.map((item) => (
                        <li key={item.productId} className="cart-item">
                          <div className="cart-item-main">
                            <div className="cart-item-name">{item.name}</div>
                            <div className="cart-item-meta">
                              <span className="qty">× {item.quantity}</span>
                              <span className="price">${item.price}</span>
                            </div>
                          </div>
                          <button
                            className="icon-danger"
                            onClick={() => removeProduct(item.productId)}
                            aria-label={`Remove ${item.name}`}
                            title="Remove"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>

                    <div className="cart-total-row">
                      <span>Total</span>
                      <strong>${cartTotal.toFixed(2)}</strong>
                    </div>

                    <div className="address-block">
                      <label htmlFor="address">
                        <FiMapPin size={16} />
                        <span>Delivery Address</span>
                      </label>
                      <textarea
                        id="address"
                        rows={3}
                        placeholder="Street, City, ZIP"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>

                    <button className="primary-btn" onClick={buyProducts}>
                      <FiCheckCircle size={18} />
                      <span>Place Order</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <FiAlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="customer-products-card">
          {loading && productList.length === 0 ? (
            <div className="table-loading">
              <div className="loader" />
              <p>Loading products...</p>
            </div>
          ) : productList.length === 0 ? (
            <div className="empty-state">
              <p>No products available right now.</p>
              <p className="muted-text">Check back later or refresh the page.</p>
            </div>
          ) : (
            <div className="customer-table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th className="numeric">Price</th>
                    <th className="numeric">Quantity</th>
                    <th className="center">Add</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((product, index) => (
                    <tr
                      key={product.productId}
                      className="row-fade-in"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <td>{product.productId}</td>
                      <td>{product.name}</td>
                      <td className="numeric">${product.price}</td>
                      <td className="numeric">
                        <input
                          type="number"
                          min="0"
                          value={product.quantity}
                          placeholder="0"
                          onChange={(e) => updateProductQuantity(e, product.productId)}
                        />
                      </td>
                      <td className="center">
                        <button
                          className="icon-btn add-btn"
                          onClick={() => addToCart(product)}
                          disabled={
                            addingId === product.productId ||
                            !product.quantity ||
                            product.quantity <= 0
                          }
                        >
                          {addingId === product.productId ? (
                            <>
                              <span className="btn-loader" />
                              <span>Adding...</span>
                            </>
                          ) : (
                            <>
                              <FiPlus size={16} />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductListCustomer;
