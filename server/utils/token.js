const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY_ACCESS_TOKEN = process.env.JWT_SECRET;
const JWT_SECRET_KEY_REFRESH_TOKEN = process.env.JWT_REFRESH_SECRET;

exports.generateAccessAndRefreshToken = (payload) => {
    const token = jwt.sign(payload, JWT_SECRET_KEY_ACCESS_TOKEN, {
        expiresIn: "3m"
    });

    const refreshToken = jwt.sign(payload, JWT_SECRET_KEY_REFRESH_TOKEN, {
        expiresIn: "3m"
    });

    return { token, refreshToken };
};

exports.verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET_KEY_ACCESS_TOKEN, (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded);
        });
    });
};

exports.refreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, JWT_SECRET_KEY_REFRESH_TOKEN, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                const { userId, isAdmin } = decoded;
                const newTokens = exports.generateAccessAndRefreshToken({
                    userId,
                    isAdmin
                });
                resolve(newTokens);
            }
        });
    });
};
