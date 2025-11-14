const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const header = req.header("Authorization");
  const token = header ? header.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
}

module.exports = { authenticateToken };
