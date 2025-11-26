import React, { useState, useEffect } from "react";
import axios from "axios";
import { getBaseURL } from "../apiConfig";
import { FiPlus, FiTrash2, FiEye, FiRefreshCw } from "react-icons/fi";
import "./AdminProductList.scss";

const ProductList = ({ handleProductDetails }) => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setProductName("");
    setProductPrice("");
    setProductDesc("");
  };

  const fetchProducts = () => {
    setLoading(true);
    setError("");
    axios
      .get(`${getBaseURL()}api/products`)
      .then((res) => {
        setProducts(res.data || []);
      })
      .catch(() => {
        setError("Could not load product list. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = () => {
    const name = productName.trim();
    const description = productDesc.trim();
    const price = parseFloat(productPrice);

    if (!name || !description || !price || price <= 0) {
      setError("Please fill out all fields with valid values.");
      return;
    }

    setAdding(true);
    setError("");

    axios
      .post(`${getBaseURL()}api/products/create`, { name, price, description })
      .then(() => {
        fetchProducts();
        resetForm();
      })
      .catch(() => {
        setError("Could not add product. Please try again.");
      })
      .finally(() => {
        setAdding(false);
      });
  };

  const deleteProduct = (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    axios
      .delete(`${getBaseURL()}api/products/delete/${productId}`)
      .then(() => {
        setProducts((prev) => prev.filter((p) => p.productId !== productId));
      })
      .catch(() => {
        setError("Could not delete product. Please try again.");
      });
  };

  const openProductDetails = (product) => {
    handleProductDetails(product);
  };

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <div className="title-block">
          <h1>Admin Products</h1>
          <p>Manage your inventory, prices, and product details in one place.</p>
        </div>
        <div className="header-actions">
          {/* <button
            className="ghost-btn"
            onClick={fetchProducts}
            disabled={loading}
          >
            <FiRefreshCw
              className={loading ? "spin-icon" : ""}
              size={18}
            />
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
          </button> */}
          <div className="stats-chip">
            <span className="dot" />
            <span>{products.length} products</span>
          </div>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="grid-layout">
        {/* Add product card */}
        <div className="add-product-section card">
          <h2>
            <FiPlus size={18} />
            <span>Add Product</span>
          </h2>
          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="eg. Wireless Headphones"
          />

          <label htmlFor="productPrice">Price</label>
          <input
            type="number"
            id="productPrice"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            placeholder="eg. 49.99"
          />

          <label htmlFor="productDesc">Description</label>
          <textarea
            id="productDesc"
            value={productDesc}
            onChange={(e) => setProductDesc(e.target.value)}
            placeholder="Short description of the product"
            rows={3}
          />

          <button
            className="primary-btn"
            onClick={addProduct}
            disabled={adding}
          >
            {adding ? (
              <>
                <span className="btn-loader" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FiPlus size={18} />
                <span>Add Product</span>
              </>
            )}
          </button>
        </div>

        {/* Product table */}
        <div className="product-list card">
          <div className="table-header-row">
            <h2>Product List</h2>
          </div>
          {loading && products.length === 0 ? (
            <div className="table-loading">
              <div className="loader" />
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>No products found yet.</p>
              <p className="muted-text">
                Start by adding a new product on the left.
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th className="numeric">Price</th>
                    <th>Created</th>
                    <th className="center">Details</th>
                    <th className="center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr
                      key={product.productId}
                      style={{ animationDelay: `${index * 40}ms` }}
                      className="row-fade-in"
                    >
                      <td>{product.productId}</td>
                      <td>{product.name}</td>
                      <td className="numeric">${product.price}</td>
                      <td>{product.createdDate}</td>
                      <td className="center">
                        <button
                          className="icon-btn info-btn"
                          onClick={() => openProductDetails(product)}
                        >
                          <FiEye size={16} />
                          <span>View</span>
                        </button>
                      </td>
                      <td className="center">
                        <button
                          className="icon-btn danger-btn"
                          onClick={() => deleteProduct(product.productId)}
                        >
                          <FiTrash2 size={16} />
                          <span>Delete</span>
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
    </div>
  );
};

export default ProductList;
