const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token. Not authorized." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;
    req.token = token;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({
          message: `Access denied. Required role(s): ${roles.join(", ")}`,
        });
      }
      next();
    } catch (err) {
      console.error("Authorization Error:", err.message);
      res.status(403).json({ message: "Authorization failed" });
    }
  };
};
