// models/orderModel.js
const pool = require("../database/connection");

// Utility: logs all query errors clearly
function logErr(ctx, err) {
  console.error(`❌ [OrderModel] ${ctx} | ${err.code || "N/A"}: ${err.message}`);
  if (err.sql) console.error(`   SQL: ${err.sql}`);
}

// =========================
// 1️⃣ Get All Orders
// =========================
exports.getAllOrders = async () => {
  console.log("🔷 [OrderModel] getAllOrders()");
  const sql = `
    SELECT O.orderId, U.fname, U.lname, O.createdDate, O.totalPrice
    FROM orders O
    INNER JOIN users U ON O.userId = U.userId;
  `;
  try {
    const [rows] = await pool.execute(sql);
    console.log(`✅ [OrderModel] getAllOrders -> ${rows.length} rows`);
    return rows;
  } catch (err) {
    logErr("getAllOrders()", err);
    throw err;
  }
};

// =========================
// 2️⃣ Get Order by ID
// =========================
exports.getOrderById = async (orderId) => {
  console.log("🔷 [OrderModel] getOrderById()", { orderId });
  const sql = `
    SELECT U.fname, U.lname, O.totalPrice, O.createdDate, O.address
    FROM orders O
    INNER JOIN users U ON O.userId = U.userId
    WHERE O.orderId = ?;
  `;
  try {
    const [rows] = await pool.execute(sql, [orderId]);
    console.log(`✅ [OrderModel] getOrderById -> ${rows.length} rows`);
    return rows;
  } catch (err) {
    logErr("getOrderById()", err);
    throw err;
  }
};

// =========================
// 3️⃣ Get Products in a Given Order
// =========================
exports.getProductsByOrder = async (orderId) => {
  console.log("🔷 [OrderModel] getProductsByOrder()", { orderId });
  const sql = `
    SELECT P2.productId, P2.name, P.quantity, P.lineTotal
    FROM productsInOrder P
    INNER JOIN product P2 ON P.productId = P2.productId
    WHERE P.orderId = ?;
  `;
  try {
    const [rows] = await pool.execute(sql, [orderId]);
    console.log(`✅ [OrderModel] getProductsByOrder -> ${rows.length} products`);
    return rows;
  } catch (err) {
    logErr("getProductsByOrder()", err);
    throw err;
  }
};

// =========================
// 4️⃣ Update Order (e.g., address or status)
// =========================
exports.updateOrder = async (orderId, newData) => {
  console.log("🔷 [OrderModel] updateOrder()", { orderId, newData });

  // Build SET clause dynamically
  const fields = Object.keys(newData);
  const values = Object.values(newData);
  const setClause = fields.map((f) => `${f} = ?`).join(", ");

  const sql = `UPDATE orders SET ${setClause} WHERE orderId = ?;`;

  try {
    const [result] = await pool.execute(sql, [...values, orderId]);
    console.log(`✅ [OrderModel] updateOrder -> affectedRows: ${result.affectedRows}`);
    return result;
  } catch (err) {
    logErr("updateOrder()", err);
    throw err;
  }
};

// =========================
// 5️⃣ Get Past Orders for a Given User
// =========================
exports.getPastOrdersByCustomerID = async (userId) => {
  console.log("🔷 [OrderModel] getPastOrdersByCustomerID()", { userId });
  const sql = `
    SELECT O.orderId, P.name, O.createdDate, PIN.quantity, PIN.lineTotal
    FROM orders O
    INNER JOIN productsInOrder PIN ON O.orderId = PIN.orderId
    INNER JOIN product P ON PIN.productId = P.productId
    WHERE O.userId = ?
    ORDER BY O.orderId DESC;
  `;
  try {
    const [rows] = await pool.execute(sql, [userId]);
    console.log(`✅ [OrderModel] getPastOrdersByCustomerID -> ${rows.length} orders`);
    return rows;
  } catch (err) {
    logErr("getPastOrdersByCustomerID()", err);
    throw err;
  }
};