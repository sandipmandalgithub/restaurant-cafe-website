const jwt = require("jsonwebtoken");

const customerOptionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // No customer token is also allowed.
    // This keeps guest checkout working.
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Only accept customer tokens.
    if (decoded.role === "customer") {
      req.customer = decoded;
    }

    next();
  } catch (error) {
    // Invalid/expired optional token should not block guest checkout.
    console.error(
      "Optional customer authentication error:",
      error.message
    );

    next();
  }
};

module.exports = customerOptionalAuth;
