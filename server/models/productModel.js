// models/productModel.js
const pool = require("../database/connection"); // promise-based pool

function logErr(ctx, err) {
  console.error(`❌ [ProductModel] ${ctx} | code=${err.code} errno=${err.errno} sqlState=${err.sqlState}`);
  if (err.sqlMessage) console.error(`   sqlMessage: ${err.sqlMessage}`);
  if (err.sql) console.error(`   sql: ${err.sql}`);
}

/** Get all products */
exports.getAllProducts = async () => {
  console.log("🔷 [ProductModel] getAllProducts()");
  try {
    const [rows] = await pool.execute("SELECT * FROM product ORDER BY createdDate DESC");
    console.log("✅ [ProductModel] getAllProducts -> rows:", rows.length);
    return rows;
  } catch (err) {
    logErr("getAllProducts()", err);
    throw err;
  }
};

/** Get product details by ID */
exports.getProductDetailsById = async (productId) => {
  console.log("🔷 [ProductModel] getProductDetailsById()", { productId });
  try {
    const id = Number(productId);
    const [rows] = await pool.execute("SELECT * FROM product WHERE productId = ?", [id]);
    console.log("✅ [ProductModel] getProductDetailsById -> rows:", rows.length);
    return rows;
  } catch (err) {
    logErr("getProductDetailsById()", err);
    throw err;
  }
};

/** All orders that include a specific product */
exports.allOrderByProductId = async (productId) => {
  console.log("🔷 [ProductModel] allOrderByProductId()", { productId });
  const sql = `
    SELECT
      O.orderId,
      U.fname,
      U.lname,
      O.createdDate,
      PIN.quantity,
      PIN.lineTotal   -- fixed: was totalPrice, but schema column is lineTotal
    FROM users U
    INNER JOIN orders O        ON U.userId = O.userId
    INNER JOIN productsInOrder PIN ON O.orderId = PIN.orderId
    INNER JOIN product P       ON PIN.productId = P.productId
    WHERE PIN.productId = ?;
  `;
  try {
    const id = Number(productId);
    const [rows] = await pool.execute(sql, [id]);
    console.log("✅ [ProductModel] allOrderByProductId -> rows:", rows.length);
    return rows;
  } catch (err) {
    logErr("allOrderByProductId()", err);
    throw err;
  }
};

/** Create a product */
exports.createProduct = async (name, price, description) => {
  console.log("🔷 [ProductModel] createProduct()", { name, price, description });
  try {
    const p = Number(price);
    const [result] = await pool.execute(
      "INSERT INTO product (name, price, description) VALUES (?, ?, ?)",
      [name, p, description ?? null]
    );
    console.log("✅ [ProductModel] createProduct -> insertId:", result.insertId);
    return { id: result.insertId };
  } catch (err) {
    logErr("createProduct()", err);
    throw err;
  }
};

/** Update a product */
exports.updateProduct = async (productId, name, price, description) => {
  console.log("🔷 [ProductModel] updateProduct()", { productId, name, price, description });
  try {
    const id = Number(productId);
    const p = Number(price);
    const [result] = await pool.execute(
      "UPDATE product SET name = ?, price = ?, description = ? WHERE productId = ?",
      [name, p, description ?? null, id]
    );
    console.log("✅ [ProductModel] updateProduct -> affectedRows:", result.affectedRows, "changedRows:", result.changedRows);
    return { affectedRows: result.affectedRows, changedRows: result.changedRows };
  } catch (err) {
    logErr("updateProduct()", err);
    throw err;
  }
};

/** Delete a product */
exports.deleteProduct = async (productId) => {
  console.log("🔷 [ProductModel] deleteProduct()", { productId });
  try {
    const id = Number(productId);
    const [result] = await pool.execute("DELETE FROM product WHERE productId = ?", [id]);
    console.log("✅ [ProductModel] deleteProduct -> affectedRows:", result.affectedRows);
    return { affectedRows: result.affectedRows };
  } catch (err) {
    logErr("deleteProduct()", err);
    throw err;
  }
};
