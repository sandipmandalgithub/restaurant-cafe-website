const jwt = require("jsonwebtoken");

const customerProtect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please provide a valid customer token.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Customer access required.",
      });
    }

    req.customer = decoded;

    next();
  } catch (error) {
    console.error("Customer authentication error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired customer token.",
    });
  }
};

module.exports = customerProtect;
