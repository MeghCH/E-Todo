const jwt = require("jsonwebtoken");
const db = require("../config/db");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Notokenprovided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    const [users] = await db
      .promise()
      .query(
        "SELECT id, email, name, firstname, role, created_at FROM user WHERE id = ?",
        [decoded.id]
      );

    if (users.length === 0) {
      return res.status(404).json({ msg: "Notfound" });
    }

    req.user = users[0];

    next();
  } catch (err) {
    return res.status(403).json({ msg: "Tokeninvalid" });
  }
};

module.exports = { authenticateToken };
