const cartModel = require("../models/cartModel");
const { verifyToken } = require('../utils/token'); 

exports.getShoppingCart = (req, res) => {
    console.log("GET /shoppingCart called");
    const userId = req.params.userId;
    console.log("userId:", userId);

    cartModel.getShoppingCart(userId)
        .then(result => {
            console.log("getShoppingCart result:", result);
            res.send(result);
        })
        .catch(err => {
            console.error("getShoppingCart error:", err.message);
            res.status(500).send("Error fetching shopping cart.");
        });
};

exports.addToCart = (req, res) => {
    console.log("POST /addToCart called");
    const { customerId, productId, quantity, isPresent } = req.body;
    console.log("addToCart body:", req.body);

    cartModel.addToCart(customerId, productId, quantity, isPresent)
        .then(result => {
            console.log("addToCart result:", result);
            res.send(result);
        })
        .catch(err => {
            console.error("addToCart error:", err.message);
            res.status(500).send("Error adding product to cart.");
        });
};

exports.removeFromCart = (req, res) => {
    console.log("DELETE /removeFromCart called");
    const productId = req.params.productId;
    const userId = req.params.userId;
    console.log("productId:", productId, "userId:", userId);

    cartModel.removeFromCart(productId, userId)
        .then(result => {
            console.log("removeFromCart result:", result);
            res.send(result);
        })
        .catch(err => {
            console.error("removeFromCart error:", err.message);
            res.status(500).send("Error removing product from cart.");
        });
};

exports.buy = (req, res) => {
    console.log("POST /buy called");
    const token = req.headers.authorization;
    console.log("Authorization header:", token);

    if (!token || !token.startsWith('Bearer ')) {
        console.log("Token missing or invalid");
        return res.status(401).send('Unauthorized: Missing or invalid token');
    }

    const tokenValue = token.split(' ')[1];
    console.log("Extracted token:", tokenValue);

    verifyToken(tokenValue)
        .then(decoded => {
            console.log("Token decoded:", decoded);

            const customerId = req.params.id;
            const address = req.body.address;

            console.log("customerId:", customerId);
            console.log("address:", address);

            cartModel.buy(customerId, address)
                .then(result => {
                    console.log("buy result:", result);
                    res.send(result);
                })
                .catch(err => {
                    console.error("buy error:", err.message);
                    res.status(500).send("Error removing product from cart.");
                });
        })
        .catch(err => {
            console.error("Token verification failed:", err);
            return res.status(401).send('Unauthorized: Invalid token');
        });
};
