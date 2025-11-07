// userController.js
const userModel = require("../models/userModel");

exports.register = async (req, res) => {
  console.log("🔹 [Controller] register() called!");
  console.log("🔹 Request body received:", req.body);

  const { email, password, isAdmin, fname, lname } = req.body;

  try {
    console.log("🔹 Calling userModel.register() with:", {
      email,
      password,
      isAdmin,
      fname,
      lname,
    });

    const result = await userModel.register(email, password, isAdmin, fname, lname);

    console.log("✅ [Controller] Registration successful. Model result:", result);

    res.status(201).send(result);
  } catch (err) {
    console.error("❌ [Controller] Error during registration:", err.message);
    res.status(500).send("Error registering user.");
  }
};

exports.login = async (req, res) => {
  console.log("🔹 [Controller] login() called!");
  console.log("🔹 Request body received:", req.body);

  const { email, password } = req.body;

  try {
    console.log("🔹 Calling userModel.login() with:", { email, password });

    const result = await userModel.login(email, password);

    console.log("✅ [Controller] Login successful. Model result:", result);

    res.status(200).send(result);
  } catch (err) {
    console.error("❌ [Controller] Error during login:", err.message);
    res.status(500).send("Error logging in.");
  }
};
