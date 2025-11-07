// models/cartModel.js
const pool = require("../database/connection");

// Utility for consistent error logging
function logErr(ctx, err) {
  console.error(`❌ [CartModel] ${ctx} | code=${err.code || "N/A"} msg=${err.message}`);
  if (err.sql) console.error(`   sql: ${err.sql}`);
}

// =========================
// 1️⃣ Get Shopping Cart
// =========================
exports.getShoppingCart = async (userId) => {
  console.log("🔷 [CartModel] getShoppingCart()", { userId });
  const sql = `
    SELECT S.quantity, P.name, P.price, P.productId
    FROM shoppingCart S
    INNER JOIN product P ON S.productId = P.productId
    WHERE S.userId = ?;
  `;
  try {
    const [rows] = await pool.execute(sql, [userId]);
    console.log("✅ [CartModel] getShoppingCart -> items:", rows.length);
    return rows;
  } catch (err) {
    logErr("getShoppingCart()", err);
    throw err;
  }
};

// =========================
// 2️⃣ Add To Cart
// =========================
exports.addToCart = async (customerId, productId, quantity, isPresent) => {
  console.log("🔷 [CartModel] addToCart()", { customerId, productId, quantity, isPresent });
  try {
    let sql, params;
    if (isPresent) {
      sql = `
        UPDATE shoppingCart
        SET quantity = quantity + ?
        WHERE productId = ? AND userId = ?;
      `;
      params = [quantity, productId, customerId];
    } else {
      sql = `
        INSERT INTO shoppingCart (userId, productId, quantity)
        VALUES (?, ?, ?);
      `;
      params = [customerId, productId, quantity];
    }
    const [result] = await pool.execute(sql, params);
    console.log("✅ [CartModel] addToCart -> affectedRows:", result.affectedRows);
    return result;
  } catch (err) {
    logErr("addToCart()", err);
    throw err;
  }
};

// =========================
// 3️⃣ Remove From Cart
// =========================
exports.removeFromCart = async (productId, userId) => {
  console.log("🔷 [CartModel] removeFromCart()", { productId, userId });
  try {
    const [result] = await pool.execute(
      "DELETE FROM shoppingCart WHERE productId = ? AND userId = ?;",
      [productId, userId]
    );
    console.log("✅ [CartModel] removeFromCart -> affectedRows:", result.affectedRows);
    return result;
  } catch (err) {
    logErr("removeFromCart()", err);
    throw err;
  }
};

// =========================
// 4️⃣ Buy (Checkout)
// =========================
exports.buy = async (customerId, address) => {
  console.log("🔷 [CartModel] buy()", { customerId, address });
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    console.log("🔸 Transaction started");

    // 1️⃣ Create order
    const [orderResult] = await conn.execute(
      "INSERT INTO orders (userId, address, totalPrice) VALUES (?, ?, 0);",
      [customerId, address]
    );
    const orderId = orderResult.insertId;
    console.log("✅ Order created:", orderId);

    // 2️⃣ Move items from cart → productsInOrder
    const insertProductsSQL = `
      INSERT INTO productsInOrder (orderId, productId, quantity, lineTotal)
      SELECT ?, S.productId, S.quantity, P.price * S.quantity
      FROM shoppingCart S
      INNER JOIN product P ON S.productId = P.productId
      WHERE S.userId = ?;
    `;
    await conn.execute(insertProductsSQL, [orderId, customerId]);
    console.log("✅ Products added to order");

    // 3️⃣ Update totalPrice in orders
    const updateOrderSQL = `
      UPDATE orders
      SET totalPrice = (
        SELECT SUM(lineTotal) FROM productsInOrder WHERE orderId = ?
      )
      WHERE orderId = ?;
    `;
    await conn.execute(updateOrderSQL, [orderId, orderId]);
    console.log("✅ Order total updated");

    // 4️⃣ Clear shopping cart
    await conn.execute("DELETE FROM shoppingCart WHERE userId = ?;", [customerId]);
    console.log("✅ Shopping cart cleared");

    await conn.commit();
    console.log("🔸 Transaction committed successfully");

    return { success: true, orderId };
  } catch (err) {
    await conn.rollback();
    logErr("buy() ROLLBACK", err);
    throw err;
  } finally {
    conn.release();
  }
};
