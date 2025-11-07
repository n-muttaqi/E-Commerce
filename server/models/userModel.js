// models/userModel.js
const pool = require("../database/connection"); // promise-based pool
const bcrypt = require("bcryptjs");
const { generateAccessAndRefreshToken } = require("../utils/token");

// Helper to log MySQL errors consistently
function logMysqlError(context, err) {
  console.error(`❌ [Model] ${context} | code=${err.code} errno=${err.errno} sqlState=${err.sqlState}`);
  if (err.sqlMessage) console.error(`   sqlMessage: ${err.sqlMessage}`);
  if (err.sql) console.error(`   sql: ${err.sql}`);
}

exports.register = async (email, password, isAdmin, fname, lname) => {
  console.log("🔷 [Model] register() called with payload:");
  console.log("   email:", email);
  console.log("   fname:", fname, "| lname:", lname);
  console.log("   isAdmin (raw):", isAdmin, "→ will send as:", Number(isAdmin));
  console.log("   password: [hidden] length:", typeof password === "string" ? password.length : "N/A");

  try {
    console.log("🔷 [Model] Checking if user already exists...");
    const [existingRows] = await pool.execute(
      "SELECT userId FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    console.log("   existingRows length:", existingRows.length);

    if (existingRows.length > 0) {
      console.log("⚠️  [Model] User already exists for email:", email);
      const e = new Error("User already exists");
      e.status = 409;
      throw e;
    }

    console.log("🔷 [Model] Hashing password with bcrypt...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("   bcrypt hash generated. hash length:", hashedPassword.length);

    console.log("🔷 [Model] Inserting new user into DB...");
    const [insertResult] = await pool.execute(
      "INSERT INTO users (email, password, isAdmin, fname, lname) VALUES (?,?,?,?,?)",
      [email, hashedPassword, Number(isAdmin), fname, lname]
    );

    console.log("✅ [Model] Insert OK. insertId:", insertResult.insertId);
    return { id: insertResult.insertId };
  } catch (err) {
    logMysqlError("register()", err);
    throw err;
  }
};

exports.login = async (email, password) => {
  console.log("🔷 [Model] login() called with:");
  console.log("   email:", email);
  console.log("   password: [hidden] length:", typeof password === "string" ? password.length : "N/A");

  try {
    console.log("🔷 [Model] Fetching user by email...");
    const [rows] = await pool.execute(
      "SELECT userId, password, isAdmin FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    console.log("   rows length:", rows.length);

    if (rows.length === 0) {
      console.log("⚠️  [Model] No user found for email:", email);
      const e = new Error("Invalid email or password");
      e.status = 401;
      throw e;
    }

    const { userId, password: storedHash, isAdmin } = rows[0];
    console.log("🔷 [Model] Comparing password with bcrypt...");
    const isMatch = await bcrypt.compare(password, storedHash);
    console.log("   bcrypt.compare result:", isMatch);

    if (!isMatch) {
      console.log("⚠️  [Model] Password mismatch for userId:", userId);
      const e = new Error("Invalid email or password");
      e.status = 401;
      throw e;
    }

    console.log("🔷 [Model] Generating access & refresh tokens...");
    const tokens = generateAccessAndRefreshToken({ userId, isAdmin });
    console.log("   Token generation success:", !!tokens?.token, "refresh:", !!tokens?.refreshToken);

    const userData = {
      userId,
      isAdmin,
      token: tokens.token,
      refreshToken: tokens.refreshToken, // pass along; handle cookie in controller if you prefer
    };

    // Your controllers expect an array response; keep compatible:
    const response = [userData];
    console.log("✅ [Model] Login success. Returning:", response);
    return response;
  } catch (err) {
    logMysqlError("login()", err);
    throw err;
  }
};
