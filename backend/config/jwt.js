const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
  const payload = {
    userId,
    role,
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET || "your_jwt_secret_key",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );

  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret_key"
    );
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
